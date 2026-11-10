import { Modal, Table } from "react-bootstrap";

export default function OrderDetailsModal({ order, onClose }) {
    return (
        <Modal show={!!order} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Order {order?.orderNumber}</Modal.Title>
            </Modal.Header>
            {order && (
                <Modal.Body>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Created:</strong> {new Date(order.createdAtUtc).toLocaleString()}</p>
                    {order.customerName && <p><strong>Customer:</strong> {order.customerName}</p>}
                    <Table bordered responsive>
                        <thead>
                            <tr><th>Product</th><th>Quantity</th><th>Unit price</th><th>Total</th></tr>
                        </thead>
                        <tbody>
                            {order.items.map((item, index) => (
                                <tr key={`${item.productId}-${index}`}>
                                    <td>{item.productName}</td>
                                    <td>{item.quantity}</td>
                                    <td>{order.currencyCode} {Number(item.unitPrice).toFixed(2)}</td>
                                    <td>{order.currencyCode} {Number(item.lineTotal ?? item.unitPrice * item.quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <p className="text-end"><strong>Order total: {order.currencyCode} {Number(order.totalAmount).toFixed(2)}</strong></p>
                </Modal.Body>
            )}
        </Modal>
    );
}
