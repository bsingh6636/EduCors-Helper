import React, { useState } from 'react';
import CodeDemo from '../pages/CodeDemo';
import '../css/Help.css'; // Import CSS file for custom styles

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
        <div className="code-demo bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Code Example</h2>
          <CodeDemo />
        </div>
      </div>
    </div>
  );
};

export default Help;