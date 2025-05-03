import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const PickupTableRow = ({ pickup, index, canEdit, canChangeStatus, handleEdit, handleChangeStatus }) => {
  // Access user roles directly from local storage
  const userRoles = JSON.parse(localStorage.getItem('roles')) || [];

  // Define the service centre address
  const serviceCentre = "service centre";

  // Determine the "from" and "to" addresses based on the serviceType
  const fromAddress = pickup.serviceType === 'PICKUP_FROM_CUSTOMER_LOCATION' ? pickup.serviceLocation : serviceCentre;
  const toAddress = pickup.serviceType === 'PICKUP_FROM_CUSTOMER_LOCATION' ? serviceCentre : pickup.serviceLocation;

  // Determine the background color based on the status
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#b0bec5'; // Grey
      case 'ADMIN_CANCELLED':
        return '#f44336'; // Red
      case 'COMPLETED':
        return '#4caf50'; // Green
      default:
        return '#ffeb3b'; // Yellow for all remaining
    }
  };

  // Determine if the edit button should be disabled
  const isEditDisabled = userRoles.includes('ROLE_SC_OPS') && pickup.status !== 'PENDING';

  return (
    <Card
      sx={{
        marginBottom: '20px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        backgroundColor: '#ffffff',
        padding: '20px',
      }}
    >
      <CardContent>
        <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline', marginRight: 1 }}>ID:</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'inline', marginRight: 4 }}>{pickup.id}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline', marginRight: 1 }}>Service Type:</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'inline', marginBottom: 3 }}>{pickup.serviceType}</Typography>
          <br />
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline', marginRight: 1 }}>Pickup Time:</Typography>
          <Typography variant="body2" sx={{ display: 'inline', marginBottom: 3 }}>
            {new Date(pickup.pickupTime).toLocaleString()}, <strong>From:</strong> {fromAddress}, <strong>To:</strong> {toAddress}
          </Typography>
          <br />
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline', marginRight: 1 }}>Customer Details:</Typography>
          <Typography variant="body2" sx={{ display: 'inline', marginBottom: 3 }}>
            {pickup.customerName}, {pickup.customerPhoneNumber}, {pickup.customerEmail}
          </Typography>
          <br />
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline', marginRight: 1 }}>Vehicle Details:</Typography>
          <Typography variant="body2" sx={{ display: 'inline', marginBottom: 3 }}>
            {pickup.vehicleNumber}, {pickup.vehicleModel}, {pickup.vehicleBrand}
          </Typography>
          <br />
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline', marginRight: 1 }}>Driver Details:</Typography>
          <Typography variant="body2" sx={{ display: 'inline', marginBottom: 3 }}>
            {pickup.driver ? `ID: ${pickup.driver.id}, Name: ${pickup.driver.name}` : 'N/A'}
          </Typography>
          <br />
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline', marginRight: 1 }}>Created By:</Typography>
          <Typography variant="body2" sx={{ display: 'inline', marginBottom: 3 }}>
            {pickup.createdByName || 'N/A'}
          </Typography>
          <br />
          <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline', marginRight: 1 }}>Created At:</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ display: 'inline', marginBottom: 3 }}>
            {new Date(pickup.createdAt).toLocaleString()} | <strong>Last Updated At:</strong> {new Date(pickup.lastUpdatedAt).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ display: 'inline-block', backgroundColor: getStatusColor(pickup.status), borderRadius: '12px', padding: '4px 12px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', textAlign: 'center', marginBottom: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {pickup.status || 'N/A'}
          </Typography>
        </Box>
        <Box sx={{ textAlign: 'right', padding: 2 }}>
          {canEdit && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={(e) => { e.stopPropagation(); handleEdit(pickup); }}
              sx={{ marginRight: 2 }}
              disabled={isEditDisabled}
            >
              Edit
            </Button>
          )}
          {canChangeStatus && userRoles.includes('ROLE_ADMIN') && ( // Check if user has ROLE_ADMIN
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={(e) => { e.stopPropagation(); handleChangeStatus(pickup); }}
            >
              Change Status
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PickupTableRow; 