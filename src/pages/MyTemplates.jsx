import React from "react";
import { useGetTemplates } from "../services/user/useGetTemplates";
import { Table } from "react-bootstrap";

const MyTemplates = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user.id);
  
  const userId = user?.id;
console.log(userId);

  const { data: templates, isLoading, isError, error } = useGetTemplates(userId);

  if (isLoading) {
    return <div>Loading templates...</div>;
  }

  if (isError) {
    return <div>Error fetching templates: {error.message}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>My Templates</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr key={template.id}>
              <td>{template.title}</td>
              <td>{template.description}</td>
              <td>{new Date(template.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MyTemplates;