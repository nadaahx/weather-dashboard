<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    // ─────────────────────────────────────────
    // Helper: resolve or create a device cookie
    // ─────────────────────────────────────────
    private function getUserSession(Request $request): string
    {
        return $request->cookie('weather_device_id') ?? '';
    }

    private function setUserSessionCookie($response, string $userId)
    {
        // 10 years in minutes
        return $response->cookie('weather_device_id', $userId, 60 * 24 * 365 * 10, '/');
    }

    // ─────────────────────────────────────────
    // Main page
    // ─────────────────────────────────────────
    public function index(Request $request)
    {
        $userId = $this->getUserSession($request);

        if (empty($userId)) {
            $userId = bin2hex(random_bytes(16));
        }

        $cities = City::forUser($userId)->latest()->get();

        $response = response()->view('weather.index', compact('cities'));
        return $this->setUserSessionCookie($response, $userId);
    }

    // ─────────────────────────────────────────
    // GET /api/weather?city=Cairo
    // ─────────────────────────────────────────
    public function getWeather(Request $request): JsonResponse
    {
        $request->validate([
            'city' => ['required', 'string', 'max:100'],
        ]);

        $apiKey = config('services.weatherapi.key');
        $city   = $request->query('city');

        try {
            $response = Http::timeout(8)
                ->get('https://api.weatherapi.com/v1/current.json', [
                    'key' => $apiKey,
                    'q'   => $city,
                ]);

            if ($response->failed()) {
                return response()->json(['error' => 'City not found or API error.'], 422);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json(['error' => 'Weather service is currently unavailable. Please try again later.'], 503);
        }
    }

    // ─────────────────────────────────────────
    // GET /api/weather/search?q=Cai
    // ─────────────────────────────────────────
    public function searchSuggestions(Request $request): JsonResponse
    {
        $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        $apiKey = config('services.weatherapi.key');

        try {
            $response = Http::timeout(8)
                ->get('https://api.weatherapi.com/v1/search.json', [
                    'key' => $apiKey,
                    'q'   => $request->query('q'),
                ]);

            if ($response->failed()) {
                return response()->json([]);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    // ─────────────────────────────────────────
    // POST /cities  (save)
    // ─────────────────────────────────────────
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'city' => ['required', 'string', 'max:100'],
        ]);

        $userId = $this->getUserSession($request);

        if (empty($userId)) {
            return response()->json(['error' => 'Session not found.'], 400);
        }

        $cityName = trim($request->input('city'));

        $exists = City::forUser($userId)
            ->where('city_name', $cityName)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'City already saved.'], 409);
        }

        City::create([
            'city_name'    => $cityName,
            'user_session' => $userId,
        ]);

        return response()->json(['success' => 'City saved.']);
    }

    // ─────────────────────────────────────────
    // GET /cities  (list)
    // ─────────────────────────────────────────
    public function getCities(Request $request): JsonResponse
    {
        $userId = $this->getUserSession($request);

        if (empty($userId)) {
            return response()->json([]);
        }

        $cities = City::forUser($userId)
            ->latest()
            ->get(['id', 'city_name', 'note']);

        return response()->json($cities);
    }

    // ─────────────────────────────────────────
    // PATCH /cities/{city}  (update note)
    // ─────────────────────────────────────────
    public function update(Request $request, City $city): JsonResponse
    {
        $userId = $this->getUserSession($request);

        if ($city->user_session !== $userId) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'note' => ['nullable', 'string', 'max:255'],
        ]);

        $city->update(['note' => $request->input('note', '')]);

        return response()->json(['success' => true]);
    }

    // ─────────────────────────────────────────
    // DELETE /cities/{city}
    // ─────────────────────────────────────────
    public function destroy(Request $request, City $city): JsonResponse
    {
        $userId = $this->getUserSession($request);

        if ($city->user_session !== $userId) {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $city->delete();

        return response()->json(['success' => 'Deleted.']);
    }
}