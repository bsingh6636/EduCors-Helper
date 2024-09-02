// src/components/Help.js
import React from 'react';
import CodeDemo from '../pages/CodeDemo';
import '../css/Help.css'; // Import CSS file for custom styles

const Help = () => {
  return (
    <div className="help-container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg max-w-4xl">
      {/* Help Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">How to Use Our API</h1>

      {/* Instructions Section */}
      <div className="instructions bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Step-by-Step Guide</h2>
        <ol className="list-decimal list-inside text-gray-700 leading-relaxed space-y-4">
          <li>
            <strong>Create an Account:</strong> 
            Visit our website and create an account to gain access to your profile.
          </li>
          <li>
            <strong>Get Your API Key:</strong> 
            Log in to your profile and generate a free API key from the 'API Keys' section.
          </li>
          <li>
            <strong>Use the API:</strong> 
            Include the API key in the `Authorization` header and make requests to our API endpoint.
          </li>
        </ol>
      </div>

      {/* Code Example Section */}
      <div className="code-example bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Code Example</h2>
        <p className="text-gray-700 mb-4">
          Here’s an example of how you can use the API to fetch data:
        </p>
        <CodeDemo />
      </div>

      {/* Disclaimer Section */}
      <div className="disclaimer bg-yellow-50 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Disclaimer</h2>
        <p className="text-gray-700">
          This guide and the provided code example are for educational purposes only. Please do not use the provided API key or endpoint in a production environment. Always generate your own API keys and follow best practices for security.
        </p>
      </div>
    </div>
  );
};

export default Help;
