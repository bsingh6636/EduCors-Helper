import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackEndPort } from '../import';
import { Context } from '../App';
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const { setUserDetails, setLoginState } = useContext(Context);
  const [headerState, setHeaderState] = useState(false);
  const navigate = useNavigate();

  async function authenticateUser() {
    const response = await fetch(`${BackEndPort}/auth`, {
      credentials: 'include'
    });
    const data = await response.json();
    if (data.success) {
      setLoginState(true);
      setUserDetails(data.data);
    } else {
      setLoginState(false);
    }
  }

  useEffect(() => {
    authenticateUser()
    githubUserData();
    // eslint-disable-next-line
  }, []);

  function onclicks() {
    navigate('/signIn');
  }
  const API_KEY = 'b7281e6314960112';
  const EDUCORS_URL ='http://localhost:3001/api/getData';
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
     // Example usage
     githubUserData();

  return (
    <header className="text-white flex justify-evenly pt-10 max-lg:pt-1 max-xl:mt-6 mb-10 max-sm:mt-2 max-sm:mb-1 max-sm:px-2">
      <div className="">
        <Link to="/"><img className='w-10 h-10 rounded-lg' src='./logo192.png' alt='logo' /></Link>
      </div>
      <div className='mt-0 border-t-[1px] text-2xl border-slate-400 max-sm:hidden'>
        <LinkTags className='flex justify-center  font-mono ' />
      </div>
      <div className='flex max-lg:flex-row'>
        <button className='mx-3 px-4 py-2 max-lg:px-2 max-lg:mx-2 rounded-lg bg-white text-black border-2 border-red-600 hover:border-blue-700 hover:bg-blue-700 hover:text-white transition duration-300 ease-in-out shadow-md'
          onClick={onclicks}>𝒮𝒾𝑔𝓃𝐼𝓃</button>
        <button className='mx-3 px-4 py-2 max-lg:px-2 max-lg:mx-2 rounded-lg bg-blue-700 text-white border-2 border-red-600 hover:border-white hover:bg-white hover:text-blue-700 transition duration-300 ease-in-out shadow-md'
          onClick={onclicks}>𝓢𝓲𝓰𝓷𝓤𝓹</button>
        <div className='lg:hidden relative flex float-end'>
          {!headerState ? <RxHamburgerMenu className='text-blue-500 text-4xl ' onClick={() => setHeaderState(!headerState)} /> : <RxCross2 className='text-blue-500 text-4xl' onClick={() => setHeaderState(!headerState)}/>  }
          {headerState && (
            <div className="relative">
            {/* Dropdown Container */}
            {headerState && (
              <div
                className="absolute top-full text-xl right-0 mt-2 w-96 bg-black border border-gray-300 shadow-lg overflow-auto z-10"
                style={{
                  maxHeight: '700px',
                  marginLeft: '100px'
                }}
                onClick={()=> setTimeout(()=>setHeaderState(!headerState),100)}
              >
                <div className="flex flex-col p-2 items-center">
                  <LinkTags className="text-white " />
                </div>
              </div>
            )}
          </div>
          
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

const LinkTags = () => {
  return (
    <>
      <Link to="/" className="nav-link mx-3 px-1 py-[4px] rounded-lg max-lg:my-1 ">Home</Link>
      <Link to="/profile" className="nav-link mx-3 px-1 py-[4px] rounded-lg max-lg:my-1">Profile</Link>
      <Link to="/documentation" className="nav-link mx-3 px-1 py-[4px] rounded-lg max-lg:my-1">Documentation</Link>
      {/* <Link to="/signIn" className="nav-link mx-3 px-1 py-[4px] rounded-lg max-lg:my-1">Register</Link> */}
      <Link to="/help" className="nav-link mx-3 px-1 py-[4px] rounded-lg max-lg:my-1">Help</Link>
    </>
  );
}
