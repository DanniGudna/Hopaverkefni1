const express = require('express');
const { getAll, getOneById } = require('./users-api');
const { requireAuthentication, cloudinary } = require('./utils.js');
const users = require('./db.js');
const multer = require('multer');

const uploads = multer({ dest: './temp' }); // eslint-disable-line

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  const data = await getAll();

  res.status(200).json(data);
});


router.get('/me', requireAuthentication, (req, res) => {
  res.json(req.user);
});

router.patch('/me', requireAuthentication, async (req, res) => { // eslint-disable-line
  const { password, name } = req.body;
  let q;
  if (password && name) {
    q = 'UPDATE users SET name = ($1), passwd = ($2) WHERE (id) = ($3)';
    users.query(q, [password, name, req.user.id]);
  } else if (password) {
    q = 'UPDATE users SET name = ($1), passwd = ($2) WHERE (id) = ($3)';
  } else if (name) {
    q = 'UPDATE users SET name = ($1), passwd = ($2) WHERE (id) = ($3)';
  }
  const u = await users.query(q, [password, name, req.user.id]);
  return res.json(u);
});

router.post('/me/profile', requireAuthentication, async (req, res, next) => {
  const { file: { path } = {} } = req;
  if (!path) {
    return res.json({ message: 'gat ekki lesið mynd' });
  }

  let upload = null;

  try {
    upload = await cloudinary.v2.uploader.upload(path);
  } catch (error) {
    console.error('Unable to upload file to cloudinary:', path);
    return next(error);
  }

  const { secure_url } = upload; // eslint-disable-line
  const r = await users.insertPic(req.user.username, secure_url);

  return res.json({ user: r });
});

router.get('/me/read', requireAuthentication, (req, res) => {
  res.json({ message: 'hello' });
});

router.post('/me/read', requireAuthentication, (req, res) => {
  res.json({ message: 'hello' });
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, data } = await getOneById(id);

  res.status(status).json(data);
});

router.delete('/me/read/:id', (req, res) => {
  const { id } = req.body;
  res.json({ message: id });
});

module.exports = router;
