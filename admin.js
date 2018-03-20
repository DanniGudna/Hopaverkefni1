const express = require('express');

const { ensureLoggedIn, catchErrors } = require('./utils');
const { fetchData } = require('./db');

const router = express.Router();

async function data(req, res) {
  const rows = await fetchData();

  return res.render('admin', { rows, showLogin: false, title: 'Stjórnsíða' });
}

async function download(req, res) {
  const rows = await fetchData();

  const header = 'date;name;email;amount;ssn';
  const body = rows.map(row => `${row.datetime};${row.name};${row.email};${row.amount};${row.ssn}`).join('\n');

  res.type('text/csv');
  res.send([header, body].join('\n'));
}

router.get('/', ensureLoggedIn, catchErrors(data));
router.get('/download', ensureLoggedIn, catchErrors(download));

module.exports = router;
