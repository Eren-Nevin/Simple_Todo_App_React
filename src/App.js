// TODO: Add Important Feature By Clicking On Items.
// Using Context For State
import AppContext from "./components/Context";

// Server API
// import { getItemsFromServer, sendItemsToServer } from "./api/Api";
import { ViewModel } from "./api/ViewModel";
import { getCurrentDay } from "./api/Utilities.js";

// Components
import Header from "./components/Header";
import ItemList from "./components/ItemList";
import { useState } from "react";
import AddItem from "./components/AddItem";
import Authenticate from "./components/Auth";

let _viewModel = null;
let userToken = '';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  return (
    <div className="container">
      {authenticated ? (
        <ListApp userToken={userToken}/>
      ) : (
        <Authenticate
          successfulAuth={(token) => {
              userToken = token;
            setAuthenticated(true);
          }}
        />
      )}
    </div>
  );
}

function ListApp({userToken}) {
    console.log(userToken);
  if (_viewModel === null) {
    _viewModel = new ViewModel(userToken);
  }

  const addItem = (title, details, important) => {
    _viewModel.addNewItem(title, details, important);
  };

  const removeItem = (item) => {
    _viewModel.removeItem(item);
  };

  const toggleItemImportance = (item) => {
    _viewModel.toggleStarItem(item);
  };

  return (
    <>
      <Header title={`${getCurrentDay()}`} />
      <AddItem addItemHandler={addItem} />
      <AppContext.Provider value={_viewModel}>
        <ItemList
          removeItemHandler={removeItem}
          doubleClickItemHandler={toggleItemImportance}
        />
      </AppContext.Provider>
    </>
  );
}

export default App;
