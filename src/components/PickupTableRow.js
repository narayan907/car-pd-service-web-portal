import React from 'react';
import { TableCell, TableRow, Typography, Button } from '@mui/material';

const PickupTableRow = ({ pickup, index, canEdit, canChangeStatus, handleEdit, handleChangeStatus }) => (
  <React.Fragment>
    <TableRow
      sx={{
        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
        cursor: 'pointer',
        '&:hover': { backgroundColor: '#e0e0e0' },
        border: 'none',
        marginBottom: '10px',
        padding: '0',
      }}
    >
      <TableCell colSpan={10} sx={{ padding: '0' }}>
        <div
          style={{
            border: 'none',
            padding: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        >
          <TableRow>
            <TableCell align="center">{pickup.id}</TableCell>
            <TableCell align="center">{pickup.serviceType}</TableCell>
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
          </TableRow>
          <TableRow>
            <TableCell colSpan={5} align="left" sx={{ borderBottom: 'none', paddingLeft: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline-block', marginRight: 1 }}>Status:</Typography>
              <Typography variant="body2" sx={{ display: 'inline-block' }}>{pickup.status || 'N/A'}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', display: 'inline-block', marginLeft: 4, marginRight: 1 }}>Driver Details:</Typography>
              {pickup.driver ? (
                <Typography variant="body2" sx={{ display: 'inline-block' }}>
                  ID: {pickup.driver.id}, Name: {pickup.driver.name}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ display: 'inline-block' }}>N/A</Typography>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={10} align="left">
              {canEdit && (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleEdit(pickup); }}
                  sx={{ marginRight: 1 }}
                >
                  Edit
                </Button>
              )}
              {canChangeStatus && (
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
        </div>
      </TableCell>
    </TableRow>
  </React.Fragment>
);

export default PickupTableRow; 