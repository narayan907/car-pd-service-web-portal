import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, Button, Grid, Card, CardContent } from '@mui/material';
import PDServiceForm from './PickupForm';
import { fetchDrivers, updateServiceStatus } from '../utils/apiService';
import PickupTableRow from './PickupTableRow';

const serviceTypeMap = {
  'PICKUP_FROM_CUSTOMER_LOCATION': 'Pickup',
  'DROP_TO_CUSTOMER_LOCATION': 'Drop',
  // Add more mappings as needed
};

const PickupListDisplay = ({ recentPickups = [], onRecentPickupsUpdate, headerText, canEdit, canChangeStatus }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    customerName: '',
    customerPhoneNumber: '',
    customerEmail: '',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleBrand: '',
    serviceType: '',
    pickupTime: '',
    serviceLocation: '',
    status: ''
  });
  const [drivers, setDrivers] = useState([]);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [statusFormData, setStatusFormData] = useState({
    status: '',
    driverId: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const driversData = await fetchDrivers();
        setDrivers(driversData);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setErrorMessage('Failed to load drivers. Please try again later.');
      }
    };
    loadDrivers();
  }, []);

  const handleEdit = (pickup) => {
    setEditFormData(pickup);
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    setEditFormData({
      customerName: '',
      customerPhoneNumber: '',
      customerEmail: '',
      vehicleNumber: '',
      vehicleModel: '',
      vehicleBrand: '',
      serviceType: '',
      pickupTime: '',
      serviceLocation: '',
      status: ''
    });
  };

  const handleFormSuccess = async () => {
    try {
      await onRecentPickupsUpdate();
      handleClose();
    } catch (error) {
      console.error('Error updating pickups:', error);
      setErrorMessage('Failed to update pickups. Please try again later.');
    }
  };

  const handleChangeStatus = (pickup) => {
    setSelectedPickup(pickup);
    setStatusFormData({
      status: pickup.status || '',
      driverId: pickup.driver ? pickup.driver.id : ''
    });
    setOpenStatusDialog(true);
  };

  const handleStatusChange = async () => {
    // console.log('canEdit:', canEdit, 'headerText:', headerText);

    // Validate the form
    if (
      !['ADMIN_CANCELLED', 'PENDING', 'ADMIN_ACCEPTED'].includes(statusFormData.status) &&
      !statusFormData.driverId
    ) {
      setErrorMessage('Please select a driver for this status.');
      return;
    }

    try {
      await updateServiceStatus(selectedPickup.id, statusFormData.driverId, statusFormData.status);
      setOpenStatusDialog(false);
      setErrorMessage('');
      await onRecentPickupsUpdate();
    } catch (error) {
      console.error('Error updating service status:', error);
      setErrorMessage('Failed to update service status. Please try again later.');
    }
  };

  return (
    <div className="pickup-list">
      <Typography variant="h6" gutterBottom>
        {headerText} - {recentPickups?.length || 0} items
      </Typography>
      {recentPickups?.length > 0 ? (
        recentPickups.map((pickup, index) => (
          <PickupTableRow
            key={pickup.id}
            pickup={pickup}
            index={index}
            canEdit={canEdit}
            canChangeStatus={canChangeStatus}
            handleEdit={handleEdit}
            handleChangeStatus={handleChangeStatus}
          />
        ))
      ) : (
        <Typography variant="body1" color="textSecondary" align="center">
          No pickups available.
        </Typography>
      )}
      <Dialog open={openEditDialog} onClose={handleClose}>
        <DialogTitle>Edit Pickup</DialogTitle>
        <DialogContent>
          <PDServiceForm
            formData={editFormData}
            setFormData={setEditFormData}
            onSuccess={handleFormSuccess}
            setOpenDialog={handleClose}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent>
          {selectedPickup && (
            <div style={{ marginBottom: '20px' }}>
              <Typography variant="subtitle1"><strong>Pickup ID:</strong> {selectedPickup.id}</Typography>
              <Typography variant="subtitle1"><strong>Customer:</strong> {selectedPickup.customerName}</Typography>
              <Typography variant="subtitle1"><strong>Vehicle:</strong> {selectedPickup.vehicleModel} - {selectedPickup.vehicleNumber}</Typography>
              <Typography variant="subtitle1"><strong>Current Status:</strong> {selectedPickup.status}</Typography>
            </div>
          )}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <select
                value={statusFormData.status}
                onChange={(e) => setStatusFormData({ ...statusFormData, status: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
              >
                <option value="">Select Status</option>
                <option value="PENDING">PENDING</option>
                <option value="ADMIN_ACCEPTED">ADMIN_ACCEPTED</option>
                <option value="ADMIN_CANCELLED">ADMIN_CANCELLED</option>
                <option value="DRIVER_ASSIGNED">DRIVER_ASSIGNED</option>
                <option value="DRIVER_PICKUP_DONE">DRIVER_PICKUP_DONE</option>
                <option value="DRIVER_DROP_DONE">DRIVER_DROP_DONE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </Grid>
            <Grid item xs={6}>
              <select
                value={statusFormData.driverId}
                onChange={(e) => setStatusFormData({ ...statusFormData, driverId: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </Grid>
          </Grid>
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
              {errorMessage}
            </Typography>
          )}
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleStatusChange}
                fullWidth
              >
                Confirm
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpenStatusDialog(false)}
                fullWidth
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PickupListDisplay; 