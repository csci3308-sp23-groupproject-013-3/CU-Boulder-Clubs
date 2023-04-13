// IMPORT DEPENDENCIES
const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// CONNECT TO DB
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

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
                    res.redirect('/discover');
                } else {
                    res.render('pages/login', {
                        message: 'Incorrect username or password',
                        error: true,
                    });
                }
            } else {
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
                        res.render('pages/login', {
                            message: 'Registration successful',
                            messageClass: 'alert-success',
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