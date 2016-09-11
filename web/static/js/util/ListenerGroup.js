class ListenerGroup{
   constructor(){
      this._listeners = [];
   }

   addListener(newListener){
      this._listeners.push(newListener);
   }

   removeListener(listener){
      var index;
      while((index = this._listeners.indexOf(listener)) >= 0) {
         this._listeners.splice(index, 1);
      }
   }

   getIterator(){
      return new Iterator(this._listeners);
   }
}
