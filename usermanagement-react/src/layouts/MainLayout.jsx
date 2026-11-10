import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Button, Offcanvas, Nav } from "react-bootstrap";

import { useAuth } from "../contexts/AuthContext";
import "../MainLayout.css";

function MainLayout() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [showMenu, setShowMenu] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState("");

    function closeMenu() {
        setShowMenu(false);
    }

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

    // Shared Sidebar Content
    const sidebarContent = (
        <>
            <div className="sidebar-title">
                Management Portal
            </div>

            <Nav className="sidebar-nav flex-column">

                <Nav.Link
                    as={NavLink}
                    to="/"
                    end
                    onClick={closeMenu}
                >
                    Dashboard
                </Nav.Link>

                {["Admin", "SuperAdmin"].includes(user?.role) && (
                    <Nav.Link
                        as={NavLink}
                        to="/users"
                        onClick={closeMenu}
                    >
                        User Management
                    </Nav.Link>
                )}

                {["Admin", "SuperAdmin"].includes(user?.role) && (
                    <Nav.Link
                        as={NavLink}
                        to="/admin/products"
                        onClick={closeMenu}
                    >
                        Product Management
                    </Nav.Link>
                )}

                {["Admin", "SuperAdmin", "User"].includes(user?.role) && (
                    <Nav.Link
                        as={NavLink}
                        to="/orders"
                        onClick={closeMenu}
                    >
                        Order Management
                    </Nav.Link>
                )}

            </Nav>

            <div className="sidebar-footer">

                <p>Signed in as</p>
                <strong>{user?.username}</strong>

                {logoutError && (
                    <p className="logout-error" role="alert">
                        {logoutError}
                    </p>
                )}

                <Button
                    variant="outline-light"
                    className="logout-button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                >
                    {loggingOut ? "Logging out..." : "Logout"}
                </Button>

            </div>
        </>
    );

    return (
        <div className="app-layout">

            {/* Desktop Sidebar */}
            <aside className="sidebar d-none d-lg-flex">
                {sidebarContent}
            </aside>

            {/* Mobile Top Navbar */}
            <div className="mobile-header d-lg-none">

                <span className="mobile-title">
                    Management Portal
                </span>

                <Button
                    variant="dark"
                    onClick={() => setShowMenu(true)}
                    aria-label="Open navigation menu"
                >
                    ☰
                </Button>

            </div>

            {/* Mobile Sidebar */}
            <Offcanvas
                show={showMenu}
                onHide={closeMenu}
                placement="start"
                className="mobile-sidebar d-lg-none"
                data-bs-theme="dark"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        Management Portal
                    </Offcanvas.Title>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0 d-flex flex-column">
                    {sidebarContent}
                </Offcanvas.Body>

            </Offcanvas>

            {/* Main Content */}
            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}


export default MainLayout;
