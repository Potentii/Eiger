
let transporter = undefined;



/**
 * Maps the parameters inside the content text
 * @param {string} content          The content text
 * @param {object} content_params   The parameters
 * @return {string}                 The mapped content
 * @author Guilherme Reginaldo Ruella
 */
function parseMailContent(content, content_params){
   return content.replace(/\$\{(\w+?)\}/g, (match, param_name) => content_params[param_name] || '');
}



/**
 * Sends an e-mail
 * @param  {string} from_address   The sender e-mail address
 * @param  {Array} to_addresses    An array containing all receivers' e-mail address
 * @param  {string} subject        The e-mail's subject
 * @param  {string} content        The e-mail's content
 * @param  {object} content_params The e-mail's content parameters
 * @return {Promise}               A promise
 * @author Guilherme Reginaldo Ruella
 */
function sendMail(from_address, to_addresses, subject, content, content_params){
   // *Returning a promise:
   return new Promise((resolve, reject) => {
      // *Checking if the transporter is set:
      if(!transporter){
         // *If it's not:
         // *Rejecting the promise:
         reject(new Error('The transporter has not been properly configured'));
         return;
      }

      try{
         // *Mapping the content with its parameters:
         content = parseMailContent(content, content_params);

         // *Setting up the e-mail:
         let mail_options = {
            from: from_address,
            to: Array.isArray(to_addresses) ? to_addresses.join(', ') : to_addresses,
            subject: subject,
            text: '',
            html: content
         };

         // *Sending the e-mail:
         transporter.sendMail(mail_options)
            .then(() => resolve())
            .catch(err => reject(err));
      } catch(err){
         // *If something went wrong:
         // *Rejecting the promise:
         reject(err);
      }
   });
}



/**
 * Sends the default schedule confirmation e-mail
 * @param  {Array} to_addresses    An array containing all receivers' e-mail address
 * @param  {object} content_params The e-mail's content parameters
 * @return {Promise}               A promise
 * @author Guilherme Reginaldo Ruella
 */
function sendScheduleConfirmationMail(to_addresses, content_params){
   const settings = require('../settings/settings');

   // *Returning the promise:
   return new Promise((resolve, reject) => {
      // *Loading the e-mail settings:
      settings.loadSettings(settings.EMAIL_SETTINGS_FILE)
         .then(email_settings => {
            // *If the file could be read:
            // *Parsing its content:
            email_settings = JSON.parse(email_settings);
            try{
               // *Sending the e-mail:
               sendMail(email_settings.confirmation_account, to_addresses, email_settings.confirmation_subject, email_settings.confirmation_body, content_params)
                  .then(() => resolve())
                  .catch(err => reject(err));
            } catch(err){
               // *If some error happened:
               // *Rejecting the promise:
               reject(new Error('Some e-mail settings is missing'));
            }
         })
         .catch(err => reject(err));
   });
}



/**
 * Sets up the mailer service
 * @return {Promise}  The setup promise
 * @author Guilherme Reginaldo Ruella
 */
function setupService(){
   const settings = require('../settings/settings');

   // *Returning the promise:
   return new Promise((resolve, reject) => {
      // *Adding a updating listener when the e-mail settings get changed:
      settings.onSettingsChanged(settings.EMAIL_SETTINGS_FILE, new_settings => applySettings(JSON.parse(new_settings)));

      // *Loading the e-mail settings:
      settings.loadSettings(settings.EMAIL_SETTINGS_FILE)
         .then(email_settings => {
            // *If the file could be loaded:
            // *Applying the e-mail settings:
            applySettings(JSON.parse(email_settings))
               .then(() => resolve())
               .catch(err => {
                  // *If the settings wasn't valid:
                  // *Rejecting the promise:
                  reject();
               });
         })
         .catch(err => {
            // *If it couldn't read the settings file:
            // *Creating a blank file:
            createBlankSettingsFile()
               .then(() => resolve())
               .catch(err => reject(err));
         });
   });
}



/**
 * Creates a default blank settings file for the mailer system
 * @return {Promise}  A promise
 * @author Guilherme Reginaldo Ruella
 */
function createBlankSettingsFile(){
   const settings = require('../settings/settings');

   // *Returning a promise:
   return new Promise((resolve, reject) => {
      // *Saving a blank configuration file:
      settings.saveSettings(settings.EMAIL_SETTINGS_FILE, JSON.stringify({
            smtp_server: '',
            smtp_port: '',
            user: '',
            pass: '',
            confirmation_account: '',
            confirmation_subject: '',
            confirmation_body: ''
         }))
         .then(() => {
            // *If the file could be created:
            // *Setting the mailer system as inactive:
            transporter = undefined;
            // *Resolving the promise:
            resolve();
         })
         .catch(err => reject(err));
   });
}



/**
 * Applies the new settings on the mailer system
 * @param  {object} settings The new settings
 * @return {Promise}         A promise
 * @author Guilherme Reginaldo Ruella
 */
function applySettings(settings){
   const nodemailer = require('nodemailer');

   // *Returning a promise:
   return new Promise((resolve, reject) => {
      let transporter_options;

      try{
         // *Trying to create a transporter options object:
         transporter_options = {
            host: settings.smtp_server,
            port: settings.smtp_port,
            secure: true,
            auth: {
               user: settings.user,
               pass: settings.pass
            }
         };
      } catch(err){
         // *Rejecting the promise:
         reject(new Error('Some e-mail settings is missing'));
         return;
      }

      // *Creating the e-mail transporter:
      transporter = nodemailer.createTransport(transporter_options);

      // *Checking the connection:
      transporter.verify()
         .then(() => {
            // *If the connection is working:
            // *Resolving the promise:
            resolve();
         })
         .catch(err => {
            // *Setting the mailer system as inactive:
            transporter = undefined;
            // *Rejecting the promise:
            reject(err);
         });
   });
}



// *Exporting this module:
module.exports = {
   sendMail: sendMail,
   sendScheduleConfirmationMail: sendScheduleConfirmationMail,
   setupService: setupService
};
