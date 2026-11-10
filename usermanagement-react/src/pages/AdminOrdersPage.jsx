import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import OrderDetailsModal from "../components/OrderDetailsModal";
import OrderFilters from "../components/OrderFilters";
import OrderTable from "../components/OrderTable";
import { getAdminOrders, updateOrderStatus } from "../services/orderService";

export default function AdminOrdersPage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [result, setResult] = useState({ items: [], totalCount: 0, totalPages: 0 });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadOrders() {
            setLoading(true);
            setError("");
            try {
                const data = await getAdminOrders(year, status, page, pageSize, controller.signal);
                if (!controller.signal.aborted) setResult(data);
            } catch (requestError) {
                if (!controller.signal.aborted) setError(requestError.message || "Failed to load orders.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadOrders();
        return () => controller.abort();
    }, [year, status, page, pageSize, refreshKey]);

    function updateFilter(setter) {
        return value => {
            setter(value);
            setPage(1);
        };
    }

    async function handleStatusChange(order, newStatus) {
        try {
            await updateOrderStatus(order.id, newStatus);
            setRefreshKey(value => value + 1);
        } catch (requestError) {
            setError(requestError.message || "Failed to update order status.");
        }
    }

    return (
        <div>
            <h1>All Orders</h1>
            <OrderFilters year={year} onYearChange={updateFilter(setYear)} status={status} onStatusChange={updateFilter(setStatus)} />
            {error && <div role="alert" className="alert alert-danger">{error}</div>}
            {loading ? <p>Loading orders...</p> : (
                <>
                    <OrderTable orders={result.items} showCustomer onSelect={setSelectedOrder} onStatusChange={handleStatusChange} />
                    <div className="d-flex align-items-center gap-3">
                        <label>Page size <select value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(1); }}>
                            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                        </select></label>
                        <span>{result.totalCount} orders — Page {page} of {Math.max(1, result.totalPages)}</span>
                        <Button variant="outline-secondary" disabled={page <= 1 || loading} onClick={() => setPage(value => value - 1)}>Previous</Button>
                        <Button variant="outline-secondary" disabled={page >= result.totalPages || loading} onClick={() => setPage(value => value + 1)}>Next</Button>
                    </div>
                </>
            )}
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
    );
}
