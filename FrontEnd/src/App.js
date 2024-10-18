// src/App.js
import { ToastContainer } from 'react-toastify';
import './App.css';
import { Home, Error, Header, UserProfile, Footer, Docs } from './import'; // Make sure Error404 is the correct component name
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter as Router
import "react-toastify/dist/ReactToastify.css";
import { createContext, useState } from 'react';
import Help from './components/Help';
import SignIn from './LoginRelated/SignIn';
import SignUp from './LoginRelated/SignUp';
import { Component } from './components/NavbarDefault';

export const Context = createContext()
function App() {
  const [userDetails, setUserDetails] = useState()
  const [loginState, setLoginState] = useState()
  return (
    <Router>
      <Context.Provider value={{ userDetails, setUserDetails, loginState, setLoginState }}>
        <Header />
        {/* <Component/> */}
        {/* <NavbarDefault/> */}
        <div className="font-mono max-sm:mx-2 max-sm:text-sm max-lg:mx-20 max-xl:mx-32 max-2xl:mx-40 2xl:mx-40" >
          {/* content bg-gradient-to-r from-black via-gray-800 to-black */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="*" element={<Error />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/help' element={<Help />} />
            <Route path='/documentation' element={<Docs />} />
          </Routes>
        </div>
        <ToastContainer position='top-center' />
        <Footer />
      </Context.Provider>
    </Router>
  );
}

export default App;
