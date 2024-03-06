import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

describe('<BlogForm />', () => {
  test('once submitted, calls createNote with correct data', async () => {
    // Create a session, so the tests can interact with the component using events
    const user = userEvent.setup();

    // Mock function
    const createBlog = jest.fn();

    render(<BlogForm createBlog={createBlog} />);

    // Get inputs and submit button into variables
    const titleInput = screen.getByPlaceholderText('Type title here');
    const authorInput = screen.getByPlaceholderText('Type author here');
    const urlInput = screen.getByPlaceholderText('Type url here');
    const sendButton = screen.getByText('Create');

    // Type into the form and submit it
    await user.type(titleInput, 'Test Title');
    await user.type(authorInput, 'Test Author');
    await user.type(urlInput, 'Test URL');
    await user.click(sendButton);

    // Check that createBlog was called properly
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe('Test Title');
    expect(createBlog.mock.calls[0][0].author).toBe('Test Author');
    expect(createBlog.mock.calls[0][0].url).toBe('Test URL');
  });
});
