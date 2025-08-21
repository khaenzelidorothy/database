import { useState, useEffect } from 'react';
import { getMembers } from '../../utils/fetchMemberDetails';

export function useFetchMembers(search = '') {
  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getMembers(search)
      .then(data => {
        setMembers(Array.isArray(data) ? data : []);
        setTotal(Array.isArray(data) ? data.length : 0);
        setLoading(false);
        setError(null);
      })
      .catch((err) => {
        setMembers([]);
        setTotal(0);
        setLoading(false);
        setError(err.message || 'Error fetching members');
      });
  }, [search]);

    const addMember = (newMember) => {
    setMembers(prevMembers => [newMember, ...prevMembers]);
    setTotal(prevTotal => prevTotal + 1);
  };

  return { members, total, loading, error, addMember };
}
