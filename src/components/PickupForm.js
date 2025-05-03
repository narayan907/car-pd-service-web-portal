import React, { useState } from 'react';
import { TextField, Button, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { createPickup, updatePickup, deletePickup, fetchRecentPickups } from '../utils/apiService';

const PDServiceForm = ({ formData, setFormData, setOpenDialog, setResponseJson, setOpenSuccessDialog, onRecentPickupsUpdate, onSuccess }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Customer Name Validation
    if (!formData.customerName || formData.customerName.length < 3 || formData.customerName.length > 50) {
      newErrors.customerName = 'Customer name must be between 3 and 50 characters.';
    }

    // Customer Phone Number Validation
    const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    if (!formData.customerPhoneNumber || !phoneRegex.test(formData.customerPhoneNumber)) {
      newErrors.customerPhoneNumber = 'Enter a valid Indian mobile or landline number.';
    }

    // Customer Email Validation
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Enter a valid email address.';
    }

    // Vehicle Number Validation
    const vehicleNumberRegex = /^[^\s]{5,16}$/;
    if (!formData.vehicleNumber || !vehicleNumberRegex.test(formData.vehicleNumber)) {
      newErrors.vehicleNumber = 'Enter a valid vehicle number with 5 to 16 characters and no spaces.';
    }

    // Vehicle Model Validation
    if (formData.vehicleModel && (formData.vehicleModel.length < 2 || formData.vehicleModel.length > 20)) {
      newErrors.vehicleModel = 'Vehicle model must be between 2 and 20 characters.';
    }

    // Service Location Validation
    if (!formData.serviceLocation || formData.serviceLocation.length < 15 || formData.serviceLocation.length > 300) {
      newErrors.serviceLocation = 'Service location must be between 15 and 300 characters.';
    }

    // Pickup Time Validation
    if (!formData.pickupTime) {
      newErrors.pickupTime = 'Pickup time is required.';
    } else {
      const selectedTime = new Date(formData.pickupTime);
      const currentTime = new Date();

      // Convert current time to IST
      const currentTimeIST = new Date(currentTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

      if (selectedTime <= currentTimeIST) {
        newErrors.pickupTime = 'Pickup time must be in the future.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const responseData = formData.id ? await updatePickup(formData.id, formData) : await createPickup(formData);
        console.log('Pickup processed:', responseData);
        if (onSuccess) {
          await onSuccess();
        } else {
          setResponseJson(responseData);
          setOpenSuccessDialog(true);
          setOpenDialog(false);
          const recentPickups = await fetchRecentPickups();
          onRecentPickupsUpdate(recentPickups);
        }
      } catch (error) {
        console.error('Error processing pickup:', error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deletePickup(formData.id);
      if (onSuccess) {
        await onSuccess();
      } else {
        const recentPickups = await fetchRecentPickups();
        onRecentPickupsUpdate(recentPickups);
        setOpenDeleteDialog(false);
        setOpenDialog(false);
      }
    } catch (error) {
      console.error('Error deleting pickup:', error);
    }
  };

  return (
    <div className="pickup-form">
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          name="customerName"
          label="Customer Name *"
          value={formData.customerName}
          onChange={handleChange}
          error={!!errors.customerName}
          helperText={errors.customerName || "Example: John Doe"}
        />
        <TextField
          fullWidth
          margin="normal"
          name="customerPhoneNumber"
          label="Customer Phone Number *"
          value={formData.customerPhoneNumber}
          onChange={handleChange}
          error={!!errors.customerPhoneNumber}
          helperText={errors.customerPhoneNumber || "Example: +919876543210"}
        />
        <TextField
          fullWidth
          margin="normal"
          name="customerEmail"
          label="Customer Email"
          value={formData.customerEmail}
          onChange={handleChange}
          error={!!errors.customerEmail}
          helperText={errors.customerEmail || "Example: example@domain.com"}
        />
        <TextField
          fullWidth
          margin="normal"
          name="vehicleNumber"
          label="Vehicle Number *"
          value={formData.vehicleNumber}
          onChange={handleChange}
          error={!!errors.vehicleNumber}
          helperText={errors.vehicleNumber || "Example: MH12AB1234"}
        />
        <TextField
          fullWidth
          margin="normal"
          name="vehicleModel"
          label="Vehicle Model"
          value={formData.vehicleModel}
          onChange={handleChange}
          error={!!errors.vehicleModel}
          helperText={errors.vehicleModel || "Example: Octavia"}
        />
        <TextField
          fullWidth
          margin="normal"
          name="vehicleBrand"
          label="Vehicle Brand"
          value={formData.vehicleBrand}
          disabled
          helperText="Default: Skoda"
        />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">Service Type *</FormLabel>
          <RadioGroup
            name="serviceType"
            value={formData.serviceType}
            onChange={handleChange}
          >
            <FormControlLabel
              value="PICKUP_FROM_CUSTOMER_LOCATION"
              control={<Radio />}
              label="Pickup from Customer Location"
            />
            <FormControlLabel
              value="DROP_TO_CUSTOMER_LOCATION"
              control={<Radio />}
              label="Drop to Customer Location"
            />
          </RadioGroup>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          name="serviceLocation"
          label="Customer Location *"
          value={formData.serviceLocation}
          onChange={handleChange}
          error={!!errors.serviceLocation}
          helperText={errors.serviceLocation || "Example: Customer's address"}
        />
        <TextField
          fullWidth
          margin="normal"
          name="pickupTime"
          label="Pickup Time *"
          type="datetime-local"
          value={formData.pickupTime || ''}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.pickupTime}
          helperText={errors.pickupTime || "Select a date and time"}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {formData.id && (
            <Button 
              variant="contained" 
              color="error" 
              onClick={() => setOpenDeleteDialog(true)}
              type="button"
            >
              Delete
            </Button>
          )}
          <Box sx={{ ml: formData.id ? 0 : 'auto' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => setOpenDialog(false)} 
              sx={{ mr: 2 }}
              type="button"
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              type="submit"
            >
              {formData.id ? 'Save Changes' : 'Create'}
            </Button>
          </Box>
        </Box>
      </form>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this pickup? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {Object.keys(errors).length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="error">
            Please correct the errors above.
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default PDServiceForm; 