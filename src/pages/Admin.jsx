import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useGetUser } from "../services/user/useGetUser";
import { useDeleteUser } from "../services/user/useDeleteUser";
import { useEditUser } from "../services/user/useEditUser";
import { useDeleteAdmin } from "../services/user/useDeleteAdmin";
import { Modal, Button, Table } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";
import { useBlockUser } from "../services/user/useBlockuser";
import { useUnblockUser } from "../services/user/useUnblockUser";
import AdminCard from "../components/AdminCard";

const AdminPage = () => {
  const { user } = useUser();
  const { data: users, isLoading, isError, error } = useGetUser();
  const deleteUser = useDeleteUser();
  const editUser = useEditUser();
  const deleteAdmin = useDeleteAdmin();
  const queryClient = useQueryClient();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
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
    blockUser.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        alert("User blocked successfully!");
      },
      onError: (error) => {
        console.error("Error blocking user:", error);
        alert("Failed to block user.");
      },
    });
  };

  const handleUnblock = (userId) => {
    unblockUser.mutate(userId, {
      onSuccess: () => {
        queryClient.invalidateQueries(["users"]);
        alert("User unblocked successfully!");
      },
      onError: (error) => {
        console.error("Error unblocking user:", error);
        alert("Failed to unblock user.");
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
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => handleEdit(user)}
                >
                  <i className="bi bi-pen"></i>
                </button>
                <button
                  variant="danger"
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(user)}
                >
                  <i className="bi bi-trash"></i>
                </button>
                {user.status === "blocked" ? (
                  <button
                    className="btn btn-outline-success"
                    onClick={() => handleUnblock(user)}
                  >
                    <i className="bi bi-unlock-fill"></i>
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleBlock(user)}
                  >
                    <i className="bi bi-lock-fill"></i>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AdminCard
        showModal={showModal}
        setShowModal={setShowModal}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleSave={handleSave}
      />
    </div>
  );
};

export default AdminPage;
