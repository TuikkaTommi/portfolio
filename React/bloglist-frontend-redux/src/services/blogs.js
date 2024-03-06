import axios from 'axios';
const baseUrl = '/api/blogs';

// Variable to store the JWT-token
let token = null;

// Method to set the token to the variable
const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

// Method to get all blogs
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

// Method to create a new blog
const create = async (newBlog) => {
  // console.log(token);
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  console.log(response);
  return response.data;
};

// Method to update a blog
const update = async (id, updatedBlog) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog);
  console.log(response);
  return response.data;
};

// Method to add a comment to a blog
const addComment = async (id, comment) => {
  const response = await axios.post(`${baseUrl}/${id}/comments`, {
    comment: comment,
  });
  console.log(response);
  return response.data;
};

// Method to delete blog
const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getAll, setToken, create, update, addComment, deleteBlog };
