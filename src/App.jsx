import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

// Pages
import EventPage from './assets/pages/EventPage'
import EventDetailsPage from './assets/pages/EventDetailsPage'
import BookingEventPage from './assets/pages/BookingEventPage'
import LoginPage from './assets/pages/LoginPage'
import RegisterPage from './assets/pages/RegisterPage'
import EmailVerificationPage from './assets/pages/EmailVerificationPage'
import ProfilePage from './assets/pages/ProfilePage'
import DashboardPage from './assets/pages/DashboardPage'
import MyBookingsPage from './assets/pages/MyBookingsPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        
        {/* Public Event Routes */}
        <Route path="/" element={<EventPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        
        {/* Protected Routes */}
        <Route path="/events/booking/:id" element={
          <ProtectedRoute>
            <BookingEventPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* Essential MVP Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute>
            <MyBookingsPage />
          </ProtectedRoute>
        } />
        
        {/* Future Routes */}
        <Route path="/invoices" element={
          <ProtectedRoute>
            <div>Invoices - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/inbox" element={
          <ProtectedRoute>
            <div>Inbox - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute>
            <div>Calendar - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/financials" element={
          <ProtectedRoute>
            <div>Financials - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/gallery" element={
          <ProtectedRoute>
            <div>Gallery - Coming Soon</div>
          </ProtectedRoute>
        } />
        <Route path="/feedback" element={
          <ProtectedRoute>
            <div>Feedback - Coming Soon</div>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App