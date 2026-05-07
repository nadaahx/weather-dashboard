<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Support\Facades\Route;

// Main page
Route::get('/', [WeatherController::class, 'index'])->name('home');