import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-[#121212] flex flex-col items-center justify-center text-white px-4">
      <div className="bg-red-500/10 p-6 rounded-full mb-6 animate-bounce">
        <AlertTriangle size={64} className="text-red-500"/>
      </div>
      
      <h1 className="text-6xl font-black mb-2 tracking-tighter">404</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-300">Page Not Found</h2>
      
      <p className="text-gray-500 max-w-md text-center mb-8">
        Your are lost in the void. The page you are looking for does not exist or has been moved.
      </p>

      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 shadow-lg shadow-blue-600/20"
      >
        <Home size={20} />
        Now Move on to Home Page
      </button>
    </div>
  );
};

export default NotFound;