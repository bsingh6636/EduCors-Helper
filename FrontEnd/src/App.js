import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import BrowserRouter as Router
import "react-toastify/dist/ReactToastify.css";
import React, { createContext, useState, lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';

// Lazy load components from ./import
const Home = lazy(() => import('./import').then(module => ({ default: module.Home })));
const Error = lazy(() => import('./import').then(module => ({ default: module.Error })));
const Header = lazy(() => import('./import').then(module => ({ default: module.Header })));
const UserProfile = lazy(() => import('./import').then(module => ({ default: module.UserProfile })));
const Footer = lazy(() => import('./import').then(module => ({ default: module.Footer })));
const Docs = lazy(() => import('./import').then(module => ({ default: module.Docs })));

// Lazy load other components
const Help = lazy(() => import('./components/Help'));
const SignIn = lazy(() => import('./LoginRelated/SignIn'));
const SignUp = lazy(() => import('./LoginRelated/SignUp'));
const HeaderV2 = lazy(() => import('./components/HeaderV2'));

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
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
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
        </Suspense>
      </Context.Provider>
    </Router>
  );
}

export default App;
