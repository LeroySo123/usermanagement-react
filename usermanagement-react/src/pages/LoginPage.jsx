import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";


export default function SignIn() {
    const [useremail, setUserEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const { login, isAuthenticated, loading, authError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();


    const from = location.state?.from;
    const returnPath = from
        ? `${from.pathname}${from.search}${from.hash}`
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
        // Use Flexbox to center the card horizontally and vertically on the screen
        <div className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '100vh' }}>
            <Container style={{ maxWidth: '400px' }}>
                <Card className="shadow-sm border-0 p-4 rounded-3">
                    <Card.Body>
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-dark">Welcome</h2>
                            <p className="text-muted small">Please enter your credentials</p>
                        </div>

                        <Form onSubmit={handleSubmit}>
                            {/* Email Input (Using Floating Labels) */}
                            <Form.Group className="form-floating mb-3" controlId="formBasicEmail">
                                <Form.Control
                                    type="email"
                                    placeholder="name@example.com"
                                    value={useremail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    required
                                />
                                <label className="text-muted">Email address</label>
                            </Form.Group>

                            {/* Password Input */}
                            <Form.Group className="form-floating mb-3" controlId="formBasicPassword">
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label className="text-muted">Password</label>
                            </Form.Group>

                            {error && (
                                <p role="alert" style={{ color: "red" }}>
                                    {error}
                                </p>
                            )}

                            {/* Login Button */}
                            <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold shadow-sm" disabled={submitting}>
                                {submitting ? "Logging in..." : "Login"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}
