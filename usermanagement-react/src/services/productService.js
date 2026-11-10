import { apiFetch, checkResponse } from "./apiFetch";

export async function getActiveProducts(signal) {
    const response = await apiFetch("/products", { signal });
    await checkResponse(response);
    return await response.json();
}

export async function getAllProducts(signal) {
    const response = await apiFetch("/products/admin", { signal });
    await checkResponse(response);
    return await response.json();
}

export async function createProduct(product) {
    const response = await apiFetch("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    await checkResponse(response);
    return await response.json();
}

export async function updateProduct(id, product) {
    const response = await apiFetch(`/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    await checkResponse(response);
}

export async function setProductActive(id, isActive) {
    const response = await apiFetch(`/products/${id}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive })
    });
    await checkResponse(response);
}
