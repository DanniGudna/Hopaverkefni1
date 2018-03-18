require('dotenv').config(); // eslint-disable-line
const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line
const validator = require('validator'); // eslint-disable-line

const connectionString = 'postgres://:@localhost/hopverkefni';

/**
 * Validates title,text and datetime
 *
 * @param {string} title - Title of note
 * @param {string} text - Text of note
 * @param {string} datetime - Datetime of note
 *
 * @returns {Promise} Promise representing the errors if there are any
 */
async function validateText(title, text, datetime) {
  const errors = [];
  // title check
  if (!validator.isLength(title, { min: 1, max: 255 })) {
    errors.push({ field: 'Title', message: 'Title must be a string of length 1 to 255 characters' });
  }

  // text check
  if (typeof text !== 'string') {
    errors.push({ field: 'text', message: 'Text must be a string' });
  }

  // datetime check
  if (!validator.isISO8601(datetime)) {
    errors.push({ field: 'datetime', message: 'Datetime must be a ISO 8601 date' });
  }

  return errors;
}

/**
* /categories` GET` skilar _síðu_ af flokkum
*
* @param {Object} books - Object
* @param {number} books.limit - How many books should show up on the page
* @param {number} books.offset - How many books should be skipped befor starting
* the limit, should start at 0 then increment by X
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getCategories(offset) {
  const client = new Client({ connectionString });
  console.log(offset);
  const q = 'SELECT category FROM categories LIMIT 10 OFFSET $1';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  // const validation = await validateText(category, limit, offset);
  // if (validation.length === 0) {
  try {
    await client.connect();
    const dbResult = await client.query(q, [offset]);
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
  console.log("TEST");
  const client = new Client({ connectionString });
  console.log(category);
  const q = 'INSERT INTO categories (category) VALUES ($1)';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  // const validation = await validateText(category, limit, offset);
  // if (validation.length === 0) {
  try {
    await client.connect();
    const dbResult = await client.query(q, [category]);
    await client.end();
    console.log(dbResult.rows);
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

module.exports = {
  getCategories,
  postCategory,
};
