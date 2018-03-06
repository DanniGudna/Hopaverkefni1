const express = require('express');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// get all books
router.get('/', (req, res) => {
  const { search } = req.query;

  res.send('get books');
});

// post a new book if valid
router.post('/', (req, res) => {
  res.send('new book');
});

// get book by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  console.info(id);
  res.send('book by id');
});

router.patch('/:id', (req, res) => {
  const { id } = req.params;
});

module.exports = router;
