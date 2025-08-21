import { useState, useEffect } from 'react';
import { fetchBankDetails } from '../../utils/fetchBankDetails';


const useFetchBanks = () => {
 const [banks, setBanks] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);


 useEffect(() => {
   async function getBanks() {
     try {
       const data = await fetchBankDetails();
       setBanks(data);
     } catch (err) {
       setError(err.message);
     } finally {
       setLoading(false);
     }
   }
   getBanks();
 }, []);


 return { banks, loading, error };
};


export default useFetchBanks;