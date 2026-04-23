<?php
// header.php – included at the top of index.php
session_start();
$loggedIn = isset($_SESSION['user_id']);
$username = $loggedIn ? htmlspecialchars($_SESSION['username']) : "";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkyScope – Weather Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header class="site-header">
    <div class="header-inner">
        <div class="logo">
            <span class="logo-icon">⛅</span>
            <span class="logo-text">SkyScope</span>
        </div>
        <nav class="header-nav">
            <span class="nav-label">Weather Dashboard</span>
        </nav>
        <div class="header-right">
            <span class="live-badge">● LIVE</span>
            <?php if ($loggedIn): ?>
                <span class="user-greeting">👤 <?= $username ?></span>
                <button class="btn-auth btn-logout" id="logoutBtn">Logout</button>
            <?php else: ?>
                <button class="btn-auth btn-login"  id="openLoginBtn">Login</button>
                <button class="btn-auth btn-signup" id="openSignupBtn">Sign Up</button>
            <?php endif; ?>
        </div>
    </div>
</header>

<!-- ── AUTH MODAL ─────────────────────────────────────── -->
<div id="authModal" class="modal-overlay hidden">
    <div class="modal-box">
        <button class="modal-close" id="closeModal">✕</button>

        <!-- Login Form -->
        <div id="loginForm" class="auth-form">
            <h2 class="auth-title">Welcome back</h2>
            <p class="auth-subtitle">Login to access your saved cities</p>
            <label>Username
                <input type="text" id="loginUsername" autocomplete="username" placeholder="your_username">
            </label>
            <label>Password
                <input type="password" id="loginPassword" autocomplete="current-password" placeholder="••••••••">
            </label>
            <p id="loginError" class="auth-error"></p>
            <button class="btn-submit" id="loginSubmit">Login</button>
            <p class="auth-switch">Don't have an account? <a href="#" id="switchToSignup">Sign up</a></p>
        </div>

        <!-- Sign-up Form -->
        <div id="signupForm" class="auth-form hidden">
            <h2 class="auth-title">Create account</h2>
            <p class="auth-subtitle">Your saved cities are private to you</p>
            <label>Username
                <input type="text" id="signupUsername" autocomplete="username" placeholder="choose_a_username">
            </label>
            <label>Email
                <input type="email" id="signupEmail" autocomplete="email" placeholder="you@example.com">
            </label>
            <label>Password
                <input type="password" id="signupPassword" autocomplete="new-password" placeholder="min. 6 characters">
            </label>
            <p id="signupError" class="auth-error"></p>
            <button class="btn-submit" id="signupSubmit">Create account</button>
            <p class="auth-switch">Already have an account? <a href="#" id="switchToLogin">Login</a></p>
        </div>
    </div>
</div>
