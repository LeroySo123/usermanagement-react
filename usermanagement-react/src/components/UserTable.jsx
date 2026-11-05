import { Table, Button } from 'react-bootstrap';

function UserTable({ users, onEdit, onDelete }) {

    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.roleName}</td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => onEdit(user)}
                                disabled={user.roleId === 3 ? true : false}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => onDelete(user)}
                                disabled={user.roleId === 3 ? true : false}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}

                {users.length === 0 && (
                    <tr>
                        <td colSpan={5}>No users found.</td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}

export default UserTable;
