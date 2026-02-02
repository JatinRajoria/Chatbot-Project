import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Home from '../pages/Home'
import ProtectedRoute from './ProtectedRoute' // Import karo
import NotFound from '../pages/NotFound'

const MainRoutes = () => {
  return (
    <Routes>
      {/* Default route abhi bhi login par rakhte hain */}
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      {/* Home page ab protected hai */}
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path='/chat/:id' // ':id' ek dynamic parameter hai
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default MainRoutes