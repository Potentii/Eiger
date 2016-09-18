// *Requeiring the MySQL package:
const mysql = require('mysql');

// *Starting the connection pool:
const pool = mysql.createPool({
   connectionLimit   : 10,
   host              : 'localhost',
   user              : 'eiger_db',
   password          : 'asd123!',
   database          : 'eiger_schema',
   supportBigNumbers : true
});



// *When connections get queued:
pool.on('enqueue', () => {
  console.log('>> POOLER: Connections are queueing up!');
});



/**
 * Queries the database
 * @param  {string} sql    The SQL query
 * @param  {object} values The query values to escape
 * @return {Promise}       The query promise
 * @author Guilherme Reginaldo Ruella
 */
function query(sql, values){
   // *Returning the query promise:
   return new Promise((resolve, reject) => {

      // *Getting a connection from pool:
      pool.getConnection((err, conn) => {
         // *Checking if something went wrong:
         if(err){
            // *If it was, rejecting the promise:
            reject(err);
            return;
         }

         // *Querying the database:
         conn.query(sql, values, (err, result, fields) => {
            // *Recycling the connection:
            conn.release();

            // *Checking if something went wrong:
            if(err){
               // *If it was, rejecting the promise:
               reject(err);
               return;
            }

            // *Resolving the promise:
            resolve({result: result, fields: fields}); //TODO try to pass as separated parameters instead of an object
         });

      });

   });
}



/**
 * Ends all connections in the pool gracefully
 * @return {Promise}  The end connection promise
 * @author Guilherme Reginaldo Ruella
 */
function end(){
   // *Returning the end promise:
   return new Promise((resolve, reject) => {

      // *Ending all connections in the pool:
      pool.end((err) => {
         // *Checking if something went wrong:
         if(err){
            // *If it was, rejecting the promise:
            reject(err);
            return;
         }

         // *Resolving the promise, as the connections have ended:
         resolve();
      });
   });
}



// *Exporting the module:
module.exports = {
   query: query,
   end: end
};
