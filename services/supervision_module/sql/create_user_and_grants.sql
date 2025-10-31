-- Optional: Create a dedicated application user and grant privileges
-- Run this connected to the 'postgres' database as a superuser (e.g., user 'postgres')
-- Replace YOUR_STRONG_PASSWORD_HERE below before executing.

-- 1) Create a login role for the app
CREATE ROLE amlguard WITH LOGIN PASSWORD 'YOUR_STRONG_PASSWORD_HERE';

-- 2) Make sure the database exists (run create_database.sql first)
-- CREATE DATABASE amlguard;

-- 3) Set ownership and grants
ALTER DATABASE amlguard OWNER TO amlguard;
GRANT ALL PRIVILEGES ON DATABASE amlguard TO amlguard;

-- 4) After connecting to the amlguard database, you can also run:
--    GRANT USAGE, CREATE ON SCHEMA public TO amlguard;
--    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO amlguard;
--    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO amlguard;
