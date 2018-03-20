const validator = require('validator'); // eslint-disable-line
const { sanitize } = require('express-validator/filter'); // eslint-disable-line
const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hopverkefni';

/**
* Get a single book by title
*
* @param {string} title - title of the book
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getBookByTitle(title) {
  const client = new Client({ connectionString });
  const q = 'SELECT * FROM books WHERE title = (%1)';
  const result = ({ error: '', item: '' });
  // no need for a validation it is validatad elsewhere

  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(title)]);
    await client.end();
    result.item = dbResult.rows;
    result.error = null;
  } catch (err) {
    console.info(err);
  }

  return result.item;
}


/**
 * Validates offset
 *
 * @param {number} num - a number
 *
 * @returns {array} an array of error messages if there are any
 */
async function validateNum(num) {
  const errors = [];

  // offset check
  if (typeof (num) !== 'number') {
    errors.push({ field: 'offset', message: 'offset must be a number' });
  }

  sanitize(num).trim();

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
 * Validates offset
 *
 * @param {number} offset - offset
 * @param {number} limit - limit
 *
 * @returns {array} an array of error messages if there are any
 */
async function validatePaging(offset, limit) {
  const errors = [];

  // offset check
  if (typeof (offset) !== 'number') {
    errors.push({ field: 'offset', message: 'offset must be a number' });
  }

  // limit check
  if (typeof (limit) !== 'number') {
    errors.push({ field: 'limit', message: 'limit must be a number' });
  }

  sanitize(offset).trim();
  sanitize(limit).trim();

  return errors;
}

/**
 * Validates category
 * @param {string} title - Title of the book- must be unique and between 1-255
 * @param {string} isbn13 - isbn13 number of book- unique
 * @param {string} author - author of book - not nesecary
 * @param {string} description - description of book- not nesecary no length limitish
 * @param {string} category - category of book, refrence table categories must be a category
 * @param {string} isbn10 - isbn10 number - unique
 * @param {string} published - date of publication -TODO:
 * @param {number} pagecount - number of pages- number min 1
 * @param {string} language - language of the book- must be 2 letters
 * @returns {array} returns array of objects of error messages
 */
async function validateBook(
  title, isbn13, author, description, category, isbn10,
  published, pagecount, language
) {
  const errors = [];
  console.log(typeof(title));

  // title  check
  if (typeof (title) !== 'string') {
    errors.push({ field: 'Title', message: 'title must be a string' });
  } else if (!validator.isLength(title, { min: 1, max: 255 })) {
    errors.push({ field: 'Title', message: 'Title must be of length 1 to 255 characters' });
  } else {
    const titleCheck = await getBookByTitle(title);
    console.log('TITLECHECK', titleCheck)
    if (titleCheck.length > 0) {
      errors.push({ field: 'Title', message: 'Title must be unique' });
    }
  }

  console.log('title done');
  console.log(typeof(isbn13));

  //isbn13 check
  console.log('VALIDATOR.ISISBN(ISBN13, [13])', validator.isISBN(isbn13, [13]))
  if (!validator.isISBN(isbn13, [13])) {
    console.log('CONDITION PASSED')
    errors.push({ field: 'isbn13', message: 'Must be ISBN13' });
  }
  sanitize(category).trim();

  return errors;
}

module.exports = {
  validateNum,
  validatePaging,
  validateCategory,
  validateBook,
};
