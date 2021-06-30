import { useState } from "react";

const checkLogin = async (email, password) => {
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

function Authenticate({ successfulAuth }) {
  const [needSignup, setNeedSignup] = useState(false);
  return (
    <>
      {needSignup ? (
        <Signup
          successfulSignup={() => {
            successfulAuth();
          }}
          switchToLogin={() => {
            setNeedSignup(false);
          }}
        />
      ) : (
        <Login
          successfulLogin={() => {
            successfulAuth();
          }}
          switchToSignup={() => {
            setNeedSignup(true);
          }}
        />
      )}
    </>
  );
}

function Login({ successfulLogin, switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Somehow show login errors (e.g. a colored text box, ...)
  const [loginError, setLoginError] = useState("");

  // Make password field not show password by default

  return (
    <form
      className="auth-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const { message, success } = await checkLogin(email, password);
        if (success) {
          successfulLogin(message);
        } else {
          // We need to call setToken here
          console.log(message);
        }
      }}
    >
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
      <button type="submit" className="auth-form-button">
        Login
      </button>
      <button type="button" className="auth-form-button"
          onClick={(e) => {switchToSignup()}}>
        Signup
      </button>
    </form>
  );
}

function Signup({ successfulSignup, switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("");
  // Somehow show signup errors (e.g. a colored text box, ...)
  const [signupError, setSignupError] = useState("");

  // Make password field not show password by default

  return (
    <form
      className="auth-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const { message, success } = await signup(email, password, profile);
        if (success) {
          successfulSignup(message);
        } else {
          console.log(message);
        }
      }}
    >
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
      <button type="submit" className="auth-form-button">
        Signup
      </button>
      <button type="button" className="auth-form-button"
          onClick={(e) => {switchToLogin()}}>
        Login
      </button>
    </form>
  );
}

export default Authenticate;
