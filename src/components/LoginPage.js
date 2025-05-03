import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import { login } from '../utils/apiService'; // Import the login function

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [empname, setEmpname] = useState(''); // New state for employee name
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Validate employee name
    if (empname.length === 0 || empname.length > 15) {
      setError('Employee name must be between 1 and 15 characters');
      return;
    }

    try {
      const { jwt, roles } = await login(username, password); // Use the login function
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('roles', JSON.stringify(roles));
      localStorage.setItem('username', username); // Store the username
      localStorage.setItem('empname', empname); // Store the employee name
      onLoginSuccess();
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Container maxWidth={false} sx={{ px: 0 }}>
      <Box sx={{ 
        width: '100%',
        bgcolor: '#1a237e',
        py: 3,
        px: 4,
        borderRadius: '0 0 16px 16px',
        boxShadow: 3,
        mb: 3,
        background: 'linear-gradient(to right, #1a237e, #283593)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Typography 
            variant="h4"
            component="h1"
            gutterBottom
            align="left"
            sx={{ 
              color: 'white',
              fontWeight: 500,
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: '0.5px',
              mb: 1
            }}
          >
            Yasashvi Logistics
          </Typography>
          <Typography 
            variant="subtitle1"
            component="h2"
            align="left"
            sx={{ 
              color: '#e3f2fd',
              fontWeight: 300,
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: '0.5px',
              opacity: 0.9
            }}
          >
            Schedule your car pickup with ease
          </Typography>
        </div>
      </Box>

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
        <TextField
          fullWidth
          margin="normal"
          label="Enter Employee Name" // Label for the new field
          value={empname}
          onChange={(e) => setEmpname(e.target.value)}
          error={empname.length > 15 || empname.length === 0}
          helperText={empname.length > 15 || empname.length === 0 ? 'Must be 1-15 characters' : ''}
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleLogin} sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage; 