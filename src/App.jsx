import React from "react";
import { Route, Routes } from "react-router-dom";
import FormBuilderr from "./components/formm";
import FormFiller from "./components/Fromfiller";
import TemplateList from "./components/TemplateList";
import { UserProvider } from "./context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/template" element={<FormBuilderr />} />
          <Route path="/formfiller/:templateId" element={<FormFiller />} />
          <Route path="/" element={<TemplateList />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
