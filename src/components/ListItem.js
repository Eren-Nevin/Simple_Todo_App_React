import { FaRegStar, FaStar, FaTimes } from "react-icons/fa";

const ListItem = ({ item, clickHandler, dblClickHandler }) => {
  return (
    <div className="task">
        {item.important ? (
          <FaStar
            className="task-important-star"
            onClick={dblClickHandler}
            style={{
              color: "green",
              // border: "1px solid black",
              stroke: "black",
              strokeWidth: "10",
              cursor: "pointer",
            }}
          />
        ) : (
          <FaRegStar className="task-important-star" onClick={dblClickHandler} />
        )}
      <h3>
        {item.title}
      </h3>
        <FaTimes
          className="task-remove-icon"
          onClick={clickHandler}
          style={{ color: "red", cursor: "pointer" }}
        />
    </div>
  );
};

export default ListItem;
