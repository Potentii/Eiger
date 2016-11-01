// *When this dialog gets opened:
dialogger.onOpen('default-select', (dialog, { icon, title, values, row_factory, selected }) => {

   // *Setting the dialog's material icon:
   $('#default-select-icon').text(icon || '_');

   // *Setting the dialog's title text:
   $('#default-select-title').text(title || srm.get('default-select-header'));

   // *Getting the list:
   let list = $('#default-select-list');


   // *Checking if the row factory is a function:
   if(typeof(row_factory) === 'function'){
      // *If it is:
      // *Checking if the values list is a Map:
      if(!(values instanceof Map)){
         // *If it's not:
         // *Transforming it to a Map:
         values = new Map(values);
      }

      // *Checking if the list will be empty, adding the empty class if it will:
      if(!values.size) list.addClass('empty');

      // *Getting each value:
      for(value of values.entries()){
         // *Generating the row:
         let row = row_factory(value[1]).data('val', value[0]);
         // *Checking if this row is the selected one, marking it as selected if its is:
         if(selected === value[0]) row.addClass('selected');
         // *Appending it on the list:
         list.append(row);
      }
   }

   // *Setting an action for when the user clicks on a list item:
   list.on('click', 'li', function(e){
      // *Getting the value, and setting it to the selected value flag:
      selected = $(this).data('val');
      // *Removing the visual selected status from all the items:
      $('#default-select-list > .selected').removeClass('selected');
      // *Adding the selected visual status to this element:
      $(this).addClass('selected');
   });

   // *Setting an action for when the user clicks the 'CANCEL' button:
   $('#default-select-cancel-button').on('click', e => {
      // *Dismissing this dialog as a neutral action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });

   // *Setting an action for when the user clicks the 'OK' button:
   $('#default-select-ok-button').on('click', e => {
      // *Dismissing this dialog as a positive action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE, {selected: selected});
   });
});



// *When the user closes this dialog:
dialogger.onDismiss('default-select', (dialog, status, params) => {
   // *Cleaning the material icon:
   $('#default-retry-icon').text('_');
   // *Cleaning the title text:
   $('#default-retry-title').text('');

   // *Cleaning the list:
   $('#default-select-list > li').remove();
   // *Removing the empty class:
   $('#default-select-list').removeClass('empty');
   // *Cleaning the list's listeners:
   $('#default-select-list').off('click');

   // *Cleaning the buttons' listeners:
   $('#default-select-cancel-button').off('click');
   $('#default-select-ok-button').off('click');
});
