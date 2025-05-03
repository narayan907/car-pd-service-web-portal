import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Card, CardContent } from '@mui/material';
import { createDriver, updateDriver, deleteDriver, fetchDrivers } from '../utils/apiService';

function ManageDriversTab() {
  const [drivers, setDrivers] = useState([]);
  const [driverForm, setDriverForm] = useState({
    name: '',
    phoneNumber: '',
    licenseNumber: '',
    address: '',
    otherDetails: ''
  });
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const data = await fetchDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverForm({ ...driverForm, [name]: value });
  };

  const handleOpenDialog = (driver = null) => {
    if (driver) {
      setSelectedDriver(driver);
      setDriverForm(driver);
      setIsEditMode(true);
    } else {
      setDriverForm({
        name: '',
        phoneNumber: '',
        licenseNumber: '',
        address: '',
        otherDetails: ''
      });
      setIsEditMode(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedDriver(null);
  };

  const handleConfirm = async () => {
    try {
      if (isEditMode && selectedDriver) {
        await updateDriver(selectedDriver.id, driverForm);
      } else {
        await createDriver(driverForm);
      }
      loadDrivers();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save driver:', error);
    }
  };

  const handleDeleteDriver = async (driverId) => {
    try {
      await deleteDriver(driverId);
      loadDrivers();
    } catch (error) {
      console.error('Failed to delete driver:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#1a237e', fontWeight: 600 }}>
        Manage Drivers
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Total Drivers: {drivers.length}
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ mb: 3 }}>
        Add Driver
      </Button>
      <List>
        {drivers.map((driver) => (
          <Card key={driver.id} sx={{ mb: 2 }}>
            <CardContent>
              <ListItem>
                <ListItemText
                  primary={`ID: ${driver.id} - ${driver.name}`}
                  secondary={
                    <>
                      <div>Phone: {driver.phoneNumber}</div>
                      <div>License: {driver.licenseNumber}</div>
                      <div>Address: {driver.address}</div>
                      <div>Other Details: {driver.otherDetails}</div>
                      <div>Created At: {new Date(driver.createdAt).toLocaleString()}</div>
                      <div>Last Updated At: {new Date(driver.lastUpdatedAt).toLocaleString()}</div>
                    </>
                  }
                />
                <Button variant="outlined" color="secondary" onClick={() => handleOpenDialog(driver)} sx={{ mr: 1 }}>
                  Update
                </Button>
                <Button variant="outlined" color="error" onClick={() => handleDeleteDriver(driver.id)}>
                  Delete
                </Button>
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? 'Update Driver' : 'Add Driver'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {isEditMode ? 'Update the details of the driver and confirm to save changes.' : 'Enter the details of the new driver.'}
          </DialogContentText>
          <TextField
            label="Name"
            name="name"
            value={driverForm.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={driverForm.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="License Number"
            name="licenseNumber"
            value={driverForm.licenseNumber}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Address"
            name="address"
            value={driverForm.address}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Other Details"
            name="otherDetails"
            value={driverForm.otherDetails}
            onChange={handleInputChange}
            fullWidth
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageDriversTab; 