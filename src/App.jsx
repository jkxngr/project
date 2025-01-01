import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import FormBuilderr from "./pages/CreateTemplate";
import FormFiller from "./pages/Fromfiller";
import TemplateList from "./pages/TemplateList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import ProtectedRoute from "./config/ProtectedRoute";
import AdminPage from "./pages/Admin";
import MyTemplates from "./pages/MyTemplates";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<TemplateList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login login={login} />} />
        <Route
          path="/create-template"
          element={
            <ProtectedRoute user={user} roles={["user", "admin"]}>
              <FormBuilderr user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} roles={["admin"]}>
              <AdminPage user={user} />
            </ProtectedRoute>
          }
        />
         <Route
          path="/my-templates"
          element={
            <ProtectedRoute user={user} roles={["user", "admin"]}>
              <MyTemplates />
            </ProtectedRoute>
          }
        />
        <Route path="/formfiller/:templateId" element={<FormFiller />} />
      </Routes>
    </div>
  );
}

export default App;