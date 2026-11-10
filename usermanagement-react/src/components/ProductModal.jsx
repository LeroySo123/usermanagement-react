import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

export default function ProductModal({
    show,
    product = null,
    onSave,
    onClose,
    saving = false,
    serverErrors = {},
    serverMessage = ""
}) {
    const [name, setName] = useState(product?.name ?? "");
    const [price, setPrice] = useState(product?.price != null ? String(product.price) : "");
    const [clientErrors, setClientErrors] = useState({});

    const isEditing = product !== null;

    function getServerError(field) {
        const key = Object.keys(serverErrors)
            .find(errorKey => errorKey.toLowerCase() === field.toLowerCase());

        return key ? serverErrors[key]?.[0] : "";
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (saving) return;

        const trimmedName = name.trim();
        const errors = {};

        if (!trimmedName) {
            errors.name = "Product name is required.";
        } else if (trimmedName.length > 100) {
            errors.name = "Product name cannot exceed 100 characters.";
        }

        const trimmedPrice = price.trim();
        if (!trimmedPrice) {
            errors.price = "Price is required.";
        } else if (!/^(?:\d{1,16})(?:\.\d{1,2})?$/.test(trimmedPrice) || Number(trimmedPrice) <= 0) {
            errors.price = "Price must be greater than 0 and have no more than 2 decimal places.";
        }

        setClientErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const saved = await onSave({ name: trimmedName, price: Number(trimmedPrice) });
        if (saved && !isEditing) {
            setName("");
            setPrice("");
            setClientErrors({});
        }
    }

    const nameError = clientErrors.name || getServerError("Name");
    const priceError = clientErrors.price || getServerError("Price");

    return (
        <Modal
            show={show}
            onHide={onClose}
            centered
            backdrop={saving ? "static" : true}
            keyboard={!saving}
        >
            <Modal.Header closeButton={!saving}>
                <Modal.Title>{isEditing ? "Edit Product" : "Create Product"}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} noValidate>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            maxLength={100}
                            value={name}
                            isInvalid={!!nameError}
                            onChange={event => {
                                setName(event.target.value);
                                setClientErrors(previous => ({ ...previous, name: "" }));
                            }}
                            disabled={saving}
                        />
                        <Form.Control.Feedback type="invalid">{nameError}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price (GBP)</Form.Label>
                        <Form.Control
                            type="number"
                            min="0.01"
                            max="9999999999999999.99"
                            step="0.01"
                            value={price}
                            isInvalid={!!priceError}
                            onChange={event => {
                                setPrice(event.target.value);
                                setClientErrors(previous => ({ ...previous, price: "" }));
                            }}
                            disabled={saving}
                        />
                        <Form.Control.Feedback type="invalid">{priceError}</Form.Control.Feedback>
                    </Form.Group>
                    {serverMessage && !nameError && !priceError && (
                        <div className="alert alert-danger" role="alert">{serverMessage}</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={saving}>
                        {saving ? (isEditing ? "Saving..." : "Creating...") : (isEditing ? "Save Changes" : "Create Product")}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
