DROP TABLE IF EXISTS clubs CASCADE;
CREATE TABLE clubs (
    club_id SERIAL PRIMARY KEY,
    club_name VARCHAR(150) NOT NULL,
    club_description TEXT,
    meeting_day VARCHAR(10),
    meeting_time VARCHAR(10),
    meeting_place VARCHAR(150),
    members INTEGER NOT NULL
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(150) NOT NULL
);

DROP TABLE IF EXISTS clubs_categories CASCADE;
CREATE TABLE clubs_categories (
    club_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (club_id, category_id),
    FOREIGN KEY (club_id) REFERENCES clubs (club_id),
    FOREIGN KEY (category_id) REFERENCES categories (category_id)
);

/*
DROP TABLE IF EXISTS users_clubs CASCADE;
CREATE TABLE users_clubs (
    user_id INTEGER NOT NULL,
    club_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (club_id) REFERENCES clubs (club_id)
);
*/