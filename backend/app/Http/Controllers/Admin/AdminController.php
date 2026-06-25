<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        $byStatus = Order::selectRaw('status, count(*) as count')
                         ->groupBy('status')
                         ->pluck('count', 'status');

        return response()->json([
            'total_orders'        => Order::count(),
            'total_reservations'  => Reservation::count(),
            'total_users'         => User::count(),
            'total_products'      => \App\Models\Product::count() + \App\Models\Pack::count(),
            'monthly_revenue'     => Order::whereMonth('created_at', now()->month)
                                         ->whereNotIn('status', ['cancelled'])
                                         ->sum('total'),
            'pending_orders'      => $byStatus['pending']   ?? 0,
            'confirmed_orders'    => $byStatus['confirmed'] ?? 0,
            'delivered_orders'    => $byStatus['delivered'] ?? 0,
            'cancelled_orders'    => $byStatus['cancelled'] ?? 0,
            'reservations_today'  => Reservation::whereDate('date', today())->count(),
        ]);
    }

    public function orders(Request $request)
    {
        $query = Order::with('items')->orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('user_name', 'like', "%{$request->search}%")
                  ->orWhere('user_email', 'like', "%{$request->search}%")
                  ->orWhere('id', $request->search);
            });
        }

        $limit = $request->integer('limit', 50);
        return response()->json(['orders' => $query->limit($limit)->get()]);
    }

    public function reservations(Request $request)
    {
        $query = Reservation::orderByDesc('created_at');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('user_name', 'like', "%{$request->search}%")
                  ->orWhere('user_phone', 'like', "%{$request->search}%");
            });
        }

        $limit = $request->integer('limit', 100);
        return response()->json(['reservations' => $query->limit($limit)->get()]);
    }

    public function users()
    {
        $users = User::withCount(['orders', 'reservations'])->orderByDesc('created_at')->get();
        return response()->json(['users' => $users]);
    }

    public function deleteUser(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }

    public function uploadImage(Request $request)
    {
        $request->validate(['image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120']);

        $path = $request->file('image')->store('products', 'public');

        return response()->json(['url' => '/storage/' . $path]);
    }

    public function confirmPayment(Reservation $reservation)
    {
        $reservation->update(['payment_status' => 'paid', 'status' => 'confirmed']);
        return response()->json(['reservation' => $reservation]);
    }

    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'user_name'    => 'required|string|max:255',
            'user_phone'   => 'nullable|string|max:30',
            'items'        => 'required|array|min:1',
            'items.*.name' => 'required|string',
            'items.*.price'=> 'required|numeric|min:0',
            'items.*.quantity' => 'nullable|integer|min:1',
            'notes'        => 'nullable|string',
        ]);

        $total = collect($validated['items'])->sum(fn($i) => $i['price'] * ($i['quantity'] ?? 1));

        $order = Order::create([
            'user_name'    => $validated['user_name'],
            'user_phone'   => $validated['user_phone'] ?? null,
            'user_email'   => 'walkin@lechef.local',
            'total'        => $total,
            'status'       => 'confirmed',
            'notes'        => $validated['notes'] ?? null,
            'delivery_type'=> 'dine-in',
            'user_id'      => null,
        ]);

        foreach ($validated['items'] as $item) {
            $order->items()->create([
                'name'     => $item['name'],
                'price'    => $item['price'],
                'quantity' => $item['quantity'] ?? 1,
                'type'     => 'product',
            ]);
        }

        return response()->json(['order' => $order->load('items')], 201);
    }
}
