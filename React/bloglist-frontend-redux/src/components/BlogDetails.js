import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { likeBlog, removeBlog, addComment } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import { Button, Container, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BlogDetails = ({ user, blogs }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const id = useParams().id;
  console.log('Blog id: ', id);

  console.log('Blogs in blogdetail component: ', blogs);

  const blog = blogs.find((b) => b.id === id);
  console.log('Blog in blogdetail component: ', blog);

  // Method to add a like to a blog
  const addLike = (id, blogObject) => {
    // Dispatch likeBlog()-action and then dispatch a notification
    dispatch(likeBlog(id, blogObject)).then(() => {
      dispatch(
        setNotification(`Added 1 like to blog "${blogObject.title}"`, 4)
      );
    });
  };

  // Method to add new comment
  const sendComment = (event) => {
    event.preventDefault();

    console.log(comment);

    // Call the addComment-action
    dispatch(addComment(blog.id, comment));

    // reset comment to empty string
    setComment('');
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

  if (!blog) return <p>Error viewing blog. This blog might not exist.</p>;

  return (
    <Container>
      <Card bg="secondary" className="fs-4">
        <Card.Header className="fs-3 mb-2 d-flex justify-content-between">
          {blog.title}
          {user.name === blog.user.name && (
            <Button
              className="mb-2"
              variant="danger"
              id="delete-blog"
              onClick={() => deleteBlog(blog)}
            >
              Remove
            </Button>
          )}
        </Card.Header>
        <Container>
          <Card.Text>
            Link to blog:
            <Link to={blog.url} className="text-light ms-2">
              {blog.url}
            </Link>
          </Card.Text>
          <Container className="d-flex align-items-center p-0 mb-2">
            <Card.Text className="mb-0 me-2">{blog.likes} likes</Card.Text>
            <Button size="sm" id="like" onClick={() => addLike(blog.id, blog)}>
              Like
            </Button>
          </Container>
          <Card.Text>
            Added by
            <Link className="text-light ms-2" to={`/users/${blog.user.id}`}>
              {blog.user.name}
            </Link>
          </Card.Text>

          <Card.Title>Comments</Card.Title>
          <Form onSubmit={sendComment}>
            <Form.Control
              type="text"
              name="comment"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
              placeholder="Type your comment.."
            />
            <Button size="sm" type="submit" id="submitComment">
              Add comment
            </Button>
          </Form>
          <ul className="mt-2">
            {blog.comments.map((comment) => {
              return <li key={comment._id}>{comment.content}</li>;
            })}
          </ul>
        </Container>
      </Card>
    </Container>
  );
};

export default BlogDetails;
