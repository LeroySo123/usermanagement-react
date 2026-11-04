
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Modal } from 'react-bootstrap';

function UserModal({
    user,
    roles,
    onSave,
    onClose,
    saving = false,
    serverErrors = {},
    serverMessage = "",
    showModal
}) {
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [roleId, setRoleId] = useState(user?.roleId ?? null);
    const [roleName, setRoleName] = useState(user?.roleName ?? "");

    const [clientErrors, setClientErrors] = useState({});

    const isEditing = user !== null;

    // Case-insensitive lookup for ASP.NET Core field names
    function getServerError(field) {
        const key = Object.keys(serverErrors)
            .find(k => k.toLowerCase() === field.toLowerCase());

        return key ? serverErrors[key]?.[0] : "";
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (saving) return;

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        const errors = {};

        if (!trimmedName) {
            errors.name = "Name is required.";
        }
        else if (trimmedName.length > 50) {
            errors.name = "Name cannot exceed 50 characters.";
        }

        if (!trimmedEmail) {
            errors.email = "Email is required.";
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            errors.email = "Invalid email address.";
        }
        else if (trimmedEmail.length > 50) {
            errors.email = "Email cannot exceed 50 characters.";
        }

        var passwordError = validatePassword(password, isEditing);
        if (passwordError) {
            errors.password = passwordError;
        }

        var confirmPasswordError = validateConfirmPassword(confirmPassword, isEditing, password);
        if (confirmPasswordError) {
            errors.confirmPassword = confirmPasswordError;
        }


        if (roleId == null) {
            errors.roleId = "Role is required.";
        }

        setClientErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        onSave({
            name: trimmedName,
            email: trimmedEmail,
            password: isEditing
                ? (password || null)
                : password,
            roleId,
            roleName
        });
    }


    function validatePassword(password, isEditing) {
        if (!isEditing && password === "") {
            return "Password is required.";
        }

        // Edit mode: empty password means no change
        if (isEditing && password === "") {
            return "";
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/;

        if (!passwordRegex.test(password)) {
            return "Password must be at least 6 characters and contain uppercase, lowercase, and numeric characters.";
        }

        return "";
    }

    function validateConfirmPassword(confirmPassword, isEditing, password) {
        if (!isEditing && confirmPassword === "") {
            return "Confirm Password is required.";
        }

        // Edit mode: empty password means no change
        if (isEditing && password === "" && confirmPassword === "") {
            return "";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }

        return "";
    }

    const nameError =
        clientErrors.name || getServerError("Name");

    const emailError =
        clientErrors.email ||
        serverErrors.Email?.[0] ||
        serverErrors.email?.[0] ||
        "";

    const passwordError =
        clientErrors.password || getServerError("Password");

    const confirmPasswordError =
        clientErrors.confirmPassword || getServerError("ConfirmPassword");

    const roleIdError =
        clientErrors.roleId || getServerError("RoleId");

    return (

        <Modal
            show={showModal}
            onHide={onClose}
            centered
            backdrop={saving ? "static" : true}
            keyboard={!saving}
        >
            <Modal.Header closeButton={!saving}>
                <Modal.Title>
                    {isEditing ? "Edit User" : "Add User"}
                </Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            isInvalid={!!nameError}
                            onChange={e => {
                                setName(e.target.value);
                                setClientErrors(prev => ({
                                    ...prev,
                                    name: ""
                                }));
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {nameError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            isInvalid={!!emailError}
                            onChange={e => {
                                setEmail(e.target.value);
                                setClientErrors(prev => ({
                                    ...prev,
                                    email: ""
                                }));
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {emailError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            isInvalid={!!passwordError}
                            onChange={e => {
                                setPassword(e.target.value);
                                setClientErrors(prev => ({
                                    ...prev,
                                    password: ""
                                }));
                            }}
                            onBlur={() => {
                                setClientErrors(
                                    validatePassword(password, isEditing)
                                );
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {passwordError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            isInvalid={!!confirmPasswordError}
                            onChange={e => {
                                setConfirmPassword(e.target.value);
                                setClientErrors(prev => ({
                                    ...prev,
                                    confirmPassword: ""
                                }));
                            }}
                        />
                        <Form.Control.Feedback type="invalid">
                            {confirmPasswordError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Select
                            value={roleId ?? ""}
                            isInvalid={!!roleIdError}
                            onChange={e => {
                                const selectedId = e.target.value === ""
                                    ? null
                                    : Number(e.target.value);

                                setRoleId(selectedId);
                                setRoleName(
                                    roles.find(r => r.id === selectedId)?.roleName ?? ""
                                );
                                setClientErrors(prev => ({
                                    ...prev,
                                    roleId: ""
                                }));
                            }}
                        >
                            <option value="">-- Select Role --</option>

                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.roleName}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {roleIdError}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {serverMessage &&
                        !nameError &&
                        !emailError &&
                        !passwordError && (
                            <div className="alert alert-danger" role="alert">
                                {serverMessage}
                            </div>
                        )}
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : isEditing
                                ? "Save Changes"
                                : "Add User"}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>

    );
}

export default UserModal;
