
/**
 * Represents a SPA page object
 */
class Page{
   constructor(name, id){
      this._name = name;
      this._id = id;

      this._onNavigate = new ListenerGroup();
      this._onOnUnload = new ListenerGroup();
   }


   // *Getters and Setters:
   // *Id:
   getId(){
      return this._id;
   }
   setId(id){
      this._id = id;
   }

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
