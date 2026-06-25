<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PackController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ReservationController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

Route::get('/products',           [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/packs',              [PackController::class, 'index']);
Route::get('/packs/{pack}',       [PackController::class, 'show']);

Route::post('/orders',       [OrderController::class, 'store']);
Route::post('/reservations', [ReservationController::class, 'store']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    Route::get('/orders/mine',              [OrderController::class, 'mine']);
    Route::patch('/orders/{order}/status',  [OrderController::class, 'updateStatus']);

    Route::get('/reservations/mine',                    [ReservationController::class, 'mine']);
    Route::patch('/reservations/{reservation}/status',  [ReservationController::class, 'updateStatus']);

    // Admin only routes
    Route::middleware('can:admin')->prefix('admin')->group(function () {
        Route::get('/stats',        [AdminController::class, 'stats']);
        Route::get('/orders',       [AdminController::class, 'orders']);
        Route::post('/orders',      [AdminController::class, 'createOrder']);
        Route::get('/reservations', [AdminController::class, 'reservations']);
        Route::get('/users',        [AdminController::class, 'users']);
        Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
        Route::post('/upload-image', [AdminController::class, 'uploadImage']);

        Route::patch('/reservations/{reservation}/payment', [AdminController::class, 'confirmPayment']);
        Route::apiResource('products', ProductController::class)->except(['index', 'show']);
        Route::apiResource('packs',    PackController::class)->except(['index', 'show']);
        Route::apiResource('expenses', ExpenseController::class)->only(['index', 'store', 'destroy']);
    });
});
