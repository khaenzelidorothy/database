import React, { useState } from 'react';
import { useFetchMembers} from './hooks/useFetchMembers';
import TablePagination from '@mui/material/TablePagination';
import Modal from '@mui/material/Modal';
import './style.css';
const AddMemberModal = ({ open, onClose, onAddMember, member }) => {
  const [fullname, setFullname] = useState(member ? member.fullname : '');
  const [cooperativeId, setCooperativeId] = useState(member ? member.cooperative_id : '');
  const [email, setEmail] = useState(member ? member.email : '');
  const [phoneNumber, setPhoneNumber] = useState(member ? member.phone_number : '');
  const [dateJoined, setDateJoined] = useState(member ? member.created_at : '');
  const handleSubmit = (e) => {
    e.preventDefault();
    const newMember = {
      fullname,
      cooperative_id: cooperativeId,
      email,
      phone_number: phoneNumber,
      last_login: dateJoined,
    };
    onAddMember(newMember);
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="modal-content">
        <h2>{member ? "Edit Member" : "Add New Member"}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullname">Full Name:</label>
            <input
              id="fullname"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="cooperativeId">Cooperative ID:</label>
            <input
              id="cooperativeId"
              type="text"
              value={cooperativeId}
              onChange={(e) => setCooperativeId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="dateJoined">Date Joined:</label>
            <input
              id="dateJoined"
              type="date"
              value={dateJoined}
              onChange={(e) => setDateJoined(e.target.value)}
              required
            />
          </div>
          <button type="submit">{member ? "Update Member" : "Add Member"}</button>
        </form>
      </div>
    </Modal>
  );
};
function MembersDetails({ onSelect = () => {} }) {
 const [search, setSearch] = useState('');
 const { members, loading, error, addMember } = useFetchMembers(search);
 const [page, setPage] = useState(0);
 const [rowsPerPage, setRowsPerPage] = useState(5);
 const [modalOpen, setModalOpen] = useState(false);
 const handleChangePage = (event, newPage) => {
   setPage(newPage);
 };
 const handleChangeRowsPerPage = (event) => {
   setRowsPerPage(parseInt(event.target.value, 10));
   setPage(0);
 };
 const filteredMembers = members.filter(member =>
   member.fullname.toLowerCase().includes(search.toLowerCase())
 );
 const paginatedMembers = filteredMembers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
 const handleAddMember = (newMember) => {
   addMember(newMember);
   setModalOpen(false);
 };
 return (
   <div className="members-table-container">
     <h1><b>Members</b></h1>
     <div className="search-and-info">
       <input
         type="text"
         placeholder="search"
         value={search}
         onChange={e => setSearch(e.target.value)}
         className="search-input"
       />
       <div className="total-members">
         <button className="add-member-button" onClick={() => {
           setModalOpen(true);
         }}>
           + Add Member
         </button>
       </div>
     </div>
     {loading && <div>Loading members...</div>}
     {error && <div style={{ color: 'red' }}>{error}</div>}
     <table className="members-table">
       <thead>
         <tr>
           <th id='first'>Name</th>
           <th>Cooperative ID</th>
           <th>Email</th>
           <th>Phone</th>
           <th id='last'>Date joined</th>
         </tr>
       </thead>
       <tbody >
         {paginatedMembers.length > 0 ? (
           paginatedMembers.map(member => (
             <tr key={member.user_id} id='members-data'>
               <td>{member.fullname}</td>
               <td>{member.cooperative_id}</td>
               <td>{member.email}</td>
               <td>{member.phone_number}</td>
               <td>{(member.last_login ? new Date(member.created_at).toLocaleDateString() : 'N/A')}</td>
             </tr>
           ))
         ) : (
           <tr>
             <td colSpan='5'>No members found.</td>
           </tr>
         )}
       </tbody>
     </table>
     <TablePagination
       rowsPerPageOptions={[5, 10, 25]}
       component="div"
       count={filteredMembers.length}
       rowsPerPage={rowsPerPage}
       page={page}
       onPageChange={handleChangePage}
       onRowsPerPageChange={handleChangeRowsPerPage}
     />
     <AddMemberModal
       open={modalOpen}
       onClose={() => setModalOpen(false)}
       onAddMember={handleAddMember}
     />
   </div>
 );
}
export default MembersDetails;





















