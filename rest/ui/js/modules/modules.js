

/**
 * Provides access to node modules
 */
const modules = (function(){
   // *Defining the available node modules:
   let modules = new Map([
      ['settings', '../settings/settings']
   ]);



   /**
    * Retrieves a node module
    * @param {string} module_name   The module's name
    * @return {object} The          node module
    * @author Guilherme Reginaldo Ruella
    */
   function get(module_name){
      // *Returning the module:
      return require(modules.get(module_name));
   }



   // *Exporting this module:
   return {
      get: get
   };
})();
