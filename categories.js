require('dotenv').config(); // eslint-disable-line
const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line
const {
  validatePaging,
  validateCategory,
} = require('./validation');  // eslint-disable-line


const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hopverkefni';


/**
* /categories` GET` skilar _síðu_ af flokkum
*
* @param {String} offset - How many books should be skipped befor starting
* @param {String} limit
* the limit, should start at 0 then increment by X
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getCategories(offset, limit) {
  const client = new Client({ connectionString });
  const off = (typeof offset === 'undefined') ? 0 : parseInt(offset, 10);
  const lim = (typeof limit === 'undefined') ? 10 : parseInt(limit, 10);

  const q = 'SELECT category FROM categories LIMIT ($1) OFFSET ($2)';
  const result = ({
    error: '', item: [[]], offset: off, limit: lim,
  });
  const validation = await validatePaging(off, lim);

  if (validation.length === 0) {
    try {
      await client.connect();
      const dbResult = await client.query(q, [Number(xss(lim)), Number(xss(off))]);
      await client.end();
      result.item = dbResult.rows;
      result.error = null;
    } catch (err) {
      console.info(err);
    }
  } else {
    result.item = null;
    result.error = validation;
  }
  return result;
}

/**
* Creates a new category.
* /categories` POST býr til nýjan flokk og skilar
*
* @param {string} category - Category to create
* @returns {Promise} Promise representing an array of the books for the page
*/
async function postCategory(category) {
  const client = new Client({ connectionString });

  const q = 'INSERT INTO categories (category) VALUES ($1)';
  const check = 'SELECT category FROM categories WHERE category = ($1)';
  const result = ({ error: {}, item: [[]] });
  const validation = await validateCategory(category);
  if (validation.length === 0) {
    try {
      await client.connect();
      const duplicateCheck = await client.query(check, [category]);
      if (duplicateCheck.rows.length > 0) {
        result.error = ({ field: 'category', message: 'category exist' });
        await client.end();
        return result;
      }
      const dbResult = await client.query(q, [category]);
      await client.end();
      result.item = dbResult.rows;
      result.error = null;
    } catch (err) {
      console.info(err);
    }
  } else {
    result.item = null;
    result.error = validation;
  }

  return result;
}

module.exports = {
  getCategories,
  postCategory,
};
