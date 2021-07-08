import './list-page.css';
// Server API
// import { getItemsFromServer, sendItemsToServer } from "./api/Api";
import { ViewModel } from "../../api/ViewModel";
import { getCurrentDay } from "../../api/Utilities.js";

// Components
import Header from "./components/Header";
import ItemList from "./components/ItemList";
import AddItem from "./components/AddItem";

// TODO: Add Important Feature By Clicking On Items.

// TODO: Should we use context? where to place context file?
// Using Context For State
import { useContext } from "react";
import ListContext from "./ListContext";
import AppContext from "../../AppContext";

let _viewModel = null;

// TODO: Fix adding items with empty name.
function ListApp({ userToken, onLogout }) {
const { baseUrl } = useContext(AppContext);
  console.log(userToken);
  if (_viewModel !== null) {
      _viewModel.destructor()
      _viewModel = null
  }
_viewModel = new ViewModel(baseUrl, userToken);

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
    <div className="list-page-container">
      <Header title={`${getCurrentDay()}`} onLogout={onLogout} />
      <AddItem addItemHandler={addItem} />
      {/* <button */}
      {/*   onClick={() => { */}
      {/*     onLogout(); */}
      {/*   }} */}
      {/* > */}
        {/* Logout */}
      {/* </button> */}
      <ListContext.Provider value={_viewModel}>
        <ItemList
          removeItemHandler={removeItem}
          doubleClickItemHandler={toggleItemImportance}
        />
      </ListContext.Provider>
    </div>
  );
}

export { ListApp };
