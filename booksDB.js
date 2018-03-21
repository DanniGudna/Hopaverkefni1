const { Client } = require('pg'); // eslint-disable-line
const xss = require('xss'); // eslint-disable-line
const {
  validateBook,
  validateNum,
  validatePaging,
  validatePatch,
} = require('./validation');  // eslint-disable-line

const {
  patchTitle,
  patchAuthor,
  patchIsbn13,
  patchDescription,
  patchCategory,
  patchPublished,
  patchIsbn10,
  patchLanguage,
  patchPagecount,
} = require('./patchBooks');  // eslint-disable-line


const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hopverkefni';

/**
* Get a page of books.
* /books` GET` skilar _síðu_ af bokum
* TODO: athugaau
* @param {Object} books - Object
* @param {number} books.limit - How many books should show up on the page
* @param {number} books.offset - How many books should be skipped befor starting
* the limit, should start at 0 then increment by X - ath veit ekki hvort að þurfi
* @param {string} books.search - search query
* @returns {Promise} Promise representing an object containing either array of
* the books for the page or the error message
*/
async function getBooks(offset, limit, search) {
  const client = new Client({ connectionString });
  const off = (typeof offset === 'undefined') ? 0 : parseInt(offset, 10);
  const lim = (typeof limit === 'undefined') ? 10 : parseInt(limit, 10);
  // const src = (typeof search === 'undefined') ? '' : search;
  const beginQ = 'SELECT * FROM books';
  const optionalQ = ' WHERE to_tsvector(title) @@ to_tsquery($3) OR to_tsvector(description) @@ to_tsquery($3)';
  const endQ = ' LIMIT ($1) OFFSET ($2)';
  let q;
  // const q = 'SELECT * FROM books WHERE to_tsvector(title) @@ to_tsquery($3)
  // OR to_tsvector(description) @@ to_tsquery($3) LIMIT ($1) OFFSET ($2)';
  if (search) {
    q = beginQ + optionalQ + endQ;
  } else {
    q = beginQ + endQ;
  }
  console.log(q);
  const result = ({
    error: '', item: [[]], offset: off, limit: lim,
  });

  const validation = await validatePaging(off, lim);

  if (validation.length === 0) {
    try {
      await client.connect();
      let dbResult;
      if (search) {
        dbResult = await client.query(q, [Number(xss(lim)), Number(xss(off)), xss(search)]);
      } else {
        dbResult = await client.query(q, [Number(xss(lim)), Number(xss(off))]);
      }
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
async function postBook(books) {
  const client = new Client({ connectionString });

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

  await client.connect();

  const insert = 'INSERT INTO books';
  const params = '(title, isbn13, author, description, category, isbn10, published, pagecount, language) ';
  const val = 'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *';
  const query = insert + params + val;
  const result = ({ error: '', item: [[]] });

  const values = [
    title, isbn13, author, description,
    category, isbn10, published, pagecount, language,
  ];
  const validation = await validateBook(
    title,
    isbn13,
    author,
    description,
    category,
    isbn10, published, pagecount, language);
  if (validation.length === 0) {
    try {
      const dataresult = await client.query(query, values);
      result.item = dataresult.rows;
      result.error = null
    } catch (err) {
      console.error('Error inserting data');
      throw err;
    } finally {
      await client.end();
    }
  } else {
    result.item = null;
    result.error = validation;
  }

  return result;
}

/**
* Get a single book
*`/books/:id`
*  - `GET` skilar stakri bók
* @param {number} id - id of the book you want to show
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getBookId(id) {
  const client = new Client({ connectionString });
  const q = 'SELECT * FROM books WHERE id = ($1)';
  const result = ({ error: '', item: '' });
  const validation = await validateNum(Number(id));
  if (validation.length === 0) {
    try {
      await client.connect();
      const dbResult = await client.query(q, [Number(xss(id))]);
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


// only use with patchbookid
/**
 * Update a note asynchronously.
 *
 * @param {number} id - Id of note to update
 * @param {string} books.title - Title of the book
 * @param {string} books.isbn13 - isbn13 number of book- unique
 * @param {string} books.author - author of book
 * @param {string} books.description - description of book ( not nesecary?)
 * @param {string} books.category - category of book, refrence table categories
 * @param {string} books.isbn10 - isbn10 number - unique
 * @param {number} books.published - date of publication
 * @param {number} books.pagecount - number of pages
 * @param {string} books.language - language of the book
 * Assumes that validation is done
 * @returns {Promise} Promise representing the object result of creating the note
 */
async function patchBook(id, book) {
  const [
    title,
    isbn13,
    author,
    description,
    category,
    isbn10,
    published,
    pagecount,
    language,
  ] = book;
  const client = new Client({ connectionString });
  const q = 'UPDATE books SET title = ($2),isbn13 = ($3),author = ($4),description = ($5),category = ($6),isbn10 = ($7),published = ($8),pagecount = ($9),language = ($10) WHERE id = ($1)';
  const result = ({ error: '', item: '' });
  const index = 0;

  try {
    await client.connect();

    const dbResult = await client.query(q, [Number(xss(id)),
      xss(title),
      xss(isbn13),
      xss(author),
      xss(description),
      xss(category),
      xss(isbn10),
      xss(published),
      Number(xss(pagecount)),
      xss(language)
    ]);
    await client.end();
    result.item = dbResult.rows[index];
    // console.log('RESULT.ITEM', result.item)
    result.error = null;
    return result;
  } catch (err) {
    console.info(err);
  }

  return result.item;
}


/**
* Get a single book
*`/books/:id`
*  - `Patch` uppfærir bók
*TODO:
* @param {Object} books - Object
* @param {number} id - Title of the book
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
async function patchBookId(id, books) {
  let {
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

  const result = ({ error: '', item: '' });
  const val = [];
  // staðfesta að id virki
  const idError = await validateNum(id);
  if (idError.length > 0) {
    result.error = idError;
    // TODO: knks skila result.error
    return result;
  }
  const original = await getBookId(id);
  const orig = [
    original.item[0].title,
    original.item[0].isbn13,
    original.item[0].author,
    original.item[0].description,
    original.item[0].category,
    original.item[0].isbn10,
    original.item[0].published,
    original.item[0].pagecount,
    original.item[0].language,
  ];



  // athuga hvað er tómt og hvað Ekki
  Object.keys(books).forEach((el, i) => {
    console.log("el: " + el);
    console.log("i: " + i);
    console.log('BOOKS[EL]', books[el])
    if (!books[el]) {
      // pusha upprunalega
      val.push(orig[i]);
      console.log('ORIG[I]', orig[i])
      // val.push(check);
    } else {
      // ef ekki tómt pusha strax inn í values.
      const check = books[el];
      val.push(check);
    }
    console.log("vali " + val[i]);
  });

  // validata það sem er ekki tómt
  const validation = await validatePatch({ books });

  if (validation.length === 0) {
    // patcha allt saman
    patchBook(id, val );
    const patched = await getBookId(id);
    result.item = patched.item;
    result.error = null;
  } else {
    // annars returna errors
    result.errors = validation;

  }


return result;
}
// only use with patchbookid
async function getOriginalValue(val, id) {
  const client = new Client({ connectionString });
  const q = 'SELECT ($1) FROM books WHERE id = ($2)';
  console.log('Q', q)
  const result = ({ item: '' });
  console.log("val " + val);
  console.log("id " + id);
  //no need to validate both has been done beforehand

  try {
    await client.connect();
    const dbResult = await client.query(q, [val, Number(xss(id))]);
    console.log('DBRESULT', dbResult.rows[0]);
    await client.end();
    result.item = dbResult.rows;
  } catch (err) {
    console.info(err);
  }

  return result.item;
}


module.exports = {
  getBooks,
  postBook,
  getBookId,
  patchBookId,
  getOriginalValue,
};
