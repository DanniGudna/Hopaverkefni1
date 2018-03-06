const express = require('express');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));

// get all users
router.get('/', (req, res) => {

});

// get user by id
router.get('/:id', (req, res) => {
  const { id } = req.params;
});

// get me
router.get('/me', (req, res) => {

});

// get my profile
router.get('/me/profile', (req, res) => {
 
});

// get book read by user
router.get('/:id/read', (req, res) => {
  const { id } = req.params;
});

// get books read by me
router.get('/me/read', (req, res) => {

});

// add book read by me
router.post('/me/read', (req, res) => {

});

// delete book i've read by id
router.delete('/me/read/:id', (req, res) => {
  const { id } = req.params;
});

module.exports = router;
