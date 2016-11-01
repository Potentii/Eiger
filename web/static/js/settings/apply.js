// *When the page gets loaded:
$(() => {
   // *Adding a new handler to the settings changed event:
   settings.onChange(applySettings);

   // *Checking if the settings were not set yet:
   if(!settings.get()){
      // *If they were not:
      // *Setting the default ones:
      settings.setDefault();
   } else{
      // *If they were set:
      // *Applying the current settings:
      applySettings();
   }
});



/**
 * Applies the new settings
 * @param  {Array} changed_settings A list of the modified settings names
 * @author Guilherme Reginaldo Ruella
 */
function applySettings(changed_settings){
   // *Getting the current settings:
   let user_settings = settings.get();

   // *Checking if the changed setting is set and it's an array, setting it to all the current settings properties if it's not:
   changed_settings = Array.isArray(changed_settings) ? changed_settings : Object.keys(user_settings);

   for(setting of changed_settings){
      // *Checking if the settings has this property, going to the next loop if it doesn't:
      if(!user_settings.hasOwnProperty(setting)) continue;

      // *Checking the setting name:
      switch(setting){
      case 'language':
         // *If the language had changed:
         // *Getting the language value:
         let new_language = user_settings[setting];
         // *Loading the dictionary:
         srm.loadDictionary('../../static/res/dictionary/' + new_language + '.json');
         break;
      }
   }
}
