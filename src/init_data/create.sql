CREATE TABLE IF NOT EXISTS clubs(
  club_id SERIAL PRIMARY KEY,   /* the primary key for each entry */
  club_name VARCHAR(120) NOT NULL,
  category VARCHAR(120),
  meeting_time VARCHAR(120),
  location VARCHAR(120),
  memebrs SMALLINT
);