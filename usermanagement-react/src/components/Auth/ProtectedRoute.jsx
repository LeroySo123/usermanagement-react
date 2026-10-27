
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

function ProtectedRoute() {
    const { isAuthenticated, loading, authError } = useAuth();
    const location = useLocation();

    if (loading) {
        return <p>Checking authentication...</p>;
    }

    if (authError) {
        return (
            <div>
                <h2>Authentication service unavailable</h2>
                <p>{authError}</p>
                <button onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return <Outlet />;
}

export default ProtectedRoute;
