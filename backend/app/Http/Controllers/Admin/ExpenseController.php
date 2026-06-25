<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::orderByDesc('date');

        if ($request->filled('month')) {
            $query->whereMonth('date', $request->month)
                  ->whereYear('date', $request->year ?? now()->year);
        }

        $expenses = $query->get();
        $totalExpenses = $expenses->sum('amount');

        $revenue = \App\Models\Order::whereNotIn('status', ['cancelled'])
            ->when($request->filled('month'), fn($q) =>
                $q->whereMonth('created_at', $request->month)
                  ->whereYear('created_at', $request->year ?? now()->year)
            )
            ->sum('total');

        return response()->json([
            'expenses'       => $expenses,
            'total_expenses' => $totalExpenses,
            'total_revenue'  => $revenue,
            'profit'         => $revenue - $totalExpenses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label'    => 'required|string|max:255',
            'amount'   => 'required|numeric|min:0',
            'category' => 'sometimes|string|max:100',
            'date'     => 'required|date',
            'notes'    => 'nullable|string',
        ]);

        $expense = Expense::create($validated);
        return response()->json(['expense' => $expense], 201);
    }

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(['message' => 'Dépense supprimée']);
    }
}
