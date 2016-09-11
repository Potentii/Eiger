class Iterator{
   constructor(arr){
      this._items = arr;
      this._nextIndex = 0;
   }



   /**
    * Checks if there's a next element
    * @return {boolean}  True if has, false otherwise
    * @author Guilherme Reginaldo Ruella
    */
   hasNext(){
      return this._nextIndex < this._items.length;
   }



   /**
    * Returns the next element
    * @return {*}  The next element, null if there's no other element
    * @author Guilherme Reginaldo Ruella
    */
   next(){
      // *Checking if there is a next element:
      return this.hasNext() ? this._items[this._nextIndex++] : null;
   }



   /**
    * Call a consumer for each remaining element
    * @param  {function} consumer The consumer to be executed
    * @author Guilherme Reginaldo Ruella
    */
   forEachRemaining(consumer){
      // *Checking if the consumer is valid:
      if(consumer === undefined || consumer === null || typeof consumer !== "function") return;
      // *Calling the consumer:
      while(this.hasNext()){
         consumer(this.next());
      }
   }
}
