import { render, screen, waitFor } from '@testing-library/react';
import App from './App';


let consoleWarnSpy;


beforeAll(() => {


consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation((message, ...args) => {
if (
typeof message === 'string' &&
(message.includes('React Router Future Flag Warning') ||
message.includes('Relative route resolution within Splat routes is changing'))
) {
return;
}
console.warn(message, ...args);
});
});


afterAll(() => {
if (consoleWarnSpy) {
consoleWarnSpy.mockRestore();
}
});


beforeEach(() => {
global.fetch = jest.fn(() =>
Promise.resolve({
ok: true,
json: () =>
Promise.resolve([
{
bank_partner_id: 1,
bank_name: 'Equity Bank',
amount_owed: '2000000.00',
amount_paid: '500000.00',
amount_remaining: '1500000.00',
bank_account_number: 'EQ1234567',
due_date: '2025-07-24T06:38:00Z',
},
]),
})
);
});


afterEach(() => {
jest.resetAllMocks();
});


test('renders Agricreds text', async () => {
render(<App />);
const agricredsElem = await screen.findByText(/Agricreds/i);
expect(agricredsElem).toBeInTheDocument();
});

