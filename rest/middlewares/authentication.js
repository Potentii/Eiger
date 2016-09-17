const pooler = require('../database/pooler');


/**
 * Authenticates a request (Middleware)
 * @author Guilherme Reginaldo Ruella
 */
module.exports = (req, res, next) => {

   // *Skiping authentication if request is OPTIONS:
   // TODO remove this if, as 'OPTIONS' requests resolves itself:
   if(req.method == 'OPTIONS') next();


   // *Reading the authentication headers:
   let token_header = req.get('Access-Token');
   let key_header = req.get('Access-Key');


   // *Checking if the request had both authentication headers:
   if(!token_header || !key_header){
      // *If it hasn't:
      // *Sending unauthorize response:
      res.status(401)
         .json({message: 'Invalid access credentials'})
         .end();
      return;
   }


   // *Querying for authentication credentials:
   // TODO change to count():
   pooler.query('select * from ?? where ?? = ? and ?? = ?', ['authentication', 'token', token_header, 'key', key_header])
      .then(result => {
         // *If there's no error:
         // *Checking if there is any entry:
         if(result.length){
            // *If there is:
            // *Send to next request handler:
            next();
         } else{
            // *If not:
            // *Sending unauthorize response:
            res.status(401)
               .json({message: 'Invalid access credentials'})
               .end();
         }
      })
      .catch(err => {
         // *If some error occured:
         // *Sending internal error response:
         res.status(500)
            .json({message: 'Something went wrong'})
            .end();
      })
});
