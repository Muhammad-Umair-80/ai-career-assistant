import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/auth/pages/login'
import Register from './features/auth/pages/register'
import Home from './features/interview/pages/Home'
import Protected from './features/auth/components/protected'
import Interview from './features/interview/pages/interview'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/interview/:interviewId" element={<Protected><Interview /></Protected>} />
        <Route path="/*" element={<div style={{padding:20}}>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
