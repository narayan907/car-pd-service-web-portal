import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/services';

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  };
};

export const createPickup = async (data) => {
  try {
    const response = await axios.post(API_BASE_URL, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error creating pickup:', error);
    throw error;
  }
};

export const updatePickup = async (id, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, data, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating pickup:', error);
    throw error;
  }
};

export const deletePickup = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
  } catch (error) {
    console.error('Error deleting pickup:', error);
    throw error;
  }
};

export const fetchRecentPickups = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recent`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching recent pickups:', error);
    throw error;
  }
};

export const fetchPickupsByDate = async (date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/by-date?date=${date}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching pickups:', error);
    throw error;
  }
};

export const updateServiceStatus = async (serviceRequestId, driverId, status) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/admin/update-service-status`, {
      serviceRequestId,
      driverId,
      status
    }, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
};

export const fetchDrivers = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/drivers`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching drivers:', error);
    throw error;
  }
}; 