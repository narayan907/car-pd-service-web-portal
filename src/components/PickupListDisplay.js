import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material';
import PDServiceForm from './PickupForm';

const serviceTypeMap = {
  'PICKUP_FROM_CUSTOMER_LOCATION': 'Pickup',
  'DROP_TO_CUSTOMER_LOCATION': 'Drop',
  // Add more mappings as needed
};

const PickupListDisplay = ({ recentPickups = [], onRecentPickupsUpdate, headerText }) => {
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
    }
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {headerText} - {recentPickups?.length || 0} items
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['ID', 'Service Type', 'Customer Details', 'Vehicle Details', 'Pickup Time', 'Service Location', 'Created At', 'Last Updated At', 'Status'].map((header) => (
                <TableCell key={header} align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recentPickups?.length > 0 ? (
              recentPickups.map((pickup, index) => (
                <TableRow
                  key={pickup.id}
                  onClick={() => handleEdit(pickup)}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#e0e0e0' },
                  }}
                >
                  <TableCell align="center">{pickup.id}</TableCell>
                  <TableCell align="center">{serviceTypeMap[pickup.serviceType] || pickup.serviceType}</TableCell>
                  <TableCell align="center">
                    {pickup.customerName}<br />
                    {pickup.customerPhoneNumber}<br />
                    {pickup.customerEmail}
                  </TableCell>
                  <TableCell align="center">
                    {pickup.vehicleNumber}<br />
                    {pickup.vehicleModel}<br />
                    {pickup.vehicleBrand}
                  </TableCell>
                  <TableCell align="center">{new Date(pickup.pickupTime).toLocaleString()}</TableCell>
                  <TableCell align="center">{pickup.serviceLocation}</TableCell>
                  <TableCell align="center">{new Date(pickup.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="center">{new Date(pickup.lastUpdatedAt).toLocaleString()}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      backgroundColor: pickup.status === 'pending' ? '#d3d3d3' : 'inherit',
                    }}
                  >
                    {pickup.status || 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
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
    </div>
  );
};

export default PickupListDisplay; 