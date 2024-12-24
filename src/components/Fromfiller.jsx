import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

const FormFiller = () => {
  const { user } = useUser();
  const { templateId } = useParams();
  const [template, setTemplate] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/templates/${templateId}`);
        setTemplate(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/forms", {
        template_id: templateId,
        user_id: user.id,
        answers,
      });
      alert("Form submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  if (!template) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Fill out the Form</h1>
      <form onSubmit={handleSubmit} className="p-4 shadow-sm rounded bg-light">
        {template.custom_string1_state && (
          <div className="mb-3">
            <label className="form-label">{template.custom_string1_question}</label>
            <input
              type="text"
              className="form-control"
              value={answers.custom_string1 || ""}
              onChange={(e) => handleChange("custom_string1", e.target.value)}
            />
          </div>
        )}

        {template.custom_string2_state && (
          <div className="mb-3">
            <label className="form-label">{template.custom_string2_question}</label>
            <input
              type="text"
              className="form-control"
              value={answers.custom_string2 || ""}
              onChange={(e) => handleChange("custom_string2", e.target.value)}
            />
          </div>
        )}

        {template.custom_text1_state && (
          <div className="mb-3">
            <label className="form-label">{template.custom_text1_question}</label>
            <textarea
              className="form-control"
              value={answers.custom_text1 || ""}
              onChange={(e) => handleChange("custom_text1", e.target.value)}
            />
          </div>
        )}

        {template.custom_text2_state && (
          <div className="mb-3">
            <label className="form-label">{template.custom_text2_question}</label>
            <textarea
              className="form-control"
              value={answers.custom_text2 || ""}
              onChange={(e) => handleChange("custom_text2", e.target.value)}
            />
          </div>
        )}

        {template.custom_int1_state && (
          <div className="mb-3">
            <label className="form-label">{template.custom_int1_question}</label>
            <input
              type="number"
              className="form-control"
              value={answers.custom_int1 || ""}
              onChange={(e) => handleChange("custom_int1", e.target.value)}
            />
          </div>
        )}

        {template.custom_int2_state && (
          <div className="mb-3">
            <label className="form-label">{template.custom_int2_question}</label>
            <input
              type="number"
              className="form-control"
              value={answers.custom_int2 || ""}
              onChange={(e) => handleChange("custom_int2", e.target.value)}
            />
          </div>
        )}

        {template.custom_checkbox1_state && (
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={answers.custom_checkbox1 || false}
              onChange={(e) => handleChange("custom_checkbox1", e.target.checked)}
            />
            <label className="form-check-label">{template.custom_checkbox1_question}</label>
          </div>
        )}

        {template.custom_checkbox2_state && (
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={answers.custom_checkbox2 || false}
              onChange={(e) => handleChange("custom_checkbox2", e.target.checked)}
            />
            <label className="form-check-label">{template.custom_checkbox2_question}</label>
          </div>
        )}

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary mt-3">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormFiller;
