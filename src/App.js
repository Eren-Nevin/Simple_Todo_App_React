// Using Context For State
import AppContext from "./components/Context";

// Server API
import { getItemsFromServer, sendItemsToServer } from "./api/Api";

// Components
import Header from "./components/Header";
import ShoppingItems from "./components/ShoppingItems";
import { useState, useEffect } from "react";
import AddItem from "./components/AddTask";

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

  return (
    <div className="container">
      <Header title="Groceries" />
      <AddItem addItemHandler={addItem} />
      <AppContext.Provider value={shoppingList}>
        <ShoppingItems removeItemHandler={removeItem} />
      </AppContext.Provider>
    </div>
  );
}

export default App;
