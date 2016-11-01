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
