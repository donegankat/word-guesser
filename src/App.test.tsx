import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders "Reset" button', () => {
  render(<App />);
  const resetButton = screen.getByText(/Reset/i);
  expect(resetButton).toBeInTheDocument();
});