const pooler = require('../database/pooler');



/**
 * Retrieves the vehicle availability
 * @author Guilherme Reginaldo Ruella
 */
function retrieveAvailability(req, res, next){
   // *Getting the master resource id:
   let id = req.params.id;
   // *Getting the dates array:
   let dates = req.query.dates.every(d => !isNaN(Date.parse(d))) ? req.query.dates : [];

   // *Checking if the dates could be parsed correctly:
   if(dates.length){
      let queries = [];
      // *Getting each date from the informed dates:
      for(let date of dates){
         // *Stacking up each date query on to the promisses array:
         queries.push(pooler.query('select * from ?? where ?? = ? and ? between DATE(??) and DATE(??) order by ?? asc', ['schedule', 'id_vehicle_fk', id, date, 'start_date', 'end_date', 'start_date']));
      }

      // *Running all queries:
      Promise.all(queries)
         .then(results => {
            let availabilities = [];
            // *Getting each query result:
            for(let i=0; i<results.length; i++){
               // *Calculating the availability for each day:
               availabilities.push(getAvailability(dates[i], results[i].rows));
            }

            // *Sending the availabilities as response:
            res.status(200)
               .json(availabilities)
               .end();
         })
         .catch(err => {
            // *If something went wrong:
            // *Sending a 500 error response:
            res.status(500)
               .json({err_code: 'ERR_INTERNAL', err_message: 'Something went wrong'})
               .end();
         });
   } else{
      // *Sending a 400 error response:
      res.status(400)
         .json({err_code: 'ERR_INVALID_DATES', err_message: 'The informed dates could not be read'})
         .end();
   }
}



/**
 * Calculates the availability of a vehicle on a day, considering its schedules
 * @param  {string} day       The day formatted as yyyy-mm-dd
 * @param  {Array} schedules  The schedules
 * @return {object}           A object containing the schedules on a day, and the left time percentage of the vehicle on this day
 * @author Guilherme Reginaldo Ruella
 */
function getAvailability(day, schedules){
   // *Defining a day duration in milliseconds:
   const DAY_MS = 86400000;

   // *Getting the day in milliseconds:
   const date = new Date(day + ' 00:00:00').getTime();
   // *Getting the day ending in milliseconds:
   const date_next = date + DAY_MS;

   // *Starting the time left counting:
   let ms_left = DAY_MS;

   // *Iterating over each schedule:
   for({start_date, end_date} of schedules){
      // *Getting the start date in milliseconds:
      start_date = new Date(start_date).getTime();
      // *Getting the end date in milliseconds:
      end_date = new Date(end_date).getTime();

      // *Checking the schedule overlaping:
      if(start_date <= date){
         // *If the schedule starts before the date - *[*]:
         // *Calculating how much of the day is left in milliseconds:
         ms_left -= end_date - date;
      } else if(date_next <= end_date){
         // *If the schedule ends after the date - [*]*:
         // *Calculating how much of the day is left in milliseconds:
         ms_left -= date_next - start_date;
      } else{
         // *If the schedule starts and ends on the date - [**]:
         // *Calculating how much of the day is left in milliseconds:
         ms_left -= end_date - start_date;
      }
   }

   // *Checking if the time left is negative, making it to zero if it is:
   ms_left = (ms_left<0) ? 0 : ms_left;

   // *Returning the availability:
   return {schedules: schedules.length, availability: (ms_left/DAY_MS)*100};
}



// *Exporting the module:
module.exports = {
   retrieveAvailability: retrieveAvailability
};
