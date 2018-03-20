require('dotenv').config(); // eslint-disable-line

const express = require('express'); // eslint-disable-line
const cookieParser = require('cookie-parser'); // eslint-disable-line
const session = require('express-session'); // eslint-disable-line
const helmet = require('helmet'); // eslint-disable-line
const { Strategy, ExtractJwt } = require('passport-jwt'); // eslint-disable-line
const users = require('./db.js');
const jwt = require('jsonwebtoken');

const { passport } = require('./utils.js');

const {
  JWT_SECRET: jwtSecret,
  TOKEN_LIFETIME: tokenLifetime = 20,
} = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET not registered in .env');
  process.exit(1);
}

const api = require('./api');
const user = require('./users');

const app = express();

app.use(express.json());

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

app.use('/', api);
app.use('/users', user);

const sessionSecret = 'sec';

app.use(helmet());
app.use(cookieParser(sessionSecret));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

async function strat(data, next) {
  const u = await users.findById(data.id);

  if (u) {
    next(null, u);
  } else {
    next(null, false);
  }
}

passport.use(new Strategy(jwtOptions, strat));

app.use(passport.initialize());

app.get('/login', (req, res) => {
  let message = '';

  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
  }
  res.json(message);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const u = await users.findByUsername(username);
  if (!u) {
    return res.status(401).json({ error: 'No such user' });
  }
  const passwordIsCorrect = await users.comparePasswords(password, u.passwd);

  if (passwordIsCorrect) {
    const payload = { id: u.id };
    const tokenOptions = { expiresIn: tokenLifetime };
    const token = jwt.sign(payload, jwtOptions.secretOrKey, tokenOptions);
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Invalid password' });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

async function validateUser(username, password) { // eslint-disable-line
  if (typeof username !== 'string' || username.length < 2) {
    return 'Notendanafn verður að vera amk 2 stafir';
  }

  const u = await users.findByUsername(username);

  if (u) {
    return 'Notendanafn er þegar skráð';
  }

  if (typeof password !== 'string' || password.length < 6) {
    return 'Lykilorð verður að vera amk 6 stafir';
  }
}

async function register(req, res, next) {
  const { username, password, name } = req.body;

  const validationMessage = await validateUser(username, password);

  if (validationMessage) {
    res.json({ message: validationMessage });
  }

  const result = await users.createUser(username, password, name); // eslint-disable-line

  // næsta middleware mun sjá um að skrá notanda inn því hann verður til
  // og `username` og `password` verða ennþá sett sem rétt í `req`
  next();
}

// registers new user
app.post(
  '/register',
  register,
  passport.authenticate('local', {
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.redirect('/admin');
  },
);


function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ title: '404 villa' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  res.status(500).json({ err });
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
