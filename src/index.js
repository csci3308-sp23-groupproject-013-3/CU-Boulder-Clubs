// IMPORT DEPENDENCIES
const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords

// CONNECT TO DB
const dbConfig = {
    host: 'db',
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
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
                    res.json({ status: 'success', message: 'Welcome!' })
                    res.redirect('/discover', {
                        message: 'Welcome!',
                        messageClass: 'alert-success',
                        });
                } else {
                    res.json({ status: 'error', message: 'Incorrect username or password' })
                    res.render('pages/login', {
                        message: 'Incorrect username or password',
                        error: true,
                    });
                }
            } else {
                res.json({ status: 'error', message: 'Incorrect username or password' })
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
                res.json({ status: 'error', message: 'Username already exists' })
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
                        res.json({ status: 'success', message: 'Registration successful' })
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

app.get('/clubs', (req, res) => {
    let categories = [];
    categories = db.any('SELECT * FROM categories')
    db.any('SELECT * FROM clubs_view')
        .then(clubs => {
            res.render('pages/clubs', {
                clubs: clubs,
                categories: categories,
            });
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
});



module.exports = app.listen(3000);
console.log('Server running on port 3000');