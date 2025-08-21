import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserUtils } from '../../utils/fetchUserUtils';

export function useSignIn() {
  const [phone, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!phone || !password) {
      setError('Please enter your phone number and password');
      return false;
    }
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };


  const handleLogin = async () => {
    setError('');
    if (!validate()) return false;
    setLoading(true);
    try {
      const data = await fetchUserUtils(phone, password);
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data));
      navigate('/home');
      return true;
    } catch (e) {
      setError(e.message || 'Login failed, please try again');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {phone, setPhoneNumber,password,setPassword,error,loading,handleLogin,};
}