import { FaTimes } from "react-icons/fa";

const ShoppingItem = ({ item, clickHandler, dblClickHandler }) => {
  return (
    <div
      className={`task ${item.reminder ? "reminder" : ""}`}
      onDoubleClick={dblClickHandler}
    >
      <h3>
        {item.title}
        <FaTimes
          onClick={clickHandler}
          style={{ color: "red", cursor: "pointer" }}
        />
      </h3>
    </div>
  );
};

export default ShoppingItem;
