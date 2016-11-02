

// *When the user navigates to this page:
spa.onNavigate('email-settings', (page, params) => {

   // *Getting module settings:
   const settings_module = modules.get('settings');

   // *Loading a file dates:
   settings_module.loadSettings(settings_module.EMAIL_SETTINGS_FILE)
      .then(content => {

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

         // *Setting email settings body confrmation:
         $('#email-settings-confirmation-body-name').text(file.confirmation_body);

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
      let getFile = e.target.files[0].name;
      $('#email-settings-confirmation-body-name').text(getFile);
   })


   $('#email-settings-confirmation-body').on('change', (e) => {
   let reader = new FileReader();
   let file ='';

   reader.onload = function (e) {
                file = e.target.result;
                console.log(file);
            };
         })
})



/**
 * Save a file with date of email settings
 * @author Willian Conti Rezende
 */
function saveFile(file){

   // *Getting module settings:
   const settings_module = modules.get('settings');

   // *Getting content of inpus in string format:
   let content_inputs = JSON.stringify({
      smtp_server: $('#email-settings-smtp-server').val(),
      smtp_port: $('#email-settings-smtp-port').val(),
      user: $('#email-settings-user').val(),
      pass: $('#email-settings-password').val(),
      confirmation_account: $('#email-settings-confirmation-email').val(),
      confirmation_subject: $('#email-settings-confirmation-subject').val(),
      confirmation_body:
   });

   // *Saving a file:
   settings_module.saveSettings(settings_module.EMAIL_SETTINGS_FILE, content_inputs)
      .then(() => {
         console.log('File Save Success!');
         // *Going to logs page:
         spa.navigateTo('log');
      })
      .catch(err =>{
         console.log('Error Saving File');

   });
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
   $('#email-settings-confirmation-body-name').val('');
});
