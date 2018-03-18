require('dotenv').config(); // eslint-disable-line
const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line
const validator = require('validator'); // eslint-disable-line
const { sanitize } = require('express-validator/filter'); // eslint-disable-line

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hopverkefni';

/**
 * Validates offset
 *
 * @param {number} offset - offset
 *
 * @returns {array} an array of error messages if there are any
 */
async function validateOffset(offset) {
  const errors = [];

  // offset check
  if (typeof (offset) !== 'number') {
    errors.push({ field: 'offset', message: 'offset must be a number' });
  }

  sanitize(offset).trim();

  return errors;
}

/**
 * Validates category
 * @param {string} category - category to create
 *
 * @returns {array} returns array of objects of error messages
 */
async function validateCategory(category) {
  const errors = [];
  // category check
  if (typeof (category) !== 'string') {
    errors.push({ field: 'Category', message: 'category must be a string' });
  } else if (!validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({ field: 'Category', message: 'Category must be of length 1 to 255 characters' });
  }

  sanitize(category).trim();

  return errors;
}

/**
* /categories` GET` skilar _síðu_ af flokkum
*
* @param {number} offset - How many books should be skipped befor starting
* the limit, should start at 0 then increment by X
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getCategories(offset) {
  const client = new Client({ connectionString });
  const off = (typeof offset === 'undefined') ? 0 : parseInt(offset, 10);
  console.log('OFF', off)
  const q = 'SELECT category FROM categories LIMIT 15 OFFSET $1';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  const validation = await validateOffset(off);
  console.log(validation);
  if (validation.length === 0) {
    try {
      await client.connect();
      const dbResult = await client.query(q, [off]);
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
  const check = 'SELECT ($1) FROM categories';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
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
