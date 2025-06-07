# Authentication System Implementation

This document describes the comprehensive authentication system that has been integrated into the Ventixe frontend application, connecting to the UserService backend.

## Overview

The authentication system provides:
- User registration with email verification
- User login with JWT tokens
- Protected routes
- User profile management
- Email verification workflow
- Automatic token refresh and validation

## Backend Integration

The frontend connects to the UserService backend which provides:

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/verify-email` - Verify email with token
- `GET /api/emailverification/status/{email}` - Check verification status
- `POST /api/emailverification/resend` - Resend verification email

### Data Models
- **User Entity**: id, name, email, passwordHash, verificationToken, verifiedAt, createdAt, etc.
- **Register Request**: name, email, password, confirmPassword
- **Login Request**: email, password
- **User Response**: id, name, email, token, createdAt

## Frontend Architecture

### Core Components

#### 1. Authentication Context (`src/contexts/AuthContext.jsx`)
- Manages global authentication state
- Provides authentication methods to components
- Handles token storage and validation
- Auto-initializes auth state on app load

#### 2. API Service (`src/services/api.js`)
- Axios instance with base configuration
- Automatic token injection in requests
- Response interceptor for handling auth errors
- Redirects to login on 401 errors

#### 3. Auth Service (`src/services/authService.js`)
- Handles all authentication API calls
- Token and user data management
- Local storage operations
- Authentication state utilities

#### 4. Protected Route Component (`src/components/ProtectedRoute.jsx`)
- Wraps protected pages/components
- Redirects unauthenticated users to login
- Shows loading state during auth check
- Preserves intended destination for post-login redirect

### Pages

#### 1. Login Page (`src/assets/pages/LoginPage.jsx`)
- Modern, responsive login form
- Form validation with react-hook-form
- Password visibility toggle
- Error handling and loading states
- Redirects to intended destination after login

#### 2. Registration Page (`src/assets/pages/RegisterPage.jsx`)
- Comprehensive registration form
- Password confirmation validation
- Success state with email verification instructions
- Form validation and error handling
- Links to login page

#### 3. Email Verification Page (`src/assets/pages/EmailVerificationPage.jsx`)
- Handles email verification tokens from URL
- Resend verification email functionality
- Multiple states: idle, verifying, success, error
- User-friendly error messages and instructions

#### 4. Profile Page (`src/assets/pages/ProfilePage.jsx`)
- User profile information display
- Email verification status
- Account statistics
- Profile refresh functionality
- Logout and navigation options

### Navigation Integration

#### Updated Nav Component (`src/assets/components/Nav.jsx`)
- Shows user information when authenticated
- Dynamic sign in/sign out buttons
- Profile link for authenticated users
- Integrates with authentication context

#### Auth Button Component (`src/components/AuthButton.jsx`)
- Reusable authentication button
- Shows user menu when authenticated
- Login/register buttons for guests
- Can be used in any component

## Features

### 1. User Registration
- Full name, email, and password collection
- Password confirmation validation
- Email verification requirement
- Success feedback with next steps

### 2. Email Verification
- Automatic email sending on registration
- Token-based verification system
- Resend verification email option
- Status checking functionality
- User-friendly verification flow

### 3. User Login
- Email and password authentication
- JWT token management
- Remember login state
- Redirect to intended destination
- Error handling for invalid credentials

### 4. Protected Routes
- Automatic authentication checking
- Seamless redirect to login
- Loading states during auth verification
- Preserve intended destination

### 5. User Profile
- Display user information
- Show verification status
- Account management options
- Profile refresh capability

### 6. Session Management
- Automatic token validation
- Token refresh on app load
- Logout on token expiration
- Secure token storage

## Security Features

### 1. Token Management
- JWT tokens stored in localStorage
- Automatic token injection in API requests
- Token validation on app initialization
- Automatic logout on token expiration

### 2. Route Protection
- Protected routes require authentication
- Automatic redirect to login
- Preserve intended destination
- Loading states prevent unauthorized access

### 3. API Security
- HTTPS communication (configure baseURL)
- Bearer token authentication
- Automatic error handling
- CORS configuration support

## Configuration

### API Configuration
Update the base URL in `src/services/api.js`:
```javascript
baseURL: 'https://your-userservice-domain.com/api'
```

### Environment Variables
Consider using environment variables for:
- API base URL
- JWT secret (backend)
- Email service configuration (backend)

## Usage Examples

### Using Authentication Context
```jsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  return <div>Please log in</div>;
}
```

### Creating Protected Routes
```jsx
import ProtectedRoute from '../components/ProtectedRoute';

<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

### Using Auth Button
```jsx
import AuthButton from '../components/AuthButton';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <AuthButton />
    </header>
  );
}
```

## Styling

The authentication system uses modern CSS with:
- Gradient backgrounds
- Smooth transitions and animations
- Responsive design
- Loading spinners
- Error and success states
- Consistent color scheme

### CSS Variables Used
- Primary colors: #6366f1, #8b5cf6
- Error colors: #ef4444, #dc2626
- Success colors: #059669, #166534
- Gray scale: #1f2937, #374151, #6b7280

## Testing

### Manual Testing Checklist
- [ ] User registration with valid data
- [ ] User registration with invalid data
- [ ] Email verification flow
- [ ] User login with valid credentials
- [ ] User login with invalid credentials
- [ ] Protected route access when authenticated
- [ ] Protected route redirect when not authenticated
- [ ] Profile page functionality
- [ ] Logout functionality
- [ ] Token expiration handling
- [ ] Email verification resend
- [ ] Responsive design on mobile

### Integration Testing
- [ ] Backend API connectivity
- [ ] Email service functionality
- [ ] Database operations
- [ ] JWT token validation

## Deployment Considerations

### Frontend
- Update API base URL for production
- Configure CORS on backend
- Set up HTTPS
- Environment variable management

### Backend
- Configure email service (SMTP)
- Set up database connection
- Configure JWT secret
- Set up HTTPS
- Configure CORS for frontend domain

## Future Enhancements

### Potential Features
1. **Password Reset**: Forgot password functionality
2. **Social Login**: Google, Facebook, GitHub integration
3. **Two-Factor Authentication**: SMS or app-based 2FA
4. **Profile Editing**: Allow users to update their information
5. **Account Deletion**: Self-service account deletion
6. **Session Management**: Multiple device login tracking
7. **Role-Based Access**: Different user roles and permissions

### Technical Improvements
1. **Refresh Tokens**: Implement refresh token rotation
2. **Biometric Authentication**: Fingerprint/Face ID support
3. **Progressive Web App**: Offline authentication support
4. **Analytics**: Track authentication events
5. **Rate Limiting**: Prevent brute force attacks
6. **Audit Logging**: Track user activities

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Ensure backend CORS is configured for frontend domain
- Check API base URL configuration

#### 2. Token Issues
- Verify JWT secret configuration
- Check token expiration settings
- Ensure proper token format

#### 3. Email Verification
- Verify email service configuration
- Check spam folders
- Ensure proper email templates

#### 4. Route Protection
- Verify ProtectedRoute wrapper usage
- Check authentication context provider
- Ensure proper route configuration

## Support

For issues or questions regarding the authentication system:
1. Check this documentation
2. Review browser console for errors
3. Verify backend API responses
4. Check network requests in browser dev tools
5. Ensure proper environment configuration 