import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';

const Users = ({ users }) => {
  return (
    <div>
      <h3>Users</h3>
      <Table striped="columns" bordered variant="dark">
        <thead>
          <tr>
            <th>User</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            return (
              <tr key={user.id}>
                <td>
                  <Link className="text-light" to={`/users/${user.id}`}>
                    {' '}
                    {user.name}
                  </Link>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
