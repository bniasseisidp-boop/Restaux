<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    protected $fillable = ['name', 'subtitle', 'price', 'description', 'image_url', 'duration', 'items', 'available'];

    protected function casts(): array
    {
        return ['available' => 'boolean', 'price' => 'decimal:2', 'items' => 'array'];
    }
}
