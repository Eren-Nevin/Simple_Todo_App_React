
class Transaction {
  type;
  item;
  id;
    constructor(id, type, item){
       this.id = id;
        this.type = type;
        this.item = item;
    };

  toJSON(_) {
      let result = {
        'transaction_id': this.id,
        'transaction_type': this.type,
        'item_id': this.item.id,
        'arb_order': this.item.theOrder,
        'title': this.item.title,
        'details': this.item.details,
        'timestamp': this.item.timestamp,
        'important': this.item.important
      };
      console.log("Being JSON Called");
      console.log(result);
      return result;
  }

  // bool operator ==(Object t) {
  //   if (t is Transaction) {
  //     return t.id == id;
  //   } else {
  //     return false;
  //   }
  // }

}



class Item {
  id;
  theOrder;
  title;
  details;
  timestamp;
  important;

  constructor(id, theOrder, title, details, timestamp,
      important){
      this.id = id;
      this.theOrder = theOrder;
      this.title = title;
      this.details = details;
      this.timestamp = timestamp;
      this.important = important;
  }

  // toJson() => {
  //       'id': id,
  //       'the_order': theOrder,
  //       'title': title,
  //       'details': details,
  //       'timestamp': timestamp,
  //       'important': important
  //     };
}

export { Item, Transaction };
