import { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import CreateOrderModal from "../components/CreateOrderModal";
import OrderDetailsModal from "../components/OrderDetailsModal";
import OrderFilters from "../components/OrderFilters";
import OrderTable from "../components/OrderTable";
import { getMyOrders, createOrder } from "../services/orderService";
import { getActiveProducts } from "../services/productService";

export default function MyOrdersPage() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCreate, setShowCreate] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        async function loadOrders() {
            setLoading(true);
            setError("");
            try {
                const data = await getMyOrders(year, status, controller.signal);
                if (!controller.signal.aborted) setOrders(data);
            } catch (requestError) {
                if (!controller.signal.aborted) setError(requestError.message || "Failed to load your orders.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        loadOrders();
        return () => controller.abort();
    }, [year, status, refreshKey]);

    const totalPages = Math.ceil(orders.length / pageSize);
    const visibleOrders = useMemo(() => orders.slice((page - 1) * pageSize, page * pageSize), [orders, page, pageSize]);

    function updateFilter(setter) {
        return value => {
            setter(value);
            setPage(1);
        };
    }

    async function openCreateOrder() {
        setError("");
        try {
            setProducts(await getActiveProducts());
            setShowCreate(true);
        } catch (requestError) {
            setError(requestError.message || "Failed to load products.");
        }
    }

    async function handleCreateOrder(items) {
        setSaving(true);
        setError("");
        try {
            await createOrder(items);
            setShowCreate(false);
            setRefreshKey(value => value + 1);
            return true;
        } catch (requestError) {
            setError(requestError.message || "Failed to create order.");
            return false;
        } finally {
            setSaving(false);
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h1>My Orders</h1>
                <Button onClick={openCreateOrder}>Create order</Button>
            </div>
            <OrderFilters year={year} onYearChange={updateFilter(setYear)} status={status} onStatusChange={updateFilter(setStatus)} />
            {error && <div role="alert" className="alert alert-danger">{error}</div>}
            {loading ? <p>Loading orders...</p> : (
                <>
                    <OrderTable orders={visibleOrders} onSelect={setSelectedOrder} />
                    <div className="d-flex align-items-center gap-3">
                        <label>Page size <select value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(1); }}>
                            <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
                        </select></label>
                        <span>{orders.length} orders — Page {page} of {Math.max(1, totalPages)}</span>
                        <Button variant="outline-secondary" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</Button>
                        <Button variant="outline-secondary" disabled={page >= totalPages} onClick={() => setPage(value => value + 1)}>Next</Button>
                    </div>
                </>
            )}
            <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            <CreateOrderModal show={showCreate} products={products} saving={saving} error={error} onClose={() => setShowCreate(false)} onCreate={handleCreateOrder} />
        </div>
    );
}
