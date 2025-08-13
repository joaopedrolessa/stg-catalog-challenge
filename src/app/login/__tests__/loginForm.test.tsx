import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../page';

// Mocks
const mockSignIn = jest.fn().mockResolvedValue({ error: null });
const mockPush = jest.fn();

jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({ signIn: mockSignIn }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockSignIn.mockClear();
    mockPush.mockClear();
  });

  it('renderiza campos de e-mail e senha e botão', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continuar/i })).toBeInTheDocument();
  });

  it('chama signIn com email e senha e redireciona', async () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/Senha/i), { target: { value: 'secret123' } });
    fireEvent.click(screen.getByRole('button', { name: /Continuar/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('user@test.com', 'secret123');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });
});
