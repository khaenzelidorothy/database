import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signin from './index';
import { useSignIn } from './hooks/useSignIn';
import { BrowserRouter as Router } from 'react-router-dom';
const mockNavigate = jest.fn();
jest.mock('./hooks/useSignIn');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
describe('Signin Component', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useSignIn.mockReturnValue({
      phone_number: '',
      setPhoneNumber: jest.fn(),
      password: '',
      setPassword: jest.fn(),
      error: null,
      loading: false,
      handleLogin: jest.fn().mockResolvedValue(true),
    });
  });
  test('renders Signin component correctly', () => {
    render(
      <Router>
        <Signin />
      </Router>
    );
    expect(screen.getByText('Welcome Back!')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone Number :')).toBeInTheDocument();
    expect(screen.getByLabelText('Password:')).toBeInTheDocument();
  });
  test('handles phone number input', async () => {
    const setPhoneNumberMock = jest.fn();
    useSignIn.mockReturnValueOnce({
      phone_number: '',
      setPhoneNumber: setPhoneNumberMock,
      password: '',
      setPassword: jest.fn(),
      error: null,
      loading: false,
      handleLogin: jest.fn().mockResolvedValue(true),
    });
    render(
      <Router>
        <Signin />
      </Router>
    );
    const phoneInput = screen.getByLabelText('Phone Number :');
    expect(phoneInput.value).toBe('');
    await userEvent.type(phoneInput, '0754367895');
    expect(setPhoneNumberMock).toHaveBeenCalled();
  });
  test('toggles password visibility', async () => {
    render(
      <Router>
        <Signin />
      </Router>
    );
    const passwordInput = screen.getByLabelText('Password:');
    const toggleButton = screen.getByTestId('password-toggle');
    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });
  test('handles successful form submission and navigates', async () => {
    const handleLoginMock = jest.fn().mockResolvedValue(true);
    useSignIn.mockReturnValueOnce({
      phone_number: '+250754367895',
      setPhoneNumber: jest.fn(),
      password: 'password123',
      setPassword: jest.fn(),
      error: null,
      loading: false,
      handleLogin: handleLoginMock,
    });
    render(
      <Router>
        <Signin />
      </Router>
    );
    const phoneInput = screen.getByLabelText('Phone Number :');
    const passwordInput = screen.getByLabelText('Password:');
    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(phoneInput.value).toBe('+250754367895');
    expect(passwordInput.value).toBe('password123');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(handleLoginMock).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
  test('displays error message when error is set', () => {
    useSignIn.mockReturnValueOnce({
      phone_number: '',
      setPhoneNumber: jest.fn(),
      password: '',
      setPassword: jest.fn(),
      error: 'Invalid credentials',
      loading: false,
      handleLogin: jest.fn(),
    });
    render(
      <Router>
        <Signin />
      </Router>
    );
    expect(screen.getByText(/Error: Invalid credentials/i)).toBeInTheDocument();
  });
  test('renders loading indicator when loading', () => {
    useSignIn.mockReturnValueOnce({
      phone_number: '',
      setPhoneNumber: jest.fn(),
      password: '',
      setPassword: jest.fn(),
      error: null,
      loading: true,
      handleLogin: jest.fn(),
    });
    render(
      <Router>
        <Signin />
      </Router>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });
});




















