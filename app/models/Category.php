<?php
/**
 * Category Model
 * 
 * Handles all category-related database operations
 */

class Category
{
    private $db;

    public function __construct($pdo)
    {
        $this->db = $pdo;
    }

    /**
     * Get all active categories
     */
    public function getAll()
    {
        $stmt = $this->db->query("SELECT * FROM categories WHERE active = 1 ORDER BY name ASC");
        return $stmt->fetchAll();
    }

    /**
     * Get category by ID
     */
    public function getById($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE id = :id AND active = 1");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch();
    }

    /**
     * Get category by slug
     */
    public function getBySlug($slug)
    {
        $stmt = $this->db->prepare("SELECT * FROM categories WHERE slug = :slug AND active = 1");
        $stmt->execute(['slug' => $slug]);
        return $stmt->fetch();
    }
}
