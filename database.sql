-- database.sql
CREATE DATABASE IF NOT EXISTS coachhelper;
USE coachhelper;

-- Drop table to recreate with new schema
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    club_name VARCHAR(255),
    plan VARCHAR(50),
    payment_method VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'client',
    offer_type VARCHAR(100),
    offer_start_date DATE,
    offer_end_date DATE
);

-- Insert admin user
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@coachhelper.com', 'admin123', 'admin');

-- Insert a regular client
INSERT INTO users (name, email, password, plan, club_name, offer_type, offer_start_date, offer_end_date)
VALUES ('John Doe', 'user@coachhelper.com', 'user123', 'monthly', 'City Tigers', 'Monthly Plan', CURRENT_DATE, DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY));

-- Drop table to recreate with new schema
DROP TABLE IF EXISTS offers;

-- Create offers table
CREATE TABLE offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    period VARCHAR(50) NOT NULL,
    description TEXT,
    is_popular BOOLEAN DEFAULT FALSE
);

-- Insert default offers
INSERT INTO offers (name, price, period, description, is_popular)
VALUES 
('Weekly Plan', 9.00, 'week', 'Perfect for short-term basketball camps, trials, or tournament weekends.', FALSE),
('Monthly Plan', 29.00, 'month', 'Standard season dashboard access. Roster tracking, stats tools, and live console.', TRUE),
('Yearly Plan', 290.00, 'year', 'Best overall value. Full support for year-round development, multiple teams, and historic seasons.', FALSE);
