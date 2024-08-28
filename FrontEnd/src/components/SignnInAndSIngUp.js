import React, { useContext, useEffect, useState } from 'react';
import { BackEndPort } from '../import';
import { toast } from 'react-toastify';
import { Context } from '../App';
import { useNavigate } from 'react-router-dom';

const SignInAndSignUp = () => {
    const {userDetails} = useContext(Context)
    const navigate = useNavigate()

    const [UserNameorEmail,setUserNameorEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');
    const [UserName, setuserName] = useState('');
    const [Name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    // const { setLoginState } = useContext(Context);
   useEffect(()=>{
    if(userDetails){
        navigate('/home')
    }
   },[userDetails])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSignUp && (!Email || !UserName || !Name ||!Password)) {
            toast.error('Please fill in all fields.');
            return;
        }

        if (!isSignUp && (!UserNameorEmail || !Password)) {
            toast.error('Please fill in all fields.');
            return;
        }

        try {
            if (isSignUp) {
               try {
                const signUp = await fetch(`${BackEndPort}/user/signUp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Email, UserName, Password, Name }),
                    credentials: 'include',
                });
                
                 const response = await signUp.json();
                 if(response.success){
                    toast.success(response.message)
                 }else{
                    toast.error(response.message)
                 }
                 
               } catch (error) {
                    toast.error(error)
               }
            } else {
               try {
                 const signIn = await fetch(`${BackEndPort}/user/SignIn`, {
                     method: 'POST',
                     credentials: 'include',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ UserNameorEmail, Password }),
                 });
                 
                 const response = await signIn.json();
                 if(response.success){
                    toast(response.message)
                 }else{
                    toast.error(response.message)
                 }
               } catch (error) {
                toast.error(error)
               }
               
            }
        } catch (error) {
            toast.error(error)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 bg-opacity-70 backdrop-blur-sm">
            <div className="flex flex-col bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h3 className={`text-4xl font-bold text-teal-600 mb-6 text-center transition-transform duration-300 ${isSignUp ? '-translate-y-2' : 'translate-y-0'}`}>
                    {isSignUp ? 'User Sign-Up' : 'User Login'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignUp && (
                        <>
                            <InputField label="Email" type="email" value={Email} onChange={(e) => setEmail(e.target.value)} />
                            <InputField label="userName" type="text" value={UserName} onChange={(e) => setuserName(e.target.value)} />
                            <InputField label="Name" type="text" value={Name} onChange={(e) => setName(e.target.value)} />
                        </>
                    )}
                    {!isSignUp && (
                        <InputField label="Enter Email or userName" type="text" value={UserNameorEmail} onChange={(e) => setUserNameorEmail(e.target.value)} />
                    )}
                    <InputField label="Password" type="password" value={Password} onChange={(e) => setPassword(e.target.value)} />
                    
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-800 transition-transform transform hover:scale-105"
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="w-full bg-gray-600 text-white rounded-lg py-2 hover:bg-gray-800 transition-transform transform hover:scale-105"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const InputField = ({ label, type, value, onChange }) => (
    <div>
        <label className="block text-gray-700 font-semibold mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
    </div>
);

export default SignInAndSignUp;
