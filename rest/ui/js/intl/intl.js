// *When a new dictionary gets loaded:
srm.onDictionaryChange(() => {
   // *Getting all labels with 'data-srm' attribute:
   $('[data-intl]')
      .each((i, label) => {
         label = $(label);
         // *Setting its text using the dictionary:
         label.text(srm.get(label.data('intl')));
      });
});


const getAvailableLanguages = (() => {
   // *Defining the available languages:
   let available_languages = new Map([
      ['en-us', 'English (US)'],
      ['pt-br', 'Português (BR)']
   ]);


   return () => {
      return available_languages;
   };
})();
