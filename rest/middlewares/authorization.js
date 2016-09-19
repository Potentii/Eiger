const pooler = require('../database/pooler');



/**
 * Prepares an authorization middleware
 * @param  {string} permission The permission name to test
 * @return {function}          Returns a middleware function that will test the authorization
 * @author Guilherme Reginaldo Ruella
 */
module.exports = (permission) => {
   // *Skiping authentication if request is OPTIONS:
   // TODO test without brackets:
   // TODO remove this if, as 'OPTIONS' requests resolves itself:
   if(req.method == 'OPTIONS') return (req, res, next) => {next();};


   // *Returning Authorization middleware:
   return (req, res, next) => {
      let key_header = req.get('Access-Key');

      // *Checking if the request had the key header:
      if(!key_header){
         // *If it hasn't:
         // *Sending 'unauthorize' response:
         res.status(403)
            .json({message: 'Unaunthorized'})
            .end();
         return;
      }

      // *Querying for an entry with the given key(login) and permission:
      // TODO try this with count(*):
      pooler.query('select * from ?? where ?? = ? and ?? = ?', ['user_permission_view', 'user_login', key_header, 'permission_title', permission])
         .then(result => {
            // *Checking if there is some result:
            if(result.rows.length>0){
               // *If there is:
               // *Authorize the request:
               next();
            } else{
               // *If not:
               // *Sending 'unauthorize' response:
               res.status(403)
                  .json({message: 'Unaunthorized'})
                  .end();
            }
         })
         .catch(err => {
            // *If something went wrong:
            // *Sending 'unauthorize' response:
            res.status(403)
               .json({message: 'Unaunthorized'})
               .end();
         });
   };
};
