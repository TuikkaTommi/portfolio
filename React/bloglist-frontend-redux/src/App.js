import { useEffect, useRef, Fragment } from 'react';
// import Blog from './components/Blog';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import Users from './components/Users';
import BlogList from './components/BlogList';
import UserDetails from './components/UserDetails';
import BlogDetails from './components/BlogDetails';
import NavMenu from './components/NavMenu';
import LoginForm from './components/LoginForm';
import blogService from './services/blogs';

import { setNotification } from './reducers/notificationReducer';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, initializeBlogs } from './reducers/blogReducer';
import { setUser, logout } from './reducers/userReducer';
import { initializeUsers } from './reducers/userListReducer';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const App = () => {
  const dispatch = useDispatch();

  // Initialize blogs with reducer
  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  // Fetch blogs from store to a variable
  const blogs = useSelector((state) => {
    console.log([...state.blogs]);
    return [...state.blogs];
  });

  const user = useSelector((state) => {
    return state.user;
  });

  // Initialize users with reducer
  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  const users = useSelector((state) => state.userList);

  // Check if localStorage already has data of a logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
  }, []);

  // Method to logout, dispatches a logout()-action
  const handleLogout = () => {
    dispatch(logout());
  };

  // Method to add new blog
  const addBlog = (blogObject) => {
    // Hide the blog form by toggling the visibility of togglable-component through ref
    blogFormRef.current.toggleVisibility();

    // Dispatch createblog() action with the new blog object
    dispatch(createBlog(blogObject)).then(() => {
      // Dispatch a notification
      dispatch(
        setNotification(
          `A new blog '${blogObject.title}' by ${blogObject.author} added`,
          4
        )
      );
    });
  };

  // Ref is used to manipulate state inside a component. Here to hide the form after creation of blog
  const blogFormRef = useRef();

  // If no user is logged in, display the login form
  if (user.loggedIn === false) {
    return (
      <Container>
        <LoginForm></LoginForm>
      </Container>
    );
  }

  return (
    <Container fluid className="p-0">
      <Router>
        <NavMenu handleLogout={handleLogout} user={user} />
        <Container fluid className="p-4">
          <Notification />

          <Routes>
            <Route
              path="/"
              element={
                <Fragment>
                  <Togglable
                    id="new-blog"
                    buttonLabel="New blog"
                    ref={blogFormRef}
                  >
                    <BlogForm createBlog={addBlog}></BlogForm>
                  </Togglable>
                  <BlogList blogs={blogs} user={user} />
                </Fragment>
              }
            />
            <Route path="/users" element={<Users users={users} />} />
            <Route path="/users/:id" element={<UserDetails users={users} />} />
            <Route
              path="/blogs/:id"
              element={<BlogDetails user={user} blogs={blogs} />}
            />
          </Routes>
        </Container>
      </Router>
    </Container>
  );
};

export default App;
