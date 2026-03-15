import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Donors from './pages/Donors';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import DonationHistory from './pages/DonationHistory';
import DonateNow from './pages/DonateNow';
import ClientSearch from './pages/ClientSearch';
import Roles from './pages/Roles';
import AdminSettings from './pages/AdminSettings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donors"
              element={
                <ProtectedRoute>
                  <Donors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <Roles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donation-history"
              element={
                <ProtectedRoute>
                  <DonationHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donate-now"
              element={
                <ProtectedRoute>
                  <DonateNow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/search-donors"
              element={
                <ProtectedRoute>
                  <ClientSearch />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
