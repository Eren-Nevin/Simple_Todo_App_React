// import Button from "./Button";

const Header = ({ title, onLogout }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <button className="logout-button" onClick={onLogout}>
        Log out
      </button>
    </div>
  );
};

export default Header;
