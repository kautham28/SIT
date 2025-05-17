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
    API.get('/vehicle_categories'),

  // Send OTP to the mobile number
  sendOtp: (data) => 
    API.post('/vehicle_registration/send-otp', data),

  // Verify OTP for the mobile number
  verifyOtp: (data) => 
    API.post('/vehicle_registration/verify-otp', data),
};

// Add authentication service for vehicle login
export const authService = {
  // Send OTP to the registered mobile for a vehicle
  sendOTP: (vehicleNumber) => 
    API.post('/auth/send-otp', { vehicleNumber }),
  
  // Verify OTP and authenticate
  verifyOTP: (vehicleNumber, otp) => 
    API.post('/auth/verify-otp', { vehicleNumber, otp }),
    
  // Get vehicle and user information
  getVehicleInfo: (vehicleNumber) =>
    API.get(`/auth/vehicle-info/${vehicleNumber}`)
};

export default API;