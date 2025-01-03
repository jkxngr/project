import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEditTemplate } from "../services/template/useEditTemplate";
import { useGetTopics } from "../services/topic/useGetTopics";
import { useGetTemplateById } from "../services/template/useGetTemplateById";

const EditTemplate = ({ user }) => {
  const navigate = useNavigate();
  const { templateId } = useParams();

  const { data: topics, isLoading: isLoadingTopics, error: errorTopics } = useGetTopics();
  const { data: template, isLoading: isLoadingTemplate, error: errorTemplate } = useGetTemplateById(templateId);
  const { mutate: editTemplate } = useEditTemplate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
    reset,
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

  const { fields, append } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (template) {
      reset({
        title: template.title || "",
        description: template.description || "",
        topic_id: template.topic_id || "",
        questions: template.questions || [
          {
            type: questionTypes[0],
            title: "",
            options: [],
          },
        ],
      });
    }
  }, [template, reset]);

  useEffect(() => {
    if (topics?.length > 0 && !template?.topic_id) {
      setValue("topic_id", topics[0].topic_id);
    }
  }, [topics, setValue, template]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      user_id: user.id,
    };

    editTemplate(payload, {
      onSuccess: () => {
        alert("Template updated successfully!");
        navigate("/");
      },
      onError: () => {
        alert("Error updating template.");
      },
    });
  };

  if (isLoadingTopics || isLoadingTemplate) return <div>Loading...</div>;
  if (errorTopics || errorTemplate) return <div>Error fetching data!</div>;

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Edit Form Template</h2>
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

export default EditTemplate;
