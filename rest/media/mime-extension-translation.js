// *Defining the mime types - extensions dictionary:
const DICTIONARY = [
   /* PNG */
   {mime: 'image/png', ext: 'png'},
   {mime: 'image/png', ext: 'x-png'},

   /* JPG */
   {mime: 'image/jpeg', ext: 'jpg'},
   {mime: 'image/pjpeg', ext: 'jpg'},
   {mime: 'image/jpeg', ext: 'jpeg'},
   {mime: 'image/pjpeg', ext: 'jpeg'},
   {mime: 'image/x-jps', ext: 'jps'},
   {mime: 'image/jpeg', ext: 'jpe'},
   {mime: 'image/pjpeg', ext: 'jpe'},
   {mime: 'image/jpeg', ext: 'jfif-tbnl'},
   {mime: 'image/jpeg', ext: 'jfif'},
   {mime: 'image/pjpeg', ext: 'jfif'},

   /* ICO */
   {mime: 'image/x-icon', ext: 'ico'},

   /* GIF */
   {mime: 'image/gif', ext: 'gif'},

   /* BMP */
   {mime: 'image/bmp', ext: 'bmp'},
   {mime: 'image/bmp', ext: 'bm'},
   {mime: 'image/x-windows-bmp', ext: 'bmp'}
];



/**
 * Translates a mime type to an extension
 * @param  {string} mime_type The mime type
 * @return {string}           The extension if found any, undefined otherwise
 * @author Guilherme Reginaldo Ruella
 */
function translateMime(mime_type){
   // *Trying to find the mime type:
   let o = DICTIONARY.find(o => o.mime === mime_type);
   // *Returning the extension:
   return o?o.ext:undefined;
}



/**
 * Translates an extension to a mime type
 * @param  {string} extension The extension
 * @return {string}           The mime type if found any, undefined otherwise
 * @author Guilherme Reginaldo Ruella
 */
function translateExtension(extension){
   // *Trying to find the extension:
   let find = DICTIONARY.find(o => o.ext === extension);
   // *Returning the mime type:
   return o?o.mime:undefined;
}



// *Exporting the module:
module.exports = {
   translateMime: translateMime,
   translateExtension: translateExtension
};
