// src/components/Header.js
import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BackEndPort } from '../import';
import { Context } from '../App';

const Header = () => {
  const { setUserDetails, setLoginState } = useContext(Context)


  async function authenticateUser() {
    const response = await fetch(`${BackEndPort}/auth`, {
      credentials: 'include'
    })
    const data = await response.json()
    if (data.success) {
      setLoginState(true)
      setUserDetails(data.data)
    }else{
      setLoginState(false)
    }
  }

  useEffect(() => {
    authenticateUser()

    // It's recommended to use environment variables for sensitive information like API keys.
    // const API_KEY = '';
    // const EDUCORS_URL = 'https://educorssolver.host/api/getData';
    // const TARGET_URL = 'https://api.github.com/users/bsingh6636/repos';

    // // Function to get data from the API
    // async function getSwiggyData() {
    //   const response = await fetch(EDUCORS_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ ApiKey: API_KEY, Target: TARGET_URL }),
    //   });
    //   const data = await response.json();
    //   console.log('Data fetched successfully:', data);
    //   return data;
    // }
    
    // It's recommended to use environment variables for sensitive information like API keys.
   
    // It's recommended to use environment variables for sensitive information like API keys.
    
    // It's recommended to use environment variables for sensitive information like API keys.
    const API_KEY = 'f21aac0985753059';
    const EDUCORS_URL ='https://educorssolver.host/api/getData';
    const TARGET_URL ='https://api.github.com/users/bsingh6636/repos';

    // Function to get data from the API
    async function githubUserData() {
      const response = await fetch(EDUCORS_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify({ ApiKey: API_KEY, Target: TARGET_URL }),
      });
      const data = await response.json();
      console.log('Data fetched successfully:', data);
      return data;
    }

    githubUserData();
  

  }, [])
  return (
    <>
    <header className="bg-blue-600 text-white p-4 z-auto">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">EDU CORS-Solver</Link>
        </div>
        <nav className="flex space-x-4 text-xl">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/signIn" className="hover:underline">Register</Link>
          <Link to="/help" className="hover:underline">Help</Link>
        </nav>
      </div>
    </header>
    </>
  );
};

export default Header;
