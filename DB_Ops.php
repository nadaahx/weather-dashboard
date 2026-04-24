<?php
header("Content-Type: application/json");
error_reporting(0);

// customization logic
$cookie_name = "weather_device_id";
$cookie_duration = time() + (10 * 365 * 24 * 60 * 60); // 10 years

if (!isset($_COOKIE[$cookie_name])) {
    // for browser
    $user_id = bin2hex(random_bytes(16)); 
    setcookie($cookie_name, $user_id, $cookie_duration, "/");
    $_COOKIE[$cookie_name] = $user_id;
} else {
    $user_id = $_COOKIE[$cookie_name];
}

$username = "root";
$password = "";
$database = "weather_db";
$hostname = "localhost";

$conn = new mysqli($hostname, $username, $password, $database);

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

if (!isset($_POST['action'])) {
    echo json_encode(["error" => "No action provided"]);
    exit();
}

$action = $_POST['action'];

// =========================
// CREATE (Save City)
// =========================
if ($action === "save") {
    $city = trim($_POST['city'] ?? "");

    if (empty($city) || strlen($city) > 100) {
        echo json_encode(["error" => "Invalid city name"]);
        exit();
    }


    $check = $conn->prepare("SELECT id FROM cities WHERE city_name = ? AND user_session = ?");
    $check->bind_param("ss", $city, $user_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["error" => "City already saved"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO cities (city_name, user_session) VALUES (?, ?)");
    $stmt->bind_param("ss", $city, $user_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => "City saved"]);
    } else {
        echo json_encode(["error" => "Insert failed"]);
    }
}

// =========================
// READ (Get Cities)
// =========================
elseif ($action === "get") {
    $stmt = $conn->prepare("SELECT * FROM cities WHERE user_session = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $cities = [];
    while ($row = $result->fetch_assoc()) {
        $cities[] = [
            "id" => $row['id'],
            "city_name" => htmlspecialchars($row['city_name']),
            "note" => htmlspecialchars($row['note'] ?? "")
        ];
    }
    echo json_encode($cities);
}

// =========================
// DELETE (Remove City)
// =========================
elseif ($action === "delete") {
    $id = intval($_POST['id'] ?? 0);

    if ($id <= 0) {
        echo json_encode(["error" => "Invalid ID"]);
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM cities WHERE id = ? AND user_session = ?");
    $stmt->bind_param("is", $id, $user_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Deleted"]);
    } else {
        echo json_encode(["error" => "Delete failed"]);
    }
}

// =========================
// Update City Note
// =========================
elseif ($action === "update"){
    $id = intval($_POST['id'] ?? 0);
    $note = substr(trim($_POST['note'] ?? ""), 0, 255); 
    $note = $_POST['note'] ?? "";

    $stmt = $conn->prepare("UPDATE cities SET note = ? WHERE id = ? AND user_session = ?");
    $stmt->bind_param("sis", $note, $id, $user_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to update note."]);
    }
    $stmt->close();
}

else {
    echo json_encode(["error" => "Invalid action"]);
}

$conn->close();
?>