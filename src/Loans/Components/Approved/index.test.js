import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Approved from "./index";  

jest.mock("../Hooks/useFetchLoanApplications", () => ({
  __esModule: true,
  default: () => ({
    loanApplications: [
      {
        loan_id: 101,
        user_fullname: "Zayn Shalo",
        national_id: "4364357",
        amount_requested: "4000.00",
        credit_score_at_application: 317.5,
      },
      
    ],
    loading: false,
    error: null,
  }),
}));

beforeEach(() => {

  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "approvedLoans") {
      return JSON.stringify([
        {
          loan_id: 101,
          user_fullname: "Zayn Shalo",
          national_id: "4364357",
          amount_requested: "4000.00",
          credit_score_at_application: 317.5,
        },
      ]);
    }
    if (key === "deniedLoans") return JSON.stringify([]);
    return null;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders Zayn Shalo approved loan with correct details", () => {
  render(
    <BrowserRouter>
      <Approved />
    </BrowserRouter>
  );

  expect(screen.getByText("Loan Applications")).toBeInTheDocument();

  expect(screen.getByText("Zayn Shalo")).toBeInTheDocument();
  expect(screen.getByText("4364357")).toBeInTheDocument();
  expect(screen.getByText("4000.00")).toBeInTheDocument();
  expect(screen.getByText("317.5")).toBeInTheDocument();

  expect(screen.getByText("Approved (1)")).toBeInTheDocument();
});
