require('dotenv').config(); // eslint-disable-line

const fs = require('fs'); // eslint-disable-line
const util = require('util'); // eslint-disable-line
const csv = require('csvtojson');

const { Client } = require('pg'); // eslint-disable-line

const connectionString = process.env.DATABASE_URL || 'postgres://:@localhost/hopverkefni';

const readFileAsync = util.promisify(fs.readFile);

const schemaFile = './schema.sql';
const csvFilePath = './data/books.csv';

async function query(q) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q);

    const rows = result;
    return rows;
  } catch (err) {
    console.error('Error running query');
    throw err;
  } finally {
    await client.end();
  }
}

async function create() {
  const data = await readFileAsync(schemaFile);

  await query(data.toString('utf-8'));

  console.info('Schema created');
}

create().catch((err) => {
  console.error('Error creating schema', err);
});

csv()
  .fromFile(csvFilePath)
  .on('json', (jsonObj) => {
    console.log(jsonObj.category);
    // combine csv header row and csv line to a json object
    // jsonObj.a ==> 1 or 4
  })
  .on('done', (error) => {
    console.log(error);
  });

