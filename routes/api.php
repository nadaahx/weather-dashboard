<?php

use App\Http\Controllers\WeatherController;
use Illuminate\Support\Facades\Route;

// Weather API proxy
Route::get('/weather',         [WeatherController::class, 'getWeather']);
Route::get('/weather/search',  [WeatherController::class, 'searchSuggestions']);

// Cities CRUD
Route::get('/cities',          [WeatherController::class, 'getCities']);
Route::post('/cities',         [WeatherController::class, 'store']);
Route::patch('/cities/{city}', [WeatherController::class, 'update']);
Route::delete('/cities/{city}',[WeatherController::class, 'destroy']);