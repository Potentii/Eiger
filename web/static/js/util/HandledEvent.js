class HandledEvent{
   constructor(){
      this._listeners = [];
   }



   /**
    * Adds new listeners to call stack
    * @param {(function|function[])} listener The listener to be added
    * @author Guilherme Reginaldo Ruella
    */
   addListener(listener){

      // *Checking if 'listener' is an array of functions:
      if(Array.isArray(listener) && listener.every(l => typeof l === 'function')){
         // *If it is:
         // *Concatenating all listeners on the call stack:
         this._listeners = this._listeners.concat(listener);

      } else if(typeof listener === 'function'){
         // *If it's a function:
         // *Stacking up the new listener:
         this._listeners.push(listener);

      }
   }



   /**
    * Removes listeners from the call stack
    * @param  {(function|function[])} listener The listeners to be removed. If left empty, all listeners will be removed
    * @author Guilherme Reginaldo Ruella
    */
   removeListener(listener){

      // *Checking if 'listener' is an array:
      if(Array.isArray(listener)){
         // *If it's an array:
         this._listeners = this._listeners.filter(l => !listener.some(o => o == l));

      } else if(listener){
         // *If isn't undefined:
         this._listeners = this._listeners.filter(l => l != listener);

      } else{
         // *If isn't set:
         this._listeners = [];

      }
   }



   /**
    * Returns an Iterator containing all listeners
    * @return {Iterator}   The iterator
    * @author Guilherme Reginaldo Ruella
    */
   getIterator(){
      // *Generating new Iterator:
      return new Iterator(this._listeners);
   }



   /**
    * Resolves all listeners with a consumer
    * @param  {function} consumer The consumer to be called for every listener
    * @author Guilherme Reginaldo Ruella
    */
   resolveAll(consumer){
      // *Checking if 'action' is a function:
      if(typeof consumer !== 'function') throw new Error('Given action is not a function');
      // *Consuming every listener:
      this.getIterator().forEachRemaining(consumer);
   }
}
