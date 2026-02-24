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
import HeaderV2 from './components/HeaderV2';
// import WithSubnavigation from './components/NavbarDefault'

export const Context = createContext()
function App() {
  const [userDetails, setUserDetails] = useState()
  const [loginState, setLoginState] = useState()

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        let response = await fetch('/api/health', {
          credentials: 'include',
        });

        // fallback if first fails
        if (!response.ok) {
          response = await fetch('/health');
        }

        // check HTTP status
        if (response.status === 200) {
          const data = await response.json();
          console.log("Response:", data);

          if (data.success) {
            setUserDetails(data.data);
            setLoginState(true);
          }
        } else {
          console.log("Non-200 status:", response.status);
        }

      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    checkHealth();
  }, []);
  return (
    <Router>

      <Context.Provider value={{ userDetails, setUserDetails, loginState, setLoginState }}>
        {/* <Header /> */}
        <HeaderV2 />

        {/* <WithSubnavigation/> */}
        {/* <App */}
        {/* <NavbarDefault/> */}
        <div className="font-mono text-base max-sm:mx-2 max-sm:text-sm max-lg:mx-20 max-xl:mx-32 max-2xl:mx-40 2xl:mx-40" >
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
