const pooler = require('../database/pooler');



/**
 * Retrieves all resources
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAll(req, res, next){
   // *Querying the database for all resources:
   pooler.query('select * from ??', ['schedule'])
      .then(result => {
         // *Sending the resources as response:
         res.status(200)
            .json(result.rows)
            .end();
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}



/**
 * Retrieves a single resource, given its id
 * @author Guilherme Reginaldo Ruella
 */
function retrieve(req, res, next){
   // *Getting the id from request params:
   let id = req.params.id;

   // *Querying the database for the resource:
   pooler.query('select * from ?? where ?? = ?', ['schedule', 'id', id])
      .then(result => {
         // *Checking if there is something on result:
         if(result.rows.length){
            // *If there is:
            // *Sending the first resource as response:
            res.status(200)
               .json(result.rows[0])
               .end();
         } else{
            // *If not:
            // *Sending a 404 response:
            res.status(404)
               .send('Resource not found')
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}



/**
 * Creates a new resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function create(req, res, next){
   // *Getting the body of the request:
   let values = req.body;

   // *Inserting the resource in the database:
   pooler.query('insert into ?? set ?', ['schedule', values])
      .then(result => {
         // *Responding with the inserted element's id:
         res.status(201)
            .json({id: result.rows.insertId})
            .end();
      })
      .catch(err => {
         // *If something went wrong:
         // *Checking the error code:
         switch(err.code){
         case 'ER_NO_DEFAULT_FOR_FIELD':
            // *Sending a 400 error response:
            res.status(400)
               .send('Missing required field')
               .end();
            break;
         case 'ER_DUP_ENTRY':
            // *Sending a 400 error response:
            res.status(400)
               .send('The resource already exists')
               .end();
            break;
         default:
            // *Sending a 500 error response:
            res.status(500)
               .send('Something went wrong')
               .end();
         }
      });
}



/**
 * Updates a resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function update(req, res, next){
   // *Getting the id from request params:
   let id = req.params.id;
   // *Getting the body of the request:
   let values = req.body;


   // *Updating the resource in the database:
   pooler.query('update ?? set ? where ?? = ?', ['schedule', values, 'id', id])
      .then(result => {
         // *Checking if the resource was updated:
         if(result.rows.affectedRows){
            // *If it was:
            // *Responding with 200 status:
            res.status(200)
               .end();
         } else{
            // *If it wasn't:
            // *Sending a 404 response:
            res.status(404)
               .send('Resource not found')
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Checking the error code:
         switch(err.code){
         case 'ER_DUP_ENTRY':
            // *Sending a 400 error response:
            res.status(400)
               .send('The resource already exists')
               .end();
            break;
         default:
            // *Sending a 500 error response:
            res.status(500)
               .send('Something went wrong')
               .end();
         }
      });
}



/**
 * Deletes a resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function erase(req, res, next){
   // *Getting the id from request params:
   let id = req.params.id;

   // *Deleting the resource from database:
   pooler.query('delete from ?? where ?? = ?', ['schedule', 'id', id])
      .then(result => {
         // *Checking if the resource was deleted:
         if(result.rows.affectedRows){
            // *If it was:
            // *Responding with 200 status:
            res.status(200)
               .end();
         } else{
            // *If it wasn't:
            // *Sending a 404 response:
            res.status(404)
               .send('Resource not found')
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}



// *Exporting the module:
module.exports = {
   retrieveAll: retrieveAll,
   retrieve: retrieve,
   create: create,
   update: update,
   erase: erase
};
