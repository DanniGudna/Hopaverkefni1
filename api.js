const express = require('express');

const {
  getCategories,
  postCategory,
} = require('./categories');

const {
  getBooks,
  postBook,
  getBookId,
  patchBookId,
} = require('./booksDB');

const router = express.Router();


async function categoriesGet(req, res) {
  const { offset } = req.query;
  console.log(offset);
  const allCategories = await getCategories(offset);
  return res.json(allCategories.item);
}

async function categoryPost(req, res) {
  const { category } = req.body;
  const data = await postCategory(category);
  if (data.error === null) {
    return res.json(data.item);
  }
  return res.json(data.erorr);
}

// GET á /books
async function booksGet(req, res) {
  let { offset } = req.query;
  const allBooks = await getBooks(offset);
  if (allBooks.error === null) {
    return res.json(allBooks.item);
  }
  return res.json(allBooks.error);
}

// POST á /books
async function booksPost(req, res) {
  const {
    title, isbn13, author, description, category, isbn10, published, pagecount, language
  }
 = req.body;
  const data = await postBook({
    title, isbn13, author, description, category, isbn10, published, pagecount, language
  });
  if (data.error === null) {
    return res.json(data.item);
  }
  return res.json(data.error);
}

// get á /books/id
async function booksID(req, res) {
  const { id } = req.params;
  console.log(id);
  const get = await getBookId(id);
  if (get.length !== null) {
    return res.json(get);
  }
  return res.status(404).json(get.error);
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

// Category routes
router.get('/categories/', catchErrors(categoriesGet));
router.post('/categories/', catchErrors(categoryPost));

// Books routes
router.post('/books/', catchErrors(booksPost));
router.get('/books', catchErrors(booksGet));
router.get('/books/:id', catchErrors(booksID));
module.exports = router;
