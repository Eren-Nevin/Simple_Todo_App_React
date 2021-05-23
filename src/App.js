// TODO: Add Important Feature By Clicking On Items.
// Using Context For State
import AppContext from "./components/Context";

// Server API
import { getItemsFromServer, sendItemsToServer } from "./api/Api";

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
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await getItemsFromServer();
    setShoppingList(res);
  };

  const addItem = (item) => {
    item.id = Math.floor(Math.random() * 5000000 + 1);
    item.timestamp = Date.now();
    const new_shoppingList = [...shoppingList, item];
    setShoppingList(new_shoppingList);
    sendItemsToServer(new_shoppingList);
  };

  const removeItem = (item) => {
    const new_shoppingList = shoppingList.filter((e) => item.id !== e.id);
    setShoppingList(new_shoppingList);
    sendItemsToServer(new_shoppingList);
  };

  const toggleItemImportance = (item) => {
    const new_shoppingList = shoppingList.map((e) => {
      if (e.id === item.id) {
        e.important = !e.important;
          e.timestamp = Date.now()
      }
      return e;
    });
    setShoppingList(new_shoppingList);
    sendItemsToServer(new_shoppingList);
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
