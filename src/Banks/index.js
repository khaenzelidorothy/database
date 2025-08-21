import React, { useState } from 'react';
import './style.css';
import useFetchBanks from './hooks/useFetchBanks';

const BankList = () => {
  const { banks, loading, error } = useFetchBanks();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const totalPages = Math.ceil(banks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBanks = banks.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (bank_partner_id) => {
    const bank = banks.find((b) => b.bank_partner_id === bank_partner_id);
    if (bank) {
      setSelectedBank(bank);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBank(null);
  };

  if (loading) return <div>Loading banks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="bank-container">
        <h2>OUR PARTNERSHIP BANKS</h2>

        <table className="shared-table">
          <thead>
            <tr>
              <th>Bank Partner</th>
              <th>Outstanding Loan Amount</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {currentBanks.map((bank) => (
              <tr key={bank.bank_partner_id}>
                <td>{bank.bank_name}</td>
                <td>{bank.amount_owed} RWF</td>
                <td>
                  <button
                    className="detailslink"
                    onClick={() => openModal(bank.bank_partner_id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={pageNum === currentPage ? 'active' : ''}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      </div>

      {isModalOpen && selectedBank && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="details-container">
              <h2>
                Bank Partners / <span>{selectedBank.bank_name}</span>
              </h2>

              <div className="summary-box">
                <div>
                  <div className="label"><b>Total Amount Owed</b></div>
                  <div className="value">{selectedBank.amount_owed} RWF</div>
                </div>
                <br />
                <div>
                  <div className="label"><b>Next Payment</b></div>
                  <div className="value">
                    Due Date:{' '}
                    {selectedBank.due_date
                      ? new Date(selectedBank.due_date).toLocaleDateString()
                      : 'N/A'}
                    <br />
                    Amount Due: {selectedBank.amount_owed} RWF
                  </div>
                </div>
              </div>
              <br />
              <div className="details-grid">
                <div>
                  <b>Account Number</b>
                  <br />
                  {selectedBank.bank_account_number}
                </div>
              </div>
              <br />
              <div className="summary-footer">
                <div>
                  <b>Total Amount Paid</b>
                  <br />
                  {selectedBank.amount_paid || 'N/A'} RWF
                </div>
                <br />
                <div>
                  <b>Remaining Balance</b>
                  <br />
                  {selectedBank.amount_remaining || 'N/A'} RWF
                </div>
              </div>
              <button className="modal-bank-close-btn" id = "modal-bank-close-btn"onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BankList;
