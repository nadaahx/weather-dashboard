<?php
header("Content-Type: application/json");

// DB connection
$conn = new mysqli("localhost", "root", "", "weather_db");

if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

// Ensure action exists
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

    // Server-side validation
    if (empty($city)) {
        echo json_encode(["error" => "City cannot be empty"]);
        exit();
    }

    // Prevent duplicates (optional but nice)
    $check = $conn->prepare("SELECT id FROM cities WHERE city_name = ?");
    $check->bind_param("s", $city);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["error" => "City already saved"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO cities (city_name) VALUES (?)");
    $stmt->bind_param("s", $city);

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

    $result = $conn->query("SELECT * FROM cities ORDER BY created_at DESC");

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

    $stmt = $conn->prepare("DELETE FROM cities WHERE id = ?");
    $stmt->bind_param("i", $id);

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
    $id = $_POST['id'];
    $note = $_POST['note'];

    // Using prepared statements for security (Rubric requirement!)
    $stmt = $conn->prepare("UPDATE cities SET note = ? WHERE id = ?");
    $stmt->bind_param("si", $note, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to update note."]);
    }
    $stmt->close();
    exit;
}


// =========================
// UNKNOWN ACTION
// =========================
else {
    echo json_encode(["error" => "Invalid action"]);
}

$conn->close();
?>

