import Notification from './Notification';
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/userReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  // Method to handle login, dispatches a login()-action with username and password.
  // Then resets username and password, so the form is emptied
  const handleLogin = (event) => {
    event.preventDefault();

    dispatch(login(username, password)).then(() => {
      setUsername('');
      setPassword('');
    });
  };

  return (
    <div>
      <h2 className="mt-4">Log in to application</h2>
      <Notification />
      <Form onSubmit={handleLogin}>
        <Form.Group>
          <Form.Label>Username</Form.Label>

          <Form.Control
            placeholder="Enter username"
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>

          <Form.Control
            placeholder="Enter password"
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>
        <Button className="mt-4" id="login-button" type="submit">
          login
        </Button>
      </Form>
    </div>
  );
};

export default LoginForm;
