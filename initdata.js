require('dotenv').config(); // eslint-disable-line

const fs = require('fs'); // eslint-disable-line
const util = require('util'); // eslint-disable-line
const csv = require('csvtojson');

const {
  postCategory,
} = require('./categories');

const { Client } = require('pg'); // eslint-disable-line

const csvFilePath = './data/books.csv';

csv()
  .fromFile(csvFilePath)
  .on('json', async (jsonObj) => {
    await postCategory(jsonObj.category);
  })
  .on('done', () => {
    console.info('doneeee');
  });
