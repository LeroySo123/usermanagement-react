
import { useState } from "react";

function UserModal({
    user,
    roles,
    onSave,
    onClose,
    saving = false,
    serverErrors = {},
    serverMessage = ""
}) {
    const [name, setName] = useState(user?.name ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [password, setPassword] = useState("");
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

    const nameError =
        clientErrors.name || getServerError("Name");

    const emailError =
        clientErrors.email ||
        serverErrors.Email?.[0] ||
        serverErrors.email?.[0] ||
        "";

    const passwordError =
        clientErrors.password || getServerError("Password");

    const roleIdError =
        clientErrors.roleId || getServerError("RoleId");

    return (
        <div className="modal-overlay">
            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="user-modal-title"
            >
                <h2 id="user-modal-title">
                    {isEditing ? "Edit User" : "Add User"}
                </h2>

                <form onSubmit={handleSubmit} noValidate>
                    <label htmlFor="user-name">Name</label>
                    <input
                        id="user-name"
                        type="text"
                        value={name}
                        aria-invalid={!!nameError}
                        aria-describedby={
                            nameError ? "name-error" : undefined
                        }
                        onChange={e => {
                            setName(e.target.value);
                            setClientErrors(prev => ({
                                ...prev,
                                name: ""
                            }));
                        }}
                    />

                    {nameError && (
                        <p id="name-error" className="field-error">
                            {nameError}
                        </p>
                    )}

                    <label htmlFor="user-email">Email</label>
                    <input
                        id="user-email"
                        type="email"
                        value={email}
                        aria-invalid={!!emailError}
                        aria-describedby={
                            emailError ? "email-error" : undefined
                        }
                        onChange={e => {
                            setEmail(e.target.value);
                            setClientErrors(prev => ({
                                ...prev,
                                email: ""
                            }));
                        }}
                    />

                    {emailError && (
                        <p id="email-error" className="field-error">
                            {emailError}
                        </p>
                    )}

                    <label htmlFor="user-password">Password</label>
                    <input
                        id="user-password"
                        type="password"
                        value={password}
                        aria-invalid={!!passwordError}
                        aria-describedby={
                            passwordError ? "password-error" : undefined
                        }
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

                    {passwordError && (
                        <p id="password-error" className="field-error">
                            {passwordError}
                        </p>
                    )}

                    <label htmlFor="user-roleId">Role</label>

                    <select
                        id="user-roleId"
                        value={roleId ?? ""}
                        aria-invalid={!!roleIdError}
                        aria-describedby={
                            roleIdError ? "roleId-error" : undefined
                        }
                        onChange={(e) => {
                            setRoleId(
                                e.target.value === ""
                                    ? null
                                    : Number(e.target.value)
                            );
                            setRoleName(roles.find(r => r.id === Number(e.target.value))?.roleName ?? "");
                            setClientErrors(prev => ({
                                ...prev,
                                roleId: ""
                            }));
                            }
                        }
                    >
                        <option value="">-- Select Role --</option>

                        {roles.map(role => (
                            <option key={role.id} value={role.id}>
                                {role.roleName}
                            </option>
                        ))}
                    </select>

                    {roleIdError && (
                        <p id="roleId-error" className="field-error">
                            {roleIdError}
                        </p>
                    )}

                    {serverMessage &&
                        !nameError &&
                        !emailError &&
                        !passwordError && (
                            <p role="alert" className="field-error">
                                {serverMessage}
                            </p>
                        )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button type="submit" disabled={saving}>
                            {saving
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Add User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UserModal;
