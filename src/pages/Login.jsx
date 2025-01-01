import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../services/auth/useLogin";
import { Spinner } from "react-bootstrap";

const Login = ({ login }) => {
  const { mutate: loginMutate, isLoading, isError, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    loginMutate(userData, {
      onSuccess: (data) => {
        login(data.user);
        localStorage.setItem("token", data.token);
        navigate("/");
      },
      onError: (err) => {
        console.error("Login error:", err);
      },
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "28rem" }}>
        <h1 className="text-center mb-3">The App</h1>
        <h2 className="h5 text-center mb-4">Sign In to The App</h2>
        {isError && <div className="alert alert-danger">{error.message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="floatingInput">Email Address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
          </button>
        </form>
        <p className="text-center mt-3">
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;