import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { login } from '../utils/apiService'; // Import the login function

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const { jwt, roles } = await login(username, password); // Use the login function
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('roles', JSON.stringify(roles));
      localStorage.setItem('username', username); // Store the username
      onLoginSuccess();
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 5 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
};

export default LoginPage; 