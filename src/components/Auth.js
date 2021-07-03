import { useState } from "react";

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
    </>
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
          Login
        </button>
        <button
          type="button"
          className="auth-form-button"
          onClick={(e) => {
            switchToSignup();
          }}
        >
          Signup
        </button>
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
        Signup
      </button>
      <button
        type="button"
        className="auth-form-button"
        onClick={(e) => {
          switchToLogin();
        }}
      >
        Login
      </button>
    </form>
  );
}

export default Authenticate;
