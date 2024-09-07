// src/App.js
import { ToastContainer } from 'react-toastify';
import './App.css';
import { Home, Error, Header, SignInAndSignUp, UserProfile, Footer } from './import'; // Make sure Error404 is the correct component name
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter as Router
import "react-toastify/dist/ReactToastify.css";
import { createContext, useState } from 'react';
import Help from './components/Help';
import DashBoard from './pages/DashBoard';

export const Context = createContext()
function App() {
  const [userDetails, setUserDetails] = useState()
  const [loginState, setLoginState] = useState()
  return (
    <Router>
      <Context.Provider value={{ userDetails, setUserDetails, loginState, setLoginState }}>
        <Header />
        <div className="bg-black font-mono">
        {/* content bg-gradient-to-r from-black via-gray-800 to-black */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signIn" element={<SignInAndSignUp />} />
            <Route path="*" element={<Error />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/help' element={<Help/>}/>
            <Route path='/dashboard' element={<DashBoard/>}/>
          </Routes>
        </div>
        <ToastContainer position='top-center'  />
        <Footer/>
     
      </Context.Provider>
    </Router>
  );
}

export default App;
