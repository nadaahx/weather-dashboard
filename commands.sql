CREATE DATABASE IF NOT EXISTS weather_db;
USE weather_db;

CREATE TABLE cities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(100) NOT NULL,
    note VARCHAR(255) DEFAULT NULL,
    user_session VARCHAR(255) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_session ON cities(user_session);