<?php
/**
 * Application Configuration
 * 
 * General application settings and environment configuration
 */

// Environment (development, staging, production)
define('ENV', getenv('APP_ENV') ?: 'development');

// Debug mode
define('DEBUG', ENV === 'development');

// Application URL
define('APP_URL', getenv('APP_URL') ?: 'http://localhost');

// Application Name
define('APP_NAME', 'NexLed');

// Session Configuration
define('SESSION_LIFETIME', 7200); // 2 hours in seconds

// Error Reporting
if (DEBUG) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/../../logs/error.log');
}

// Security Settings
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.use_strict_mode', 1);

// Timezone
date_default_timezone_set('Europe/Lisbon');
