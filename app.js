require('dotenv').config(); // eslint-disable-line

const express = require('express'); // eslint-disable-line
const cookieParser = require('cookie-parser'); // eslint-disable-line
const session = require('express-session'); // eslint-disable-line
const helmet = require('helmet'); // eslint-disable-line
const passport = require('passport'); // eslint-disable-line
const { Strategy } = require('passport-local'); // eslint-disable-line
const users = require('./db.js');
const cloudinary = require('cloudinary');
const multer = require('multer');

const uploads = multer({ dest: './temp' });

const api = require('./api');
// const users = require('./users');

const app = express();

app.use(express.json());
app.use('/', api);

const sessionSecret = 'sec';

app.use(helmet());
app.use(cookieParser(sessionSecret));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

if (!process.env.CLOUDINARY_CLOUD || !process.env.CLOUDINARY_API_KEY ||
   !process.env.CLOUDINARY_API_SECRET) {
  console.warn('Missing cloudinary config, uploading images will not work');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET,
});

async function strat(username, password, done) {
  const user = await users.findByUsername(username);
  if (!user) {
    return done(null, false);
  }

  let result = false;
  try {
    result = await users.comparePasswords(password, user.passwd);
  } catch (error) {
    done(error);
  }

  if (result) {
    console.info(user);
    return done(null, user);
  }

  return done(null, false);
}

passport.use(new Strategy(strat));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findById(id);
    return done(null, user);
  } catch (error) {
    return done(error);
  }
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.user = req.user.username;
  }

  res.locals.showLogin = true;

  next();
});


app.get('/login', (req, res) => {
  let message = '';

  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
  }
  res.json(message);
});

app.post(
  '/login',
  passport.authenticate('local', {
    failureMessage: 'Vitlaust notendanafn eða lykilorð',
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.json({ message: 'you are logged inn' });
  },
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

async function validateUser(username, password) { // eslint-disable-line
  if (typeof username !== 'string' || username.length < 2) {
    return 'Notendanafn verður að vera amk 2 stafir';
  }

  const user = await users.findByUsername(username);

  if (user) {
    return 'Notendanafn er þegar skráð';
  }

  if (typeof password !== 'string' || password.length < 6) {
    return 'Lykilorð verður að vera amk 6 stafir';
  }
}

app.post('/image', uploads.single('image'), async (req, res, next) => {
  const { file: { path } = {} } = req;
  if (!path) {
    return res.json({ message: 'gat ekki lesið mynd' });
  }
  if (!req.isAuthenticated()) {
    return res.json({ message: 'thu tharft ad skra thig inn' });
  }

  let upload = null;

  try {
    upload = await cloudinary.v2.uploader.upload(path);
  } catch (error) {
    console.error('Unable to upload file to cloudinary:', path);
    return next(error);
  }

  const { secure_url } = upload; // eslint-disable-line
  const r = await users.insertPic(res.locals.user, secure_url);
  return res.json({ user: r });
});


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
