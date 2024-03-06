import { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const BlogForm = ({ createBlog }) => {
  // State of the form is now stored in the component
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // Method that creatas a blogObject from the form-values, and then sends it as a parameter to createBlog()-function in app-component
  const addBlog = (event) => {
    event.preventDefault();

    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    // Reset the values to empty
    setNewTitle('');
    setNewAuthor('');
    setNewUrl('');
  };

  // Template for the form
  return (
    <Form onSubmit={addBlog}>
      <Form.Group className="mb-2">
        <Form.Label>Title*</Form.Label>
        <Form.Control
          id="title"
          type="text"
          value={newTitle}
          name="Title"
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder="Enter title here"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Author*</Form.Label>
        <Form.Control
          id="author"
          type="text"
          value={newAuthor}
          name="Author"
          onChange={({ target }) => setNewAuthor(target.value)}
          placeholder="Enter author here"
        />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label>Url*</Form.Label>
        <Form.Control
          id="url"
          type="text"
          value={newUrl}
          name="Url"
          onChange={({ target }) => setNewUrl(target.value)}
          placeholder="Enter url here"
        />
      </Form.Group>
      <Button
        id="submitBlog"
        type="submit"
        disabled={!newTitle || !newAuthor || !newUrl}
      >
        Create
      </Button>
    </Form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
