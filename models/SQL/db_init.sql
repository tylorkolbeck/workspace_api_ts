DROP DATABASE IF EXISTS note_api_db;
CREATE DATABASE note_api_db;
USE note_api_db;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
	id int AUTO_INCREMENT NOT NULL,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(50) NOT NULL,
    activated boolean NOT NULL DEFAULT 0,
    confirmation_code varchar(50) NOT NULL,
    role enum('user', 'admin') NOT NULL DEFAULT 'user',
    created_at date NOT NULL,
    updated_at date NOT NULL,
    
    PRIMARY KEY(id)
)