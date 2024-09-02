import React, { useContext, useState } from 'react';
import { Context } from '../App';
import { BackEndPort, SignInPrompt } from '../import';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
  const { loginState, userDetails, setLoginState,setUserDetails } = useContext(Context);
  const [apiKey, setApiKey] = useState('');
  const navigate = useNavigate()

  const generateApiKey = async () => {
    if (!userDetails.UserName) {
      toast.error("Username is not defined");
      return;
    }

    try {
      const response = await fetch(`${BackEndPort}/user/genApiKey`, {
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

  async function signOut (){
      const response = await fetch(`${BackEndPort}/user/signOut`,{
       
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = response.json()
      setUserDetails(null)
      setLoginState(true)
      navigate('/signIn');

  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast.info('API key copied to clipboard!');
  };

  if (!loginState) return <SignInPrompt />;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">User Profile</h1>
          <button
            onClick={()=>signOut()}
            className="bg-red-500 text-white px-6 py-2 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-6">
          <Detail label="Username" value={userDetails.UserName} />
          <Detail label="Name" value={userDetails.Name} />
          <Detail label="Email" value={userDetails.Email} />
          <Detail label="Created At" value={new Date(userDetails.createdAt).toLocaleString()} />
        </div>

        
        {
          !userDetails.ApiKey && 
            <div className="flex justify-center mb-10">
          <button
            onClick={generateApiKey}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            Generate API Key
          </button>
        </div>
          
        }

        {userDetails.ApiKey && (
          <div className="mt-8 bg-gray-100 p-6 rounded-xl shadow-inner">
            <p className="text-lg font-semibold mb-2 text-gray-800">Your API Key:</p>
            <div className="flex items-center">
              <input
                type="text"
                value={userDetails.ApiKey}
                readOnly
                className="flex-grow px-4 py-2 border rounded-lg bg-white text-gray-900"
              />
              <button
                onClick={copyToClipboard}
                className="ml-3 bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-colors duration-300"
              >
                Copy
              </button>
            </div>
            <p className="text-sm text-red-600 mt-3">
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
  <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
    <p className="text-sm font-semibold text-gray-600">{label}</p>
    <p className="text-lg font-medium text-gray-800">{value}</p>
  </div>
);

const Notice = ({ title, message }) => (
  <div className="mt-10 p-6 bg-yellow-100 border border-yellow-300 rounded-lg shadow-sm">
    <h2 className="text-2xl font-bold text-yellow-700 mb-2">{title}</h2>
    <p className="text-sm text-yellow-700">{message}</p>
  </div>
);

export default UserHome;
