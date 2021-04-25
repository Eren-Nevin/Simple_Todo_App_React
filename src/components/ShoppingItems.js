import { useContext } from "react";
import AppContext from './Context';
import ShoppingItem from "./ShoppingItem.js";

const ShoppingItems = ({ stateHandler }) => {
  const shoppingList = useContext(AppContext);
  return (
    <>
      {shoppingList.length === 0 ? <p>There Are No Items</p> : <></>}
      {shoppingList.map((v) => (
        <ShoppingItem
          key={v.id}
          item={v}
          clickHandler={() => {
            stateHandler(
              shoppingList.filter((item) => {
                return item.id !== v.id;
              })
            );
          }}
          dblClickHandler={() => {
            stateHandler(
              shoppingList.map((item) => {
                if (v.id === item.id) {
                  item.reminder = !item.reminder;
                }
                return item;
              })
            );
          }}
        />
      ))}
    </>
  );
};

export default ShoppingItems;
