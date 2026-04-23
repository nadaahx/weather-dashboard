<?php
header("Content-Type: application/json");
error_reporting(0);

$apiKey = "603c36f65bb8428caa6221304262304";

// =============================
// Autocomplete / Search suggest
// =============================
if (isset($_GET['search'])) {
    $query = trim($_GET['search']);

    if (empty($query)) {
        echo json_encode([]);
        exit();
    }

    $url = "https://api.weatherapi.com/v1/search.json?key=$apiKey&q=" . urlencode($query);
    $response = file_get_contents($url);

    if ($response === FALSE) {
        echo json_encode([]);
        exit();
    }

    echo $response; // Returns array of matching cities
    exit();
}

// =============================
// Get current weather
// =============================
if (!isset($_GET['city'])) {
    echo json_encode(["error" => "City missing"]);
    exit();
}

$city = $_GET['city'];
$url = "https://api.weatherapi.com/v1/current.json?key=$apiKey&q=" . urlencode($city);

$response = file_get_contents($url);

if ($response === FALSE) {
    echo json_encode(["error" => "API request failed"]);
    exit();
}

echo $response;
?>