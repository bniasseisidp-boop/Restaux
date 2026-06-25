<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id', 'user_name', 'user_phone', 'user_email',
        'date', 'time', 'guests', 'notes', 'status',
        'deposit_amount', 'payment_status', 'payment_method', 'payment_reference',
    ];

    protected function casts(): array
    {
        return ['date' => 'date', 'guests' => 'integer'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
