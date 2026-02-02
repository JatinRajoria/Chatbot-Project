import React from 'react';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {

    // Cookie se token uthao (maan lo naam 'token' hai)
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Use: const token = getCookie('token');
    const token = getCookie('token');

    // Agar token nahi hai, toh login par redirect kar do
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Agar token hai, toh component dikhao
    return children;
};

export default ProtectedRoute;