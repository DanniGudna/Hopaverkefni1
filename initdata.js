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
  .on('json', (jsonObj) => {
    postCategory(jsonObj.category);
    // combine csv header row and csv line to a json object
    // jsonObj.a ==> 1 or 4
  })
  .on('done', (error) => {
    console.info(error);
  });
