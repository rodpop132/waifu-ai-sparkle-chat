
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('waifu_user');
    if (user) {
      navigate('/chat');
    } else {
      navigate('/');
    }
  }, [navigate]);

  return null;
};

export default Index;
