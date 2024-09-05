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

    }
  }

  useEffect(() => {
    authenticateUser()
    // async function test() {
    //   const response = await fetch(`${BackEndPort}/getData`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       ApiKey: "b302cea952ef0f8d",
    //       Target: "https://www.swiggy.com/dapi/restaurants/list/v5?lat=13.1017167&lng=77.634826600000011"
    //     })
    //   })
    //   const data = response.json;
    //   console.log(data)
    // }
    // test()
    // eslint-disable-next-line
  }, [])
  return (
    <header className="bg-blue-600 text-white p-4">
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
  );
};

export default Header;
