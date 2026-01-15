<?php
/**
 * Shopping Cart Functions
 * 
 * Session-based shopping cart management
 */

// Ensure session is started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Add item to cart
 */
function addToCart($productId, $quantity = 1)
{
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }

    if (isset($_SESSION['cart'][$productId])) {
        $_SESSION['cart'][$productId] += $quantity;
    } else {
        $_SESSION['cart'][$productId] = $quantity;
    }

    return true;
}

/**
 * Remove item from cart
 */
function removeFromCart($productId)
{
    if (isset($_SESSION['cart'][$productId])) {
        unset($_SESSION['cart'][$productId]);
        return true;
    }
    return false;
}

/**
 * Update cart item quantity
 */
function updateCartQuantity($productId, $quantity)
{
    if ($quantity <= 0) {
        return removeFromCart($productId);
    }

    $_SESSION['cart'][$productId] = $quantity;
    return true;
}

/**
 * Get all cart items with product details
 */
function getCartItems()
{
    require_once __DIR__ . '/../config/database.php';

    $cart = $_SESSION['cart'] ?? [];
    $items = [];

    if (empty($cart)) {
        return $items;
    }

    $db = getDbConnection();

    foreach ($cart as $productId => $quantity) {
        $stmt = $db->prepare("SELECT * FROM products WHERE id = :id AND active = 1");
        $stmt->execute(['id' => $productId]);
        $product = $stmt->fetch();

        if ($product) {
            $product['quantity'] = $quantity;
            $product['subtotal'] = $product['price'] * $quantity;
            $items[] = $product;
        }
    }

    return $items;
}

/**
 * Get cart total
 */
function getCartTotal()
{
    $items = getCartItems();
    $total = 0;

    foreach ($items as $item) {
        $total += $item['subtotal'];
    }

    return $total;
}

/**
 * Get cart item count
 */
function getCartCount()
{
    $cart = $_SESSION['cart'] ?? [];
    return array_sum($cart);
}

/**
 * Clear cart
 */
function clearCart()
{
    $_SESSION['cart'] = [];
}
