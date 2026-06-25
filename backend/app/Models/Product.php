<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'category', 'price', 'description', 'image_url', 'available', 'tag'];

    protected function casts(): array
    {
        return ['available' => 'boolean', 'price' => 'decimal:2'];
    }
}
