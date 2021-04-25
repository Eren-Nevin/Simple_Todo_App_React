import { FaTimes } from "react-icons/fa";

const ShoppingItem = ({ item, clickHandler, dblClickHandler }) => {
  return (
    <div
      className={`task ${item.reminder ? "reminder" : ""}`}
      onDoubleClick={dblClickHandler}
    >
      <h3>
        {item.text}
        <FaTimes
          onClick={clickHandler}
          style={{ color: "red", cursor: "pointer" }}
        />
      </h3>
      <p>{item.day}</p>
    </div>
  );
};

export default ShoppingItem;
