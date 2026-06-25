<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(['products' => Product::orderBy('category')->orderBy('name')->get()]);
    }

    public function show(Product $product)
    {
        return response()->json(['product' => $product]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'category'    => 'required|string',
            'price'       => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|string',
            'available'   => 'boolean',
            'tag'         => 'nullable|string',
        ]);

        $product = Product::create($data);
        return response()->json(['product' => $product], 201);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'category'    => 'sometimes|string',
            'price'       => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|string',
            'available'   => 'boolean',
            'tag'         => 'nullable|string',
        ]);

        $product->update($data);
        return response()->json(['product' => $product]);
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
