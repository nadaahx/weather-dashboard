<?php
// DB_ops.php – City CRUD (per-user, session-protected)
header("Content-Type: application/json");

session_start();

// Require login for every action
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "Not authenticated."]);
    exit();
}

$userId = (int) $_SESSION['user_id'];

$conn = new mysqli("localhost", "root", "", "weather_db");
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

if (!isset($_POST['action'])) {
    echo json_encode(["error" => "No action provided"]);
    exit();
}

$action = $_POST['action'];

// ─── SAVE ──────────────────────────────────────────────────
if ($action === "save") {

    $city = trim($_POST['city'] ?? "");
    if (empty($city)) {
        echo json_encode(["error" => "City cannot be empty"]);
        exit();
    }

    // Prevent duplicates for THIS user
    $check = $conn->prepare("SELECT id FROM user_cities WHERE user_id = ? AND city_name = ?");
    $check->bind_param("is", $userId, $city);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        echo json_encode(["error" => "City already saved"]);
        exit();
    }

    $stmt = $conn->prepare("INSERT INTO user_cities (user_id, city_name) VALUES (?, ?)");
    $stmt->bind_param("is", $userId, $city);

    if ($stmt->execute()) {
        echo json_encode(["success" => "City saved"]);
    } else {
        echo json_encode(["error" => "Insert failed"]);
    }

// ─── GET ───────────────────────────────────────────────────
} elseif ($action === "get") {

    $stmt = $conn->prepare("SELECT id, city_name, note FROM user_cities WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    $cities = [];
    while ($row = $result->fetch_assoc()) {
        $cities[] = [
            "id"        => $row['id'],
            "city_name" => htmlspecialchars($row['city_name']),
            "note"      => htmlspecialchars($row['note'] ?? "")
        ];
    }
    echo json_encode($cities);

// ─── DELETE ────────────────────────────────────────────────
} elseif ($action === "delete") {

    $id = intval($_POST['id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(["error" => "Invalid ID"]);
        exit();
    }

    // Only delete if the city belongs to this user
    $stmt = $conn->prepare("DELETE FROM user_cities WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Deleted"]);
    } else {
        echo json_encode(["error" => "Delete failed"]);
    }

// ─── UPDATE NOTE ───────────────────────────────────────────
} elseif ($action === "update") {

    $id   = intval($_POST['id']   ?? 0);
    $note = trim($_POST['note']   ?? "");

    if ($id <= 0) {
        echo json_encode(["error" => "Invalid ID"]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE user_cities SET note = ? WHERE id = ? AND user_id = ?");
    $stmt->bind_param("sii", $note, $id, $userId);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "Failed to update note."]);
    }
    $stmt->close();

} else {
    echo json_encode(["error" => "Invalid action"]);
}

$conn->close();
?>
