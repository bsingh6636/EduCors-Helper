// src/App.js
import { ToastContainer } from 'react-toastify';
import './App.css';
import { Dashboard, Error, Header, SignInAndSignUp, UserHome } from './import'; // Make sure Error404 is the correct component name
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter as Router
import "react-toastify/dist/ReactToastify.css";
import { createContext, useState } from 'react';

export const Context = createContext()
function App() {
  const [userDetails, setUserDetails] = useState()
  const [loginState, setLoginState] = useState()
  return (
    <Router>
      <Context.Provider value={{ userDetails, setUserDetails, loginState, setLoginState }}>
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signIn" element={<SignInAndSignUp />} />
            <Route path="*" element={<Error />} />
            <Route path='/home' element={<UserHome />} />
          </Routes>
        </div>
        <ToastContainer position='top-center' />
      </Context.Provider>
    </Router>
  );
}

export default App;
