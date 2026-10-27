
import {
    API_BASE,
    getCsrfToken
} from "./authService";

export async function apiFetch(path, options = {}) {
    const method = (options.method ?? "GET").toUpperCase();

    const headers = new Headers(options.headers);

    // Only state-changing requests need CSRF.
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
        const token = await getCsrfToken();
        headers.set("X-CSRF-TOKEN", token);
    }

    return fetch(`${API_BASE}${path}`, {
        ...options,
        method,
        credentials: "include",
        headers
    });
}

export async function checkResponse(response) {
    if (response.ok) {
        return response;
    }

    let body = {};

    try {
        body = await response.json();
    } catch {
        // Some errors do not return JSON.
    }

    const message =
        body.message ||
        body.title ||
        `Request failed (${response.status}).`;

    throw new ApiError(
        response.status,
        message,
        body.errors || {}
    );
}

export class ApiError extends Error {
    constructor(status, message, errors = {}) {
        super(message);

        this.name = "ApiError";
        this.status = status;
        this.errors = errors;
    }
}
