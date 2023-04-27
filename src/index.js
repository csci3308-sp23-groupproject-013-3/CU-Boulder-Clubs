// IMPORT DEPENDENCIES
const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const async = require('async');

// CONNECT TO DB
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    max_connections: 10,
};

const db = pgp(dbConfig);

app.use(express.static(__dirname + '/resources'));

db.connect()
    .then(obj => {
        console.log('Database connection successful');
        obj.done();
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

// APP SETTINGS
app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
    })
);

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

// API REQUESTS
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/welcome', (req, res) => {
    res.json({ status: 'success', message: 'Welcome!' });
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.oneOrNone('SELECT * FROM users WHERE username = $1', [username])
        .then(async user => {
            if (user) {
                const result = await bcrypt.compare(req.body.password, user.password);
                if (result) {
                    req.session.loggedin = true;
                    req.session.user = username;
                    req.session.save();
                    //res.json({ status: 'success', message: 'Welcome!' })
                    res.redirect('/home');
                } else {
                    //res.json({ status: 'error', message: 'Incorrect username or password' })
                    res.render('pages/login', {
                        message: 'Incorrect username or password',
                        error: true,
                    });
                }
            } else {
                //res.json({ status: 'error', message: 'Incorrect username or password' })
                res.render('pages/register', {
                    message: 'Incorrect username or password',
                    error: true,
                });
            }
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hashSync(password, 10);
    db.oneOrNone('SELECT * FROM users WHERE username = $1', [username])
        .then(user => {
            if (user) {
                //res.json({ status: 'error', message: 'Username already exists' })
                res.render('pages/register', {
                    message: 'Username already exists',
                    error: true,
                });
            } else {
                db.none('INSERT INTO users(username, password) VALUES($1, $2)', [
                    username,
                    hashedPassword,
                ])
                    .then(() => {
                        //res.json({ status: 'success', message: 'Registration successful' })
                        res.render('pages/login', {
                            message: 'Registration successful',
                            messageClass: 'alert-success',
                            error: false,
                        });
                    })
                    .catch(error => {
                        console.log('ERROR:', error.message || error);
                    });
            }
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});

app.get('/clubs', async (req, res) => {
    const categories = await db.any('SELECT * FROM categories');

    db.any('SELECT * FROM clubs_view')
        .then(data => {
            const clubs = data;
            res.render('pages/clubs', {
                clubs,
                categories,
            });
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});

app.get('/clubs/:id', (req, res) => {
    const id = req.params.id;
    db.oneOrNone('SELECT * FROM clubs_view WHERE club_id = $1', [id])
        .then(club => {
            res.render('pages/clubPages', {
                club,
            });
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});


app.get('/clubs/add', (req, res) => {
    db.any('SELECT * FROM categories')
        .then(categories => {
            res.render('pages/addClub', {
                categories,
            });
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});

app.post('/clubs/add', (req, res) => {
    const { name, description, category } = req.body;
    db.none('INSERT INTO clubs(name, description, category_id) VALUES($1, $2, $3)', [
        name,
        description,
        category,
    ])
        .then(() => {
            res.redirect('/clubs');
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});

app.get('/clubs/:id/edit', (req, res) => {
    const id = req.params.id;
    db.oneOrNone('SELECT * FROM clubs WHERE club_id = $1', [id])
        .then(club => {
            res.render('pages/editClub', {
                club,
            });
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});

app.post('/clubs/:id/edit', (req, res) => {
    const id = req.params.id;
    const { club_name, description, category, meeting_time, meeting_location, members } = req.body;
    if (category != "NULL"){
        db.none('UPDATE clubs SET name = $1, description = $2, category = $3, meeting_time = $4, meeting_location = $5, members = $6 WHERE club_id = $7', [
            club_name,
            description,
            category,
            meeting_time,
            meeting_location,
            members,
            id,
        ])
            .then(() => {
                res.redirect('/clubs');
            })
            .catch(error => {
                console.log('ERROR:', error.message || error);
            });
    }
    else{
        db.none('UPDATE clubs SET name = $1, description = $2, meeting_time = $3, meeting_location = $4, members = $5 WHERE club_id = $6', [
            club_name,
            description,
            meeting_time,
            meeting_location,
            members,
            id,
        ])
            .then(() => {
                res.redirect('/clubs');
            })
            .catch(error => {
                console.log('ERROR:', error.message || error);
            });
    }
});

app.get('/clubs/:id/delete', (req, res) => {
    const id = req.params.id;
    db.one('SELECT * FROM clubs WHERE club_id = $1', [id])
        .then(club => {
            res.render('pages/deleteClub', {
                club,
            });
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});

app.post('/clubs/:id/delete', (req, res) => {
    const id = req.params.id;
    db.none('DELETE FROM clubs WHERE club_id = $1', [id])
        .then(() => {
            res.redirect('/clubs');
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});

app.get('/home', (req, res) => {
    const username = req.session.user;
    console.log("Username: " + username);

    db.any('SELECT * FROM clubs WHERE club_id IN (SELECT club_id FROM users_clubs WHERE username = $1)', [username])
        .then((result) => {
            console.log(result);
            res.render('pages/home', { clubs: result });
        })
        .catch((err) => {
            console.log(err);
            res.render('pages/home', { clubs: [] })
        });
});

module.exports = app.listen(3000);
console.log('Server running on port 3000');