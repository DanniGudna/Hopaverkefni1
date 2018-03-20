const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line
const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hopverkefni';

/**
* patches teh title of the book
* @param {string} title - title of the book
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchTitle(title, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET title = ($1) WHERE id = ($2)';
  let result;
  // const result = ({ error: '', item: '' });
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(title), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}

/**
* patches the author fo the book
* @param {string} author - title of the book
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchAuthor(author, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET author = ($1) WHERE id = ($2)';
  let result;
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(author), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}

/**
* patches the isbn13 fo the book
* @param {string} isbn13 - isbn13 of the book
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchIsbn13(isbn13, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET isbn13 = ($1) WHERE id = ($2)';
  let result;
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(isbn13), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}

/**
* patches the description fo the book
* @param {string} description - description of the book
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchDescription(description, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET description = ($1) WHERE id = ($2)';
  let result;
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(description), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}

/**
* patches the category fo the book
* @param {string} category - category of the book
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchCategory(category, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET category = ($1) WHERE id = ($2)';
  let result;
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(category), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}

/**
* patches the published fo the book
* @param {string} published - published of the book
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchPublished(published, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET published = ($1) WHERE id = ($2)';
  let result;
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(published), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}

/**
* patches the isbn10 fo the book
* @param {string} isbn10 - isbn10 of the book
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchIsbn10(isbn10, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET isbn10 = ($1) WHERE id = ($2)';
  let result;
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(isbn10), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}

/**
* patches the language fo the book
* @param {string} language - language of the book must be of length 2
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchLanguage(language, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET language = ($1) WHERE id = ($2)';
  let result;
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(language), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}

/**
* patches the pagecount fo the book
* @param {string} pagecount - pagecount of the book
* @param {number} id - id of the book to patch
* everything is expected to be validated beforehand
* @returns {Promise} Promise representing an array of the books for the page
*/
async function patchPagecount(pagecount, id) {
  const client = new Client({ connectionString });
  const q = 'Update books SET pagecount = ($1) WHERE id = ($2)';
  let result;
  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(pagecount), Number(xss(id))]);
    await client.end();
    result = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result;
}


module.exports = {
  patchTitle,
  patchAuthor,
  patchIsbn13,
  patchDescription,
  patchCategory,
  patchPublished,
  patchIsbn10,
  patchLanguage,
  patchPagecount,
};
