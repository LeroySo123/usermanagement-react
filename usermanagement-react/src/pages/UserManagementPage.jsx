import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import UserTable from "../components/UserTable";
import UserModal from "../components/UserModal";


function UserManagementPage() {

    // Custom Hook
    const {
        users,
        totalCount,
        totalPages,
        roles,
        page,
        pageSize,
        changeSearch,
        setPage,
        changePageSize,
        loading,
        saving,
        deleting,
        loadError,
        mutationError,
        addUser,
        editUser,
        removeUser,
        refreshUsers
    } = useUsers();




    // UI-only states
    const [searchInput, setSearchInput] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);


    const [formErrors, setFormErrors] = useState({});
    const [formMessage, setFormMessage] = useState("");


    // Open Add Modal
    function handleOpenAdd() {
        setFormErrors({});
        setFormMessage("");
        setEditingUser(null);
        setShowModal(true);
    }

    // Open Edit Modal
    function handleEditUser(user) {
        setEditingUser(user);
        setShowModal(true);
    }

    // Close Modal
    function handleCloseModal() {
        if (saving) return;
        setShowModal(false);
        setEditingUser(null);
    }

    // Search
    function handleSearch(e) {
        e.preventDefault();
        changeSearch(searchInput);
    }


    // Add / Edit User

    async function handleSaveUser(formData) {
        setFormErrors({});
        setFormMessage("");

        let result;

        if (editingUser === null) {
            result = await addUser(formData);
        }
        else {
            result = await editUser(
                editingUser.id,
                formData
            );
        }

        console.log("Save Result:", result);

        if (result.success) {
            setShowModal(false);
            setEditingUser(null);
            return;
        }

        // Validation or Conflict
        if (result.status === 400 || result.status === 409) {
            setFormErrors(result.errors || {});
            setFormMessage(result.message);
        }
        else if (result.status === 404) {
            setFormMessage("User not found. It may have been deleted.");
        }
        else {
            setFormMessage(
                result.status >= 500
                    ? "Server error. Please try again later."
                    : result.message
            );
        }
    }


    // Delete User
    async function handleDeleteUser(user) {
        if (deleting) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.name}?`
        );

        if (!confirmed) return;

        await removeUser(user.id);
    }


    return (
        <div>
            <h1>User Management</h1>

            <button type="button" onClick={handleOpenAdd} disabled={saving || deleting}>
                Add User
            </button>

            <hr />

            <h2>User List</h2>

            {/* Search Form */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchInput}
                    onChange={e =>
                        setSearchInput(e.target.value)
                    }
                />

                <button type="submit">
                    Search
                </button>
            </form>




            {/* API Error */}
            {loadError && (
                <div role="alert" style={{ color: "red" }}>
                    <p>{loadError}</p>
                    <button
                        type="button"
                        onClick={refreshUsers}
                    >
                        Retry Loading
                    </button>
                </div>
            )}

            {mutationError && (
                <p role="alert" style={{ color: "red" }}>
                    {mutationError}
                </p>
            )}


            {/* Loading */}
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <UserTable
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                />
            )}

            {/* Pagination */}
            <div style={{ marginTop: "20px" }}>
                <label>
                    Page Size:
                    <select
                        value={pageSize}
                        onChange={e =>
                            changePageSize(e.target.value)
                        }
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>
                </label>

                <p>Total Users: {totalCount}</p>

                <button
                    type="button"
                    disabled={loading || !!loadError || page <= 1}
                    onClick={() =>
                        setPage(prev => prev - 1)
                    }
                >
                    Previous
                </button>

                <span style={{ margin: "0 15px" }}>
                    Page {page} of {Math.max(1, totalPages)}
                </span>

                <button
                    type="button"
                    disabled={
                        loading ||
                        !!loadError ||
                        page >= totalPages
                    }
                    onClick={() =>
                        setPage(prev => prev + 1)
                    }
                >
                    Next
                </button>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <UserModal
                    key={editingUser?.id ?? "new"}
                    user={editingUser}
                    roles={roles}
                    onSave={handleSaveUser}
                    onClose={handleCloseModal}
                    saving={saving}
                    serverErrors={formErrors}
                    serverMessage={formMessage}
                />
            )}


        </div>
    );
}

export default UserManagementPage;
