# Fullstack Bloglist app

This app was made for the Fullstack-open course. This app manages a list of blogs, that users can add. The blogs can be viewed, liked and commented by other users. The creator of the blog can also remove it. The apps architecture consists of MongoDB-database running on MongoDB Atlas, a server made with Express and a frontend made with React. The server is inside [bloglist-backend](https://github.com/TuikkaTommi/portfolio/tree/main/React/bloglist-backend) folder and the frontend is inside [bloglist-frontend-redux](https://github.com/TuikkaTommi/portfolio/tree/main/React/bloglist-frontend-redux) folder. 


## Server

The server was built with Express.js and consists of models, controllers, middlewares and the [main server-file](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/app.js). 

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
