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

async function index(req, res) {
  return res.json({
    authentication: {
      register: '/register',
      login: '/login',
    },
    books: {
      books: '/books',
      book: '/book/{id}',
    },
    categories: '/categories',
    users: {
      users: '/users',
      user: '/users/{id}',
      read: '/users/{id}/read',
    },
    me: {
      me: '/users/me',
      profile: '/users/me/profile',
      read: '/users/me/read',
    },
  });
}

async function categoriesGet(req, res) {
  const { offset, limit } = req.query;
  const allCategories = await getCategories(offset, limit);
  if (allCategories.error === null) {
    const result = ({
      offset: allCategories.offset, limit: allCategories.limit, items: allCategories.item,
    });
    return res.json(result);
  }
  return res.json(allCategories.error);
}

async function categoryPost(req, res) {
  const { category } = req.body;
  const data = await postCategory(category);
  if (data.error === null) {
    return res.json(data.item);
  }
  return res.json(data.error);
}

// GET á /books
async function booksGet(req, res) {
  const { offset, limit, search } = req.query;
  const allBooks = await getBooks(offset, limit, search);
  if (allBooks.error === null) {
    const result = ({ offset: allBooks.offset, limit: allBooks.limit, items: allBooks.item });
    return res.json(result);
  }
  return res.json(allBooks.error);
}

// POST á /books
async function booksPost(req, res) {
  const {
    title, isbn13, author, description, category, isbn10, published, pagecount, language,
  }
 = req.body;
  const data = await postBook({
    title, isbn13, author, description, category, isbn10, published, pagecount, language,
  });
  if (data.error === null) {
    return res.json(data.item);
  }
  return res.json(data.error);
}

// get á /books/id
async function booksID(req, res) {
  const { id } = req.params;
  const get = await getBookId(id);
  if (get.error === null) {
    return res.json(get.item);
  }
  return res.status(404).json(get.error);
}

async function booksPatch(req, res) {
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
  } = req.body;
  const { id } = req.params;
  const data = await patchBookId(
    Number(id),
    {
      title,
      isbn13,
      author,
      description,
      category,
      isbn10,
      published,
      pagecount,
      language,
    },
  );

  if (data.error === null) {
    return res.json(data.item);
  }
  return res.json(data.error);
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/', catchErrors(index));
// Category routes
router.get('/categories/', catchErrors(categoriesGet));
router.post('/categories/', catchErrors(categoryPost));

// Books routes
router.post('/books/', catchErrors(booksPost));
router.get('/books', catchErrors(booksGet));
router.get('/books/:id', catchErrors(booksID));
router.patch('/books/:id', catchErrors(booksPatch));
module.exports = router;
