import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog />', () => {
  let container;

  // Mock-functions for testing
  const addLike = jest.fn();
  const deleteBlog = jest.fn();

  // Mock-blog for testing
  const mockBlog = {
    title: 'Test Blog',
    author: 'Test Author',
    url: 'test-url',
    likes: 120,
    user: {
      name: 'test-user',
    },
  };

  // Mock-user for testing, required because propTypes have defined this prop as required
  const mockUser = {
    name: 'test-user',
    token: 'test-token',
    username: 'test-username',
  };

  beforeEach(() => {
    container = render(
      <Blog
        blog={mockBlog}
        user={mockUser}
        addLike={addLike}
        deleteBlog={deleteBlog}
      />
    ).container;
  });

  test('renders blog title and author', () => {
    // Check that title and author are displayed
    const element = screen.getByText('Test Blog Test Author');
    expect(element).toBeDefined();

    // Check that details are not displayed
    const detaildiv = container.querySelector('#detailDiv');
    expect(detaildiv).toHaveStyle('display: none');
  });

  test('after clicking "View"-button, url, likes and user are shown', async () => {
    // Create a session, so the tests can interact with the component using events
    const user = userEvent.setup();

    // Select and click the button
    const button = screen.getByText('View');
    await user.click(button);

    // Check that details are displayed
    const detaildiv = container.querySelector('#detailDiv');
    expect(detaildiv).not.toHaveStyle('display: none');
  });

  test('clicking "like"-button twice, will call addLike-function twice', async () => {
    // Create a session, so the tests can interact with the component using events
    const user = userEvent.setup();

    // Select and click the button to show details
    const viewButton = screen.getByText('View');
    await user.click(viewButton);

    // Select and click the like-button twice
    const likeButton = screen.getByText('Like');
    await user.click(likeButton);
    await user.click(likeButton);

    expect(addLike.mock.calls).toHaveLength(2);
  });
});
