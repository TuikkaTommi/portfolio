import Blog from './Blog';
import { useDispatch } from 'react-redux';
import { likeBlog, removeBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import { ListGroup } from 'react-bootstrap';

const BlogList = ({ blogs, user }) => {
  const dispatch = useDispatch();

  // Method to add a like to a blog
  const addLike = (id, blogObject) => {
    // Dispatch likeBlog()-action and then dispatch a notification
    dispatch(likeBlog(id, blogObject)).then(() => {
      dispatch(
        setNotification(`Added 1 like to blog "${blogObject.title}"`, 4)
      );
    });
  };

  // Method to delete a blog
  const deleteBlog = (blogObject) => {
    if (
      window.confirm(
        `Remove blog "${blogObject.title}" by ${blogObject.author}?`
      )
    ) {
      console.log('Deleting blog with id ', blogObject.id);
      dispatch(removeBlog(blogObject.id)).then(() => {
        dispatch(
          setNotification(
            `Deleted blog "${blogObject.title}" by ${blogObject.author}`,
            4
          )
        );
      });
    } else {
      console.log('Delete canceled');
    }
  };

  if (blogs.length < 1)
    return <p className="text-light mt-2">There are no blogs yet.</p>;

  return (
    <ListGroup className="mt-4">
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={() => addLike(blog.id, blog)}
            deleteBlog={() => deleteBlog(blog)}
            user={user}
          />
        ))}
    </ListGroup>
  );
};

export default BlogList;
