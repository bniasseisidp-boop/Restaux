<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id', 'user_name', 'user_phone', 'user_email',
        'total', 'status', 'notes', 'delivery_type', 'delivery_address'
    ];

    protected function casts(): array
    {
        return ['total' => 'decimal:2'];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
