import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";


function LoginPage() {
    const [useremail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const { login, isAuthenticated, loading, authError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();


    const from = location.state?.from;
    const returnPath = from
        ? `${ from.pathname}${from.search}${from.hash}`
        : "/";

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setSubmitting(true);

        try {
            await login(useremail, password);
            navigate(returnPath, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return <p>Checking authentication...</p>;
    }

    if (authError) {
        return <p>Authentication service unavailable: {authError}</p>;
    }

    if (isAuthenticated) {
        return <Navigate to={returnPath} replace />;
    }

    return (
        <div className="login-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="useremail">UserEmail</label>
                    <input
                        id="useremail"
                        type="email"
                        autoComplete="useremail"
                        value={useremail}
                        onChange={e => setUserEmail(e.target.value)}
                        required
                        disabled={submitting}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={submitting}
                    />
                </div>

                {error && (
                    <p role="alert" style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button type="submit" disabled={submitting}>
                    {submitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default LoginPage;