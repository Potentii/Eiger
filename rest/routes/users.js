const pooler = require('../database/pooler');



/**
 * Retrieves all resources
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAll(req, res, next){
   // *Querying the database for all resources:
   pooler.query('select * from ??', ['user_view'])
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
            .json({message: 'Database error'})
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
   pooler.query('select * from ?? where ?? = ?', ['user_view', 'user_id', id])
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
               .json({message: 'Resource not found'})
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .json({message: 'Database error'})
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
   pooler.query('insert into ?? set ?', ['user', values])
      .then(result => {
         // *Checking if the resource was inserted:
         if(result.affectedRows){
            // *If it was:
            // *Responding with the inserted element's id:
            res.status(201)
               .json({id: result.insertId})
               .end();
         } else{
            // *If it wasn't:
            // TODO test to know what happens if values isn't correct:
            // TODO maybe we'll need to change this:
            // *Sending a 400 response:
            res.status(400)
               .json({message: 'Invalid request'})
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .json({message: 'Database error'})
            .end();
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
   pooler.query('update ?? set ? where ?? = ?', ['user', values, 'id', id])
      .then(result => {
         // *Checking if the resource was updated:
         if(result.affectedRows){
            // *If it was:
            // *Responding with 200 status:
            res.status(200)
               .end();
         } else{
            // *If it wasn't:
            // TODO test to know what happens if values isn't correct:
            // TODO maybe we'll need to change this:
            // *Sending a 404 response:
            res.status(404)
               .json({message: 'Resource not found'})
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .json({message: 'Database error'})
            .end();
      });
}



/**
 * Deletes a resource in the database
 * @author Guilherme Reginaldo Ruella
 */
function delete(req, res, next){
   // *Getting the id from request params:
   let id = req.params.id;

   // *Deleting the resource from database:
   pooler.query('delete from ?? where ?? = ?', ['user', 'id', id])
      .then(result => {
         // *Checking if the resource was deleted:
         if(result.affectedRows){
            // *If it was:
            // *Responding with 200 status:
            res.status(200)
               .end();
         } else{
            // *If it wasn't:
            // *Sending a 404 response:
            res.status(404)
               .json({message: 'Resource not found'})
               .end();
         }
      })
      .catch(err => {
         // *If something went wrong:
         // *Sending a 500 error response:
         res.status(500)
            .json({message: 'Database error'})
            .end();
      });
}



// *Exporting the module:
module.exports = {
   retrieveAll: retrieveAll,
   retrieve: retrieve,
   create: create,
   update: update,
   delete: delete
};
