import * as Rx from "rxjs";
import { Repository } from "./Repository.js";
import { Item } from "./Model.js";

class ViewModel {
  _repository;
  _itemAddedStream = new Rx.Subject();
  _itemRemovedStream = new Rx.Subject();
  _itemChangedStream = new Rx.Subject();
  _resetStream = new Rx.Subject();
  _currentItemList = [];

  constructor(userToken) {
    console.log("ViewModel is Created!");
    this._repository = new Repository(userToken);
    this._startListeningOnRepository();
    this._repository.start();
  }

  getResetStream() {
    return this._resetStream;
  }

  getItemAddedStream() {
    return this._itemAddedStream;
  }

  getItemRemovedStream() {
    return this._itemRemovedStream;
  }

  getItemChangedStream() {
    return this._itemChangedStream;
  }

  _addItem(item) {
    this._repository.addItem(item);
  }
  _changeItem(item) {
    this._repository.changeItem(item);
  }
  _removeItem(item) {
    this._repository.removeItem(item);
  }
  removeItem(item) {
    this._removeItem(item);
  }
  toggleStarItem(item) {
    item.important = !item.important;
    item.timestamp = Date.now();
    this._changeItem(item);
  }
  addNewItem(title, details, important) {
    const item = new Item(Date.now(), 0, title, details, Date.now(), important);
    this._addItem(item);
  }
  _startListeningOnRepository() {
    this._repository.getResetStream().subscribe({
      next: (v) => {
        this._resetStream.next(v);
      },
    });
    this._repository.getItemAddedStream().subscribe({
      next: (item) => {
        console.log(`Adding ${item.title} In ViewModel`);
        this._currentItemList.unshift(item);
        this._itemAddedStream.next(item);
      },
    });

    this._repository.getItemChangedStream().subscribe({
      next: (item) => {
        console.log(`Changing ${item.title} In ViewModel`);
        const index = this._currentItemList.findIndex(
          (element) => element.id === item.id
        );
        this._currentItemList[index] = item;
        this._itemChangedStream.next(item);
      },
    });

    this._repository.getItemRemovedStream().subscribe({
      next: (item) => {
        console.log(`Removing ${item.title} In ViewModel`);
        // this._currentItemList.remove(item);
        //
        // this._currentItemList.splice(this_currentItemList.)
        const index = this._currentItemList.findIndex(
          (element) => element.id === item.id
        );
        this._currentItemList.splice(index, 1);
        this._itemRemovedStream.next(item);
      },
    });
  }
}

export { ViewModel };
