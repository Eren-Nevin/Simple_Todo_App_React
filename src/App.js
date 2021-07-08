import { useState } from "react";
import { AuthenticateApp, removeTokenLocally } from "./pages/auth/Auth-Page";
import { ListApp } from "./pages/list/List-Page";
import AppContext from "./AppContext";


let userToken = "";
let baseUrl = "http://localhost:9999"
if (process.env.NODE_ENV === 'production'){
    baseUrl = "https://dinkedpawn.com:9999"
    console.log(baseUrl)
}

 

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  async function logout() {
    await removeTokenLocally(userToken);
    setAuthenticated(false);
  }
  return (
    <>
        <AppContext.Provider value={{baseUrl: baseUrl}}>
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
            </AppContext.Provider>
    </>
  );
}


export default App;
