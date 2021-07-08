import { useState, useEffect } from "react";
import { useContext } from "react";
import ListContext from "../ListContext";
import ListItem from "./ListItem.js";

const ItemList = ({ removeItemHandler, doubleClickItemHandler }) => {
  const _viewModel = useContext(ListContext);
  const [itemList, setItemList] = useState([]);

  // Start Listening On Transactions Of Items.
  const itemAddedSubscription = _viewModel.getItemAddedStream().subscribe({
    next: (item) => {
      setItemList([item, ...itemList]);
    },
  });

  const itemChangedSubscription = _viewModel.getItemChangedStream().subscribe({
    next: (item) => {
      const newList = itemList.map((e) => {
        if (e.id === item.id) {
          return item;
        } else {
          return e;
        }
      });
      setItemList(newList);
    },
  });

  const itemRemovedSubscription = _viewModel.getItemRemovedStream().subscribe({
    next: (item) => {
      const newList = itemList.filter((e) => e.id !== item.id);
      setItemList(newList);
    },
  });

  const itemsResetSubscription = _viewModel.getResetStream().subscribe({
    next: (v) => {
      setItemList(v);
    },
  });

  useEffect(() => {
    return () => {
      // Cancel the subscriptions when the component is being unmounted.
      // This happens just before the component is being changed.
      // When the component is being recreated, new subscriptions are formed.
      // We do this to prevent memory leaks even though it might not be
      // needed.
      itemAddedSubscription.unsubscribe();
      itemChangedSubscription.unsubscribe();
      itemRemovedSubscription.unsubscribe();
      itemsResetSubscription.unsubscribe();
    };
  });

  return (
    <>
      {itemList.length === 0 ? <p>There Are No Items</p> : <></>}
      {itemList.map((item) => (
        <ListItem
          key={item.id}
          item={item}
          clickHandler={() => {
            removeItemHandler(item);
          }}
          dblClickHandler={() => {
            doubleClickItemHandler(item);
          }}
        />
      ))}
    </>
  );
};

export default ItemList;
