import csv

categories = {
    "Humanities and Social Sciences": 1,
    "STEM": 2,
    "Art, Music, & Performance": 3,
    "Business & Entrepreneurship": 4,
    "Service & Philanthropy": 5,
    "Community Service & Volunteerism": 6,
    "Greek Life, Fraternities, & Sororities": 7,
    "Cultural and International": 8,
    "University Programs": 9,
    "Environmental": 10,
    "Governing Body": 11,
    "Government & Politics": 12,
    "Graduate and Professional Studies": 13,
    "Honor Society": 14,
    "Law & Law School": 15,
    "Media & Journalism": 16,
    "Recreation & Wellness": 17,
    "Religion & Spirituality": 18,
    "Residence Life": 19,
    "Social": 20,
    "Social Justice, Advocacy & Activism": 21
}

def main():
    currID = 0
    with open('clubdata.csv') as f:
        with open('insert_clubs.sql', 'w') as sql:
            reader = csv.reader(f)
            next(reader)
            for row in reader:
                currID += 1
                name = row[0]
                category = categories[row[1]]
                member_count = row[5]
                sql.write(f"INSERT INTO clubs (name, member_count) VALUES ('{name}', {member_count});\n")
                sql.write(f"INSERT INTO clubs_categories (club_id, category_id) VALUES ({currID}, {category});\n")

main()