import React from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup } from "react-bootstrap";
import axios from "axios";

const TemplateCard = ({ template }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLike = async () => {
   
    try {
      await axios.post(`http://localhost:3306/api/templates/63/like`);
      window.location.reload(); // Reload the page to update the likes count
    } catch (error) {
      console.error("Error liking template:", error);
    }
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">{template.title}</h5>
          <p className="card-text">{template.description}</p>
          <p className="card-text">
            Created by: {template.User.name} {template.User.surname}
          </p>
          <div className="d-flex justify-content-between align-items-center">
            <ButtonGroup>
              <Link to={`/formfiller/${template.id}`} className="btn btn-primary">
                Fill Template
              </Link>
              <Button variant="outline-danger" onClick={handleLike}>
                <i className="bi bi-heart"></i>
              </Button>
            </ButtonGroup>
            <span className="ms-2">{template.likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;