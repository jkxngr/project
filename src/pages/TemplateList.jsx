import React, { useState } from "react";
import { useGetTemplate } from "../services/template/useGetTemplate";
import { Spinner, Table } from "react-bootstrap";
import Header from "../components/Header";
import TemplateCard from "../components/TemplateCard";
import { useNavigate } from "react-router-dom";

const TemplateList = () => {
  const { data: templates, isLoading, isError, error } = useGetTemplate();
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredTemplates = templates?.filter((template) =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading templates...</span>
        </Spinner>
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching templates: {error.message}</div>;
  }

  return (
    <div>
      <Header
        user={user}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleLogout={handleLogout}
      />
      <div className="container my-5">
        <h2 className="text-center mb-4">Available Templates</h2>
        {filteredTemplates.length === 0 ? (
          <p className="text-center">No templates available.</p>
        ) : (
          <div className="row">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateList;