<?php
// auth.php – Sign-up & Login handler
header("Content-Type: application/json");

session_start();

$conn = new mysqli("localhost", "weather_user", "1234", "weather_db");
if ($conn->connect_error) {
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

if (!isset($_POST['action'])) {
    echo json_encode(["error" => "No action provided"]);
    exit();
}

$action = $_POST['action'];

// ─── SIGN UP ───────────────────────────────────────────────
if ($action === "signup") {

    $username = trim($_POST['username'] ?? "");
    $email    = trim($_POST['email']    ?? "");
    $password =       $_POST['password'] ?? "";

    // Basic validation
    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode(["error" => "All fields are required."]);
        exit();
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "Invalid email address."]);
        exit();
    }
    if (strlen($password) < 6) {
        echo json_encode(["error" => "Password must be at least 6 characters."]);
        exit();
    }

    // Check username / email uniqueness
    $check = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $check->bind_param("ss", $username, $email);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        echo json_encode(["error" => "Username or email already exists."]);
        exit();
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hash);

    if ($stmt->execute()) {
        $userId = $conn->insert_id;
        $_SESSION['user_id']   = $userId;
        $_SESSION['username']  = $username;
        echo json_encode(["success" => true, "username" => $username]);
    } else {
        echo json_encode(["error" => "Registration failed. Please try again."]);
    }

// ─── LOGIN ─────────────────────────────────────────────────
} elseif ($action === "login") {

    $username = trim($_POST['username'] ?? "");
    $password =       $_POST['password'] ?? "";

    if (empty($username) || empty($password)) {
        echo json_encode(["error" => "Username and password are required."]);
        exit();
    }

    $stmt = $conn->prepare("SELECT id, username, password FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($id, $dbUsername, $dbHash);
    $stmt->fetch();

    if ($stmt->num_rows === 0 || !password_verify($password, $dbHash)) {
        echo json_encode(["error" => "Invalid username or password."]);
        exit();
    }

    $_SESSION['user_id']  = $id;
    $_SESSION['username'] = $dbUsername;
    echo json_encode(["success" => true, "username" => $dbUsername]);

// ─── LOGOUT ────────────────────────────────────────────────
} elseif ($action === "logout") {

    session_unset();
    session_destroy();
    echo json_encode(["success" => true]);

// ─── SESSION CHECK ─────────────────────────────────────────
} elseif ($action === "check") {

    if (isset($_SESSION['user_id'])) {
        echo json_encode(["loggedIn" => true, "username" => $_SESSION['username']]);
    } else {
        echo json_encode(["loggedIn" => false]);
    }

} else {
    echo json_encode(["error" => "Invalid action."]);
}

$conn->close();
?>
