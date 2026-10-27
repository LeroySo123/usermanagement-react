
const API_BASE = "https://localhost:7238/api";

let csrfToken = null;

async function requestCsrfToken() {
    const response = await fetch(`${API_BASE}/auth/csrf`, {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error("Unable to get CSRF token.");
    }

    const data = await response.json();
    csrfToken = data.token;

    return csrfToken;
}

export async function getCsrfToken() {
    if (!csrfToken) {
        return await requestCsrfToken();
    }

    return csrfToken;
}

export async function refreshCsrfToken() {
    csrfToken = null;
    return await requestCsrfToken();
}

export function clearCsrfToken() {
    csrfToken = null;
}

export async function login(useremail, password) {
    const token = await getCsrfToken();

    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": token
        },
        body: JSON.stringify({ useremail, password })
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Invalid useremail or password.");
        }

        throw new Error(`Login failed (${response.status}).`);
    }

    const user = await response.json();

    // Authentication identity changed.
    await refreshCsrfToken();

    return user;
}

export async function getCurrentUser() {
    const response = await fetch(`${API_BASE}/auth/me`, {
        credentials: "include"
    });

    if (response.status === 401) {
        return null;
    }

    if (!response.ok) {
        throw new Error(
            `Unable to check login status (${response.status}).`
        );
    }

    return await response.json();
}

export async function logout() {
    const token = await getCsrfToken();

    const response = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-CSRF-TOKEN": token
        }
    });

    if (!response.ok) {
        throw new Error(`Logout failed (${response.status}).`);
    }

    clearCsrfToken();
}

export { API_BASE };
