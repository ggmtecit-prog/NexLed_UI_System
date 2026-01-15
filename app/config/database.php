<?php
/**
 * Database Configuration
 * 
 * Update these values with your actual database credentials
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'nexled_db');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_CHARSET', 'utf8mb4');

/**
 * Get Database Connection
 * 
 * Returns a PDO instance with error handling
 * 
 * @return PDO Database connection
 */
function getDbConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        
        return $pdo;
        
    } catch(PDOException $e) {
        // Log error to file instead of displaying
        error_log("Database connection failed: " . $e->getMessage());
        
        // Display user-friendly message
        die("Connection failed. Please try again later.");
    }
}
