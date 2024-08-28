import React, { useContext, useState } from 'react';
import { Context } from '../App';
import { SignInPrompt } from '../import';

const UserHome = () => {

  const { loginState } = useContext(Context)
  // Mock user data
  const user = {
    UserName: 'a',
    Name: 'a',
    Email: 'a@b2',
    createdAt: '2024-08-27T01:39:36.986Z',
    updatedAt: '2024-08-27T01:39:36.986Z',
  };

  // State to handle API key generation
  const [apiKey, setApiKey] = useState('');

  // Function to simulate API key generation
  const generateApiKey = () => {
    const newApiKey = 'api_key_' + Math.random().toString(36).substring(2, 15);
    setApiKey(newApiKey);
  };

  // Copy API key to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    alert('API key copied to clipboard!');
  };

  return !loginState ? <SignInPrompt/> : (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-500 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">User Details</h1>
        <div className="mb-4">
          <p className="text-lg font-medium">Username: <span className="text-gray-700">{user.UserName}</span></p>
          <p className="text-lg font-medium">Name: <span className="text-gray-700">{user.Name}</span></p>
          <p className="text-lg font-medium">Email: <span className="text-gray-700">{user.Email}</span></p>
          <p className="text-lg font-medium">Created At: <span className="text-gray-700">{new Date(user.createdAt).toLocaleString()}</span></p>
          <p className="text-lg font-medium">Updated At: <span className="text-gray-700">{new Date(user.updatedAt).toLocaleString()}</span></p>
        </div>
        <div className="mb-6">
          <button
            onClick={generateApiKey}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Generate API Key
          </button>
        </div>
        {apiKey && (
          <div className="mt-4 p-4 border rounded-lg border-gray-300 bg-gray-50">
            <p className="text-lg font-medium mb-2">Your API Key:</p>
            <div className="flex items-center">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="flex-grow px-2 py-1 border rounded-lg border-gray-300 bg-white"
              />
              <button
                onClick={copyToClipboard}
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-red-500 mt-2">
              * Keep your API key secure. Do not share it with others.
            </p>
          </div>
        )}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2">Important Notice</h2>
          <p className="text-sm text-yellow-700">
            Please do not share your API key with anyone. Your API key is unique to your account and can be used to access sensitive information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
