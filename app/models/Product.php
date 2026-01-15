<?php
/**
 * Product Model
 * 
 * Handles all product-related database operations
 */

class Product
{
    private $db;

    public function __construct($pdo)
    {
        $this->db = $pdo;
    }

    /**
     * Get all active products
     */
    public function getAll($limit = null, $offset = 0)
    {
        $sql = "SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC";

        if ($limit) {
            $sql .= " LIMIT :limit OFFSET :offset";
        }

        $stmt = $this->db->prepare($sql);

        if ($limit) {
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Get product by ID
     */
    public function getById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = :id AND active = 1");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Get products by category
     */
    public function getByCategory($categoryId, $limit = null)
    {
        $sql = "SELECT * FROM products WHERE category_id = :category_id AND active = 1 ORDER BY created_at DESC";

        if ($limit) {
            $sql .= " LIMIT :limit";
        }

        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':category_id', $categoryId, PDO::PARAM_INT);

        if ($limit) {
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        }

        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Search products
     */
    public function search($query)
    {
        $stmt = $this->db->prepare("
            SELECT * FROM products 
            WHERE (name LIKE :query OR description LIKE :query) 
            AND active = 1 
            ORDER BY created_at DESC
        ");

        $searchTerm = "%$query%";
        $stmt->execute(['query' => $searchTerm]);
        return $stmt->fetchAll();
    }

    /**
     * Get featured products
     */
    public function getFeatured($limit = 4)
    {
        $stmt = $this->db->prepare("
            SELECT * FROM products 
            WHERE featured = 1 AND active = 1 
            ORDER BY created_at DESC 
            LIMIT :limit
        ");

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
