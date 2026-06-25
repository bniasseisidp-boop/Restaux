<?php

namespace App\Http\Controllers;

use App\Models\Pack;
use Illuminate\Http\Request;

class PackController extends Controller
{
    public function index()
    {
        return response()->json(['packs' => Pack::where('available', true)->get()]);
    }

    public function show(Pack $pack)
    {
        return response()->json(['pack' => $pack]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'subtitle'    => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|string',
            'duration'    => 'nullable|string',
            'items'       => 'nullable|array',
            'available'   => 'boolean',
        ]);

        $pack = Pack::create($data);
        return response()->json(['pack' => $pack], 201);
    }

    public function update(Request $request, Pack $pack)
    {
        $data = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'subtitle'    => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|string',
            'duration'    => 'nullable|string',
            'items'       => 'nullable|array',
            'available'   => 'boolean',
        ]);

        $pack->update($data);
        return response()->json(['pack' => $pack]);
    }

    public function destroy(Pack $pack)
    {
        $pack->delete();
        return response()->json(['message' => 'Supprimé']);
    }
}
