import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user, roles }) => {
  console.log("ProtectedRoute - user:", user);
  console.log("ProtectedRoute - roles:", roles);
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && roles.indexOf(user.role) === -1) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;