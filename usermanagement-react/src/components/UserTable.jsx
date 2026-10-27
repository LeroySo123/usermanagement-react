
function UserTable({ users, onEdit, onDelete }) {

    return (
        <table>
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
                            <button
                                type="button"
                                onClick={() => onEdit(user)}
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => onDelete(user)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}

                {users.length === 0 && (
                    <tr>
                        <td colSpan={4}>No users found.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default UserTable;
