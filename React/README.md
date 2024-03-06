# Fullstack Bloglist app

This app was made for the Fullstack-open course. This app manages a list of blogs, that users can add. The blogs can be viewed, liked and commented by other users. The creator of the blog can also remove it. The apps architecture consists of MongoDB-database running on MongoDB Atlas, a server made with Express and a frontend made with React. The server is inside [bloglist-backend](https://github.com/TuikkaTommi/portfolio/tree/main/React/bloglist-backend) folder and the frontend is inside [bloglist-frontend-redux](https://github.com/TuikkaTommi/portfolio/tree/main/React/bloglist-frontend-redux) folder. 


## Server

The server was built with Express.js and consists of models, controllers, middlewares and the [main server-file](https://github.com/TuikkaTommi/portfolio/blob/main/React/bloglist-backend/app.js). Models made with Mongoose exist for both blogs and users. The users are connected to the blog with a ref inside the model:

```
user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
```
