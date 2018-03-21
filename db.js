const { Client } = require('pg');
const bcrypt = require('bcrypt');
const xss = require('xss');

const {
  validateAddBookReadBy
} = require('./validation');

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/postgres';

async function runQuery(q) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q);

    const { rows } = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function query(q, values = []) {
  const client = new Client({ connectionString });
  await client.connect();

  let result;

  try {
    result = await client.query(q, values);
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }

  return result;
}

async function comparePasswords(password, hash) {
  const result = await bcrypt.compare(password, hash);

  return result;
}
async function findByUsername(username) {
  const q = 'SELECT * FROM users WHERE username = $1';
  const result = await query(q, [username]);
  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function findById(id) {
  const q = 'SELECT * FROM users WHERE id = $1';

  const result = await query(q, [id]);

  if (result.rowCount === 1) {
    return result.rows[0];
  }

  return null;
}

async function createUser(username, password, name) {
  const hashedPassword = await bcrypt.hash(password, 11);

  const q = 'INSERT INTO users (username, passwd, fname) VALUES ($1, $2, $3) RETURNING *';

  const result = await query(q, [xss(username), hashedPassword, xss(name)]);

  return result.rows[0];
}

async function insertPic(username, img) {
  const q = 'UPDATE users SET avatar = ($1) WHERE (username) = ($2)';

  const result = await query(q, [img, xss(username)]);
  return result[0];
}

async function addBookReadBy(userid, bookid, grade, comments) {
  const client = new Client({ connectionString });
  const q = 'INSERT INTO readBooks (userID, bookID, rating, review) VALUES ($1, $2, $3, $4) RETURNING *';
  await client.connect();
  const validation = validateAddBookReadBy(bookid, grade, comments);
  const value = [Number(xss(userid)), Number(xss(bookid)), Number(xss(grade)), xss(comments)];
  if (validation.length > 0) {
    console.log('CONDITION PASSED')
    try {
      const result = await client.query(q, value);
      const { rows } = result;
      return rows[0];
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      await client.end();
    }
  } else {
    return validation;
  }
}

async function patchUser(passwd, name) {
  const q = 'UPDATE users SET fname = COALESCE($1, fname), passwd = COALESCE($2, passwd) RETURNING *';
  let hashedPassword = null;
  if (passwd) {
    hashedPassword = await bcrypt.hash(passwd, 11);
  }
  const result = await query(q, [xss(name), hashedPassword]);
  return result[0];
}

module.exports = {
  runQuery,
  findById,
  findByUsername,
  comparePasswords,
  createUser,
  insertPic,
  query,
  addBookReadBy,
  patchUser,
};
