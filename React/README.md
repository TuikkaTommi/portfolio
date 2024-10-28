# Bloglist app - MERN-stack

This app was made for the Fullstack-open course by University of Helsinki. This app manages a list of blogs, that users can add. The blogs can be viewed, liked and commented by other users. The creator of the blog can also remove it. The apps architecture consists of MongoDB-database running on MongoDB Atlas, a server made with Express and a frontend made with React. The server is inside [bloglist-backend](https://github.com/TuikkaTommi/portfolio/tree/main/React/bloglist-backend) folder and the frontend is inside [bloglist-frontend-redux](https://github.com/TuikkaTommi/portfolio/tree/main/React/bloglist-frontend-redux) folder. 

## React frontend

The frontend of this application is made with React and it uses react-redux for handling its main state-management and react-bootstrap for styling. The basic structure of the frontend consists of components, reducers, services, [root-file app.js](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-frontend-redux/src/App.js) and a store.

### Services

The services handle making requests to the server and serve that data to the rest of the application. There are three services; one for blogs, one for logging in and one for user-related functionalities. The services have methods that create http-requests to the server with axios. For example in the [blog-service](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-frontend-redux/src/services/blogs.js) a new blog is sent to the server with the following method:


```
const create = async (newBlog) => {
  // console.log(token);
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  console.log(response);
  return response.data;
};

```

The method takes a blog-object and puts it into the body of a post-request and sends it to the servers endpoint with the users jwt-token in the header.

### Components

Basically all parts of the app are done inside their own components, and the root-file only dictates where and when those components are displayed. Components are inside the [src/components](https://github.com/TuikkaTommi/portfolio/tree/main/React/bloglist-frontend-redux/src/components) directory.

As an example the list of blogs is implemented with two components. [Blog-component](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-frontend-redux/src/components/Blog.js) handles displaying a single blog, while [BlogList-component](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-frontend-redux/src/components/BlogList.js) is its parent and uses it to display the blogs as a list. The BlogList-component receives all the blogs as a prop, and then those blogs use map to create Blog-components for each of them. Data of the specific blog is sent as a prop to the child component. The funtions for liking and deleting a blog are also given to the Blog-component as props.

The funtionality for creating singular blogs is implemented in the following way inside the BlogList-component:

```
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
```

Another note-worthy component is the [Togglable-component](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-frontend-redux/src/components/Togglable.js) that allows toggling the visibility of its child-components.

The component has a state for the visibility status, made with useState():

```
const [visible, setVisible] = useState(false);
```

Then there are two styles for setting the style to either visible or hidden based on that status:

```
const hideWhenVisible = { display: visible ? 'none' : '' };
const showWhenVisible = { display: visible ? '' : 'none' };
```

toggleVisibility() -funtion toggles the value in state and is provided for use outside this component with useImperativeHandle(), so that the toggling can be done from the parent-component:


```
  const toggleVisibility = () => {
    setVisible(!visible);
  };
```

```
  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });
```

A toggle-button and the togglable children are finally displayed in the following way:

```
<div>
      <div style={hideWhenVisible}>
        <Button id={props.id} onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button id="cancel" variant="secondary" onClick={toggleVisibility}>
          Cancel
        </Button>
      </div>
    </div>
  );
```

### State-management

The state-management of this app is a combination of useState for local state and 'react-redux'-library for global state. For the reducers there is [a store-file](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-frontend-redux/src/store.js), that configures a store that contains all the reducers:

```
const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    userList: userListReducer,
  },
});
```

Reducers are inside the [src/reducers](https://github.com/TuikkaTommi/portfolio/tree/main/React/bloglist-frontend-redux/src/reducers) directory. The reducers are separated into separate files by their purpose. All the reducers implement createSlice-method from '@reduxjs/toolkit'-library. The slice and its methods handle actually altering the state. The reducer-files then have separate methods that readies the data to be set to the state. For example one of these methods adds +1 like to an existing blog in the state when a blog is liked, and then sets it to state with the slices method.

The reducer for adding a new blog to state is created inside blogSlice in the following way: 

```
const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    // .....
  },
});
```

This reducer can then be used by dispatching its action. BlogReducer.js has a helper function 'createBlog()' that creates a new blog through the server, and if it succeeds, it calls the reducer:

```
export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  };
};
```

A method in [App.js](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-frontend-redux/src/App.js) receives the blog from a form-component and then sends it to the helper function and also dispatches a notification:

```
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
```

The [blogForm-component](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-frontend-redux/src/components/BlogForm.js) takes users inputs, sets them to local state and creates an object from them. This blog is then sent to the method in App.js that was received in the form-component as a prop.

Similar reducers and processes also exist for manipulating notifications and users in the applications state.

## Server

The server was built with Express.js and consists of models, controllers, middlewares and the [main server-file](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/app.js). Server provides the following endpoints for interacting with the backend:

Blogs:
- GET /blogs/ - provides list of all blogs
- POST /blogs/ - endpoint for adding a new blog. Authenticated with JWT
- PUT /blogs/:id - update a blog with given id
- POST /blogs/:id/comments - add a comment to a blog with given id
- DELETE /blogs/:id - deletes a blog with given id

Users:
- GET /users/ - provides list of all users, and their blogs
- POST /users/ - create new user

Login:
- POST /login/ - validates credentials, and provides a JWT token for the user

### Models

Models made with Mongoose exist for both blogs and users. The users are connected to the blog-model with a ref inside the model:

```
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
```

Data in the blog-model is transformed so that it doesn't return fields _id and __v. The removed fields are unnecessary for the app. The transformation is implemented with the following call to the blogSchema.set()-method:

```
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
```

In the user-model also the passwordHash-field is removed for security reasons.

### Controllers

Inside the server, there are four controllers; one for blogs, one for logins, one for users and one for testing purposes.

The [blog-controller](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/controllers/blogs.js) handles functionalities for managing blogs. There are routes for getting blogs, addding and updating blogs, adding a comment to a blog and deleting blogs. Adding a blog is done by sending a POST-request to /blogs/ -url. The user who posted the blog is extracted from the token sent with the request by using userExtractor-middleware. The blog is then added to the users list of blogs by concatting it to the user.blogs -field. The user is then saved and the new blog is returned in the response. 


Full method for adding new blog:

```
// Add new blog
blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;

  const user = request.user;

  if (!body.title || !body.url) {
    response.status(400).json(body);
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id,
    });

    let savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog.id);
    await user.save();

    savedBlog = await Blog.findById(savedBlog._id).populate('user');

    response.status(201).json(savedBlog);
  }
});

```


The [login-controller](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/controllers/login.js) handles logging an user in. User can be logged in by sending a post request with username and password in its body. The correct user is then fetched from db, and the password is checked against the password designated for the user. Password is saved as a hash, so the comparison is done with bcrypt-librarys compare()-method. If the credential are wrong, a response is sent back with an error 'invalid username or password'. If the credentials are correct, a jwt-token is created for the user and sent to the user within the response.

Full method for logging in:

```
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});
```

[User-controller](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/controllers/users.js) has two methods. One for getting all users and one for creating a new user. Getting all users is a simple GET-request, that returns a list of users. It also populates the blogs-field of users with the blogs' data:


```
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    author: 1,
    title: 1,
    url: 1,
  });
  response.json(users);
});
```

Creating a new user is done with a POST-request, that has username, name and password in its body. Password is validated by checking that it exists and is atleast 3 characters long. If the validation passes, the password is hashed with bcrypt, user is saved into the db and a response succesful response is sent back with the new users data attached.

Full method for creating an user:

```
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password is required, and must be atleast 3 characters long',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

```

The [testing-controller](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/controllers/testing.js) is only available in testing-mode and only has one method for resetting the testing-database:

```
router.post('/reset', async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(204).end();
});
```

### Middlewares

Middlewares are inside the [/utils/middleware.js](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/utils/middleware.js) file. Middlewares are built as separate funtions inside the file, and then exported, so they are available for the controllers. There exists middlewares for logging a request, notifying about an unknown endpoint, handling errors, getting token from a request and extracting an user from a request.

Middlewares that log something into the console use a [helper-file](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/utils/logger.js), that logs given parameters into the console.



