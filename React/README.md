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

The [blog-controller](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/controllers/blogs.js) handles functionalities for managing blogs. There are routes for getting blogs, addding and updating blogs, adding a comment to a blog and deleting blogs.


