import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('toggles the mobile menu and closes it on Escape', () => {
    render(<Navbar />);
    expect(
      screen.queryByRole('navigation', { name: 'Navegação mobile' }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Abrir menu de navegação/i }));
    expect(
      screen.getByRole('navigation', { name: 'Navegação mobile' }),
    ).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(
      screen.queryByRole('navigation', { name: 'Navegação mobile' }),
    ).not.toBeInTheDocument();
  });
});
