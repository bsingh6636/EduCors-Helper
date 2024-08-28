// src/Error404.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Error() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold animate-bounce">404</h1>
        <p className="text-xl mt-4">Page Not Found</p>
        <button
          onClick={handleRedirect}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default Error;
