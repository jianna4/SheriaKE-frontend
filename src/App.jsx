import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Components/layout/Layout'
import LandingPage from './pages/landingpage'
import Login from './pages/login'
import Signup from './pages/signup'
import Chat from './pages/chatAI'
import './index.css'
function App() {
  return (
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
  )
}

export default App