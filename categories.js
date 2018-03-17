require('dotenv').config(); // eslint-disable-line
const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line
// const validator = require('validator');

const connectionString = 'postgres://:@localhost/v3';

/**
* /categories` GET` skilar _síðu_ af flokkum
*
* @param {Object} books - Object
* @param {number} books.limit - How many books should show up on the page
* @param {number} books.offset - How many books should be skipped befor starting
* the limit, should start at 0 then increment by X
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getCategories({ limit, offset } = {}) {
  const client = new Client({ connectionString });
  const q = 'SELECT category FROM categories LIMIT $1 OFFSET $2';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  // const validation = await validateText(category, limit, offset);
  // if (validation.length === 0) {
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(limit), xss(offset)]);
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
  const q = 'INSERT INOT categories (category) VALUES $1';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  // const validation = await validateText(category, limit, offset);
  // if (validation.length === 0) {
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(category)]);
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

module.exports = {
  getCategories,
  postCategory,
};
