require('dotenv').config(); // eslint-disable-line

const path = require('path');
const express = require('express'); // eslint-disable-line
const cookieParser = require('cookie-parser'); // eslint-disable-line
const session = require('express-session'); // eslint-disable-line
const helmet = require('helmet'); // eslint-disable-line
const passport = require('passport'); // eslint-disable-line
const { Strategy } = require('passport-local'); // eslint-disable-line

// const categories = require('./categories');
// const index = require('./index');
const admin = require('./admin'); // eslint-disable-line
const books = require('./books'); // eslint-disable-line
const users = require('./users'); // eslint-disable-line

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const sessionSecret = 'sec';

app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(sessionSecret));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

function strat(username, password, done) {
  users
    .findByUsername(username)
    .then((user) => {
      if (!user) {
        return done(null, false);
      }

      return users.comparePasswords(password, user);
    })
    .then(res => done(null, res))
    .catch((err) => {
      done(err);
    });
}

passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  users
    .findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

app.use(passport.initialize());
app.use(passport.session());

// app.use('/', index);

app.get('/login', (req, res) => {
  let message = '';

  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
  }

  res.render('login', { showLogin: false, message, title: 'Innskráning' });
});

app.post('/login', (req, res) => {

});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// registers new user
app.post('/register', (req, res) => {

});

// logs in new user
app.post('/login', (req, res) => {

});

app.use('/admin', admin);
app.use('/books', books);
app.use('/users', users);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', { title: '404' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  res.status(500).render('error', { err });
}

app.use(notFoundHandler);
app.use(errorHandler);

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

app.listen(port, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
