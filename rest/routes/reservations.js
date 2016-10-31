const pooler = require('../database/pooler');



/**
 * Retrieves all resources
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAll(req, res, next){
   // *Getting the filters from the query string:
   let id = req.query.id;
   let status = req.query.status;
   let from_date = !isNaN(Date.parse(req.query.from_date)) ? req.query.from_date : undefined;
   let to_date = !isNaN(Date.parse(req.query.to_date)) ? req.query.to_date : undefined;

   // *Getting the sort headers:
   let sort_field = req.get('Sort-Field');
   let sort_type = req.get('Sort-Type');

   // *Defining the initial sql query and its values:
   let sql = 'select ??.*, ??.*, ??.* from ?? inner join ?? on ?? = ??.?? inner join ?? on ?? = ??.??';
   let values = ['user', 'schedule', 'vehicle', 'schedule', 'user', 'id_user_fk', 'user', 'id', 'vehicle', 'id_vehicle_fk', 'vehicle', 'id'];

   // *Checking if the id filtering is set:
   if(id){
      // *If it is:
      // *Adding it to the query:
      sql += ' and ??.?? = ?';
      values.push('schedule', 'id', id);
   }

   // *Checking if the confirmed status filtering is set:
   if(status === 'true'){
      // *If it is, and it's set to confirmed:
      // *Adding it to the query:
      sql += ' and ??.?? = ?';
      values.push('schedule', 'confirmed', 1);
   } else if(status === 'false'){
      // *If it is, and it's set to planned:
      // *Adding it to the query:
      sql += ' and ??.?? = ?';
      values.push('schedule', 'confirmed', 0);
   }

   // *Checking if the period is valid:
   if(from_date && to_date && (Date.parse(from_date) > Date.parse(to_date))){
      // *If it's not:
      // *Sending a 400 error response:
      res.status(400)
         .json({err_code: 'ERR_INVALID_FILTERS', err_message: 'Invalid timespan'})
         .end();
      return;
   }

   // *Checking if the initial date filtering is set:
   if(from_date){
      // *If it is:
      // *Adding it to the query:
      sql += ' and (? <= DATE(??.??))';
      values.push(from_date, 'schedule', 'end_date');
   }
   // *Checking if the ending date filtering is set:
   if(to_date){
      // *If it is:
      // *Adding it to the query:
      sql += ' and (? >= DATE(??.??))';
      values.push(to_date, 'schedule', 'start_date');
   }

   // *Checking if the sorting is set:
   if(sort_field){
      // *If it is:
      // *Adding it to the query:
      sort_type = (sort_type==='desc') ? 'desc' : 'asc';
      sql += ' order by ??.?? ' + sort_type;
      values.push('schedule', sort_field);
   }


   // *Querying the database for all resources:
   pooler.query({sql: sql, nestTables: true}, values)
      .then(result => {
         // *Sending the resources as response:
         res.status(200)
            .json(result.rows)
            .end();
      })
      .catch(err => {
         // *If something went wrong:
         // *Checking the error code:
         switch(err.code){
         case 'ER_BAD_FIELD_ERROR':
            // *Sending a 400 error response:
            res.status(400)
               .json({err_code: 'ERR_INVALID_SORTING', err_message: 'Invalid sorting field'})
               .end();
            break;
         default:
            // *Sending a 500 error response:
            res.status(500)
               .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
               .end();
         }
      });
}



// *Exporting the module:
module.exports = {
   retrieveAll: retrieveAll
};
