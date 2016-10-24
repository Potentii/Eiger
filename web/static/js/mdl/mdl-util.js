/**
 * MDL utilities module
 */
const mdl_util = (function(){



   /**
    * Updates the visual state of MDL Textfields inside the given container
    * @param  {string} container_id The container HTML id
    * @author Guilherme Reginaldo Ruella
    */
   function updateTextFields(container_id){
      // *Updating the Textfields:
      updateElements('.mdl-js-textfield');
   }



   /**
    * Updates the visual state of MDL Checkboxes inside the given container
    * @param  {string} container_id The container HTML id
    * @author Guilherme Reginaldo Ruella
    */
   function updateCheckBoxes(container_id){
      // *Updating the Checkboxes:
      updateElements('.mdl-js-checkbox');
   }



   /**
    * Updates the visual state of MDL elements inside the given container
    * @param  {string} container_id The container HTML id
    * @param  {string} mdl_class The MDL element class name
    * @author Guilherme Reginaldo Ruella
    */
   function updateElements(container_id, mdl_class){
      // *Getting all MDL elements inside the given container:
      let mdl_elements = document.querySelectorAll(container_id + ' ' + mdl_class);
      // *Updating the states of each MDL element:
      for(mdl_element of mdl_elements){
         // *Updating the status:
         mdl_element.MaterialTextfield.updateClasses_();
      }
   }



   // *Exporting the module:
   return {
      updateTextFields: updateTextFields,
      updateCheckBoxes: updateCheckBoxes
   };
})();
