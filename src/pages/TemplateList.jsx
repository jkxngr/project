import React from "react";
import { useGetTemplate } from "../services/template/useGetTemplate";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const TemplateList = () => {
  const { data: templates, isLoading, isError, error } = useGetTemplate();

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
    <div className="container my-5">
      <h2 className="text-center mb-4">Available Templates</h2>
      {templates.length === 0 ? (
        <p className="text-center">No templates available.</p>
      ) : (
        <div className="row">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
};

const TemplateCard = ({ template }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{template.title}</h5>
          <p className="card-text">{template.description}</p>
          <p className="card-text">
            Created by: {template.User.name} {template.User.surname}
          </p>
          <Link to={`/formfiller/${template.id}`} className="btn btn-primary">
            Fill Template
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplateList;