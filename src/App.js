// TODO: Add Important Feature By Clicking On Items.
// Using Context For State
import AppContext from "./components/Context";

// Server API
// import { getItemsFromServer, sendItemsToServer } from "./api/Api";
import * as ViewModel from "./api/ViewModel";

// Components
import Header from "./components/Header";
import ShoppingItems from "./components/ShoppingItems";
import { useState, useEffect } from "react";
import AddItem from "./components/AddItem";

function getCurrentDay() {
  let currentDate = new Date();
  let currentDay = currentDate.getDay();
  switch (currentDay) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 0:
      return "Sunday";
  }
}

function App() {
  const [shoppingList, setShoppingList] = useState([]);

  // Initial Fetch After First Page Load
  useEffect(() => {
    ViewModel.getItems().then((v) => {
      setShoppingList(v);
    });
  }, []);

  const addItem = (title, details, important) => {

    ViewModel.addNewItem(title, details, important);
      ViewModel.syncItems().then((v) => setShoppingList(v));
  };

  const removeItem = (item) => {
      ViewModel.removeItem(item)
      ViewModel.syncItems().then((v) => setShoppingList(v));
  };

  const toggleItemImportance = (item) => {
    ViewModel.toggleStarItem(item);
      ViewModel.syncItems().then((v) => setShoppingList(v));
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
