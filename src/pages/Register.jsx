import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../services/auth/useRegister";
import { Spinner } from "react-bootstrap";

const Register = () => {
  const { mutate: registerMutate, isLoading, isError, error } = useRegister();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password, name, surname };
    registerMutate(userData, {
      onSuccess: () => {
        navigate("/login");
      },
      onError: (err) => {
        console.error("Register error:", err);
      },
    });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: "28rem" }}>
        <h1 className="text-center mb-3">The App</h1>
        <h2 className="h5 text-center mb-4">Sign Up for The App</h2>
        {isError && <div className="alert alert-danger">{error.message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingName"
              placeholder="John"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="floatingName">First Name</label>
          </div>
          <div className="form-floating mb-3">
            <input
              className="form-control"
              id="floatingSurname"
              placeholder="Doe"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
            <label htmlFor="floatingSurname">Last Name</label>
          </div>
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
            {isLoading ? <Spinner animation="border" size="sm" /> : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
};

export default Register;  