import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Dialog, DialogContent, DialogTitle } from '@mui/material';
import PickupListDisplay from './PickupListDisplay';
import { fetchPickupsByDate } from '../utils/apiService';

const ViewScheduleTab = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Retrieve selectedDate from localStorage if available
    return localStorage.getItem('selectedDate') || '';
  });
  const [pickups, setPickups] = useState(() => {
    // Retrieve pickups from localStorage if available
    const savedPickups = localStorage.getItem('pickups');
    return savedPickups ? JSON.parse(savedPickups) : [];
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [responseJson, setResponseJson] = useState(null);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      updatePickups();
    }
  }, [selectedDate]);

  useEffect(() => {
    // Save pickups to localStorage whenever it changes
    localStorage.setItem('pickups', JSON.stringify(pickups));
  }, [pickups]);

  useEffect(() => {
    // Save selectedDate to localStorage whenever it changes
    localStorage.setItem('selectedDate', selectedDate);
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const updatePickups = async () => {
    const data = await fetchPickupsByDate(selectedDate);
    setPickups(data);
    return data;  // Important: Return the Promise
  };

  return (
    <div className="schedule-tab">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          View Pickups
        </Typography>
        <TextField
          sx={{ width: '250px' }}
          margin="normal"
          label="Select Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          onChange={handleDateChange}
          value={selectedDate}
        />
        <PickupListDisplay
          recentPickups={pickups}
          onRecentPickupsUpdate={updatePickups}
          headerText="Pickups Schedule for this date"
          canEdit={true}
          canChangeStatus={true}
        />
      </Box>
    </div>
  );
};

export default ViewScheduleTab; 