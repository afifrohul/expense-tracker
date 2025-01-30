<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/login');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/api/transactions/summary', [DashboardController::class, 'getAnnualSummary']);
    Route::get('/api/daily-expenses', [DashboardController::class, 'getDailyExpenses']);
    
    Route::get('/category', [CategoryController::class, 'index'])->name('category');
    Route::get('/category/data', [CategoryController::class, 'data']);
    Route::post('/category/create', [CategoryController::class, 'store']);
    Route::put('/category/update/{id}', [CategoryController::class, 'update']);
    Route::delete('/category/delete/{id}', [CategoryController::class, 'destroy']);

    Route::get('/transaction', [TransactionController::class, 'index'])->name('transaction');
    Route::get('/transaction/data', [TransactionController::class, 'data']);
    Route::post('/transaction/create', [TransactionController::class, 'store']);
    Route::put('/transaction/update/{id}', [TransactionController::class, 'update']);
    Route::delete('/transaction/delete/{id}', [TransactionController::class, 'destroy']);
});

require __DIR__.'/auth.php';
