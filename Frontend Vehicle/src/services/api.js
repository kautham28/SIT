import axios from 'axios';

// Create an axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
API.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Log detailed error information
    console.error('API Error:', {
      message: error.response?.data?.message || 'Unknown error',
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data
    });
    
    // Return a more structured error object
    return Promise.reject({
      message: error.response?.data?.message || 'An unknown error occurred',
      status: error.response?.status,
      data: error.response?.data,
      originalError: error
    });
  }
);

// Vehicle registration services
export const vehicleRegistrationService = {
  // Validate vehicle against DMT database
  validateVehicle: (vehicleData) => 
    API.post('/vehicle_registration/validate-vehicle', vehicleData),
  
  // Register a new user (step 1)
  registerUser: (userData) => 
    API.post('/vehicle_registration/register-user', userData),
  
  // Register a vehicle (step 2)
  registerVehicle: (vehicleData) => 
    API.post('/vehicle_registration/register-vehicle', vehicleData),
  
  // Complete registration in one step
  register: (registrationData) => 
    API.post('/vehicle_registration/register', registrationData),

  // Get all vehicle categories
  getVehicleCategories: () => 
    API.get('/vehicle_categories')
};

export default API;
