<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = ['order_id', 'name', 'price', 'quantity', 'type', 'product_id', 'pack_id'];

    protected function casts(): array
    {
        return ['price' => 'decimal:2'];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
