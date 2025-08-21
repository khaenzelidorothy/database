import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import BankList from './index.js';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  fetch.resetMocks();
});

const mockBanksData = [
  {
    bank_partner_id: 1,
    bank_name: 'Equity Bank',
    amount_owed: '2000000.00',
    amount_paid: '500000.00',
    amount_remaining: '1500000.00',
    bank_account_number: 'EQ1234567',
    due_date: '2025-07-24T06:38:00Z',
  },
  {
    bank_partner_id: 2,
    bank_name: 'Cogebanque',
    amount_owed: '3000000.00',
    amount_paid: '1000000.00',
    amount_remaining: '2000000.00',
    bank_account_number: 'CG1234567',
    due_date: '2025-08-15T00:00:00Z',
  },
];

const renderBankList = () =>
  render(
    <BrowserRouter>
      <BankList />
    </BrowserRouter>
  );

describe('BankList Component', () => {
  test('displays loading state initially', async () => {
    fetch.mockResponseOnce(JSON.stringify([]));
    renderBankList();
    expect(screen.getByText(/Loading banks/i)).toBeInTheDocument();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  });

  test('displays error message when fetch fails', async () => {
    fetch.mockRejectOnce(new Error('Failed to fetch'));
    renderBankList();
    const errorMessage = await screen.findByText(/Error: Failed to fetch/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('renders bank list correctly after successful fetch', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockBanksData));
    renderBankList();
    expect(await screen.findByText(/OUR PARTNERSHIP BANKS/i)).toBeInTheDocument();
    expect(screen.getByText('Equity Bank')).toBeInTheDocument();
    expect(screen.getByText('2000000.00 RWF')).toBeInTheDocument();
    expect(screen.getByText('Cogebanque')).toBeInTheDocument();
    expect(screen.getByText('3000000.00 RWF')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /View Details/i })).toHaveLength(2);
  });

  test('opens modal with correct bank details and closes on overlay click', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockBanksData));
    const { container } = renderBankList();
    await screen.findByText('Equity Bank');

  
    fireEvent.click(screen.getAllByText(/View Details/i)[0]);

    const modalHeader = await screen.findByRole('heading', { name: /Bank Partners.*Equity Bank/i });
    expect(modalHeader).toBeInTheDocument();

    expect(screen.getByText(/Total Amount Owed/i)).toBeInTheDocument();

    const modal = screen.getByRole('dialog');
    const amounts = within(modal).getAllByText(/2000000.00 RWF/i);
    expect(amounts.length).toBeGreaterThan(1);

    expect(screen.getByText(/Due Date:/i)).toHaveTextContent(/7\/24\/2025/);
    expect(screen.getByText(/Account Number/i).closest('div')).toHaveTextContent('EQ1234567');
    expect(screen.getByText(/Total Amount Paid/i).closest('div')).toHaveTextContent('500000.00 RWF');
    expect(screen.getByText(/Remaining Balance/i).closest('div')).toHaveTextContent('1500000.00 RWF');

   
    const modalOverlay = container.querySelector('.modal-overlay');
    fireEvent.click(modalOverlay);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  test('closes modal when close button is clicked', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockBanksData));
    renderBankList();
    await screen.findByText('Equity Bank');

    
    fireEvent.click(screen.getAllByText(/View Details/i)[0]);

   
    const closeButton = screen.getByRole('button', { name: /close/i }); 
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
