import React from 'react'
import { Routes, Route, Navigate ,BrowserRouter } from 'react-router-dom'
import Layout from './Components/layout/Layout'
import LandingPage from './pages/landingpage'
import Login from './pages/login'
import Signup from './pages/signup'
import { useAuth } from './Components/contexts/AuthContext'
import Chat from './pages/chatAI'
import './index.css'
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Layout>
      </div>
    </BrowserRouter>
  )
}

export default App