import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Denied from "./index"; 

jest.mock("../Hooks/useFetchLoanApplications", () => ({
  __esModule: true,
  default: () => ({
    loanApplications: [
      {
        loan_id: 202,
        user_fullname: "Mutaka Brice",
        national_id: "4753964",
        amount_requested: "200000.00",
        credit_score_at_application: 410.0,
        rejectionReason: "Insufficient collateral",
      },
      {
        loan_id: 203,
        user_fullname: "Other User",
        national_id: "123456",
        amount_requested: "50000.00",
        credit_score_at_application: 600,
      },
    ],
    loading: false,
    error: null,
  }),
}));

beforeEach(() => {

  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "deniedLoans") {
      return JSON.stringify([
        {
          loan_id: 202,
          user_fullname: "Mutaka Brice",
          national_id: "4753964",
          amount_requested: "200000.00",
          credit_score_at_application: 410.0,
          rejectionReason: "Insufficient collateral",
        },
      ]);
    }
    if (key === "approvedLoans") return JSON.stringify([]);
    return null;
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders Denied component with Mutaka Brice's loan and correct details", async () => {
  render(
    <BrowserRouter>
      <Denied />
    </BrowserRouter>
  );

  expect(screen.getByText("Loan Applications")).toBeInTheDocument();

  expect(screen.getByText("Denied (1)")).toBeInTheDocument();

  expect(screen.getByText("Mutaka Brice")).toBeInTheDocument();
  expect(screen.getByText("4753964")).toBeInTheDocument();
  expect(screen.getByText("200000.00")).toBeInTheDocument();
  expect(screen.getByText("410")).toBeInTheDocument();

  expect(screen.queryByText("Other User")).not.toBeInTheDocument();

  expect(screen.getByText("Denied")).toBeInTheDocument();

  expect(screen.getByText("Pending (1)")).toBeInTheDocument(); 
  expect(screen.getByText("Approved (0)")).toBeInTheDocument();
});
