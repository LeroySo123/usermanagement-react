import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import ProductModal from "../components/ProductModal";
import { createProduct, getAllProducts, setProductActive, updateProduct } from "../services/productService";

export default function ProductManagementPage() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const [showProductModal, setShowProductModal] = useState(false);
    const [savingProduct, setSavingProduct] = useState(false);
    const [serverErrors, setServerErrors] = useState({});
    const [serverMessage, setServerMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        getAllProducts(controller.signal)
            .then(data => { if (!controller.signal.aborted) setProducts(data); })
            .catch(requestError => { if (!controller.signal.aborted) setError(requestError.message || "Failed to load products."); })
            .finally(() => { if (!controller.signal.aborted) setLoading(false); });
        return () => controller.abort();
    }, [refreshKey]);

    function editProduct(product) {
        setServerErrors({});
        setServerMessage("");
        setSelectedProduct(product);
        setShowProductModal(true);
    }

    async function handleSaveProduct(productData) {
        setSavingProduct(true);
        setServerErrors({});
        setServerMessage("");

        try {
            if (selectedProduct === null) {
                await createProduct(productData);
            } else {
                await updateProduct(selectedProduct.id, productData);
            }

            setShowProductModal(false);
            setSelectedProduct(null);
            setRefreshKey(value => value + 1);
            return true;
        } catch (requestError) {
            setServerErrors(requestError.errors || {});
            setServerMessage(requestError.message || "Failed to save product.");
            return false;
        } finally {
            setSavingProduct(false);
        }
    }

    function openCreateModal() {
        setServerErrors({});
        setServerMessage("");
        setSelectedProduct(null);
        setShowProductModal(true);
    }

    function closeProductModal() {
        if (savingProduct) return;
        setShowProductModal(false);
        setSelectedProduct(null);
        setServerErrors({});
        setServerMessage("");
    }

    async function toggleActive(product) {
        setError("");
        try {
            await setProductActive(product.id, !product.isActive);
            setRefreshKey(value => value + 1);
        } catch (requestError) {
            setError(requestError.message || "Failed to update product.");
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Product Management</h1>
                <Button onClick={openCreateModal} disabled={savingProduct}>Create product</Button>
            </div>
            {error && <div role="alert" className="alert alert-danger">{error}</div>}
            {loading ? <p>Loading products...</p> : (
                <Table striped bordered hover responsive>
                    <thead><tr><th>ID</th><th>Name</th><th>Price (GBP)</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>{product.id}</td><td>{product.name}</td><td>{Number(product.price).toFixed(2)}</td><td>{product.isActive ? "Active" : "Inactive"}</td>
                                <td>
                                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => editProduct(product)}>Edit</Button>
                                    <Button size="sm" variant={product.isActive ? "outline-danger" : "outline-success"} onClick={() => toggleActive(product)}>
                                        {product.isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && <tr><td colSpan={5}>No products found.</td></tr>}
                    </tbody>
                </Table>
            )}
            <ProductModal
                key={selectedProduct?.id ?? "new"}
                product={selectedProduct}
                show={showProductModal}
                onSave={handleSaveProduct}
                onClose={closeProductModal}
                saving={savingProduct}
                serverErrors={serverErrors}
                serverMessage={serverMessage}
            />
        </div>
    );
}
