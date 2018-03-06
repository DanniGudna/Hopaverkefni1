const express = require('express');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

router.get('/', (res, req) => {
  res.send('hello');
});

