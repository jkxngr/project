import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useGetUser } from "../services/user/useGetUser";
import { useDeleteUser } from "../services/user/useDeleteUser";
import { useEditUser } from "../services/user/useEditUser";
import { useDeleteAdmin } from "../services/user/useDeleteAdmin";
import { useBlockUser } from "../services/user/useBlockUser";
import { useUnblockUser } from "../services/user/useUnblockUser";
import { Modal, Button, Table } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";

const AdminPage = () => {
  const { user } = useUser();
  const { data: users, isLoading, isError, error } = useGetUser();
  const deleteUser = useDeleteUser();
  const editUser = useEditUser();
  const deleteAdmin = useDeleteAdmin();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  if (user.role !== "admin") {
    return <div>Access Denied</div>;
  }

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  if (isError) {
    return <div>Error fetching users: {error.message}</div>;
  }

  const handleDelete = (userId) => {
    deleteUser.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        alert("User deleted successfully!");
      },
    });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = () => {
    if (selectedUser.role === "user") {
      deleteAdmin.mutate(selectedUser, {
        onSuccess: () => {
          queryClient.invalidateQueries(["users"]);
          alert("Admin privileges removed successfully!");
          setShowModal(false);
        },
      });
    } else {
      editUser.mutate(selectedUser, {
        onSuccess: () => {
          queryClient.invalidateQueries(["users"]);
          alert("User updated successfully!");
          setShowModal(false);
        },
      });
    }
  };

  const handleBlock = (userId) => {
    console.log(userId);
    blockUser.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        alert("User blocked successfully!");
      },
    });
  };

  const handleUnblock = (userId) => {
    unblockUser.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        alert("User unblocked successfully!");
      },
    });
  };

  return (
    <div className="container mt-5">
      <h2>Admin Page</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(user)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => handleDelete(user)}>
                  Delete
                </Button>{" "}
                {user.status === "blocked" ? (
                  <Button
                    variant="success"
                    onClick={() => handleUnblock(user)}
                  >
                    Unblock
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleBlock(user)}
                  >
                    Block
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={selectedUser?.name || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={selectedUser?.email || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                className="form-control"
                id="role"
                value={selectedUser?.role || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPage;
