import { Form } from "react-bootstrap";

export default function OrderFilters({ year, onYearChange, status, onStatusChange }) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1999 }, (_, index) => currentYear - index);

    return (
        <div className="d-flex gap-3 mb-3">
            <Form.Group>
                <Form.Label>Year</Form.Label>
                <Form.Select value={year} onChange={event => onYearChange(Number(event.target.value))}>
                    {years.map(value => <option key={value} value={value}>{value}</option>)}
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={event => onStatusChange(event.target.value)}>
                    <option value="">All statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </Form.Select>
            </Form.Group>
        </div>
    );
}
