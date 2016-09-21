// *Requiring the token generator:
const uuid = require('node-uuid');
// *Requiring the database pooler:
const pooler = require('../database/pooler');




function onAuthenticated(req, res, next){
   // *Getting the key header:
   let key_header = req.get('Access-Key');

   // *Querying for the user with the given key header as login:
   pooler.query('select * from ?? where ?? = ? limit 1', ['user_view', 'login', key_header])
      .then(result => {
         // *If there's no error:
         // *Checking if there is any entry:
         if(result.rows.length){
            // *If there is:
            // *Send a 200 response:
            res.status(200)
               .json({user: result.rows[0]})
               .end();
         } else{
            // *If not:
            // *Sending 404 response:
            res.status(404)
               .send('Resource not found')
               .end();
         }
      })
      .catch(err => {
         // *If some error occured:
         // *Sending 500 response:
         res.status(500)
            .send('Something went wrong')
            .end();
      });
}





/**
 * Authenticates a client, given the user's credentials
 * @author Guilherme Reginaldo Ruella
 */
function login(req, res, next){
   // *Getting the user's credentials from the request body:
   let login = req.body.login;
   let pass = req.body.pass;

   // *Querying the database to find the user that matches the given login and password:
   pooler.query('select * from ?? where ?? = ? and ?? = ? limit 1', ['user', 'login', login, 'pass', pass])
      .then(result_user => {

         // *Checking if found some user:
         if(result_user.rows.length){
            // *If found:
            // *Removing the sensitive data from user object (password):
            result_user.rows[0].pass = undefined;

            // *Querying the database to check if the user has an active access token:
            pooler.query('select * from ?? where ?? = ? limit 1', ['auth', 'key', login])
               .then(result_auth => {

                  // *Checking if found any token:
                  if(result_auth.rows.length){
                     // *If found:
                     // *Sending the found token and the user object (without password):
                     res.status(200)
                        .json({token: result_auth.rows[0].token, user: result_user.rows[0]})
                        .end();
                  } else{
                     // *If not found any:
                     // *Generating new uuid-v4 token:
                     let token = uuid.v4();

                     // *Inserting the new token in the database:
                     pooler.query('insert into ?? set ?', ['auth', {token: token, key: login}])
                        .then(result_insert_auth => {
                           // *Checking if the token was inserted:
                           if(result_insert_auth.rows.affectedRows){
                              // *If it was:
                              // *Sending the inserted token and the user object (without password):
                              res.status(201)
                                 .json({token: token, user: result_user.rows[0]})
                                 .end();
                           } else{
                              // *If it wasn't:
                              // *Sending a 500 error response:
                              res.status(500)
                                 .send('Something went wrong')
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
               })
               .catch(err => {
                  // *If something went wrong:
                  // *Sending a 500 error response:
                  res.status(500)
                     .send('Something went wrong')
                     .end();
               });
         } else{
            // *If not found:
            // *Sending a 401 error response:
            res.status(401)
               .send('Invalid credentials')
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
   onAuthenticated: onAuthenticated,
   login: login
};
