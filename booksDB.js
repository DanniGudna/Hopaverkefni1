const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line
const {
  validateBook,
  validateNum,
  validateCategory,
  validatePaging,
} = require('./validation');  // eslint-disable-line


const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hopverkefni';

/**
* Get a page of books.
* /books` GET` skilar _síðu_ af bokum
* TODO: athugaau
* @param {Object} books - Object
* @param {number} books.limit - How many books should show up on the page
* @param {number} books.offset - How many books should be skipped befor starting
* the limit, should start at 0 then increment by X - ath veit ekki hvort að þurfi
* @returns {Promise} Promise representing an object containing either array of
* the books for the page or the error message
*/
async function getBooks(offset, limit) {
  const client = new Client({ connectionString });
  const off = (typeof offset === 'undefined') ? 0 : parseInt(offset, 10);
  const lim = (typeof limit === 'undefined') ? 10 : parseInt(limit, 10);
  const q = 'SELECT * FROM books LIMIT ($1) OFFSET ($2)';
  const result = ({ error: '', item: '' });

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
  console.log("result " + result);
  return result;
}


/**
* create a book
* /books` POST` Býr til nýja bók
* @param {Object} books - Object
* @param {string} books.title - Title of the book
* @param {string} books.isbn13 - isbn13 number of book- unique
* @param {string} books.author - author of book
* @param {string} books.description - description of book ( not nesecary?)
* @param {string} books.category - category of book, refrence table categories
* @param {string} books.isbn10 - isbn10 number - unique
* @param {number} books.published - date of publication
* @param {number} books.pagecount - number of pages
* @param {string} books.language - language of the book
* @returns {Promise} Promise representing an array of the books for the page
*/
async function postBook({
  title, isbn13, author, description, category, isbn10, published, pagecount, language,
} = {}) {
  const client = new Client({ connectionString });
  const q = 'INSERT INTO books (title, isbn13, author,description, category, isbn10,published,pagecount, language) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9)';
  const result = ({ error: '', item: '' });
  const index = 0;
  // TODO: gera validation fall
   const validation = await validateBook(title, isbn13);
   console.log('VALIDATION', validation)
  // if (validation.length === 0) {
  try {
    await client.connect();
    const dbResult = await client.query(q, [
      xss(title), xss(isbn13), xss(author), xss(description), xss(category), xss(isbn10),
      published, pagecount, xss(language)]);
    await client.end();
    result.item = dbResult.rows[index];
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
* Get a single book
*`/books/:id`
*  - `GET` skilar stakri bók
*
* @param {Object} books - Object
* @param {number} books.id - How many books should show up on the page
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getBookId({ id } = {}) {
  const client = new Client({ connectionString });
  const q = 'SELECT * FROM books WHERE id = (%1)';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  // const validation = await validateText(category, limit, offset);
  // if (validation.length === 0) {
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(id)]);
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
* Get a single book
*`/books/:id`
*  - `GET` skilar stakri bók
*
* @param {Object} books - Object
* @param {number} books.id - How many books should show up on the page
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getBookByTitle({ id } = {}) {
  const client = new Client({ connectionString });
  const q = 'SELECT * FROM books WHERE id = (%1)';
  const result = ({ error: '', item: '' });
  // TODO: no need for a validation

  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(id)]);
    await client.end();
    result.item = dbResult.rows;
    result.error = null;
  } catch (err) {
    console.info(err);
  }

  return result;
}
/**
* Get a single book
*`/books/:id`
*  - `Patch` uppfærir bók
*TODO:
* @param {Object} books - Object
* @param {number} books.id - id of the book
* @param {} lalala ATH þarf að setja upp database og testa fyrst ekki ready!
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchBookId({ id } = {}) {
  const client = new Client({ connectionString });
  // fáum allar upplýsingar um bókina til að sjá hvað breytist
  const origQ = 'SELECT * FROM books WHERE id = $1';
  const q = '';
  const result = ({ error: '', item: '' });
  // TODO: gera validation fall
  // const validation = await validateText(category, limit, offset);
  // if (validation.length === 0) {
  try {
    await client.connect();

    const origResult = await client.query(origQ, [xss(id)]); // eslint-disable-line

    const dbResult = await client.query(q, [xss(id)]);
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
  getBooks,
  postBook,
  getBookId,
  getBookByTitle,
  patchBookId,
};
