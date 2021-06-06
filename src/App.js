// TODO: Add Important Feature By Clicking On Items.
// Using Context For State
import AppContext from "./components/Context";

// Server API
// import { getItemsFromServer, sendItemsToServer } from "./api/Api";
import {ViewModel} from "./api/ViewModel";
import {getCurrentDay} from "./api/Utilities.js";

// Components
import Header from "./components/Header";
import ShoppingItems from "./components/ShoppingItems";
import { useState, useEffect } from "react";
import AddItem from "./components/AddItem";


const _viewModel = new ViewModel();
function App() {
  const [shoppingList, setShoppingList] = useState([]);

  // Initial Fetch After First Page Load
  // useEffect(() => {
    _viewModel.getItemAddedStream().subscribe({ next: (item) => {
        setShoppingList([item, ...shoppingList]);
    }});
    _viewModel.getItemChangedStream().subscribe({ next: (item) => {
        let newList = shoppingList.map((e) => {
            if (e.id === item.id){
                return item;
            }
            else {
                return e;
            }
        });
        setShoppingList(newList);
    }});
    _viewModel.getItemRemovedStream().subscribe({ next: (item) => {
        let newList = shoppingList.filter((e) => e.id !== item.id);
        setShoppingList(newList);
    }});

    _viewModel.getResetStream().subscribe({ next: (v) => {
        setShoppingList(v);
    }});
      // _viewModel.start();
    // _viewModel.getItems().then((v) => {
    //   setShoppingList(v);
    // });
  // }, []);
    //


  const addItem = (title, details, important) => {

    _viewModel.addNewItem(title, details, important);
      // _viewModel.syncItems().then((v) => setShoppingList(v));
  };

  const removeItem = (item) => {
      _viewModel.removeItem(item)
      // _viewModel.syncItems().then((v) => setShoppingList(v));
  };

  const toggleItemImportance = (item) => {
    _viewModel.toggleStarItem(item);
      // _viewModel.syncItems().then((v) => setShoppingList(v));
  };

  return (
    <div className="container">
      <Header title={`${getCurrentDay()}`} />
      <AddItem addItemHandler={addItem} />
      <AppContext.Provider value={shoppingList}>
        <ShoppingItems
          removeItemHandler={removeItem}
          doubleClickItemHandler={toggleItemImportance}
        />
      </AppContext.Provider>
    </div>
  );
}

export default App;
