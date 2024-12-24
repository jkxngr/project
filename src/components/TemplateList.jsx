import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/templates");
        setTemplates(res.data);
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Available Templates</h2>
      {templates.length === 0 ? (
        <p className="text-center">No templates available.</p>
      ) : (
        <div className="row">
          {templates.map((template) => (
            <div className="col-md-4 mb-4" key={template.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{template.title}</h5>
                  <p className="card-text">{template.description}</p>
                  <Link to={`/formfiller/${template.id}`} className="btn btn-primary">
                    Fill out Form
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
