import { useContext } from "react";
import AppContext from './Context';
import ShoppingItem from "./ShoppingItem.js";

const ShoppingItems = ({ removeItemHandler }) => {
  const shoppingList = useContext(AppContext);
  return (
    <>
      {shoppingList.length === 0 ? <p>There Are No Items</p> : <></>}
      {shoppingList.map((item) => (
        <ShoppingItem
          key={item.id}
          item={item}
          clickHandler={() => {
            removeItemHandler(item)
          }}
          // dblClickHandler={() => {
          //   stateHandler(
          //     shoppingList.map((item) => {
          //       if (v.id === item.id) {
          //         item.reminder = !item.reminder;
          //       }
          //       return item;
          //     })
          //   );
          // }}
        />
      ))}
    </>
  );
};

export default ShoppingItems;
