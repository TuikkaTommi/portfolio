import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    deleteBlog(state, action) {
      console.log(action.payload);
      const removedBlogId = action.payload;
      return state.filter((blog) => blog.id !== removedBlogId);
    },
    updateBlog(state, action) {
      const updatedBlog = action.payload;
      return state.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      );
    },
  },
});

export const { appendBlog, setBlogs, deleteBlog, updateBlog } =
  blogSlice.actions;

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (id, blogObj) => {
  return async (dispatch) => {
    const updatedBlog = { ...blogObj, likes: blogObj.likes + 1 };
    const likedBlog = await blogService.update(id, updatedBlog);

    dispatch(updateBlog(likedBlog));
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    const commentedBlog = await blogService.addComment(id, comment);

    dispatch(updateBlog(commentedBlog));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.deleteBlog(id);
    dispatch(deleteBlog(id));
  };
};

export default blogSlice.reducer;
