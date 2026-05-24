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
import CaseDetail from './pages/clientbyid'
import PostCase from './pages/postcase'
import ClientCases from './pages/clientsposts'

import LawyerProfileSetup from './pages/lawyerEdits'
import LawyerCases from './Components/lawyers/laywercases'

import MyLawyerProfile from './pages/lawyerprolife'
import PublicLawyerProfile from './pages/lawyerprofileforclient'
import LawyerApplications from './pages/lapplications'
import ApplyToCase from './pages/lapply'

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
            <Route path="client/post-case" element={
              <ProtectedRoute allowedRoles={['client']}>
                <PostCase />
              </ProtectedRoute>
            } />
            <Route path="/client/cases" element={
              <ProtectedRoute allowedRoles={['client']}>
                <ClientCases />
              </ProtectedRoute>
            } />
            
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
              <ProtectedRoute allowedRoles={[ 'lawyer']}>
                <AllCases />
              </ProtectedRoute>
            }
            />
          
              <Route path="/lawyer/profile" element={
                <ProtectedRoute allowedRoles={['lawyer','client']}>
                  <MyLawyerProfile />
                </ProtectedRoute>
              } />
              <Route path="/lawyer/profile-setup" element={
                <ProtectedRoute allowedRoles={['lawyer']}>
                  <LawyerProfileSetup />
                </ProtectedRoute>
              } />

              <Route path="/lawyers/:id" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <PublicLawyerProfile />
                </ProtectedRoute>
              } />
              <Route path="/lawyer/applications" element={
                <ProtectedRoute allowedRoles={['lawyer']}>
                  <LawyerApplications />
                </ProtectedRoute>
              } />
              <Route path="/lawyer/cases/:id/apply" element={
                <ProtectedRoute allowedRoles={['lawyer']}>
                  <ApplyToCase />
                </ProtectedRoute>
              } />
              <Route path="/client/cases/:id" element={
                <ProtectedRoute allowedRoles={['client']}>
                  <CaseDetail />
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