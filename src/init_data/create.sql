DROP TABLE IF EXISTS reviews CASCADE;
CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL,
    user_id VARCHAR NOT NULL REFERENCES users(username),
    club_id INTEGER NOT NULL REFERENCES clubs(club_id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS clubs CASCADE;
CREATE TABLE IF NOT EXISTS clubs(
  club_id SERIAL PRIMARY KEY,
  club_name VARCHAR(120) NOT NULL,
  club_description TEXT,
  category VARCHAR(120),
  meeting_time VARCHAR(120),
  location VARCHAR(120),
  members SMALLINT
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users(
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(60) NOT NULL
);

<<<<<<< Updated upstream
DROP TABLE IF EXISTS users_clubs CASCADE;
CREATE TABLE users_clubs (
    username INTEGER NOT NULL,
    club_id INTEGER NOT NULL,
    PRIMARY KEY (username, club_id),
    FOREIGN KEY (username) REFERENCES users (username),
    FOREIGN KEY (club_id) REFERENCES clubs (club_id)
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE IF NOT EXISTS categories(
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(120) NOT NULL
);
=======
CREATE TABLE IF NOT EXISTS users_to_clubs(
  club_id INTEGER,
  username VARCHAR(50) 
);
>>>>>>> Stashed changes
