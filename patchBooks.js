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
/*
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
*//*
async function patchBookId(id, books) {
  console.log(typeof(id));
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
  console.log('BOOKS', books)
  console.log('title', title)

  const func = [
    patchTitle,
    patchIsbn13,
    patchAuthor,
    patchDescription,
    patchCategory,
    patchIsbn10,
    patchPublished,
    patchPagecount,
    patchLanguage,
  ];

  const promises = [];
  const result = ({ error: '', item: '' });
  // athuga hvað er tómt og hvað Ekki

  Object.keys(books).forEach((el, i) => {
    console.log("el: " + el);
    console.log("i: " + i);
    console.log('BOOKS[EL]', books[el])
    if (books[el]) {
      console.log('CONDITION PASSED')
      // bæta við í promise fylki
      promises.push(func[i]);
      promises.push(books[el]);
      console.log('FUNC[EL]', func[i])
    }
  });

  // staðfesta að id virki
  /*const idError = validateNum(id);
  console.log('IDERROR', idError);
  if (idError.length > 0) {
    result.error = idError;
    return result.error;
  }*/
/*
  // validata það sem er ekki tómt
  const validation = await validatePatch({ books });

  console.log('VALIDATION.LENGTH', validation.length)
  if (validation.length === 0) {
    console.log('CONDITION PASSED')
    // keyra öll promises og skila result.item
    // await Promise.all(promises).then(getBookId(id));
    for (let i = 0; i<promises.length; i += 2) {
      await promises[i](books[i + 1]);
    }
    result.item = getBookId(id);
  } else {
    // annars returna errors
    result.errors = validation;

  }

  console.log(result.item);

return result;
} */
