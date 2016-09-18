


/**
 * Echoes the name of this application back to the client
 * @author Guilherme Reginaldo Ruella
 */
function echo(req, res, next){
   res.status(200)
      .send('EIGER')
      .end();
}



// *Exporting the module:
module.exports = {
   echo: echo
};
