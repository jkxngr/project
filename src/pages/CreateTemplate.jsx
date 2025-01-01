import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { usePostTemplate } from "../services/template/usePostTemplate";
import { useGetTopics } from "../services/topic/useGetTopics";

const FormBuilder = ({ user }) => {
  const navigate = useNavigate();

  const { data: topics, isLoading, error } = useGetTopics(); 
  const { mutate: postTemplate } = usePostTemplate(); 

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  console.log("user:", user);
  
  const questionTypes = [
    "single-line",
    "multi-line",
    "positive-integer",
    "checkbox",
  ];

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      topic_id: "",
      questions: [
        {
          type: questionTypes[0],
          title: "",
          options: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const watchQuestions = watch("questions");

  useEffect(() => {
    if (topics?.length > 0) {
      setValue("topic_id", topics[0].topic_id);
    }
  }, [topics, setValue]);

  const onSubmit = (data) => {
    const counters = { string: 0, text: 0, int: 0, checkbox: 0 };

    const processedQuestions = data.questions.reduce((acc, q) => {
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
      title: data.title,
      description: data.description,
      topic_id: data.topic_id,
      user_id: user.id,
      ...processedQuestions,
    };

    postTemplate(payload, {
      onSuccess: () => {
        alert("Template saved successfully!");
        navigate("/");
      },
      onError: () => {
        alert("Error saving template.");
      },
    });
  };

  if (isLoading) return <div>Loading topics...</div>;
  if (error) return <div>Error fetching topics!</div>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Create a Form Template</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 border shadow-sm rounded bg-light"
      >
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Form Title
          </label>
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            type="text"
            className="form-control"
            placeholder="Enter form title"
          />
          {errors.title && (
            <div className="text-danger">{errors.title.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="form-control"
            placeholder="Enter description"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="topic_id" className="form-label">
            Choose Topic
          </label>
          <select
            id="topic_id"
            {...register("topic_id", { required: "Please select a topic" })}
            className="form-select"
          >
            {topics.map((topic) => (
              <option key={topic.topic_id} value={topic.topic_id}>
                {topic.name}
              </option>
            ))}
          </select>
          {errors.topic_id && (
            <div className="text-danger">{errors.topic_id.message}</div>
          )}
        </div>

        <h3>Questions</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 p-3 border rounded">
            <div className="mb-3">
              <label className="form-label">Type</label>
              <Controller
                control={control}
                name={`questions.${index}.type`}
                render={({ field }) => (
                  <select {...field} className="form-select">
                    {questionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                {...register(`questions.${index}.title`, {
                  required: "Question title is required",
                })}
                type="text"
                className="form-control"
                placeholder="Enter question title"
              />
              {errors.questions?.[index]?.title && (
                <div className="text-danger">
                  {errors.questions[index].title.message}
                </div>
              )}
            </div>

            {watchQuestions[index]?.type === "checkbox" && (
              <div className="mb-3">
                <h4>Options</h4>
                <Controller
                  control={control}
                  name={`questions.${index}.options`}
                  defaultValue={[]}
                  render={({ field }) => (
                    <div>
                      {field.value.map((option, optionIndex) => (
                        <div key={optionIndex} className="d-flex mb-2">
                          <input
                            {...register(
                              `questions.${index}.options.${optionIndex}`,
                              { required: "Option cannot be empty" }
                            )}
                            type="text"
                            className="form-control me-2"
                            placeholder="Option text"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(
                                field.value.filter((_, i) => i !== optionIndex)
                              )
                            }
                            className="btn btn-light"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => field.onChange([...field.value, ""])}
                        className="btn btn-secondary"
                      >
                        Add Option
                      </button>
                    </div>
                  )}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => remove(index)}
              className="btn btn-outline-danger"
            >
             <i class="bi bi-trash"></i>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            append({ type: questionTypes[0], title: "", options: [] })
          }
          className="btn btn-primary mt-3"
        >
          Add Question
        </button>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success">
            Save Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormBuilder;
