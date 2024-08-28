// src/components/Header.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackEndPort } from '../import';
import { Context } from '../App';

const Header = () => {
  const navigate = useNavigate()
  const {setUserDetails ,  setLoginState} = useContext(Context)
  async function authenticateUser(){
    const response = await fetch(`${BackEndPort}/user/auth`,{
      credentials:'include'
    })
    const data = await response.json()
    console.log(data)
    if(data.success){
      setLoginState(true)
      setUserDetails(data.userObject)
      navigate('/')
    }else{
      navigate('/')
    }
  }

  useEffect(()=>{
    authenticateUser()
  },[])
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">EduLogo</Link>
        </div>
        <nav className="flex space-x-4">
          <Link to="/" className="hover:underline">Proxy</Link>
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/profile" className="hover:underline">Profile</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/signIn" className="hover:underline">Register</Link>
          <Link to="/signIn" className="hover:underline">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
