

// *When the user navigates to this page:
spa.onNavigate('email-settings', (page, params) => {

   // *Getting module settins:
   let load_setting = modules.get('settings');

   // *Getting name file:
   let file_name = load_setting.EMAIL_SETTINGS_FILE;

   load_setting.loadSettings(file_name)
      .then(content => {

         //* Converting string to a object:
         let file = jQuery.parseJSON(content);

         // *Setting email settings smtp server:
         $('#email-settings-smtp-server').val(file.smtp_server);

         // *Setting email settings smtp port:
         $('#email-settings-smtp-port').val(file.smtp_port);

         // *Setting email settings user:
         $('#email-settings-user').val(file.user);

         // *Setting email settings password:
         $('#email-settings-password').val(file.password);

         // *Setting email settings email:
         $('#email-settings-confirmation-email').val(file.confirmation_email_account);

         // *Setting email settings subject:
         $('#email-settings-confirmation-subject').val(file.confirmation_subject);

         // *Setting email settings body confrmation:
         $('#email-settings-confirmation-body').text(file.confirmation_body);

         // *Updating MDL Textfields:
         mdl_util.updateTextFields('#email-settings-section');

         // *Updating MDL Textfields:
         mdl_util.updateCheckBoxes('#email-settings-section');


      })
      .catch(err => {

      });

   // *Listening event of submit:
   $('#email-settings-form').submit((e) => {
      // *Preventing action default of browser happen:
      e.preventDefault();
      // *Calling a function to save a file:
      saveFile();
   })
   // *Listening when the user choose a file:
   $('#email-settings-confirmation-body').on('change', (e) => {
      let nameFile = e.target.files[0].name;
      console.log(nameFile);
      $('#email-settings-confirmation-body-name').text(nameFile);
   })

});

/**
 * Save a file with date of email settings
 * @author Willian Conti Rezende
 */
function saveFile(){

// *Getting module settins:
let save_settings = modules.get('settings');

// *Getting name file:
let file_name_save = save_settings.EMAIL_SETTINGS_FILE;

   // *Getting content of inpus in string format:
   let content_inputs = JSON.stringify({
   smtp_server: $('#email-settings-smtp-server').val(),
   smtp_port: $('#email-settings-smtp-port').val(),
   user: $('#email-settings-user').val(),
   password: $('#email-settings-password').val(),
   confirmation_email_account: $('#email-settings-confirmation-email').val(),
   confirmation_subject: $('#email-settings-confirmation-subject').val(),
   confirmation_body: $('#email-settings-confirmation-body').val()
   });

   // *Saving a file:
   save_settings.saveSettings(file_name_save, content_inputs)
   .then(() => {
      // *Going to logs page:
      spa.navigateTo('log');
   })
   .catch(err =>{

   })

}



// *When the user left this page:
spa.onLeft('email-settings', (page) => {

   // *Cleaning values of inputs:
   $('#email-settings-smtp-server').val('');
   $('#email-settings-smtp-port').val('');
   $('#email-settings-user').val('');
   $('#email-settings-password').val('');
   $('#email-settings-confirmation-email').val('');
   $('#email-settings-confirmation-subject').val('');
   $('#email-settings-confirmation-body').val('');
   $('#email-settings-confirmation-body').val('');



});
