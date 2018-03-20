const csv = require('csvtojson');
const xss = require('xss');

const {
  postCategory,
} = require('./categories');

const {
  postBook,
} = require('./booksDB');

const csvFilePath = './data/books.csv';
const allCategories = [];
const allBooks = [];

async function insert() {
  for (let i = 0; i < allBooks.length; i += 1) {
    await postBook(allBooks[i]);
  }
  console.info('=== Books Added ===');
}

function readJson() {
  csv()
    .fromFile(csvFilePath)
    .on('json', (jsonObj) => {
      const {
        title,
        isbn13,
        author,
        description,
        isbn10,
        published,
        pagecount = 0,
        language,
        category,
      } = jsonObj;

      const data = {
        title: xss(title),
        isbn13: xss(isbn13),
        author: xss(author),
        description: xss(description),
        category: xss(category),
        isbn10: xss(isbn10),
        published: xss(published),
        pagecount: Number(xss(pagecount)),
        language: xss(language),
      };

      allBooks.push(data);
    })
    .on('done', async () => {
      console.info('=== Adding Books ===');
      await insert();
    });
}

console.info('=== Adding Categories ===');
csv()
  .fromFile(csvFilePath)
  .on('json', async (jsonObj) => {
    const { category } = jsonObj;
    if (!allCategories.includes(category)) {
      allCategories.push(category);
      await postCategory(xss(category));
    }
  })
  .on('done', () => {
    console.info('=== Categories Added ===');
    setTimeout(readJson, 2000);
  });
