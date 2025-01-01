import React from "react";
import { Link } from "react-router-dom";

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

export default TemplateCard;