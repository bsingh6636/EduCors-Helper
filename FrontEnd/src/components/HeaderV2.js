import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackEndPort } from '../import';
import { Context } from '../App';
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

export default function HeaderV2() {
  const { setUserDetails, setLoginState } = useContext(Context);
  const [headerState, setHeaderState] = useState(false);
  const navigate = useNavigate();
  async function authenticateUser() {
    try {
      const response = await fetch(`${BackEndPort}/auth`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setLoginState(true);
        setUserDetails(data.data);
      } else {
        setLoginState(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    authenticateUser();
    // eslint-disable-next-line
  }, []);

  function handleNavigation(path) {
    navigate(path);
    setHeaderState(false); // Close menu on navigation
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center justify-between px-4 md:px-6">
        {/* Logo Section */}
        <Link to="/" className="flex items-center">
          <img src="./logo192.png" alt="logo" className="h-10 w-10 rounded-lg" />
          <span className="sr-only">Platform Logo</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex gap-4 text-white">
          <NavLink path="/" label="Home" />
          <NavLink path="/profile" label="Profile" />
          <NavLink path="/documentation" label="Documentation" />
          <NavLink path="/help" label="Help" />
        </nav>

        {/* Sign-In/Sign-Up Buttons */}
        <div className="hidden lg:flex gap-2">
          <button
            onClick={() => handleNavigation('/signIn')}
            className="group inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100"
          >
            Sign In
          </button>
          <button
            onClick={() => handleNavigation('/signUp')}
            className="group inline-flex h-9 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800"
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="lg:hidden">
          {headerState ? (
            <RxCross2 className="text-4xl text-gray-500" onClick={() => setHeaderState(false)} />
          ) : (
            <RxHamburgerMenu className="text-4xl text-gray-500" onClick={() => setHeaderState(true)} />
          )}
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {headerState && (
        <div className="lg:hidden bg-gray-500 shadow-md rounded-md py-4">
          <div className="flex flex-col items-center">
            <NavLink path="/" label="Home" onClick={() => setHeaderState(false)} />
            <NavLink path="/profile" label="Profile" onClick={() => setHeaderState(false)} />
            <NavLink path="/documentation" label="Documentation" onClick={() => setHeaderState(false)} />
            <NavLink path="/help" label="Help" onClick={() => setHeaderState(false)} />
            <button
              onClick={() => handleNavigation('/signIn')}
              className="my-2 inline-flex h-9 items-center justify-center rounded-md text-black bg-gray-100 px-4 py-2 text-sm font-medium"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavigation('/signUp')}
              className="my-2 inline-flex h-9 items-center justify-center rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavLink({ path, label, onClick }) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className="group inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-100 hover:text-gray-900"
    >
      {label}
    </Link>
  );
}
