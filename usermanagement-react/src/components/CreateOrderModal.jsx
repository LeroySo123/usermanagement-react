import { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";

export default function CreateOrderModal({ show, products, saving, error, onClose, onCreate }) {
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [items, setItems] = useState([]);

    function addItem() {
        if (!productId || Number(quantity) < 1) return;
        setItems(current => [...current, { productId: Number(productId), quantity: Number(quantity) }]);
        setProductId("");
        setQuantity(1);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!items.length || saving) return;
        const created = await onCreate(items);
        if (created) setItems([]);
    }

    function handleClose() {
        setItems([]);
        setProductId("");
        setQuantity(1);
        onClose();
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form onSubmit={handleSubmit}>
                <Modal.Header closeButton={!saving}>
                    <Modal.Title>Create order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Product</Form.Label>
                        <Form.Select value={productId} onChange={event => setProductId(event.target.value)}>
                            <option value="">Select a product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} — {Number(product.price).toFixed(2)}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" min="1" max="1000" value={quantity} onChange={event => setQuantity(event.target.value)} />
                    </Form.Group>
                    <Button type="button" variant="outline-primary" onClick={addItem} disabled={!productId}>
                        Add item
                    </Button>
                    {items.length > 0 && (
                        <Table size="sm" className="mt-3">
                            <thead><tr><th>Product</th><th>Quantity</th><th></th></tr></thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={`${item.productId}-${index}`}>
                                        <td>{products.find(product => product.id === item.productId)?.name}</td>
                                        <td>{item.quantity}</td>
                                        <td><Button type="button" size="sm" variant="link" onClick={() => setItems(current => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                    {error && <p className="text-danger" role="alert">{error}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} disabled={saving}>Cancel</Button>
                    <Button type="submit" disabled={saving || !items.length}>
                        {saving ? "Creating..." : "Place order"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
