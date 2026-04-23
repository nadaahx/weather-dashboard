CREATE DATABASE weather_db;

USE weather_db;

-- ─── Users ────────────────────────────────────────────────
CREATE TABLE users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,          -- bcrypt hash
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Per-user saved cities ────────────────────────────────
CREATE TABLE user_cities (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   INT          NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    note      VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_city (user_id, city_name)
);
