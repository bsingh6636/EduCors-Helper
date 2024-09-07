import React from 'react';
import CodeDemo from '../pages/CodeDemo';
import { FaCloudUploadAlt , FaLock } from "react-icons/fa";
import { FaBoltLightning } from "react-icons/fa6";
import FAQComponent from '../pages/FAQComponent';
const Home = () => {
  return (
    <>
      <div className='flex justify-center flex-col'>
        <div className='flex justify-center'>
          <p className='mt-20 border-2 p-1 px-2 rounded-2xl  border-white'>Now: Effotless soltutions for devvelopers |
            <span className='text-blue-700'>Learn more></span>
          </p>
        </div>
        <div className='flex flex-col text-5xl font-extrabold items-center mt-5 text'>
          <span>Optimize Your API</span>
          <span>Development</span>
        </div>
        <div className='flex items-center text-xl flex-col'>
          <span>Resolve CORS issues seamlessly with our secure API Keys. Focues on building</span>
          <span>great Application without hassle</span>
          <div className='h-48 w-48 rounded-3xl mt-6 bg-slate-300'>
            <img src='https://res.cloudinary.com/bsingh6636/image/upload/v1725749746/projects/apiSerice/image3_qnqjha.webp' alt='iamge3'/>
          </div>
          <Home2/>
          <Home3/>
          <FAQComponent/>
          <Home4/>
        </div>
      </div>
      <Homee />
    </>

  );
};

export default Home;

const Home2 = () =>{
  return(
    <div className='mt-10 flex flex-row ml-12'>
  <div className='w-1/2 mr-5 '>
    <p className='text-blue-700 mb-5'>Seamless API Integration</p>
    <h1 className='font-extrabold text-5xl'>Unlock your application potential</h1>
    <p className='mt-9'>Effortlessly resolve CORS issues and streamline your development process</p>
    <div className='flex flex-row mt-10 ml-5'>
      <div className='text-blue-600 flex flex-col items-center mr-4'>
        <FaCloudUploadAlt className='mb-2'/>
        <FaLock className='mb-2'/>
        <FaBoltLightning />
      </div>
      <div>
        <p className='text-base'><strong>Instant CORS Resolution:</strong> Transform complex integration into smooth API interaction</p>
        <p><strong>Secure API Keys:</strong> Protect your data with tailored user-specific keys.</p>
        <p><strong>Quick Setup:</strong> Get started swiftly without any hassle</p>
      </div>
    </div>
  </div>
  <div className='w-1/2 text-sm'>
    <CodeDemo/>
  </div>
</div>

  )
}


const Home3 = () => {
  return (
    <div className="bg-black text-white py-16 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Unlock the Power of APIs</h1>
        <p className="text-lg mb-12">
          Effortlessly integrate our secure APIs and enhance your application's capabilities while avoiding CORS issues.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col space-y-12">
        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Get Your API Key */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 00-5 18.71V22h10v-1.29A10 10 0 0012 2zm-4 10a4 4 0 118 0 4 4 0 01-8 0zm10 6h-2v-1.26a6 6 0 10-8 0V18H6a8 8 0 1116 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Get Your API Key</h2>
            <p>Sign up and get your unique API key to start integrating with ease and security.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Integrate Seamlessly */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 00-10 10 9.98 9.98 0 004.25 8.25L12 22l5.75-1.75A10 10 0 0022 12a10 10 0 00-10-10zm0 18.25L9.2 19h-.55a7.94 7.94 0 01-3.86-1.02L6 14.3l6-3.3 6 3.3-1.79 3.68c-1.3.65-2.74 1.03-4.21 1.06zm4.66-5.62a4 4 0 11-5.66 0 4 4 0 015.66 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Integrate Seamlessly</h2>
            <p>Follow our straightforward guides to integrate our APIs into your application without hassle.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Go Live */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5.67 5.67l-1.42 1.42A5.98 5.98 0 0112 18v-2a4 4 0 10-3.17-7l1.42-1.42a6 6 0 015.42 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Go Live</h2>
            <p>Launch your application with confidence, backed by our secure and efficient API services.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home4 = () =>{
  return (
    <div className="bg-black text-white py-16 px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Unlock the Power of APIs</h1>
        <p className="text-lg mb-12">
          Effortlessly integrate our secure APIs and enhance your application's capabilities while avoiding CORS issues.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col space-y-12">
        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Get Your API Key */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 00-5 18.71V22h10v-1.29A10 10 0 0012 2zm-4 10a4 4 0 118 0 4 4 0 01-8 0zm10 6h-2v-1.26a6 6 0 10-8 0V18H6a8 8 0 1116 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Get Your API Key</h2>
            <p>Sign up and get your unique API key to start integrating with ease and security.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Integrate Seamlessly */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 00-10 10 9.98 9.98 0 004.25 8.25L12 22l5.75-1.75A10 10 0 0022 12a10 10 0 00-10-10zm0 18.25L9.2 19h-.55a7.94 7.94 0 01-3.86-1.02L6 14.3l6-3.3 6 3.3-1.79 3.68c-1.3.65-2.74 1.03-4.21 1.06zm4.66-5.62a4 4 0 11-5.66 0 4 4 0 015.66 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Integrate Seamlessly</h2>
            <p>Follow our straightforward guides to integrate our APIs into your application without hassle.</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-gray-800 p-4 rounded-full">
            {/* Icon for Go Live */}
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm5.67 5.67l-1.42 1.42A5.98 5.98 0 0112 18v-2a4 4 0 10-3.17-7l1.42-1.42a6 6 0 015.42 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Go Live</h2>
            <p>Launch your application with confidence, backed by our secure and efficient API services.</p>
          </div>
        </div>
      </div>
    </div>
  );
}




const Homee = () => {
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
  )
}
