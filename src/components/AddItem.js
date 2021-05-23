import { useState } from "react";
import { FaPlus } from "react-icons/fa";

const AddItem = ({ addItemHandler }) => {
  const [title, setTitle] = useState("");

  return (
    <form
      className="add-form"
      onSubmit={(e) => {
        e.preventDefault();
        const new_item = {
          title: title,
        };
        // Reset Title Form Box To Empty
        setTitle("");
        // Call Handler To Add New Item
        addItemHandler(new_item);
      }}
    >
      <div className="form-control">
        {/* <label>Item</label> */}
        <input
            className="text-field"
          type="text"
          placeholder="Add Item"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      <button className="btn btn-block" type="submit">
          <FaPlus
              style={{ color: "black", cursor: "pointer"}}
          />
          </button>
      </div>
    </form>
  );
};

export default AddItem;
