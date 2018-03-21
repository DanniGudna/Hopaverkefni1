const express = require('express');
const { getAll, getOneById } = require('./users-api');
const { requireAuthentication, cloudinary } = require('./utils.js');
const users = require('./db.js');
const multer = require('multer');

const {
  getReadUser,
} = require('./user-db');

const uploads = multer({ dest: './temp' }); // eslint-disable-line

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {

  const { offset } = req.query;
  const data = await getAll(offset);
  const ubers = [];
  for (let i = 0; i < data.length; i += 1) {
    ubers.push({
      id: data[i].id,
      user: data[i].username,
      name: data[i].fname,
      avatar: data[i].avatar,
    });
  }
  res.status(200).json(ubers);
});


router.get('/me', requireAuthentication, (req, res) => {
  const data = {
    username: req.user.username,
    name: req.user.fname,
    avatar: req.user.avatar,
  };
  res.json(data);
});

router.patch('/me', requireAuthentication, async (req, res) => { // eslint-disable-line
  const { password, name } = req.body;
  let q;
  if (password && name) {
    q = 'UPDATE users SET fname = ($1), passwd = ($2) WHERE (id) = ($3)';
    users.query(q, [password, name, req.user.id]);
  } else if (password) {
    q = 'UPDATE users SET passwd = ($2) WHERE (id) = ($3)';
  } else if (name) {
    q = 'UPDATE users SET fname = ($1) WHERE (id) = ($3)';
  }
  const u = await users.query(q, [password, name, req.user.id]);
  return res.json(u);
});

router.post('/me/profile', requireAuthentication, uploads.single('image'), async (req, res, next) => {
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

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, data } = await getOneById(id);

  res.status(status).json(data);
});

router.delete('/me/read/:id', (req, res) => {
  const { id } = req.body;
  res.json({ message: id });
});
/* `/users/:id/read`
  - `GET` skilar _síðu_ af lesnum bókum notanda -ekki rdy
  */
async function userIdRead(req, res) {
  const id = req.param;
  const offset = req.query;
  const get = await getReadUser(id, offset);
  if (get.error === null) {
    return res.json(get.item);
  }
  return res.status(404).json(get.error);
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/users/:id/read', catchErrors(userIdRead));

module.exports = router;
