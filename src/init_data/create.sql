CREATE TABLE IF NOT EXISTS clubs(
  club_id SERIAL PRIMARY KEY,   /* the primary key for each entry */
  club_name VARCHAR(120) NOT NULL,
  category VARCHAR(120),
  meeting_time VARCHAR(120),
  location VARCHAR(120),
  members SMALLINT
);
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(60) NOT NULL
);