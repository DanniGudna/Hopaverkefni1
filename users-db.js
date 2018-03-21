const bcrypt = require('bcrypt');
const { Client } = require('pg');
const xss = require('xss');

const {
  validateBook,
  validateNum,
  validatePaging,
  validatePatch,
} = require('./validation');

const connectionString = process.env.DATABASE_URL;

async function getAllUsers(offset) {
  const client = new Client({ connectionString });
  const off = (typeof offset === 'undefined') ? 0 : parseInt(offset, 10);
  await client.connect();
  const query = 'SELECT * FROM users LIMIT 10 OFFSET ($1)';

  try {
    const result = await client.query(query, [Number(xss(off))]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error getting data');
    throw err;
  } finally {
    await client.end();
  }
}


async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}

async function findByUsername(username) {
  const client = new Client({ connectionString });
  const query = 'SELECT * FROM users WHERE username = $1';
  await client.connect();

  try {
    const result = await client.query(query, [username]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function findById(id) {
  const client = new Client({ connectionString });
  const query = 'SELECT id, username, fname, avatar FROM users WHERE id = $1';
  await client.connect();

  try {
    const result = await client.query(query, [id]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

async function createUser(data) {
  const client = new Client({ connectionString });
  const query =
  'INSERT INTO users (username, name, password, photo) VALUES ($1, $2, $3, $4) RETURNING username, name, photo';
  await client.connect();

  try {
    const {
      username,
      name,
      password,
      photo,
    } = data;

    const hashedPassword = await bcrypt.hash(password, 11);
    const result = await client.query(query, [username, name, hashedPassword, photo]);
    const { rows } = result;
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    await client.end();
  }
}

/**
 *`/users/:id/read`
 *  - `GET` skilar _síðu_ af lesnum bókum notanda
 /**
  * get all the books a user has read
  *
  * @param {number} id - Username of user
  * @param {number} offset - Offset of where to shot books
  * @returns {Promise} Promise representing the object of the user to create
  */
async function getReadUser(id, offset) {
  console.log('OFFSET', offset)
  console.log('ID', id)
  const client = new Client({ connectionString });
  const off = (typeof offset === 'undefined') ? 0 : parseInt(offset, 10);
  console.log('OFFSET', off)
  const query = 'SELECT * FROM readBooks WHERE userID = ($1) LIMIT 10 OFFSET ($2)';
  await client.connect();
  const result = ({ error: '', item: [[]] });
  //const validation = validatePaging(parseInt(id, 10), parseInt(off, 10));
  const validation = [];
  console.log('VALIDATION', validation)
  if (validation.length < 1) {
    try {
      const dbResult = await client.query(query, [Number(xss(id)), Number(xss(off))]);
      result.item = dbResult.rows;
      result.error = null;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await client.end();
    }
  } else {
    result.item = null;
    result.error = validation;
  }

  return result;
}


module.exports = {
  getAllUsers,
  comparePasswords,
  findByUsername,
  findById,
  createUser,
  getReadUser,
};
