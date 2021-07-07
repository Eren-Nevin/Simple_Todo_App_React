import { useState } from "react";
import { AuthenticateApp, removeTokenLocally } from "./pages/auth/Auth-Page";
import { ListApp } from "./pages/list/List-Page";


let userToken = "";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  async function logout() {
    await removeTokenLocally(userToken);
    setAuthenticated(false);
  }
  return (
    <>
      {authenticated ? (
        <ListApp userToken={userToken} onLogout={logout} />
      ) : (
        <AuthenticateApp
          successfulAuth={(token) => {
            userToken = token;
            setAuthenticated(true);
          }}
        />
      )}
    </>
  );
}


export default App;
