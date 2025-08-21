import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../Dashboard/index';
import { calculateTotals, prepareGeneralBarData, prepareCreditScorePieData } from '../utils/dashboardUtils';
import { fetchUsers } from '../utils/fetchUsersUtils';
import { fetchRepayments } from '../utils/fetchLoanRepaymentUtils';
import { fetchLoans } from '../utils/fetchLoansUtils';
jest.mock('../utils/fetchLoansUtils', () => ({
  fetchLoans: jest.fn(),
}));
jest.mock('../Dashboard/hooks/useDashboardData', () => ({
  useDashboardData: () => ({ loading: true, error: null }),
}));
beforeEach(() => {
  fetchLoans.mockReset();
  global.fetch = jest.fn();
});
describe('dashboardUtils functions', () => {
  test('calculateTotals correctly computes totals', () => {
    const sampleLoans = [
      { loan_id: 1, amount_requested: '1000' },
      { loan_id: 2, amount_requested: '2000' },
    ];
    const sampleRepayments = [
      { loan_repayment_id: 1, amount_paid: '500' },
      { loan_repayment_id: 2, amount_paid: '300' },
    ];
    const sampleUsers = [{ user_id: 1 }, { user_id: 2 }, { user_id: 3 }];
    const totals = calculateTotals(sampleLoans, sampleRepayments, sampleUsers);
    expect(totals.totalAmountRequested).toBe(3000);
    expect(totals.totalRepaymentPaid).toBe(800);
    expect(totals.totalBorrowers).toBe(3);
    expect(totals.totalOutstanding).toBe(2200);
  });
  test('prepareGeneralBarData creates correct labels and dataset', () => {
    const totals = {
      totalAmountRequested: 5000,
      totalRepaymentPaid: 2000,
      totalOutstanding: 3000,
    };
    const barData = prepareGeneralBarData(totals);
    expect(barData.labels).toEqual(['Amount Requested', 'Repayment Paid', 'Outstanding']);
    expect(barData.datasets[0].data).toEqual([5000, 2000, 3000]);
  });
test('prepareCreditScorePieData creates correct pie data', () => {
  const loans = [
    { loan_id: 1, credit_score_at_application: '700' },
    { loan_id: 2, credit_score_at_application: '650' },
    { loan_id: 3, credit_score_at_application: '700' },
    { loan_id: 4 },
  ];
  const pieData = prepareCreditScorePieData(loans);
  expect(pieData.labels.sort()).toEqual(['650', '700', 'Unknown'].sort());
  const idx700 = pieData.labels.indexOf('700');
  const idx650 = pieData.labels.indexOf('650');
  const idxUnknown = pieData.labels.indexOf('Unknown');
  expect(pieData.datasets[0].data[idx700]).toBe(2);
  expect(pieData.datasets[0].data[idx650]).toBe(1);
  expect(pieData.datasets[0].data[idxUnknown]).toBe(1);
  expect(pieData.datasets[0].backgroundColor).toHaveLength(pieData.labels.length);
});
});
describe('Dashboard component', () => {
  test('renders Dashboard heading correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
  test('renders loading message while loans are being fetched', async () => {
    fetchLoans.mockImplementation(() => new Promise(() => {})); // Simulate loading state
    render(<Dashboard />);
    expect(await screen.findByText(/Loading dashboard data/i)).toBeInTheDocument();
  });
  test('renders dashboard successfully with fetched loans', async () => {
    const mockLoansData = [{ loan_id: 1, amount_requested: '1000' }];
    fetchLoans.mockResolvedValue(mockLoansData);
    render(<Dashboard />);
    expect(await screen.findByText(/Dashboard/i)).toBeInTheDocument();
  });
  test('shows loading for slow API response', async () => {
    const slowFetch = new Promise(resolve =>
      setTimeout(() => resolve({ ok: true, json: async () => [] }), 2000)
    );
    global.fetch = jest.fn(() => slowFetch);
    render(<Dashboard />);
    expect(screen.getByText(/Loading dashboard data/i)).toBeInTheDocument();
  });
});
describe('API utility functions', () => {
  test('fetchUsers returns empty array if API returns non-array JSON', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'no users' }),
    });
    const users = await fetchUsers();
    expect(users).toEqual([]);
  });
  test('fetchRepayments returns empty array if API returns non-array JSON', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'no loan repayments' }),
    });
    const repayments = await fetchRepayments();
    expect(repayments).toEqual([]);
  });
  test('fetchUsers returns users array', async () => {
    const mockUsers = [{ user_id: 10 }];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockUsers });
    const users = await fetchUsers();
    expect(users).toEqual(mockUsers);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  test('fetchRepayments returns repayments array', async () => {
    const mockRepayments = [{ repayment_id: 10 }];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockRepayments });
    const repayments = await fetchRepayments();
    expect(repayments).toEqual(mockRepayments);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});









