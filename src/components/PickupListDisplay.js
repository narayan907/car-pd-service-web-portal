import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent, Button, Grid, Card, CardContent, Box } from '@mui/material';
import PDServiceForm from './PickupForm';
import { fetchDrivers, updateServiceStatus } from '../utils/apiService';

const serviceTypeMap = {
  'PICKUP_FROM_CUSTOMER_LOCATION': 'PICKUP',
  'DROP_TO_CUSTOMER_LOCATION': 'DROP',
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
  const [userRole, setUserRole] = useState('');

  // Define status categories
  const statusCategoryMap = {
    PENDING: ['PENDING'],
    CANCELLED: ['ADMIN_CANCELLED'],
    INPROGRESS: ['ADMIN_ACCEPTED', 'DRIVER_ASSIGNED', 'DRIVER_PICKUP_DONE', 'DRIVER_DROP_DONE'],
    COMPLETED: ['COMPLETED']
  };

  // Define light background colors for each category
  const categoryColors = {
    PENDING: '#FFFFFF', // White
    CANCELLED: '#FFCDD2', // Light red
    INPROGRESS: '#BBDEFB', // Light blue
    COMPLETED: '#C8E6C9' // Light green
  };

  useEffect(() => {
    // Retrieve user role from local storage
    const storedRoles = JSON.parse(localStorage.getItem('roles'));
    if (storedRoles && storedRoles.length > 0) {
      setUserRole(storedRoles[0]); // Assuming the first role is the primary role
    }
  }, []);

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

  // Calculate the count for each category
  const categoryCounts = Object.keys(statusCategoryMap).reduce((acc, category) => {
    acc[category] = recentPickups.filter(pickup => statusCategoryMap[category].includes(pickup.status)).length;
    return acc;
  }, {});

  return (
    <div className="pickup-list">
      <Typography variant="h6" gutterBottom>
        {headerText} - {recentPickups?.length || 0} items
      </Typography>

      {/* Status Bar */}
      <Card variant="outlined" sx={{ marginBottom: 2 }}>
        <CardContent sx={{ padding: '8px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {Object.entries(categoryCounts).map(([category, count], index) => (
              <Box
                key={category}
                sx={{
                  textAlign: 'center',
                  borderRight: index < Object.entries(categoryCounts).length - 1 ? '1px solid #ccc' : 'none',
                  padding: '4px 8px',
                  marginRight: index < Object.entries(categoryCounts).length - 1 ? 1 : 0,
                  backgroundColor: categoryColors[category],
                  borderRadius: '4px'
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {category}
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>
                  {count}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  width: '10%', 
                  maxWidth: '120px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                ID
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '15%', 
                  maxWidth: '180px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                Service Type
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '15%', 
                  maxWidth: '180px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                Pickup Time
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '15%', 
                  maxWidth: '180px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                From
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '15%', 
                  maxWidth: '180px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                To
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '20%', 
                  maxWidth: '250px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                Customer Details
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '20%', 
                  maxWidth: '250px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                Vehicle Details
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '20%', 
                  maxWidth: '250px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                Driver Details
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '10%', 
                  maxWidth: '120px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                Status
              </TableCell>
              <TableCell 
                sx={{ 
                  width: '20%', 
                  maxWidth: '250px', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden',
                  backgroundColor: '#f0f0f0'
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentPickups?.length > 0 ? (
              recentPickups.map((pickup, index) => {
                const fromAddress = pickup.serviceType === 'PICKUP_FROM_CUSTOMER_LOCATION' ? pickup.serviceLocation : 'ServiceCentre';
                const toAddress = pickup.serviceType === 'PICKUP_FROM_CUSTOMER_LOCATION' ? 'ServiceCentre' : pickup.serviceLocation;
                
                // Determine the category color based on the pickup status
                const category = Object.keys(statusCategoryMap).find(category => 
                  statusCategoryMap[category].includes(pickup.status)
                );
                const rowColor = categoryColors[category] || 'transparent';

                return (
                  <TableRow 
                    key={pickup.id} 
                    sx={{ 
                      backgroundColor: rowColor, 
                      borderBottom: '1px solid black', 
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                  >
                    <TableCell sx={{ width: '10%', maxWidth: '120px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{pickup.id}</TableCell>
                    <TableCell sx={{ width: '15%', maxWidth: '180px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{serviceTypeMap[pickup.serviceType] || pickup.serviceType}</TableCell>
                    <TableCell sx={{ width: '15%', maxWidth: '180px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{new Date(pickup.pickupTime).toLocaleString()}</TableCell>
                    <TableCell sx={{ width: '15%', maxWidth: '180px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{fromAddress}</TableCell>
                    <TableCell sx={{ width: '15%', maxWidth: '180px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{toAddress}</TableCell>
                    <TableCell sx={{ width: '20%', maxWidth: '250px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {pickup.customerName}<br />
                      {pickup.customerPhoneNumber}<br />
                      {pickup.customerEmail}
                    </TableCell>
                    <TableCell sx={{ width: '20%', maxWidth: '250px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {pickup.vehicleNumber}<br />
                      {pickup.vehicleModel}<br />
                      {pickup.vehicleBrand}
                    </TableCell>
                    <TableCell sx={{ width: '20%', maxWidth: '250px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      {pickup.driver ? `${pickup.driver.name} (${pickup.driver.id})` : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ width: '10%', maxWidth: '120px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{pickup.status || 'N/A'}</TableCell>
                    <TableCell sx={{ width: '20%', maxWidth: '250px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Created By: {pickup.createdByName || 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Created At: {new Date(pickup.createdAt).toLocaleString() || 'N/A'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Last Updated At: {new Date(pickup.lastUpdatedAt).toLocaleString() || 'N/A'}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={(e) => { e.stopPropagation(); handleEdit(pickup); }}
                        sx={{ marginRight: 2 }}
                        disabled={!(canEdit && (userRole === 'ROLE_ADMIN' || (userRole === 'ROLE_SC_OPS' && pickup.status === 'PENDING')))}
                      >
                        Edit
                      </Button>
                      {canChangeStatus && userRole === 'ROLE_ADMIN' && (
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={(e) => { e.stopPropagation(); handleChangeStatus(pickup); }}
                        >
                          Change Status
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body1" color="textSecondary">
                    No pickups available.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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