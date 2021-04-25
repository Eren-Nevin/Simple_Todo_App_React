// import Button from "./Button";

const Header = ({ title, onAdd, addShown }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      {/* <Button */}
      {/*     color={addShown ? 'red' : 'green'} */}
      {/*     text={addShown ? "Close" : "Add"} */}
      {/*   onClick={onAdd} */}
      {/* /> */}
    </header>
  );
};

export default Header;
