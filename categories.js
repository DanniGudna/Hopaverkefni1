require('dotenv').config(); // eslint-disable-line
const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line
const validator = require('validator'); // eslint-disable-line
const { sanitize } = require('express-validator/filter');

const connectionString = 'postgres://:@localhost/hopverkefni';

/**
 * Validates title,text and datetime
 *
 * @param {number} offset - Title of note
 * @param {string} category - category to create
 *
 * @returns {Promise} Promise representing the errors if there are any
 */
async function validateText(offset, category) {
  const errors = [];

  // offset check
  // console.log("typeof: " + typeof (offset));
  if (typeof (offset) !== 'number') {
    errors.push({ field: 'offset', message: 'offset must be a number' });
  }

  // category check
  if (typeof (category) !== 'string') {
    errors.push({ field: 'Category', message: 'category must be a string' });
  } else if (!validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({ field: 'Category', message: 'Category must be of length 1 to 255 characters' });
  }

  sanitize(category).trim();
  sanitize(offset).trim();


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
  const off = (typeof offset === 'undefined') ? 0 : offset;
  console.log("off: " + off);
  const q = 'SELECT category FROM categories LIMIT 15 OFFSET $1';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  // const validation = await validateText(category, limit, offset);
  // if (validation.length === 0) {
  try {
    await client.connect();
    const dbResult = await client.query(q, [off]);
    await client.end();
    result.item = dbResult.rows;
    result.error = null;
  } catch (err) {
    console.info(err);
  }

  /* } else {
   result.item = null;
   result.error = validation;
 }
*/
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
  console.log("category: " + category);
  const q = 'INSERT INTO categories (category) VALUES ($1)';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  const validation = await validateText(10, category);
  if (validation.length === 0) {
    try {
      await client.connect();
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
