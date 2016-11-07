

// *When the user navigates to this page:
spa.onNavigate('settings', (page, params) => {

   // *Defining the available languages:
   let languages_available = getAvailableLanguages();

   // *Setting the language button text:
   $('#settings-language').text(languages_available.get(settings.get().language));
   // *When the user clicks on the language button:
   $('#settings-language').on('click', e => {
      // *Preparing the language picker dialog options:
      let select_options = {
         icon: 'translate',
         title: srm.get('default-select-translate-header'),
         values: languages_available,
         selected: settings.get().language,
         row_factory: language => {
            // *Building the main row element:
            let row = $('<li>').addClass('row');
            // *Building the text element:
            $('<span>').addClass('primary').text(language).appendTo(row);
            // *Returning the row:
            return row;
         }
      };

      // *Showing the language picker dialog:
      dialogger.open('default-select', select_options, (dialog, status, params) => {
         // *Checking which diolog's button the user has clicked on:
         switch(status){
         case dialogger.DIALOG_STATUS_POSITIVE:
            // *If the user clicked on ok:

            // *Setting a new dictionary changed listener:
            let dictionaryChanged = () => {
               // *Showing a snackbar:
               snack.open(srm.get('settings-saved-language'), snack.TIME_SHORT);
               // *Removing this listener:
               srm.removeOnDictionaryChange(dictionaryChanged);
            };

            // *Adding a listener to the dictionary:
            srm.onDictionaryChange(dictionaryChanged);

            // *Checking if the settings has changed:
            if(settings.set({language: params.selected})){
               // *If they were:
               // *Changing the button text:
               $('#settings-language').text(languages_available.get(params.selected));
            } else{
               // *If they not:
               // *Removing the dictionary change listener:
               srm.removeOnDictionaryChange(dictionaryChanged);
            }
            break;
         }
      });
   });
});



// *When the user left this page:
spa.onLeft('settings', (page) => {
   // *Cleaning the texts:
   $('#settings-language').text('');

   // *Removing the click listeners:
   $('#settings-language').off('click');
});
