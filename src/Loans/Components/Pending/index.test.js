import React from "react";
import { render, screen } from "@testing-library/react";
import Pending from "./index";
import { BrowserRouter } from "react-router-dom";
jest.mock("../Hooks/useFetchLoanApplications", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../Hooks/useUpdateLoanStatus", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useFetchLoanApplications from "../Hooks/useFetchLoanApplications";
import useUpdateLoanStatus from "../Hooks/useUpdateLoanStatus";

describe("Pending Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows Loan Applications header after loading", async () => {
    useFetchLoanApplications.mockReturnValue({
      loading: false,
      error: null,
      loanApplications: [
        {
          loan_id: 1,
          status: "pending_approval",
          user_fullname: "User One",
          amount_requested: 1000,
          credit_score_at_application: 600,
          national_id: "123",
        },
        {
          loan_id: 2,
          status: "pending_approval",
          user_fullname: "User Two",
          amount_requested: 2000,
          credit_score_at_application: 700,
          national_id: "456",
        },
      ],
      fetchLoanApplications: jest.fn(),
    });

    useUpdateLoanStatus.mockReturnValue({
      updateLoanStatus: jest.fn(),
      loading: false,
    });

    render(
      <BrowserRouter>
        <Pending />
      </BrowserRouter>
    );

    const header = await screen.findByText(/Loan Applications/i);
    expect(header).toBeInTheDocument();
  });

  test("shows Pending tab with correct loan count", async () => {
    useFetchLoanApplications.mockReturnValue({
      loading: false,
      error: null,
      loanApplications: [
        { loan_id: 1, status: "pending_approval" },
        { loan_id: 2, status: "pending_approval" },
        { loan_id: 3, status: "approved" },
      ],
      fetchLoanApplications: jest.fn(),
    });

    useUpdateLoanStatus.mockReturnValue({
      updateLoanStatus: jest.fn(),
      loading: false,
    });

    const { container } = render(
      <BrowserRouter>
        <Pending />
      </BrowserRouter>
    );

    const tabs = container.querySelectorAll(".tab");
    const pendingTab = Array.from(tabs).find(
      (tab) => tab.textContent.includes("Pending") && tab.textContent.includes("(2)")
    );

    expect(pendingTab).toBeDefined();
  });
});
