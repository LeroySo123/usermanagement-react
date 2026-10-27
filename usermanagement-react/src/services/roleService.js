import { apiFetch, checkResponse } from "./apiFetch";


// GET /api/roles
export async function getRoles( signal) {

    const response = await apiFetch(
        `/roles`, { signal }
    );

    await checkResponse(response);

    return await response.json();
}