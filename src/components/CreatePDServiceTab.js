import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import PickupListDisplay from './PickupListDisplay';
import PDServiceForm from './PickupForm'; // Ensure this import is correct
import { fetchRecentPickups } from '../utils/apiService'; // Import the utility function
import { styled } from '@mui/material/styles'; // Import styled from MUI

const CreatePDServiceTab = ({ preFilledData = {} }) => { // Updated component name
  const initialFormData = {
    customerName: '',
    customerPhoneNumber: '',
    customerEmail: '',
    vehicleNumber: '',
    vehicleModel: '',
    vehicleBrand: 'Skoda', // Default value
    pickupTime: new Date().toISOString().slice(0, 16), // Default to current date and time
    serviceLocation: '',
    createdBy: 'narayan', // Default value for createdBy
    serviceType: 'PICKUP_FROM_CUSTOMER_LOCATION', // Default value
    ...preFilledData // Merge pre-filled data if available
  };

  const [formData, setFormData] = useState(initialFormData);

  const [openDialog, setOpenDialog] = useState(false); // Initially set to false
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [responseJson, setResponseJson] = useState(null);
  const [recentPickups, setRecentPickups] = useState([]);

  useEffect(() => {
    const getRecentPickups = async () => {
      try {
        const data = await fetchRecentPickups(); // Use the utility function
        setRecentPickups(data);
      } catch (error) {
        console.error('Error fetching recent pickups:', error);
      }
    };

    getRecentPickups();
  }, []); // Ensure this runs on page load

  useEffect(() => {
    // Check if preFilledData is actually different before updating state
    setFormData((prevData) => {
      if (JSON.stringify(prevData) !== JSON.stringify({ ...prevData, ...preFilledData })) {
        return {
          ...prevData,
          ...preFilledData
        };
      }
      return prevData;
    });
  }, [preFilledData]); // Ensure this only runs when preFilledData changes

  const updateRecentPickups = async () => {
    const newPickups = await fetchRecentPickups();  // API call
    setRecentPickups(newPickups);  // Updates local state
  };

  // Define a styled button
  const StyledButton = styled(Button)({
    backgroundColor: '#1976d2', // Primary color
    color: '#fff', // White text
    padding: '10px 20px', // Increase padding
    fontSize: '16px', // Larger font size
    fontWeight: 'bold', // Bold text
    borderRadius: '8px', // Rounded corners
    boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)', // Add shadow
    margin: '20px 0', // Add vertical spacing
    '&:hover': {
      backgroundColor: '#115293', // Darker shade on hover
    },
  });

  return (
    <div className="create-service-tab">
      <StyledButton onClick={() => {
        setFormData(initialFormData); // Reset form data
        setOpenDialog(true);
      }}>
        Create New Pickup
      </StyledButton>
      <PickupListDisplay
        recentPickups={recentPickups}
        onRecentPickupsUpdate={updateRecentPickups}
        headerText="Today's Created Pickups"
        canEdit={true}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>Create Pickup</DialogTitle>
        <DialogContent>
          <PDServiceForm
            formData={formData}
            setFormData={setFormData}
            setOpenDialog={setOpenDialog}
            setResponseJson={setResponseJson}
            setOpenSuccessDialog={setOpenSuccessDialog}
            onRecentPickupsUpdate={updateRecentPickups}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePDServiceTab; // Updated export 