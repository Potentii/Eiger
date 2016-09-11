class Iterator{
   constructor(arr){
      this._items = arr;
      this._nextIndex = 0;
   }

   hasNext(){
      return this._nextIndex < this._items.length;
   }

   next(){
      // *If there is a next element, return it, null otherwise:
      return this.hasNext() ? this._items[this._nextIndex++] : null;
   }

   forEachRemaining(consumer){
      if(consumer === undefined || consumer === null || typeof consumer !== "function") return;
      while(this.hasNext()){
         consumer(this.next());
      }
   }
}
