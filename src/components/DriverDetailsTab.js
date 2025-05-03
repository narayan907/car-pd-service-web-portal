import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchDrivers } from '../utils/apiService';

function DriverDetailsTab() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const getDrivers = async () => {
      try {
        const data = await fetchDrivers();
        setDrivers(data);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };

    getDrivers();
  }, []);

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1a237e', fontWeight: 600, mb: 4 }}>
      Our Professional Drivers
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drivers.map(driver => (
              <TableRow key={driver.id}>
                <TableCell>{driver.id}</TableCell>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.phoneNumber}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 3 }}>
        All our drivers are:
      </Typography>
      <Box sx={{ 
        bgcolor: '#f5f5f5',
        p: 3,
        borderRadius: '8px',
        mb: 4
      }}>
        <Typography variant="body1" component="ul" sx={{ fontSize: '1.1rem', lineHeight: 2 }}>
          <li>Professionally licensed with minimum 5 years of experience</li>
          <li>Background verified and certified</li>
          <li>Trained in customer service excellence</li>
          <li>Knowledgeable about various Skoda models and other car brands</li>
          <li>Available 24/7 for pickup services</li>
        </Typography>
      </Box>
      <Typography variant="h5" sx={{ color: '#1a237e', fontWeight: 600, mb: 2 }}>
        Safety Measures
      </Typography>
      <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
        We maintain strict safety protocols including regular vehicle sanitization, 
        GPS tracking, and real-time service updates for your peace of mind.
      </Typography>
    </Box>
  );
}

export default DriverDetailsTab; 