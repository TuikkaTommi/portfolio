const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
// const User = require('../models/user');
// const jwt = require('jsonwebtoken');
const middleware = require('../utils/middleware');

// Get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

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

// Update a blog
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  }).populate('user');

  response.json(updatedBlog);
});

// Add a comment to blog
blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body;

  // Get the blog to update
  const blog = await Blog.findById(request.params.id).populate('user');

  // Add the comment to the blogs comments
  blog.comments = blog.comments.concat({ content: body.comment });

  // Save the blog
  const savedBlog = await blog.save();

  // Send response
  response.status(200).json(savedBlog);
});

// Delete a blog
blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);

    const user = request.user;

    if (blog.user.toString() === user.id.toString()) {
      user.blogs = user.blogs.filter(
        (b) => b.toString() !== blog.id.toString()
      );

      await user.save();
      await Blog.findByIdAndRemove(request.params.id);
      response.status(204).end();
    } else {
      response.status(400).json({ error: 'token invalid' });
    }
  }
);

module.exports = blogsRouter;
