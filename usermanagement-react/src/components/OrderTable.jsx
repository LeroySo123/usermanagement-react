import { Button, Table, Form } from "react-bootstrap";

const nextStatuses = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Completed", "Cancelled"]
};

export default function OrderTable({ orders, showCustomer = false, onSelect, onStatusChange }) {
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>Order</th>
                    {showCustomer && <th>Customer</th>}
                    <th>Created</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.orderNumber}</td>
                        {showCustomer && <td>{order.customerName}</td>}
                        <td>{new Date(order.createdAtUtc).toLocaleDateString()}</td>
                        <td>
                            {onStatusChange && nextStatuses[order.status]?.length ? (
                                <Form.Select
                                    size="sm"
                                    value=""
                                    aria-label={`Update status for order ${order.orderNumber}`}
                                    onChange={event => onStatusChange(order, event.target.value)}
                                >
                                    <option value="">{order.status}</option>
                                    {nextStatuses[order.status].map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Select>
                            ) : order.status}
                        </td>
                        <td>{order.items.length}</td>
                        <td>{order.currencyCode} {Number(order.totalAmount).toFixed(2)}</td>
                        <td>
                            <Button size="sm" variant="outline-primary" onClick={() => onSelect(order)}>
                                Details
                            </Button>
                        </td>
                    </tr>
                ))}
                {orders.length === 0 && (
                    <tr>
                        <td colSpan={showCustomer ? 7 : 6}>No orders found.</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}
