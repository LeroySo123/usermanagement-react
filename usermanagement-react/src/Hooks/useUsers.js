
import { useEffect, useState } from "react";
import {
    getUsers,
    createUser,
    updateUser,
    deleteUser
} from "../services/userService";
import { getRoles } from "../services/roleService";


export function useUsers() {

    // Server data
    const [users, setUsers] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [roles, setRoles] = useState([]);

    // Search and Pagination
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // API states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [mutationError, setMutationError] = useState("");

    const [refreshKey, setRefreshKey] = useState(0);

    

    // GET Users
    useEffect(() => {
        const controller = new AbortController();

        async function loadUsers() {
            try {
                setLoading(true);
                setLoadError("");

                const result = await getUsers(
                    search,
                    page,
                    pageSize,
                    controller.signal
                );

                if (controller.signal.aborted) return;

                setUsers(result.items);
                setTotalCount(result.totalCount);
                setTotalPages(result.totalPages);

                const lastPage = Math.max(
                    1, result.totalPages
                );

                // Handle deleting the last user on a page
                if (page > lastPage) {
                    setPage(lastPage);
                }
            }
            catch (err) {
                if (!controller.signal.aborted) {
                    console.error(err);
                    setLoadError("Failed to load users.");
                }
            }
            finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        async function loadRoles() {
            try {
                const data = await getRoles(controller.signal);

                if (!controller.signal.aborted) {
                    setRoles(data);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Failed to load roles", error);
                }
            }
        }

        loadUsers();
        loadRoles();

        return () => controller.abort();

    }, [search, page, pageSize, refreshKey]);


    // Refresh current page
    function refreshUsers() {
        setRefreshKey(prev => prev + 1);
    }

    // Search
    function changeSearch(keyword) {
        setPage(1);
        setSearch(keyword.trim());
    }

    // Page Size
    function changePageSize(size) {
        setPageSize(Number(size));
        setPage(1);
    }

    // CREATE
    async function addUser(formData) {
        if (saving) {
            return { success: false, message: "Saving in progress." };
        }


        try {
            setSaving(true);
            setMutationError("");

            await createUser(formData);

            refreshUsers();
            return { success: true };
        }
        catch (err) {
            console.error(err);

            return {
                success: false,
                status: err.status ?? 0,
                message: err.message || "Failed to add user.",
                errors: err.errors ?? {}
            };
        }
        finally {
            setSaving(false);
        }
    }

    // UPDATE
    async function editUser(id, formData) {
        try {
            setSaving(true);
            setMutationError("");

            await updateUser(id, formData);

            if (search) {
                refreshUsers();
            }
            else {
                setUsers(prevUsers =>
                    prevUsers.map(user =>
                        user.id === id
                            ? { ...user, ...formData }
                            : user
                    )
                );
            }

            return { success: true };
        }
        catch (err) {
            console.error(err);

            return {
                success: false,
                status: err.status ?? 0,
                message: err.message || "Failed to add user.",
                errors: err.errors ?? {}
            };
        }
        finally {
            setSaving(false);
        }
    }

    // DELETE
    async function removeUser(id) {
        if (deleting) return false;

        try {
            setDeleting(true);
            setMutationError("");

            await deleteUser(id);

            refreshUsers();
            return true;
        }
        catch (err) {
            console.error(err);
            setMutationError("Failed to delete user.");
            return false;
        }
        finally {
            setDeleting(false);
        }
    }

    return {
        // Data
        users,
        totalCount,
        totalPages,
        roles,

        // Search / Pagination
        search,
        page,
        pageSize,
        changeSearch,
        setPage,
        changePageSize,

        // API states
        loading,
        saving,
        deleting,
        loadError,
        mutationError,

        // Operations
        addUser,
        editUser,
        removeUser,
        refreshUsers
    };
}
