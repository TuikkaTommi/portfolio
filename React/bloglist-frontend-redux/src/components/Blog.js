import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroupItem } from 'react-bootstrap';

const Blog = ({ blog }) => {
  // Blogs are placed in their own ListGroupItem-elements
  return (
    <ListGroupItem variant="dark" className="blog">
      <Link to={`/blogs/${blog.id}`} className="text-dark">
        {blog.title}, {blog.author}
      </Link>
    </ListGroupItem>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
};

export default Blog;
