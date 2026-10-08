<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AiDesignController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LinkController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\QrCodeController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'api_version' => 'mvp',
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/public/pages/{slug}', [PageController::class, 'publicShow']);
Route::post('/links/{link}/click', [LinkController::class, 'click']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::apiResource('pages', PageController::class);
    Route::post('/pages/{page}/links', [LinkController::class, 'store']);
    Route::put('/links/{link}', [LinkController::class, 'update']);
    Route::delete('/links/{link}', [LinkController::class, 'destroy']);
    Route::patch('/links/{link}/position', [LinkController::class, 'position']);

    Route::get('/pages/{page}/qr', [QrCodeController::class, 'index']);
    Route::post('/pages/{page}/qr/generate', [QrCodeController::class, 'generate']);
    Route::get('/pages/{page}/qr/download', [QrCodeController::class, 'download']);

    Route::get('/pages/{page}/analytics', [AnalyticsController::class, 'show']);

    Route::middleware('throttle:10,1')->group(function () {
        Route::post('/ai/design', [AiDesignController::class, 'design']);
        Route::post('/ai/image', [AiDesignController::class, 'image']);
        Route::post('/ai/content', [AiDesignController::class, 'content']);
    });

    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::patch('/admin/users/{user}/status', [AdminController::class, 'updateUserStatus']);
    Route::get('/admin/pages', [AdminController::class, 'pages']);
    Route::patch('/admin/pages/{page}/status', [AdminController::class, 'updatePageStatus']);
    Route::get('/admin/stats', [AdminController::class, 'stats']);
});
