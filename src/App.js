// TODO: Add Important Feature By Clicking On Items.
// Using Context For State
import AppContext from "./components/Context";

// Server API
// import { getItemsFromServer, sendItemsToServer } from "./api/Api";
import { ViewModel } from "./api/ViewModel";
import { getCurrentDay } from "./api/Utilities.js";

// Components
import Header from "./components/Header";
import ItemList from "./components/ShoppingItems";
import { useState, useEffect } from "react";
import AddItem from "./components/AddItem";
import Authenticate from "./components/Auth";

let _viewModel = null;

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <div className="container">
      {authenticated ? (
        <ListApp />
      ) : (
        <Authenticate
          successfulAuth={() => {
            setAuthenticated(true);
          }}
        />
      )}
    </div>
  );
}

function ListApp() {
  if (_viewModel === null) {
    _viewModel = new ViewModel();
  }
  const [shoppingList, setShoppingList] = useState([]);

  // Start Listening On Transactions Of Items.
  _viewModel.getItemAddedStream().subscribe({
    next: (item) => {
      setShoppingList([item, ...shoppingList]);
    },
  });
  _viewModel.getItemChangedStream().subscribe({
    next: (item) => {
      let newList = shoppingList.map((e) => {
        if (e.id === item.id) {
          return item;
        } else {
          return e;
        }
      });
      setShoppingList(newList);
    },
  });
  _viewModel.getItemRemovedStream().subscribe({
    next: (item) => {
      let newList = shoppingList.filter((e) => e.id !== item.id);
      setShoppingList(newList);
    },
  });

  _viewModel.getResetStream().subscribe({
    next: (v) => {
      setShoppingList(v);
    },
  });

  const addItem = (title, details, important) => {
    _viewModel.addNewItem(title, details, important);
    // _viewModel.syncItems().then((v) => setShoppingList(v));
  };

  const removeItem = (item) => {
    _viewModel.removeItem(item);
    // _viewModel.syncItems().then((v) => setShoppingList(v));
  };

  const toggleItemImportance = (item) => {
    _viewModel.toggleStarItem(item);
    // _viewModel.syncItems().then((v) => setShoppingList(v));
  };

  return (
    <>
      <Header title={`${getCurrentDay()}`} />
      <AddItem addItemHandler={addItem} />
      <AppContext.Provider value={shoppingList}>
        <ItemList
          removeItemHandler={removeItem}
          doubleClickItemHandler={toggleItemImportance}
        />
      </AppContext.Provider>
    </>
  );
}

export default App;
