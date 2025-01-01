import React, { useState } from "react";
import { useGetTemplate } from "../services/template/useGetTemplate";
import { Link, useNavigate } from "react-router-dom";
import { Spinner, Button, Form, Navbar, Container, Nav } from "react-bootstrap";
import TemplateCard from "../components/TemplateCard";

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
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">The App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/create-template">Create Template</Nav.Link>
              {user?.role === "admin" && <Nav.Link href="/admin">Admin Page</Nav.Link>}
              <Nav.Link href="/my-templates">My Templates</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            <Nav>
              {!user ? (
                <>
                  <Nav.Link href="/login">Sign In</Nav.Link>
                  <Nav.Link href="/register">Sign Up</Nav.Link>
                </>
              ) : (
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

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