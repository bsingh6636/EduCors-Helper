import React, { useContext, useState } from 'react';
import { Context } from '../App';
import { BackEndPort, SignInPrompt } from '../import';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { loginState, userDetails, setLoginState, setUserDetails } = useContext(Context);
  const [apiKey, setApiKey] = useState('');
  const navigate = useNavigate();

  const generateApiKey = async () => {
    if (!userDetails.UserName) {
      toast.error("Username is not defined");
      return;
    }

    try {
      const response = await fetch(`${BackEndPort}/genApiKey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserName: userDetails.UserName }),
      });

      if (!response.ok) {
        toast.error(`Failed to generate API key: ${response.statusText}`);
        return;
      }

      const data = await response.json();
      setApiKey(data.data);
      toast.success(data.message);
    } catch (error) {
      toast.error('An error occurred while generating the API key');
      console.error('Error generating API key:', error);
    }
  };

  async function signOut() {
    try {
      const response = await fetch(`${BackEndPort}/signOut`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        setUserDetails(null);
        setLoginState(true);
        navigate('/signIn');
      } else {
        toast.error('Sign out failed');
      }
    } catch (error) {
      toast.error('An error occurred during sign out');
      console.error('Error signing out:', error);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.info('API key copied to clipboard!');
  };

  if (!loginState) return <SignInPrompt />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-gray-900 text-gray-100 rounded-2xl shadow-2xl p-8 md:p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">User Profile</h1>
          <button
            onClick={signOut}
            className="bg-red-600 text-white px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Detail label="Username" value={userDetails.UserName} />
          <Detail label="Name" value={userDetails.Name} />
          <Detail label="Email" value={userDetails.Email} />
          <Detail label="Created At" value={new Date(userDetails.createdAt).toLocaleString()} />
        </div>

        {!userDetails.ApiKey && (
          <div className="flex justify-center mb-10">
            <button
              onClick={generateApiKey}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              Generate API Key
            </button>
          </div>
        )}

        {userDetails.ApiKey && (
          <div className="mt-8 bg-gray-800 p-6 rounded-xl shadow-inner">
            <p className="text-lg font-semibold mb-2">Your API Key:</p>
            <div className="flex items-center">
              <input
                type="text"
                value={userDetails.ApiKey}
                readOnly
                className="flex-grow px-4 py-2 border rounded-lg bg-gray-700 text-gray-100"
              />
              <button
                onClick={copyToClipboard}
                className="ml-3 bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition-colors duration-300"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-red-400 mt-3">
              * Keep your API key secure. Do not share it with others.
            </p>
          </div>
        )}

        <Notice
          title="Important Notice"
          message="Please do not share your API key with anyone. Your API key is unique to your account and can be used to access sensitive information."
        />
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
    <p className="text-sm font-semibold text-gray-400">{label}</p>
    <p className="text-lg font-medium text-gray-100">{value}</p>
  </div>
);

const Notice = ({ title, message }) => (
  <div className="mt-10 p-6 bg-gray-700 border border-gray-600 rounded-lg shadow-sm">
    <h2 className="text-2xl font-bold text-gray-300 mb-2">{title}</h2>
    <p className="text-sm text-gray-300">{message}</p>
  </div>
);

export default UserProfile;
