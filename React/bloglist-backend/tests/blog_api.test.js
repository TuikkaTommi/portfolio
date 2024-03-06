const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Declaring a variable, where token is stored, so it doesn't need to be generated for each test
let loggedInToken = '';

beforeEach(async () => {
  // First delete all blogs from db, then add initialBlogs to db
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);

  // Remove all users from db
  await User.deleteMany({});

  // Create new user to the db
  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();

  // Log the user in
  const userToLogin = {
    username: 'root',
    password: 'sekret',
  };

  const loginResponse = await api
    .post('/api/login')
    .send(userToLogin)
    .expect(200);

  // Set received token into the variable
  loggedInToken = loginResponse.body.token;
});

describe('When blogs are fetched', () => {
  test('blogs are returned as json', async () => {
    // Get all blogs
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('correct amount of blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('blogs should have an id', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('When adding a new blog', () => {
  test('a new blog can be added', async () => {
    const newBlog = {
      title: 'A fancy, brand new blog',
      author: 'Pro Author',
      url: 'Blog url',
      likes: 98,
    };

    // Send new blog to db
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain('A fancy, brand new blog');
  });

  test('a new blog with no "likes"-value given, will have 0 likes', async () => {
    const newBlogWithoutLikes = {
      title: 'This blog was not given property "likes"',
      author: 'Some author',
      url: 'Url to blog',
    };

    await api
      .post('/api/blogs')
      .send(newBlogWithoutLikes)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find((blog) => {
      return blog.title === newBlogWithoutLikes.title;
    });

    expect(addedBlog.likes).toEqual(0);
  });

  test('a new blog without title will return 400 - Bad Request', async () => {
    const newBlogWithoutTitle = {
      author: 'Some author',
      url: 'Url to blog',
      likes: 3,
    };

    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test('a new blog without url will return 400 - Bad Request', async () => {
    const newBlogWithoutUrl = {
      title: 'This blog has no url',
      author: 'Some author',
      likes: 3,
    };

    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

describe('When blogs are deleted', () => {
  test('deleting a blog succeeds with status code 204 if id is valid', async () => {
    // New blog
    const newBlog = {
      title: 'This blog was created to be deleted',
      author: 'Author',
      url: 'Blog url',
      likes: 98,
    };

    // Create new blog to delete
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAfterNewBlog = await helper.blogsInDb();
    const blogToDelete = blogsAfterNewBlog[blogsAfterNewBlog.length - 1];

    // Delete the blog
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${loggedInToken}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

  test('deleting a blog fails with status code 401, if no token is provided', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    // Deletion without token
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);
  });
});

describe('When blogs are updated', () => {
  test('blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedBlog = {
      title: 'This blog was updated',
      author: 'Author was also updated',
      url: 'updated url',
      likes: 10000,
    };

    // Updating the blog
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd[0].title).toEqual(updatedBlog.title);
    expect(blogsAtEnd[0].author).toEqual(updatedBlog.author);
    expect(blogsAtEnd[0].url).toEqual(updatedBlog.url);
    expect(blogsAtEnd[0].likes).toEqual(updatedBlog.likes);
  });
});

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password missing', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserWithoutPw = {
      username: 'root',
      name: 'Superuser',
    };

    const result = await api
      .post('/api/users')
      .send(newUserWithoutPw)
      .expect(400);

    expect(result.body.error).toContain(
      'password is required, and must be atleast 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if password is less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserWithShortPw = {
      username: 'root',
      name: 'Superuser',
      password: 'as',
    };

    const result = await api
      .post('/api/users')
      .send(newUserWithShortPw)
      .expect(400);

    expect(result.body.error).toContain(
      'password is required, and must be atleast 3 characters long'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username does not exist', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUserWithoutUsername = {
      name: 'Superuser',
      password: 'salasana',
    };

    const result = await api
      .post('/api/users')
      .send(newUserWithoutUsername)
      .expect(400);

    expect(result.body.error).toContain(
      'User validation failed: username: Path `username` is required.'
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
