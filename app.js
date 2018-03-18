require('dotenv').config(); // eslint-disable-line

const express = require('express'); // eslint-disable-line
const cookieParser = require('cookie-parser'); // eslint-disable-line
const session = require('express-session'); // eslint-disable-line
const helmet = require('helmet'); // eslint-disable-line
const passport = require('passport'); // eslint-disable-line
const { Strategy } = require('passport-local'); // eslint-disable-line

const api = require('./api');
const users = require('./users');

const app = express();

app.use(express.json());
app.use('/', api);
app.use('/users', users);

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
