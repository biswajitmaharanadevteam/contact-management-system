# Database Directory - Contact Management System

This directory encapsulates the persistence layer for the Contact Management System.

## Contents
- **`schema.sql`**: SQLite table definitions, index declarations, and trigger for auto-updating timestamps.
- **`seed.sql`**: Realistic sample contacts across categories (Work, Family, Friends, Personal, Other).
- **`db.js`**: Native SQLite adapter utilizing Node.js 22+ built-in `node:sqlite` (`DatabaseSync`), with WAL mode enabled and complete Data Access Layer (DAL) methods.
- **`contacts.db`**: The SQLite database file created and updated automatically upon server startup.

## Table Schema: `contacts`
| Column | Type | Constraints / Description |
|---|---|---|
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT |
| `first_name` | TEXT | NOT NULL |
| `last_name` | TEXT | DEFAULT '' |
| `email` | TEXT | Email address |
| `phone` | TEXT | NOT NULL phone number |
| `category` | TEXT | CHECK IN ('Work', 'Family', 'Personal', 'Friends', 'Other') |
| `company` | TEXT | Company name |
| `job_title` | TEXT | Role / title |
| `address` | TEXT | Street / city address |
| `notes` | TEXT | Freeform notes |
| `is_favorite` | INTEGER | 0 or 1 (boolean flag) |
| `avatar_color` | TEXT | HEX color string (e.g. #3b82f6) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP, auto-updated by SQLite trigger |

## Indexes
- `idx_contacts_name`: `(first_name, last_name)`
- `idx_contacts_category`: `(category)`
- `idx_contacts_favorite`: `(is_favorite)`
- `idx_contacts_email`: `(email)`
- `idx_contacts_phone`: `(phone)`
