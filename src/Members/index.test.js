import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MembersDetails from '.';
const mockAddMember = jest.fn();
jest.mock('./hooks/useFetchMembers', () => ({
  useFetchMembers: (search) => {
    const allMembers = [
      {
        user_id: 1,
        fullname: 'Bonny Umu',
        cooperative_id: 'COOP-0987-7685',
        email: 'umu@gmail.com',
        phone_number: '0723451643',
        created_at: '2025-04-11T09:30:00Z',
        last_login: '2025-04-12T10:00:00Z',
      },
      {
        user_id: 2,
        fullname: 'Umuvandime Julie',
        cooperative_id: 'COOP-6543-0988',
        email: 'vandime@gmail.com',
        phone_number: '0787334329',
        created_at: '2025-04-12T10:45:06Z',
        last_login: '2025-04-13T11:00:00Z',
      },
    ];
    const filteredMembers = allMembers.filter((member) =>
      member.fullname.toLowerCase().includes(search.toLowerCase())
    );
    return {
      members: filteredMembers,
      total: filteredMembers.length,
      loading: false,
      error: null,
      addMember: mockAddMember,
    };
  },
}));
describe('MembersDetails component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('renders members table with initial data', () => {
    render(<MembersDetails />);
    expect(screen.getByText('Bonny Umu')).toBeInTheDocument();
    expect(screen.getByText('Umuvandime Julie')).toBeInTheDocument();
    ['Name', 'Cooperative ID', 'Email', 'Phone', 'Date joined'].forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });
  test('search filters members in the table', async () => {
    render(<MembersDetails />);
    const searchInput = screen.getByPlaceholderText('search');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Julie');
    expect(screen.queryByText('Bonny Umu')).not.toBeInTheDocument();
    expect(screen.getByText('Umuvandime Julie')).toBeInTheDocument();
  });
  test('shows "No members found." message when no matches in search', async () => {
    render(<MembersDetails />);
    const searchInput = screen.getByPlaceholderText('search');
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'Nonexistent Name');
    expect(screen.getByText('No members found.')).toBeInTheDocument();
  });
  test('opens Add Member modal on "+ Add Member" button click', async () => {
    render(<MembersDetails />);
    await userEvent.click(screen.getByText('+ Add Member'));
    expect(screen.getByText('Add New Member')).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cooperative ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date Joined/i)).toBeInTheDocument();
  });
  test('fills and submits Add Member modal form and calls addMember', async () => {
    render(<MembersDetails />);
    await userEvent.click(screen.getByText('+ Add Member'));
    await userEvent.type(screen.getByLabelText(/Full Name/i), 'Test User');
    await userEvent.type(screen.getByLabelText(/Cooperative ID/i), 'COOP-1234');
    await userEvent.type(screen.getByLabelText(/Email/i), 'testuser@example.com');
    await userEvent.type(screen.getByLabelText(/Phone Number/i), '0700000000');
    await userEvent.type(screen.getByLabelText(/Date Joined/i), '2025-08-01');
    await userEvent.click(screen.getByRole('button', { name: /Add Member/i }));
    await waitFor(() => {
      expect(mockAddMember).toHaveBeenCalledWith({
        fullname: 'Test User',
        cooperative_id: 'COOP-1234',
        email: 'testuser@example.com',
        phone_number: '0700000000',
        last_login: '2025-08-01',
      });
      expect(screen.queryByText('Add New Member')).not.toBeInTheDocument();
    });
  });
});









