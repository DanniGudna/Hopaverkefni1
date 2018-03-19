const validator = require('validator'); // eslint-disable-line
const { sanitize } = require('express-validator/filter'); // eslint-disable-line


/**
 * Validates offset
 *
 * @param {number} num - a number
 *
 * @returns {array} an array of error messages if there are any
 */
async function validateNum(num) {
  const errors = [];

  // offset check
  if (typeof (num) !== 'number') {
    errors.push({ field: 'offset', message: 'offset must be a number' });
  }

  sanitize(num).trim();

  return errors;
}

/**
 * Validates category
 * @param {string} category - category to create
 *
 * @returns {array} returns array of objects of error messages
 */
async function validateCategory(category) {
  const errors = [];
  // category check
  if (typeof (category) !== 'string') {
    errors.push({ field: 'Category', message: 'category must be a string' });
  } else if (!validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({ field: 'Category', message: 'Category must be of length 1 to 255 characters' });
  }

  sanitize(category).trim();

  return errors;
}

/**
 * Validates offset
 *
 * @param {number} offset - offset
 * @param {number} limit - limit
 *
 * @returns {array} an array of error messages if there are any
 */
async function validatePaging(offset, limit) {
  const errors = [];

  // offset check
  if (typeof (offset) !== 'number') {
    errors.push({ field: 'offset', message: 'offset must be a number' });
  }

  // limit check
  if (typeof (limit) !== 'number') {
    errors.push({ field: 'limit', message: 'limit must be a number' });
  }

  sanitize(offset).trim();
  sanitize(limit).trim();

  return errors;
}

/**
 * Validates category
 * @param {string} category - category to create
 *
 * @returns {array} returns array of objects of error messages
 */
async function validateCategory(category) {
  const errors = [];
  // category check
  if (typeof (category) !== 'string') {
    errors.push({ field: 'Category', message: 'category must be a string' });
  } else if (!validator.isLength(category, { min: 1, max: 255 })) {
    errors.push({ field: 'Category', message: 'Category must be of length 1 to 255 characters' });
  }

  sanitize(category).trim();

  return errors;
}

module.exports = {
  validateNum,
  validatePaging,
  validateCategory,
};
