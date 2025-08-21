export function calculateTotals(loans, repayments, users) {
  const totalAmountRequested = loans.reduce(
    (sum, loan) => sum + Number(loan.amount_requested || 0),
    0
  );
  const totalRepaymentPaid = repayments.reduce(
    (sum, rep) => sum + Number(rep.amount_paid ?? rep.amount ?? 0),
    0
  );
  const totalBorrowers = users.length;
  const totalOutstanding = totalAmountRequested - totalRepaymentPaid;

  return {
    totalAmountRequested,
    totalRepaymentPaid,
    totalBorrowers,
    totalOutstanding,
  };
}

export function prepareGeneralBarData(totals) {
  if (!totals) return { labels: [], datasets: [] };

  return {
    labels: ["Amount Requested", "Repayment Paid", "Outstanding"],
    datasets: [
      {
        label: "Amount (RWF)",
        backgroundColor: ["#2980b9", "#16a085", "#f39c12"],
        data: [
          totals.totalAmountRequested,
          totals.totalRepaymentPaid,
          totals.totalOutstanding,
        ],
      },
    ],
  };
}

export function prepareCreditScorePieData(loans) {
  if (!Array.isArray(loans)) return { labels: [], datasets: [] };

  const freqMap = loans.reduce((acc, loan) => {
    const score = loan.credit_score_at_application ?? "Unknown";
    acc[score] = (acc[score] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(freqMap);
  const data = Object.values(freqMap);
  const backgroundColors = [
    "#16a085", "#2980b9", "#9b59b6", "#f39c12",
    "#e74c3c", "#34495e", "#8e44ad", "#2ecc71",
    "#d35400", "#7f8c8d",
  ].slice(0, labels.length);

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
      },
    ],
  };
}