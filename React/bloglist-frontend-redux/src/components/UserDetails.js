import { Link, useParams } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

const UserDetails = ({ users }) => {
  const id = useParams().id;
  console.log('User id: ', id);

  console.log('users in detail component:', users);

  const user = users.find((u) => u.id === id);
  console.log(user);

  if (!user) return null;

  return (
    <div>
      <h2>{user.name}</h2>
      <h4>Added blogs</h4>
      <ListGroup>
        {user.blogs.map((blog) => {
          return (
            <ListGroup.Item key={blog.id} variant="dark">
              <Link className="text-dark" to={`/blogs/${blog.id}`}>
                {blog.title}
              </Link>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default UserDetails;
