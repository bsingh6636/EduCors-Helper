import React, { useState } from 'react';
import CodeDemo from '../pages/CodeDemo';
import '../css/Help.css'; // Import CSS file for custom styles
import { Link } from 'react-router-dom'

const Help = () => {
  const [darkMode] = useState(false);

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  // };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="help-container mx-auto p-6 rounded-lg shadow-lg max-w-4xl bg-white dark:bg-gray-900 text-black dark:text-gray-100">


        {/* Help Title */}
        <h1 className="text-3xl font-bold mb-6">How to Use Our API</h1>

        {/* Instructions Section */}
        <div className="instructions bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Step-by-Step Guide</h2>
          <ol className="list-decimal list-inside leading-relaxed space-y-4">
            <li>
              <strong>Create an Account:</strong>
              Visit our <Link to="/signUp" className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition duration-200">sign up</Link> page to create an account and gain access to your profile.
            </li>
            <li>
              <strong>Get Your API Key:</strong>
              Log in to your <Link to="/profile" className="ml-2 text-blue-600 hover:text-blue-800 font-semibold transition duration-200">profile</Link> and generate a free API key from the 'API Keys' section.
            </li>
            <li>
              <strong>Use the API:</strong>
              Copy the code below, replace the required target (where you want to fetch data from) with your own target URL, and make sure to use your own API key.
              <span className="text-red-600 font-bold block mt-2">
                Important: Ensure you replace "Target" with the correct target URL and use your unique API key.
              </span>
            </li>
          </ol>

        </div>

        {/* Code Example Section */}
        <div className="code-demo bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Code Example</h2>
          <CodeDemo />
        </div>
      </div>
    </div>
  );
};

export default Help;