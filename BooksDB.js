// llalalal
/*

  - `GET` skilar _síðu_ af flokkum
  - `POST` býr til nýjan flokk og skilar
* `/books`
  - `GET` skilar _síðu_ af bókum
  - `POST` býr til nýja bók ef hún er gild og skilar
* `/books?search=query`
  - `GET` skilar _síðu_ af bókum sem uppfylla leitarskilyrði, sjá að neðan
* `/books/:id`
  - `GET` skilar stakri bók
  - `PATCH` uppfærir bók
* `/users/:id/read`
  - `GET` skilar _síðu_ af lesnum bókum notanda
* `/users/me/read`
  - `GET` skilar _síðu_ af lesnum bókum innskráðs notanda
  - `POST` býr til nýjan lestur á bók og skilar
* `/users/me/read/:id`
  - `DELETE` eyðir lestri bókar fyrir innskráðann notanda

  */

/**
* Get a page of books.
*
* @param {Object} books - Note to create
* @param {string} books.category - Category of book
* @param {number} books.limit - How many books should show up on the page
* @param {number} books.offset - How many books should be skipped befor starting
* the limit
* @returns {Promise} Promise representing an array of the books for the page
*/
async function getCategory({ category, limit, offset } = {}) {
 /* todo útfæra */
 const client = new Client({ connectionString });
 const q = 'SELECT * FROM books WHERE category = $1 ORDER BY id LIMIT $2 OFFSET $3';
 const result = ({ error: '', item: '' });
 aijsfoasjf
 asfasf= asf = asd
//TODO: gera validation fall
 //const validation = await validateText(category, limit, offset);
 //if (validation.length === 0) {
   try {
     await client.connect();
     const dbResult = await client.query(q, [xss(category), xss(limit), xss(offset)]);
     await client.end();
     result.item = dbResult.rows[index];
     result.error = null;
   } catch (err) {
     console.info(err);
   }
 /*} else {
   result.item = null;
   result.error = validation;
 }

 return result;
}
