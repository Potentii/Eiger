

/**
 * Module for management and handling the pages
 * @type {object}
 */
var spa = (function(){
   const DEFAULT_PAGE_NAME = 'login';

   const pages = [
         new Page('login', 'login-section'),
         new Page('vehicles', 'vehicles-section'),
         new Page('vehicle-schedule', 'vehicle-schedule-section')
      ];

   var current_page_name;



   /**
    * Stacks a new history state, and triggers the loading of the given page
    * @param  {string} page_name (Optional) The name of the page to load, if left empty, it'll load the default page
    * @param  {object} params    (Optional) The data to be used on the page
    * @author Guilherme Reginaldo Ruella
    */
   function navigateTo(page_name = DEFAULT_PAGE_NAME, params = {}){

      // *If it's an invalid page, return:
      if(!pageExists(page_name)) return;

      // *If it's the same page as before, return:
      if(history.state && page_name === history.state.page_name) return;

      // *Stacking up new state:
      history.pushState({page_name: page_name, params: params}, page_name, page_name + '.html');

      // *Loading the new content, and erasing the old one:
      loadPage();
   };



   /**
    * Runs all navigation callbacks of the current page, and all unload callbacks for the previous page
    * @author Guilherme Reginaldo Ruella
    */
   function loadPage(){

      // *Getting the page to load:
      let { page_name, params } = history.state;
      let page = findPage(page_name);

      // *Getting the page to unload:
      let previous_page = findPage(current_page_name);

      // *If it's the same page as before, return:
      if(page_name === current_page_name) return;

      // *Unloading the previous page:
      if(previous_page) previous_page.getOnUnload().getIterator().forEachRemaining(f => f(previous_page));

      // *Loading the new page:
      page.getOnNavigate().getIterator().forEachRemaining(f => f(page, params));

      // *Changing the current page flag:
      current_page_name = page_name;
   };



   /**
    * Defines an action to be executed when user navigate to a given page
    * @param  {string} page_name The page's name
    * @param  {function} action  The action to be done
    * @author Guilherme Reginaldo Ruella
    */
   function onNavigate(page_name, action){
      // *Finding the page object:
      let page = findPage(page_name);
      if(!page) return;

      // *Adding the action to the page's listener group:
      page.getOnNavigate().addListener(action);
   }



   /**
    * Defines an action to be executed when user left a given page
    * @param  {string} page_name The page's name
    * @param  {function} action  The action to be done
    * @author Guilherme Reginaldo Ruella
    */
   function onUnload(page_name, action){
      // *Finding the page object:
      let page = findPage(page_name);
      if(!page) return;

      // *Adding the action to the page's listener group:
      page.getOnUnload().addListener(action);
   }



   /**
    * Checks if a page exists, given its name
    * @param  {string} page_name The page's name
    * @return {boolean}          True if it exists, false otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function pageExists(page_name){
      return pages.some(p => p.getName() === page_name);
   };



   /**
    * Retrieves a page, given its name
    * @param  {string} page_name The page's name
    * @return {Page}             The Page object if found, undefined otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function findPage(page_name){
      return pages.find(p => p.getName() === page_name);
   };



   /**
    * Retrieves all pages
    * @return {Page[]} The pages array
    * @author Guilherme Reginaldo Ruella
    */
   function getPages(){
      return pages;
   }

   // *Exporting SPA module functions:
   return {
      navigateTo: navigateTo,
      pageExists: pageExists,
      loadPage: loadPage,
      getPages: getPages,
      onNavigate: onNavigate,
      onUnload: onUnload
   }
})();



// *When user go back on browser's history:
window.addEventListener('popstate', routeCurrentPage);



// *When the DOM finished to load:
$(() => {

   // *Defining the default action for navigation:
   let defaultNavigate = function(this_page, params){
      $('#' + this_page.getId()).show();
   }

   // *Defining the default action for unloading:
   let defaultUnload = function(this_page){
      $('#' + this_page.getId()).hide();
   }

   
   for(let page of spa.getPages()){
      // *Hiding all pages:
      $('#' + page.getId()).hide();

      // *Setting up default action to pages' load and unload events:
      spa.onNavigate(page.getName(), defaultNavigate);
      spa.onUnload(page.getName(), defaultUnload);
   }


   routeCurrentPage();
});




function routeCurrentPage(){
   // *Checking if current page exists:
   if(history.state && spa.pageExists(history.state.page_name)){
      // *If it exists:
      // *Loading it:
      spa.loadPage();
   } else{
      // *If not:
      // *Navigating to default page:
      spa.navigateTo();
   }
}
