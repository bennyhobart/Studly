# Ensure the database exists, use it
CREATE DATABASE IF NOT EXISTS studly;
USE studly;

# Disable foreign key checking
SET foreign_key_checks = 0;

# Drop old tables
DROP TABLE IF EXISTS User;

# Create user table
CREATE TABLE User (
    userID int UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(32) NOT NULL,
    PRIMARY KEY(userID),
    UNIQUE(username)
);

# Enable foreign key checking again
SET foreign_key_checks = 1;
