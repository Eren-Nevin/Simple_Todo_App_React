import "./auth-page.css";
import { useState } from "react";
import localforage from "localforage";

// TODO: Use create instance
const localStorage = localforage.createInstance({ name: "userToken" });

async function saveTokenLocally(token) {
  try {
    const _savedToken = await localStorage.setItem("userToken", token);
    console.log(`User Token Saved: ${_savedToken}`);
    return { success: true, token: _savedToken };
  } catch (e) {
    console.log(e);
    return { success: false, token: "" };
  }
}

async function loadTokenLocally() {
  try {
    const _loadedToken = await localStorage.getItem("userToken");
    if (_loadedToken) {
      console.log(`User Token Loaded: ${_loadedToken}`);
      return { success: true, token: _loadedToken };
    } else {
      return { success: false, token: "" };
    }
  } catch (e) {
    console.log(e);
    return { success: false, token: "" };
  }
}

async function removeTokenLocally(token) {
  try {
    await localStorage.removeItem("userToken");
    console.log(`User Token Removed: ${token}`);
    return { success: true, token: token };
  } catch (e) {
    console.log(e);
    return { success: false, token: "" };
  }
}

async function checkLoggedIn(token) {
  // const _result = await loadTokenLocally();
  // if (!_result.success) {
  //   return _result;
  // }
  const url = "http://127.0.0.1:8833/api/check_login";
  const data = {
    token: token,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // mode: "no-cors",
    body: JSON.stringify(data),
  });
  try {
    let result = await response.json();
    return result.success;
  } catch (e) {
    console.log(e);
  }
}

const login = async (email, password) => {
  const url = "http://127.0.0.1:8833/api/login";
  const data = {
    email: email,
    password: password,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // mode: "no-cors",
    body: JSON.stringify(data),
  });
  try {
    let result = await response.json();
    await saveTokenLocally(result.message);
    return result;
  } catch (e) {
    console.log(e);
  }
};

const signup = async (email, password, profile) => {
  const url = "http://127.0.0.1:8833/api/signup";
  const data = {
    email: email,
    password: password,
    profile: profile,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // mode: "no-cors",
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (result.success) {
    console.log(result.message);
  }
  return result;
};

function AuthenticateApp({ successfulAuth }) {
  loadTokenLocally().then(({ success, token }) => {
    if (!success) {
      return;
    }
    checkLoggedIn(token).then((_result) => {
      if (_result) {
        console.log(`Checked Login Successful With ${token}`);
        successfulAuth(token);
      }
    });
  });
  const [needSignup, setNeedSignup] = useState(false);
  return (
    <div className="auth-page-container">
      {needSignup ? (
        <Signup
          successfulSignup={(token) => {
            successfulAuth(token);
          }}
          switchToLogin={() => {
            setNeedSignup(false);
          }}
        />
      ) : (
        <Login
          successfulLogin={(token) => {
            successfulAuth(token);
          }}
          switchToSignup={() => {
            setNeedSignup(true);
          }}
        />
      )}
    </div>
  );
}

function Login({ successfulLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  return (
    <>
      <form
        className="auth-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const { message, success } = await login(email, password);
          if (success) {
            successfulLogin(message);
          } else {
            setLoginError(message);
            console.log(message);
          }
        }}
      >
        <h5 className="auth-header">Log in</h5>
        <input
          className="auth-form-text-field"
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <input
          className="auth-form-text-field"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        {loginError ? (
          <p className="auth-error"> Error: {loginError}! </p>
        ) : (
          <></>
        )}

        <button type="submit" className="auth-form-button">
            Continue
        </button>
        <p className="switch-auth-message"> Don't have an account? </p>
        <a
          className="switch-auth-link"
          onClick={(e) => {
            switchToSignup();
          }}
        >
          Sign up
        </a>
      </form>
    </>
  );
}

function Signup({ successfulSignup, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  const [signupError, setSignupError] = useState("");

  return (
    <form
      className="auth-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const { message, success } = await signup(email, password, profile);
        if (success) {
          const { message, success } = await login(email, password);
          // We know the login would be succesful after signup but we still
          // check for success for rare cases (Defensive Programming).
          if (success) {
            successfulSignup(message);
          }
        } else {
          setSignupError(message);
          console.log(message);
        }
      }}
    >
        <h5 className="auth-header">Sign up</h5>
      <input
        className="auth-form-text-field"
        type="text"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />

      <input
        className="auth-form-text-field"
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <input
        className="auth-form-text-field"
        type="text"
        name="profile"
        placeholder="Profile"
        value={profile}
        onChange={(e) => {
          setProfile(e.target.value);
        }}
      />
      {signupError ? (
        <p className="auth-error"> Error: {signupError}! </p>
      ) : (
        <></>
      )}
      <button type="submit" className="auth-form-button">
       Continue 
      </button>
      <p className="switch-auth-message"> Already have an account? </p>
      <a
        className="switch-auth-link"
        onClick={(e) => {
          switchToLogin();
        }}
      >
        Log in
      </a>
      {/* <button */}
      {/*   type="button" */}
      {/*   className="auth-form-button" */}
      {/*   onClick={(e) => { */}
      {/*     switchToLogin(); */}
      {/*   }} */}
      {/* > */}
      {/*   Login */}
      {/* </button> */}
    </form>
  );
}

export { AuthenticateApp, removeTokenLocally };
