
import { apiFetch, checkResponse } from "./apiFetch";


// GET /api/users
export async function getUsers(
    search = "",
    page = 1,
    pageSize = 10,
    signal
) {
    const params = new URLSearchParams({
        search: search,
        page: page.toString(),
        pageSize: pageSize.toString()
    });


    const response = await apiFetch(
        `/users?${params.toString()}`, { signal }
    );

    await checkResponse(response);

    return await response.json();
}

// POST /api/users
export async function createUser(user) {


    const response = await apiFetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    await checkResponse(response);

    return await response.json();
}

// PUT /api/users/{id}
export async function updateUser(id, user) {

    const response = await apiFetch(`/users/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });

    await checkResponse(response);
}

// DELETE /api/users/{id}
export async function deleteUser(id) {

    const response = await apiFetch(`/users/${id}`, {
        method: "DELETE"
    });


    await checkResponse(response);
}
