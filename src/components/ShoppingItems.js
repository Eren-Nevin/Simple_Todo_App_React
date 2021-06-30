import { useContext } from "react";
import AppContext from './Context';
import ListItem from "./ListItem.js";

const ItemList = ({ removeItemHandler, doubleClickItemHandler }) => {
  const itemList = useContext(AppContext);
  return (
    <>
      {itemList.length === 0 ? <p>There Are No Items</p> : <></>}
      {itemList.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          clickHandler={() => {
            removeItemHandler(item)
          }}
          dblClickHandler={() => {
              doubleClickItemHandler(item)
          }}
        />
      ))}
    </>
  );
};

export default ItemList;
