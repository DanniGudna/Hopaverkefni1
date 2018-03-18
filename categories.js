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
  console.log(typeof (offset));
  if (typeof (offset) !== 'number') {
    errors.push({ field: 'offset', message: 'offset must be a number' });
  }

  // category check
  if (!validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({ field: 'Category', message: 'Category must be a string of length 1 to 255 characters' });
  }

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
