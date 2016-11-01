
/**
 * Settings module
 * @author Guilherme Reginaldo Ruella
 */
const settings = (function(){
   // *Defining the settings changed event handler:
   let change_event = new HandledEvent();



   /**
    * Retrieves the saved settings
    * @return {object}  The settings object
    * @author Guilherme Reginaldo Ruella
    */
   function get(){
      // *Returning the cached object:
      return JSON.parse(localStorage.getItem('settings'));
   }



   /**
    * Saves the new settings
    * @param {object} new_settings The settings to be added or changed
    * @return {boolean}  True if the settings were changed, false otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function set(new_settings){
      // *Getting the old settings, or a empty object:
      let old_settings = get() || {};
      // *Defining the changed settings list:
      let changed_settings = [];

      // *Getting each property on the new given settings object:
      for(var setting in new_settings){
         // *Checking if the object has this property:
         if(new_settings.hasOwnProperty(setting)){
            // *If it has:
            // *checking if the setting has changed:
            if(old_settings[setting] !== new_settings[setting]){
               // *If it has:
               // *Adding the property name to the changed settings list:
               changed_settings.push(setting);
               // *Setting the new value to the object:
               old_settings[setting] = new_settings[setting];
            }
         }
      }

      // *Checking if some setting has changed:
      if(changed_settings.length){
         // *If it has:
         // *Saving them on the cache:
         localStorage.setItem('settings', JSON.stringify(old_settings));
         // *Calling the settings changed event:
         change_event.resolveAll(f => f(changed_settings));
         // *Returning true:
         return true;
      } else{
         // *If it hasn't:
         // *Returning false:
         return false;
      }
   }



   /**
    * Sets the default settings
    * @author Guilherme Reginaldo Ruella
    */
   function setDefault(){
      // *Setting the default settings:
      set({
         language: 'en-us'
      });
   }



   /**
    * Defines a new action to be called whenever the settings change
    * @param  {function|function[]} action The new action
    * @author Guilherme Reginaldo Ruella
    */
   function onChange(action){
      // *Adding the action to the event handler:
      change_event.addListener(action);
   }



   // *Exporting this module:
   return {
      get: get,
      set: set,
      setDefault: setDefault,
      onChange: onChange
   };
})();
