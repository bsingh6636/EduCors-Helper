// src/components/Header.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackEndPort } from '../import';
import { Context } from '../App';

const Header = () => {
const { setUserDetails, setLoginState } = useContext(Context)
const navigate = useNavigate()

  async function authenticateUser() {
    const response = await fetch(`${BackEndPort}/auth`, {
      credentials: 'include'
    })
    const data = await response.json()
    if (data.success) {
      setLoginState(true)
      setUserDetails(data.data)
    } else {
      setLoginState(false)
    }
  }

  useEffect(() => {

    // It's recommended to use environment variables for sensitive information like API keys.
    const API_KEY = '310ecb8f2154245c';
    const EDUCORS_URL = 'https://educorssolver.host/api/getData';
    const TARGET_URL = 'https://api.github.com/users/bsingh6636/repos';

    // Function to get data from the API
    async function githubUserData() {
      const response = await fetch(EDUCORS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ApiKey: API_KEY, Target: TARGET_URL }),
      });
      const data = await response.json();
      console.log('Data fetched successfully:', data);
      return data;
    }

    // Example usage
    githubUserData();

    authenticateUser()
  }, [])

  function onclicks (){
    navigate('/signIn')
  }
  return (
    <>
      <header className=" text-white flex justify-evenly mt-10">
        <div className="">
          <Link to="/"><img className='w-10 h-10 rounded-lg ' src='./logo192.png' alt='logo image' /></Link>
        </div>
        <div className='mt-0'>
          <nav className="flex justify-center align- text-xl font-mono">
            <Link to="/" className="mx-3  px-1 py-[1px] rounded-lg hover:bg-blue-700 hover:scale-105">Home</Link>
            <Link to="/profile" className="mx-3  px-1 py-[1px] rounded-lg hover:bg-blue-700">Profile</Link>
            <Link to="/dashboard" className="mx-3  px-1 py-[1px] rounded-lg hover:bg-blue-700">Dashboard</Link>
            <Link to="/signIn" className="mx-3  px-1 py-[1px] rounded-lg hover:bg-blue-700">Register</Link>
            <Link to="/help" className="mx-3  px-1 py-[1px] rounded-lg hover:bg-blue-700">Help</Link>
          </nav>
        </div>
        <div>
          <button className='mx-3  p-1 rounded-lg bg-white text-black border-[2px] border-red-600 hover:border-blue-700'
           onClick={()=>onclicks()}>SignIn</button>
          <button className='mx-3  p-1 rounded-lg bg-blue-700 text-white border-[2px] border-red-600 hover:border-white'
           onClick={()=>onclicks()}>SignUp</button>
        </div>

      </header>
    </>
  );
};

export default Header;
