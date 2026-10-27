
import { Routes, Route } from "react-router";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserManagementPage from "./pages/UserManagementPage";
import OrderManagementPage from "./pages/OrderManagementPage";
import NotFoundPage from "./pages/NotFoundPage";

import RequireRole from "./components/auth/RequireRole";

import "./UserModal.css";

function App() {
    return (
        <Routes>

            {/* Public */}
            <Route
                path="/login"
                element={<LoginPage />}
            />


            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route element={<RequireRole allowedRoles={["Admin", "SuperAdmin"]} />}>
                        <Route
                            path="/users"
                            element={<UserManagementPage />}
                        />
                    </Route>

                    <Route element={<RequireRole allowedRoles={["Admin", "SuperAdmin", "User"]} />}>
                        <Route
                            path="/orders"
                            element={<OrderManagementPage />}
                        />
                    </Route>
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );
}

export default App;
