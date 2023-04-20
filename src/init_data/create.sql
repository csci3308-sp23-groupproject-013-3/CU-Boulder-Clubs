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

DROP VIEW IF EXISTS clubs_view CASCADE;
CREATE VIEW clubs_view AS
    SELECT clubs.club_id, club_name, club_description, meeting_day, meeting_time, meeting_place, members, array_agg(category_name) AS categories
    FROM clubs
    LEFT JOIN clubs_categories ON clubs.club_id = clubs_categories.club_id
    LEFT JOIN categories ON clubs_categories.category_id = categories.category_id
    GROUP BY clubs.club_id;