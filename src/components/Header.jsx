import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Form, Button } from "react-bootstrap";

const Header = ({ user, searchTerm, handleSearch, handleLogout }) => {
  return (
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
  );
};

export default Header;