// import logo from './logo.svg';
// import './App.css';

import AppContext from './components/Context'

import Header from "./components/Header";
import ShoppingItems from "./components/ShoppingItems";
import { useState, useEffect} from "react";
import AddItem from "./components/AddTask";

// For instances where Server is not available
const initialShoppingList = [
  { id: 1, text: "Bread", day: "Feb 5th at 2:30pm", reminder: false },
  { id: 2, text: "Egg", day: "Feb 10th at 2:30pm", reminder: true },
  { id: 3, text: "Milk", day: "Feb 5th at 5:30pm", reminder: false },
];

// let initialShoppingList = [];


function App() {
  const fetchInitalData = async () => {
    const res = await fetch("http://localhost:5000/data");
    setShoppingList(await res.json());
  };
  // useEffect(() => {
  //   fetchInitalData();
  // }, []);


    

  const [showAddTask, setShowAddTask] = useState(false);
  const [shoppingList, setShoppingList] = useState(initialShoppingList);
  const addItem = (item) => {
    item.id = Math.floor(Math.random() * 5000 + 1);
    setShoppingList([...shoppingList, item]);
  };

  return (
    <div className="container">
      <Header
        onAdd={() => {
          setShowAddTask(!showAddTask);
        }}
        addShown={showAddTask}
        title="Groceries"
      />
      {showAddTask && <AddItem addItemHandler={addItem} />}

      <AppContext.Provider value={shoppingList}>
        <ShoppingItems
          stateHandler={setShoppingList}
        />
      </AppContext.Provider>
    </div>
  );
}

export default App;
