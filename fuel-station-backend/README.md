# Fuel Station Backend

## OTP Verification System

### Using the Universal Test OTP (Development Mode Only)

While in development mode, you can use the universal test OTP "123456" to bypass the real SMS verification system. This makes testing easier without having to wait for actual SMS messages.

#### How to Use:

1. When prompted for an OTP during registration:
   - Enter "123456" as the verification code
   - The system will accept this code even without sending an actual SMS

2. This works for both:
   - The OTP verification step
   - The complete registration endpoint

#### Security Note:

Before deploying to production, make sure to:
- Set `DEV_MODE = false` in the vehicle_registration_route.js file
- Remove debug information from API responses
- Ensure proper SMS API credentials are configured

### API Endpoints Overview

- `POST /send-otp`: Generates and sends an OTP code
- `POST /verify-otp`: Verifies an OTP code 
- `POST /register`: Complete user and vehicle registration (requires OTP)

For a complete API documentation, see the API specification document.
