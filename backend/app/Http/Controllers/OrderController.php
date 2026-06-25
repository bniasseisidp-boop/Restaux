<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'user_name'        => 'nullable|string',
            'user_phone'       => 'nullable|string',
            'user_email'       => 'nullable|email',
            'items'            => 'required|array|min:1',
            'items.*.name'     => 'required|string',
            'items.*.price'    => 'required|numeric',
            'items.*.quantity' => 'required|integer|min:1',
            'notes'            => 'nullable|string',
            'delivery_type'    => 'in:dine-in,delivery,whatsapp',
            'delivery_address' => 'nullable|string',
        ]);

        $total = collect($data['items'])->sum(fn($i) => $i['price'] * $i['quantity']);

        $authUser = auth('sanctum')->user() ?? auth()->user();
        $order = Order::create([
            'user_id'          => $authUser?->id,
            'user_name'        => $data['user_name'] ?? $authUser?->name,
            'user_phone'       => $data['user_phone'] ?? $authUser?->phone,
            'user_email'       => $data['user_email'] ?? $authUser?->email,
            'total'            => $total,
            'status'           => 'pending',
            'notes'            => $data['notes'] ?? null,
            'delivery_type'    => $data['delivery_type'] ?? 'dine-in',
            'delivery_address' => $data['delivery_address'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            OrderItem::create([
                'order_id'   => $order->id,
                'name'       => $item['name'],
                'price'      => $item['price'],
                'quantity'   => $item['quantity'],
                'product_id' => $item['product_id'] ?? null,
                'pack_id'    => $item['pack_id'] ?? null,
                'type'       => $item['type'] ?? 'product',
            ]);
        }

        return response()->json(['order' => $order->load('items')], 201);
    }

    public function mine(Request $request)
    {
        $orders = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();
        return response()->json(['orders' => $orders]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate(['status' => 'required|in:pending,confirmed,delivered,cancelled']);
        $order->update(['status' => $request->status]);
        return response()->json(['order' => $order]);
    }
}
