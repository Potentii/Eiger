
/**
 * Represents a SPA page object
 */
class Page{
   constructor(name){
      this._name = name;

      this._onNavigate = new HandledEvent();
      this._onOnUnload = new HandledEvent();
   }



   /**
    * Retrieves the page's HTML element
    * @return {jQuery}  The HTML element
    */
   getDOM(){
      return $('[data-page=\'' + this._name + '\']');
   }



   // *Getters and Setters:
   // *Name:
   getName(){
      return this._name;
   }
   setName(name){
      this._name = name;
   }

   // *OnNavigate:
   getOnNavigate(){
      return this._onNavigate;
   }

   // *OnUnload:
   getOnUnload(){
      return this._onOnUnload;
   }
}
