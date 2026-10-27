import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import "../MainLayout.css";

function MainLayout() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    async function handleLogout() {
        setLogoutError("");
        setLoggingOut(true);

        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            setLogoutError(error.message);
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <div className="app-layout">
            <aside className="sidebar">
                <div className="sidebar-title">
                    Management Portal
                </div>

                <nav className="sidebar-nav">
                    <NavLink to="/" end>
                        Dashboard
                    </NavLink>

                    {["Admin", "SuperAdmin"].includes(user?.role) && (
                        <NavLink to="/users">
                            User Management
                        </NavLink>
                    )}

                    {["Admin", "SuperAdmin", "User"].includes(user?.role) && (
                        <NavLink to="/orders">
                            Order Management
                        </NavLink>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <p>Signed in as</p>
                    <strong>{user?.username}</strong>

                    {logoutError && (
                        <p role="alert">{logoutError}</p>
                    )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                    >
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;
