require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');

const admin = require('./admin');

const app = express();

const passport = require('passport');
const { Strategy } = require('passport-local');
const users = require('./users');

const sessionSecret = process.env.SESSION_SECRET || 'fj489jfadkljv';

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

function strat(username, password, done) {
  users
    .findByUsername(username)
    .then((user) => {
      if (!user) {
        return false;
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

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user.name;
  }

  res.locals.showLogin = true;

  next();
});

// hjálparfall fyrir view
app.locals.isInvalid = (param, errors) => {
  if (!errors) {
    return false;
  }

  return Boolean(errors.find(i => i.param === param));
};

app.get('/login', (req, res) => {
  let message = '';

  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
  }

  res.render('login', { showLogin: false, message, title: 'Innskráning' });
});

app.post(
  '/login',
  passport.authenticate('local', {
    failureMessage: 'Vitlaust notendanafn eða lykilorð',
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.use('/admin', admin);

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
