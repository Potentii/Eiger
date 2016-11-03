

// *When the user navigates to this page:
spa.onNavigate('email-settings', (page, params) => {
   let fileText = '';

   // *Getting the ipc renderer:
   const {ipcRenderer} = require('electron');

   // *When the loading retrieves the data successfully:
   ipcRenderer.on('load-email-settings-success', (e, content) => {
      //* Converting string to a object:
      let file = JSON.parse(content);

      // *Setting email settings smtp server:
      $('#email-settings-smtp-server').val(file.smtp_server);

      // *Setting email settings smtp port:
      $('#email-settings-smtp-port').val(file.smtp_port);

      // *Setting email settings user:
      $('#email-settings-user').val(file.user);

      // *Setting email settings password:
      $('#email-settings-password').val(file.pass);

      // *Setting email settings email:
      $('#email-settings-confirmation-email').val(file.confirmation_account);

      // *Setting email settings subject:
      $('#email-settings-confirmation-subject').val(file.confirmation_subject);

      // *Updating MDL Textfields:
      mdl_util.updateTextFields('#email-settings-section');

      // *Updating MDL Textfields:
      mdl_util.updateCheckBoxes('#email-settings-section');
   });


   // *When the loading retrieves an error:
   ipcRenderer.on('load-email-settings-fail', (e, err) => {
      // *Printing a error when load lettings on a file:
      console.log(err);
   });



   // *Retrieving the previous saved settings:
   ipcRenderer.send('load-email-settings');



   // *Listening event of submit:
   $('#email-settings-form').submit((e) => {
      // *Preventing action default of browser happen:
      e.preventDefault();
      // *Calling a function to save a file:
      saveFile(fileText);
   });



   // *Listening when the user choose a file:
   $('#email-settings-confirmation-body').on('change', (e) => {
      let getFile = e.target.files[0].name;
      // *Setting name of a file in spam:
      $('#email-settings-confirmation-body-name').text(getFile);

      // *Getting a file selected:
      let file = document.querySelector('#email-settings-confirmation-body').files[0];
      // *Setting a text of a file selected:
      file_encoder.asText(file, res => {
         fileText = res;
      });
   });
});



/**
 * Save a file with mail configuration
 * @param  {file} fileText   File as a Text
 * @author Willian Conti Rezende
 */
function saveFile(fileText){

   // *Getting the ipc renderer:
   const {ipcRenderer} = require('electron');

   // *When the saving goes ok:
   ipcRenderer.on('save-email-settings-success', (e, content) => {
      // *Going to logs page:
      spa.navigateTo('log');
   });

   // *When something wrong happens with the saving:
   ipcRenderer.on('save-email-settings-fail', (e, err) => {
      // *Printing a error when save a file:
      console.log(err);
   });



   // *Saving a file:
   ipcRenderer.send('save-email-settings', JSON.stringify({
      smtp_server: $('#email-settings-smtp-server').val(),
      smtp_port: $('#email-settings-smtp-port').val(),
      user: $('#email-settings-user').val(),
      pass: $('#email-settings-password').val(),
      confirmation_account: $('#email-settings-confirmation-email').val(),
      confirmation_subject: $('#email-settings-confirmation-subject').val(),
      confirmation_body: fileText
   }));
}



// *When the user left this page:
spa.onLeft('email-settings', (page) => {
   // *Getting the ipc renderer:
   const {ipcRenderer} = require('electron');

   // *Cleaning values of inputs:
   $('#email-settings-smtp-server').val('');
   $('#email-settings-smtp-port').val('');
   $('#email-settings-user').val('');
   $('#email-settings-password').val('');
   $('#email-settings-confirmation-email').val('');
   $('#email-settings-confirmation-subject').val('');
   $('#email-settings-confirmation-body').val('');
   $('#email-settings-confirmation-body-name').text('');

   // *Removing all event listeners:
   $('#email-settings-form').off('submit');
   $('#email-settings-confirmation-body').off('change');

   // *Removing ipc channels:
   ipcRenderer.removeAllListeners('load-email-settings-success');
   ipcRenderer.removeAllListeners('load-email-settings-fail');

   ipcRenderer.removeAllListeners('save-email-settings-success');
   ipcRenderer.removeAllListeners('save-email-settings-fail');
});
