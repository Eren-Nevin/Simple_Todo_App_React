// const onCLick = (_) => {
//   alert("Clicked");
// };
const Button = ({ color, text, onClick }) => {
  return (
    <button
      className="btn"
      onClick={onClick}
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  color: "steelblue",
  onClick: (_) => {
    console.log("Clicked");
  },
};
export default Button;
