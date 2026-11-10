import { apiFetch, checkResponse } from "./apiFetch";

export async function getAdminOrders(year, status, page, pageSize, signal) {
    const params = new URLSearchParams({
        year: String(year),
        page: String(page),
        pageSize: String(pageSize)
    });

    if (status) params.set("status", status);

    const response = await apiFetch(`/orders?${params}`, { signal });
    await checkResponse(response);
    return await response.json();
}

export async function getMyOrders(year, status, signal) {
    const params = new URLSearchParams({ year: String(year) });
    if (status) params.set("status", status);

    const response = await apiFetch(`/orders/mine?${params}`, { signal });
    await checkResponse(response);
    return await response.json();
}

export async function createOrder(items) {
    const response = await apiFetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
    });
    await checkResponse(response);
    return await response.json();
}

export async function updateOrderStatus(id, status) {
    const response = await apiFetch(`/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
    });
    await checkResponse(response);
}
