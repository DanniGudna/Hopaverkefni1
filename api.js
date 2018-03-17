const express = require('express');

const {
  categories,
  createCategory,
} = require('./categories');

const {
  getBooks,
  postBook,
  getBookId,
  patchBookId,
} = require('./books');

const router = express.Router();

// async function getCategories(req, res) {
//   const allCategories = await ****;
//   res.json(allCategories.rows);
// }

// async function postCategories(req, res) {
//   const { catName } = req.body;
//   const data = await create({ catName});
//   if (data.error === null) {
//     return res.json(data.item);
//   }
//   return res.json(data.erorr);
// }

async function booksGet(req, res) {
  const allBooks = await getBooks();
  if (allBooks.error === null) {
    return res.json(allBooks.item);
  }
  return res.json(allBooks.error);
}


async function booksPost(req, res) {
  const { book } = req.body;
  const data = await postBook(book);
  if (data.error === null) {
    return res.json(data.item);
  }
  return res.json(data.error);
}

async function booksID(req, res) {
  const { id } = req.params;
  const get = await getBookId(id);
  if (get.length !== null) {
    return res.json(get);
  }
  return res.status(404).json(get.error);
}
