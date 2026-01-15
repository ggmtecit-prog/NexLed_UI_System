<?php
/**
 * Public Entry Point
 * 
 * Routes requests to appropriate controllers
 */

// Load configuration
require_once __DIR__ . '/../app/config/app.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/includes/helpers.php';

// Start session
session_start();

// Simple routing
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

// Remove leading slash
$path = ltrim($path, '/');

// Default to homepage
if (empty($path) || $path === 'index.php') {
    require_once __DIR__ . '/../app/views/pages/homepage.php';
    exit;
}

// Route to appropriate page
switch ($path) {
    case 'products':
        require_once __DIR__ . '/../app/views/pages/products.php';
        break;

    case 'cart':
        require_once __DIR__ . '/../app/views/pages/cart.php';
        break;

    case 'checkout':
        require_once __DIR__ . '/../app/views/pages/checkout.php';
        break;

    case 'about':
        require_once __DIR__ . '/../app/views/pages/about.php';
        break;

    case 'contact':
        require_once __DIR__ . '/../app/views/pages/contact.php';
        break;

    default:
        // 404 page
        http_response_code(404);
        echo "Page not found";
        break;
}
