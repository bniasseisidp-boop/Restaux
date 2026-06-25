<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    private const PRICE_PER_GUEST = 5000; // FCFA average per person
    private const DEPOSIT_RATE    = 0.30; // 30%

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_name'         => 'required|string|max:255',
            'user_phone'        => 'nullable|string',
            'user_email'        => 'nullable|email',
            'date'              => 'required|date|after_or_equal:today',
            'time'              => 'required|string',
            'guests'            => 'required|integer|min:1|max:50',
            'notes'             => 'nullable|string',
            'payment_method'    => 'nullable|in:wave,orange_money,cash,other',
            'payment_reference' => 'nullable|string|max:100',
        ]);

        $depositAmount = round(($data['guests'] * self::PRICE_PER_GUEST) * self::DEPOSIT_RATE, 2);
        $paymentStatus = 'unpaid';

        if (!empty($data['payment_reference'])) {
            $paymentStatus = 'pending';
        } elseif (($data['payment_method'] ?? '') === 'cash') {
            $paymentStatus = 'pending';
        }

        $reservation = Reservation::create([
            'user_id'           => auth('sanctum')->id(),
            'user_name'         => $data['user_name'],
            'user_phone'        => $data['user_phone'] ?? null,
            'user_email'        => $data['user_email'] ?? null,
            'date'              => $data['date'],
            'time'              => $data['time'],
            'guests'            => $data['guests'],
            'notes'             => $data['notes'] ?? null,
            'status'            => 'pending',
            'deposit_amount'    => $depositAmount,
            'payment_status'    => $paymentStatus,
            'payment_method'    => $data['payment_method'] ?? null,
            'payment_reference' => $data['payment_reference'] ?? null,
        ]);

        return response()->json(['reservation' => $reservation, 'deposit_amount' => $depositAmount], 201);
    }

    public function mine(Request $request)
    {
        $reservations = Reservation::where('user_id', $request->user()->id)
            ->orderByDesc('date')
            ->get();
        return response()->json(['reservations' => $reservations]);
    }

    public function updateStatus(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status'         => 'required|in:pending,confirmed,cancelled',
            'payment_status' => 'nullable|in:unpaid,pending,paid',
        ]);

        $reservation->update(array_filter($validated, fn($v) => $v !== null));
        return response()->json(['reservation' => $reservation]);
    }
}
