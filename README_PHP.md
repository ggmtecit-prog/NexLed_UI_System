# NexLed UI System - PHP Backend

This directory contains the PHP backend structure for the NexLed eCommerce platform.

## 📁 Directory Structure

```
├── public/              # Web root (point your server here)
│   ├── index.php       # Main entry point
│   ├── assets/         # Static assets (CSS, JS, images)
│   └── uploads/        # User-uploaded files
│
├── app/
│   ├── config/         # Configuration files
│   ├── models/         # Database models
│   ├── views/          # PHP templates
│   ├── controllers/    # Page controllers
│   └── includes/       # Helper functions
│
└── database/
    └── schema.sql      # Database schema
```

## 🚀 Getting Started

### 1. Set Up Database

```bash
# Import the schema
mysql -u your_username -p < database/schema.sql
```

### 2. Configure Database

Edit `app/config/database.php` with your credentials:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'nexled_db');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
```

### 3. Configure Web Server

**Apache**: Point document root to `/public` directory

**.htaccess** is already configured for routing

### 4. Test

Visit: `http://localhost/` (or your configured domain)

## 📝 Next Steps

1. Convert existing HTML pages to PHP templates in `app/views/pages/`
2. Move static assets to `public/assets/`
3. Implement controllers in `app/controllers/`
4. Add API endpoints for AJAX functionality

## 🔒 Security Notes

- Database credentials should be in `.env` file (gitignored)
- All user inputs are sanitized using `htmlspecialchars()`
- CSRF protection is implemented via helper functions
- Session cookies are configured as secure and httponly

## 📖 Documentation

See `PRODUCTION_ROADMAP.txt` for the complete deployment guide.
