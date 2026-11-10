import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function OrderManagementPage() {
    const { user } = useAuth();
    const destination = ["Admin", "SuperAdmin"].includes(user?.role)
        ? "/admin/orders"
        : "/my-orders";

    return <Navigate to={destination} replace />;
}

export default OrderManagementPage;