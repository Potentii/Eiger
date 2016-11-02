


/**
 * Pads the values below ten with a leading zero
 * @param  {number} v         The value to pad
 * @return {string|number}    The padded value
 * @author Guilherme Reginaldo Ruella
 */
function pad10(v){
   return v<10 ? '0'+v : v;
}



/**
 * Formats a date as DD/MM/YYYY string
 * @param  {Date} date  The date to format
 * @return {string}     The formatted date
 * @author Guilherme Reginaldo Ruella
 */
function asFullDate(date){
   // *Getting the date:
   let Y = date.getFullYear();
   let M = pad10(date.getMonth()+1);
   let D = pad10(date.getDate());

   // *Returning the string:
   return `${D}/${M}/${Y}`;
}



/**
 * Formats a date as HH:mm string
 * @param  {Date} date  The date to format
 * @return {string}     The formatted date
 * @author Guilherme Reginaldo Ruella
 */
function asShorterTime(date){
   // *Getting the time:
   let h = pad10(date.getHours());
   let m = pad10(date.getMinutes());

   // *Returning the string:
   return `${h}:${m}`;
}



// *Exporting this module:
module.exports = {
   asFullDate: asFullDate,
   asShorterTime: asShorterTime
};
