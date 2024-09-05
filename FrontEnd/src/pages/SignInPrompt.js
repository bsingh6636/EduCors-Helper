import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignInPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-100 mb-4">Welcome!</h1>
        <p className="text-lg text-gray-300 mb-6">You are not signed in. Please sign in to access your account details.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
          onClick={() => navigate('/signIn')}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignInPrompt;
