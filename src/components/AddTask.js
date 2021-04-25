import { useState } from "react";

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
          type="text"
          placeholder="Add Item"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </div>
      {/* <div className="form-control"> */}
      {/*   <label>Day & Time</label> */}
      {/*   <input */}
      {/*     type="text" */}
      {/*     placeholder="Add Day & Time" */}
      {/*     value={date} */}
      {/*     onChange={(e) => setDate(e.target.value)} */}
      {/*   /> */}
      {/* </div> */}
      {/* <div className="form-control form-control-check"> */}
      {/*   <label>Set Reminder</label> */}
      {/*   <input */}
      {/*     type="checkbox" */}
      {/*     checked={reminder} */}
      {/*     onChange={(e) => setReminder(e.currentTarget.checked)} */}
      {/*   /> */}
      {/* </div> */}

      <input className="btn btn-block" type="submit" value="Save Task" />
    </form>
  );
};

export default AddItem;
