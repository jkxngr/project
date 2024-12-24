import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const FormBuilder = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [topics, setTopics] = React.useState([]); 
  const questionTypes = ["single-line", "multi-line", "positive-integer", "checkbox"]; 

  React.useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get("https://my-course-project-25cbbc9b712d.herokuapp.com/api/topics");
        setTopics(res.data);
      } catch (err) {
        console.error("Error fetching topics:", err);
      }
    };
    fetchTopics();
  }, []);

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    topic_id: Yup.string().required("Please select a topic"),
    questions: Yup.array().of(
      Yup.object({
        type: Yup.string().required("Question type is required"),
        title: Yup.string().required("Question title is required"),
        options: Yup.array().when("type", {
          is: "checkbox",
          then: Yup.array().of(Yup.string().required("Option cannot be empty")).min(1, "At least one option is required"),
        }),
      })
    ),
  });

  const initialValues = {
    title: "",
    description: "",
    topic_id: topics.length > 0 ? topics[0].topic_id : "", 
    questions: [
      {
        type: questionTypes[0], 
        title: "",
        options: [],
      },
    ],
  };

  const handleSubmit = async (values) => {
    try {
      const counters = { string: 0, text: 0, int: 0, checkbox: 0 };

      const processedQuestions = values.questions.reduce((acc, q) => {
        const typeMap = {
          "single-line": "string",
          "multi-line": "text",
          "positive-integer": "int",
          checkbox: "checkbox",
        };

        const typePrefix = typeMap[q.type];
        counters[typePrefix] += 1;

        acc[`custom_${typePrefix}${counters[typePrefix]}_state`] = true;
        acc[`custom_${typePrefix}${counters[typePrefix]}_question`] = q.title;

        if (typePrefix === "checkbox") {
          acc[`custom_${typePrefix}${counters[typePrefix]}_options`] = q.options;
        }

        return acc;
      }, {});

      const payload = {
        title: values.title,
        description: values.description,
        topic_id: values.topic_id,
        user_id: user.id,
        ...processedQuestions,
      };

      await axios.post("https://my-course-project-25cbbc9b712d.herokuapp.com/api/templates", payload);
      alert("Template saved successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error saving template:", err);
      alert("Error saving template.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Create a Form Template</h2>
      <Formik
        enableReinitialize 
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form className="p-4 border shadow-sm rounded bg-light">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Form Title</label>
              <Field
                id="title"
                name="title"
                type="text"
                className="form-control"
                placeholder="Enter form title"
              />
              <ErrorMessage name="title" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <Field
                id="description"
                name="description"
                as="textarea"
                className="form-control"
                placeholder="Enter description"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="topic_id" className="form-label">Choose Topic</label>
              <Field as="select" name="topic_id" className="form-select" id="topic_id">
                {topics.map((topic) => (
                  <option key={topic.topic_id} value={topic.topic_id}>
                    {topic.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="topic_id" component="div" className="text-danger" />
            </div>

            <FieldArray name="questions">
              {({ push, remove }) => (
                <div>
                  <h3>Questions</h3>
                  {values.questions.map((q, index) => (
                    <div key={index} className="mb-4 p-3 border rounded">
                      <div className="mb-3">
                        <label className="form-label">Type</label>
                        <Field as="select" name={`questions[${index}].type`} className="form-select">
                          {questionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name={`questions[${index}].type`} component="div" className="text-danger" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <Field
                          name={`questions[${index}].title`}
                          type="text"
                          className="form-control"
                          placeholder="Enter question title"
                        />
                        <ErrorMessage name={`questions[${index}].title`} component="div" className="text-danger" />
                      </div>

                      {q.type === "checkbox" && (
                        <FieldArray name={`questions[${index}].options`}>
                          {({ push: pushOption, remove: removeOption }) => (
                            <div className="mb-3">
                              <h4>Options</h4>
                              {q.options && q.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="d-flex mb-2">
                                  <Field
                                    name={`questions[${index}].options[${optionIndex}]`}
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Option text"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeOption(optionIndex)}
                                    className="btn btn-danger"
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => pushOption("")}
                                className="btn btn-secondary"
                              >
                                Add Option
                              </button>
                            </div>
                          )}
                        </FieldArray>
                      )}

                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="btn btn-danger"
                      >
                        Remove Question
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      push({ type: questionTypes[0], title: "", options: [] }) // Default to first question type
                    }
                    className="btn btn-primary mt-3"
                  >
                    Add Question
                  </button>
                </div>
              )}
            </FieldArray>

            <div className="text-center mt-4">
              <button type="submit" className="btn btn-success">
                Save Template
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormBuilder;
