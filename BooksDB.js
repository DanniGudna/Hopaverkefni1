const { Client } = require('pg');
const xss = require('xss');
// const validator = require('validator');


const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hopverkefni';
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

/**
* Get a page of books.
* /books` GET` skilar _síðu_ af bokum
*
* @param {Object} books - Object
* @param {number} books.limit - How many books should show up on the page
* @param {number} books.offset - How many books should be skipped befor starting
* the limit, should start at 0 then increment by X - ath veit ekki hvort að þurfi
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getBooks({ limit, offset } = {}) {
  const client = new Client({ connectionString });
  const q = 'SELECT * FROM books LIMIT $1 OFFSET $2';
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
* create a book
* /books` POST` Býr til nýja bók
* @param {Object} books - Object
* @param {string} books.title - Title of the book
* @param {string} books.isbn13 - isbn13 number of book- unique
* @param {string} books.author - author of book
* @param {string} books.description - description of book ( not nesecary?)
* @param {string} books.category - category of book, refrence table categories
* @param {string} books.isbn10 - isbn10 number - unique
* @param {string} books.published - date of publication
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
  // const validation = await validateText(category, limit, offset);
  // if (validation.length === 0) {
  try {
    await client.connect();
    const dbResult = await client.query(q, [
      xss(title), xss(isbn13), xss(author), xss(description), xss(category), xss(isbn10),
      xss(published), xss(pagecount), xss(language)]);
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
  const q = 'SELECT * FROM books WHERE id = %1';
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
    const origResult = await client.query(origQ, [xss(id)]);
    console.log(origResult);
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
    const origResult = await client.query(origQ, [xss(id)]);
    console.log(origResult);
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
  getCategories,
  postCategory,
  getBooks,
  postBook,
  getBookId,
  patchBookID,
};

/*
  - `GET` skilar _síðu_ af flokkum check
  - `POST` býr til nýjan flokk og skilar check
* `/books`
  - `GET` skilar _síðu_ af bókum check
  - `POST` býr til nýja bók ef hún er gild og skilar
* `/books?search=query`
  - `GET` skilar _síðu_ af bókum sem uppfylla leitarskilyrði, sjá að neðan
* `/books/:id`
  - `GET` skilar stakri bók
  - `PATCH` uppfærir bók
* `/users/:id/read`
  - `GET` skilar _síðu_ af lesnum bókum notanda
* `/users/me/read`
  - `GET` skilar _síðu_ af lesnum bókum innskráðs notanda
  - `POST` býr til nýjan lestur á bók og skilar
* `/users/me/read/:id`
  - `DELETE` eyðir lestri bókar fyrir innskráðann notanda
*/
