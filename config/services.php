<?php

return [

    /*
    |--------------------------------------------------------------------------
    | WeatherAPI
    |--------------------------------------------------------------------------
    | Store your WeatherAPI key in .env as WEATHERAPI_KEY.
    | Access it in code via:  config('services.weatherapi.key')
    */

    'weatherapi' => [
        'key' => env('WEATHERAPI_KEY'),
    ],

];