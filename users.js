const express = require('express');
const { getAll, getOneById } = require('./users-api');
const { requireAuthentication, cloudinary } = require('./utils.js');
const users = require('./db.js');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
  const data = await getAll();

  res.status(200).json(data);
});


router.get('/me', requireAuthentication, (req, res) => {
  res.json(req.user);
});

router.patch('/me', requireAuthentication, (req, res) => {
  res.send('hello');
});

router.post('/me/profile', requireAuthentication, async (req, res, next) => {
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

router.get('/me/read', requireAuthentication, (req, res) => {
  
});

router.post('/me/read', requireAuthentication, (req, res) => {
  
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, data } = await getOneById(id);

  res.status(status).json(data);
});

router.delete('/me/read/:id', (req, res) => {
  const { id } = req.body;
});

module.exports = router;
