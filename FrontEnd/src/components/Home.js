import React from 'react';
import CodeDemo from '../pages/CodeDemo';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 flex flex-col space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-dark p-6 rounded-lg shadow-lg hover-scale relative overflow-hidden">
        <img
          src="/images/welcome-bg.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <h1 className="text-4xl font-bold text-gray-100 mb-4 z-10 relative">
          Welcome to Your API Dashboard
        </h1>
        <p className="text-gray-300 leading-relaxed z-10 relative">
          Our platform provides developers with secure and efficient access to our APIs by offering unique API keys. These keys help you bypass CORS issues, enabling seamless communication between your applications and our servers.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-light p-6 rounded-lg shadow-lg hover-scale relative overflow-hidden">
        <img
          src="/images/benefits-bg.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <h2 className="text-3xl font-semibold text-gray-100 mb-4 z-10 relative">
          Benefits of Using Our API
        </h2>
        <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2 z-10 relative">
          <li>Resolve CORS issues effortlessly with a simple API key integration.</li>
          <li>Secure access to your data with unique, user-specific API keys.</li>
          <li>Quick and easy setup, enabling you to focus on building your application.</li>
          <li>Access to robust, reliable, and scalable API endpoints for your needs.</li>
        </ul>
      </div>

      {/* How It Works Section */}
      <div className="bg-gradient-dark p-6 rounded-lg shadow-lg hover-scale relative overflow-hidden">
        <img
          src="/images/how-it-works-bg.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <h2 className="text-3xl font-semibold text-gray-100 mb-4 z-10 relative">
          How It Works
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4 z-10 relative">
          When you create an account on our website, you receive a unique API key. This key acts as a secure identifier, allowing your applications to access our API without encountering cross-origin errors. Simply include the key in the `Authorization` header of your HTTP requests to gain access to our data.
        </p>
        <CodeDemo />
      </div>

      {/* Getting Started Section */}
      <div className="bg-gradient-light p-6 rounded-lg shadow-lg hover-scale relative overflow-hidden">
        <img
          src="/images/getting-started-bg.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <h2 className="text-3xl font-semibold text-gray-100 mb-4 z-10 relative">
          Getting Started
        </h2>
        <p className="text-gray-300 leading-relaxed mb-4 z-10 relative">
          To begin using our API, simply generate your API key from your user dashboard. Once you have your key, include it in your application's HTTP requests to start fetching data seamlessly.
        </p>
        <p className="text-gray-300 leading-relaxed z-10 relative">
          Need help integrating? Check out our documentation or use the `CodeDemo` component to see a working example of API integration.
        </p>
      </div>

      {/* Support & Resources Section */}
      <div className="bg-gradient-dark p-6 rounded-lg shadow-lg hover-scale relative overflow-hidden">
        <img
          src="/images/support-bg.svg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />
        <h2 className="text-3xl font-semibold text-gray-100 mb-4 z-10 relative">
          Support & Resources
        </h2>
        <p className="text-gray-300 leading-relaxed z-10 relative">
          Our support team is here to help you every step of the way. Whether you need assistance with API integration, troubleshooting, or exploring advanced features, we're just a click away.
        </p>
        <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2 z-10 relative">
          <li>
            <a href="/docs" className="text-gray-100 hover:text-gray-400 hover:underline">
              API Documentation
            </a>
          </li>
          <li>
            <a href="/support" className="text-gray-100 hover:text-gray-400 hover:underline">
              Contact Support
            </a>
          </li>
          <li>
            <a href="/community" className="text-gray-100 hover:text-gray-400 hover:underline">
              Join our Community
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
