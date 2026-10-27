function OrderManagementPage() {

    const orders = [
        { id: 1001, customer: "John", status: "Pending" },
        { id: 1002, customer: "Mary", status: "Completed" }
    ];

    return (
        <div>
            <h1>Order Management</h1>

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default OrderManagementPage;