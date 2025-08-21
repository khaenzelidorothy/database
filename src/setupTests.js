// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

let consoleWarnSpy;

beforeAll(() => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      (
        msg.includes('React Router Future Flag Warning') ||
        msg.includes('Relative route resolution within Splat routes is changing')
      )
    ) {
      
      return;
    }
   
    console.warn(msg, ...args);
  });
});

afterAll(() => {
  if (consoleWarnSpy) {
    consoleWarnSpy.mockRestore();
  }
});
