<?php
header("Content-Type: application/json");

error_reporting(0);

if (!isset($_GET['city'])) {
    echo json_encode(["error" => "City missing"]);
    exit();
}

$city = $_GET['city'];
$apiKey = "key"; #############update


$url = "https://api.weatherapi.com/v1/current.json?key=$apiKey&q=$city";

$response = file_get_contents($url);

if ($response === FALSE) {
    echo json_encode(["error" => "API request failed"]);
    exit();
}

// IMPORTANT: return raw JSON ONLY
echo $response;
?>