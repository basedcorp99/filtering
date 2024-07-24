import React, { useEffect, useState } from 'react';
import Home from './Home';

const Login = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const handleLogin = () => {
      const password = prompt('Enter password:');

      const validPassword = 'ASNAJDJ3J434';

      if (password === validPassword) {
        setAuthenticated(true);
      } else {
        alert('Invalid credentials');
      }
    };

    handleLogin();
  }, []);

  if (authenticated) {
    return <Home />;
  }

  return null;
};

export default Login;
