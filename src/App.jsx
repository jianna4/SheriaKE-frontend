import React from 'react'
import { Routes, Route, Navigate ,BrowserRouter } from 'react-router-dom'
import Layout from './Components/layout/Layout'
import LandingPage from './pages/landingpage'
import Login from './pages/login'
import Signup from './pages/signup'
import { useAuth } from './Components/contexts/AuthContext'
import { AuthProvider } from './Components/contexts/AuthContext'
import Chat from './pages/chatAI'
import ProtectedRoute from './Components/ProtectedRoute'

import LawyerDashboard from './pages/LawyerDashboard'
import ClientDashboard from './pages/ClientDashboard'
import './index.css'

import FindLawyers from './pages/AllLawyres'
import AllCases from './pages/Allcases'
import LawyerProfile from './pages/lawyerdetail'
import LawyerCases from './Components/lawyers/laywercases'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Client Routes */}
            <Route 
              path="/client/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            {/* Lawyer Routes */}
            <Route 
              path="/lawyer/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['lawyer']}>
                  <LawyerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="/lawyers" element={
              <ProtectedRoute allowedRoles={['client']}>
                <FindLawyers />
              </ProtectedRoute>
            }
             />
            <Route path="/cases" element={
              <ProtectedRoute allowedRoles={['client', 'lawyer']}>
                <AllCases />
              </ProtectedRoute>
            }
            />
            <Route path="/lawyer/profile" element={
              <ProtectedRoute allowedRoles={['client', 'lawyer']}>
                <LawyerProfile />
              </ProtectedRoute>
            } 
            />
              <Route path="/lawyer/applications" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <LawyerCases />
                </ProtectedRoute>
              } />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App