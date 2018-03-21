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
  const q = 'SELECT * FROM books WHERE title = ($1)';
  const result = ({ error: '', item: '' });
  // no need for a validation it is validatad elsewhere

  try {
    await client.connect();
    const dbResult = await client.query(q, [xss(title)]);
    await client.end();
    result.item = dbResult.rowCount;
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
    errors.push({ field: 'id', message: 'id must be a number' });
  }

  // TODO: bryeta þetta í validate id til að athuga hvort að id sé til!!
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
  const client = new Client({ connectionString });
  // category check
  if (typeof (category) !== 'string') {
    errors.push({ field: 'Category', message: 'category must be a string' });
  } else if (!validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({ field: 'Category', message: 'Category must be of length 1 to 255 characters' });
  } else {
    await client.connect();
    const check = 'SELECT ($1) FROM categories';
    const duplicateCheck = await client.query(check, [xss(category)]);
    if (duplicateCheck.rows.length > 0) {
      errors.push({ field: 'category', message: 'category does not exist' });
    }
    await client.end();
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
 * Validates book
 * @param {string} title - Title of the book- must be unique and between 1-255
 * @param {string} isbn13 - isbn13 number of book- unique
 * @param {string} author - author of book - not nesecary
 * @param {string} description - description of book- not nesecary no length limitish
 * @param {string} category - category of book, refrence table categories must be a category
 * @param {string} isbn10 - isbn10 number - unique
 * @param {string} published - date of publication -TODO:
 * @param {number} pagecount - number of pages- number min 1
 * @param {string} language - language of the book- must be 2 letters
 * @returns {Promise} returns array of objects of error messages
 */
async function validateBook(
  title, isbn13, author, description, category, isbn10,
  published, pagecount, language,
) {
  const errors = [];

  // title  check
  if (typeof (title) !== 'string') {
    errors.push({ field: 'Title', message: 'title must be a string' });
  } else if (!validator.isLength(title, { min: 1, max: 255 })) {
    errors.push({ field: 'Title', message: 'Title must be of length 1 to 255 characters' });
  } else {
    const titleCheck = await getBookByTitle(title);
    if (titleCheck.length > 0) {
      errors.push({ field: 'Title', message: 'Title must be unique' });
    }
  }

  // isbn13 check
  if (typeof (isbn13) !== 'string') {
    errors.push({ field: 'isbn13', message: 'isbn13 must be a string' });
  } else if (!validator.isISBN(isbn13, [13])) {
    errors.push({ field: 'isbn13', message: 'Must be ISBN13' });
  }

  // author check
  if (author) {
    if (typeof (author) !== 'string') {
      errors.push({ field: 'Author', message: 'author must be string' });
    } else if (!validator.isLength(author, { min: 1, max: 64 })) {
      errors.push({ field: 'Author', message: 'Author must be of length 1 to 64 characters' });
    }
  }

  // description check
  if (description) {
    if (typeof (description) !== 'string') {
      errors.push({ field: 'Description', message: 'Description must be string' });
    }
  }

  // category check
  // getum ekki kallad a validatecategory thvi thad verdur ljott thegar thetta er
  // svo skrifad ut athuga betur seinna
  if (typeof (category) !== 'string') {
    errors.push({ field: 'Category', message: 'category must be a string' });
  } else if (!validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({ field: 'Category', message: 'Category must be of length 1 to 255 characters' });
  } else {
    const client = new Client({ connectionString });
    await client.connect();
    const check = 'SELECT category FROM categories WHERE category = ($1)';
    const duplicateCheck = await client.query(check, [xss(category)]);
    if (duplicateCheck.rows.length < 1) {
      errors.push({ field: 'category', message: 'category does not exist' });
    }
    await client.end();
  }

  // isbn10 check
  if (isbn10) {
    if (typeof (isbn10) !== 'string') {
      errors.push({ field: 'isbn10', message: 'isbn10 must be a string' });
    } else if (!validator.isISBN(isbn10, [10])) {
      errors.push({ field: 'isbn10', message: 'Must be ISBN10' });
    }
  }

  // published
  if (published) {
    if (typeof (published) !== 'string') {
      errors.push({ field: 'published', message: 'published must be a string' });
    } else if (!validator.isLength(published, { min: 0, max: 32 })) {
      errors.push({ field: 'Published', message: 'Published must be of length 0 to 32 characters' });
    }
  }

  // PAGECOUNT
  // TODO: athuga med int
  if (pagecount) {
    if (typeof (pagecount) !== 'number') {
      errors.push({ field: 'pagecount', message: 'pagecount must be a number' });
    }
  }
  // language
  if (language) {
    if (typeof (language) !== 'string') {
      errors.push({ field: 'language', message: 'language must be a string' });
    } else if (!validator.isLength(language, { min: 2, max: 2 })) {
      errors.push({ field: 'language', message: 'language must be of length 2 characters' });
    }
  }

  sanitize(category).trim();

  return errors;
}


/**
 * Validates patch on book, nothing is required
 * @param {Object} books - Note to create
 * @param {string} books.title - Title of the book- must be unique and between 1-255
 * @param {string} books.isbn13 - isbn13 number of book- unique
 * @param {string} books.author - author of book - not nesecary
 * @param {string} books.description - description of book- not nesecary no length limitish
 * @param {string} books.category - category of book, refrence table categories must be a category
 * @param {string} books.isbn10 - isbn10 number - unique
 * @param {string} books.published - date of publication -TODO:
 * @param {number} books.pagecount - number of pages- number min 1
 * @param {string} books.language - language of the book- must be 2 letters
 * @returns {Promise} returns array of objects of error messages
 */
async function validatePatch({ books } = {}) {
  const errors = [];
  const {
    title,
    isbn13,
    author,
    description,
    category,
    isbn10,
    published,
    pagecount,
    language,
  } = books;

  // title check
  if (title) {
    if (typeof (title) !== 'string') {
      errors.push({ field: 'Title', message: 'title must be a string' });
    } else if (!validator.isLength(title, { min: 1, max: 255 })) {
      errors.push({ field: 'Title', message: 'Title must be of length 1 to 255 characters' });
    } else {
      const titleCheck = await getBookByTitle(title);
      if (titleCheck.length > 0) {
        errors.push({ field: 'Title', message: 'Title must be unique' });
      }
    }
  }

  // isbn13 check
  if (isbn13) {
    if (typeof (isbn13) !== 'string') {
      errors.push({ field: 'isbn13', message: 'isbn13 must be a string' });
    } else if (!validator.isISBN(isbn13, [13])) {
      errors.push({ field: 'isbn13', message: 'Must be ISBN13' });
    }
  }

  // author check
  if (author) {
    if (typeof (author) !== 'string') {
      errors.push({ field: 'Author', message: 'author must be string' });
    } else if (!validator.isLength(author, { min: 1, max: 64 })) {
      errors.push({ field: 'Author', message: 'Author must be of length 1 to 64 characters' });
    }
  }

  // description check
  if (description) {
    if (typeof (description) !== 'string') {
      errors.push({ field: 'Description', message: 'Description must be string' });
    }
  }

  // category check
  // getum ekki kallad a validatecategory thvi thad verdur ljott thegar thetta er
  // svo skrifad ut athuga betur seinna
  if (category) {
    if (typeof (category) !== 'string') {
      errors.push({ field: 'Category', message: 'category must be a string' });
    } else if (!validator.isLength(category, { min: 1, max: 255 })) {
      errors.push({ field: 'Category', message: 'Category must be of length 1 to 255 characters' });
    } else {
      const client = new Client({ connectionString });
      await client.connect();
      const check = 'SELECT category FROM categories WHERE category = ($1)';
      const duplicateCheck = await client.query(check, [xss(category)]);
      if (duplicateCheck.rows.length < 1) {
        errors.push({ field: 'category', message: 'category does not exist' });
      }
      await client.end();
    }
  }

  // isbn10 check
  if (isbn10) {
    if (typeof (isbn10) !== 'string') {
      errors.push({ field: 'isbn10', message: 'isbn10 must be a string' });
    } else if (!validator.isISBN(isbn10, [10])) {
      errors.push({ field: 'isbn10', message: 'Must be ISBN10' });
    }
  }

  // published
  if (published) {
    if (typeof (published) !== 'string') {
      errors.push({ field: 'published', message: 'published must be a string' });
    } else if (!validator.isLength(published, { min: 0, max: 32 })) {
      errors.push({ field: 'Published', message: 'Published must be of length 0 to 32 characters' });
    }
  }

  // PAGECOUNT
  // TODO: athuga med int
  if (pagecount) {
    if (typeof (pagecount) !== 'number') {
      errors.push({ field: 'pagecount', message: 'pagecount must be a number' });
    }
  }
  // language

  if (language) {
    if (typeof (language) !== 'string') {
      errors.push({ field: 'language', message: 'language must be a string' });
    } else if (!validator.isLength(language, { min: 2, max: 2 })) {
      errors.push({ field: 'language', message: 'language must be of length 2 characters' });
    }
  }

  return errors;
}

module.exports = {
  validateNum,
  validatePaging,
  validateCategory,
  validateBook,
  validatePatch,
};
