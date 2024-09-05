import React, { useContext, useEffect, useState } from 'react';
import { BackEndPort } from '../import';
import { toast } from 'react-toastify';
import { Context } from '../App';
import { useNavigate } from 'react-router-dom';
import '../css/SignInAndSignUp.css';

const SignInAndSignUp = () => {
    const { userDetails, setUserDetails, setLoginState } = useContext(Context);
    const navigate = useNavigate();

    const [UserNameorEmail, setUserNameorEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [Email, setEmail] = useState('');
    const [UserName, setUserName] = useState('');
    const [Name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    // Error states
    const [errors, setErrors] = useState({
        UserNameorEmail: '',
        Password: '',
        Email: '',
        UserName: '',
        Name: ''
    });

    useEffect(() => {
        if (userDetails) {
            navigate('/profile');
        }
        // eslint-disable-next-line
    }, [userDetails]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let hasErrors = false;

        // Reset errors
        setErrors({
            UserNameorEmail: '',
            Password: '',
            Email: '',
            UserName: '',
            Name: ''
        });

        // Validation checks
        if (isSignUp) {
            if (!Email || !UserName || !Name || !Password) {
                toast.error('Please fill in all fields.');
                return;
            }

            if (Email.length === 0) {
                setErrors(prev => ({ ...prev, Email: 'Email is required.' }));
                hasErrors = true;
            }
            if (UserName.length < 5) {
                setErrors(prev => ({ ...prev, UserName: 'Username must be at least 5 characters.' }));
                hasErrors = true;
            }
            if (Name.length < 5) {
                setErrors(prev => ({ ...prev, Name: 'Name must be at least 5 characters.' }));
                hasErrors = true;
            }
            if (Password.length < 6) {
                setErrors(prev => ({ ...prev, Password: 'Password must be at least 6 characters.' }));
                hasErrors = true;
            }
        } else {
            if (!UserNameorEmail || !Password) {
                toast.error('Please fill in all fields.');
                return;
            }

            if (UserNameorEmail.length === 0) {
                setErrors(prev => ({ ...prev, UserNameorEmail: 'Username or Email is required.' }));
                hasErrors = true;
            }
            if (Password.length < 6) {
                setErrors(prev => ({ ...prev, Password: 'Password must be at least 6 characters.' }));
                hasErrors = true;
            }
        }

        if (hasErrors) return;

        try {
            if (isSignUp) {
                const signUp = await fetch(`${BackEndPort}/signUp`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Email, UserName, Password, Name }),
                    credentials: 'include',
                });

                const response = await signUp.json();
                if (response.success) {
                    toast.success(response.message);
                    toast(response.message);
                    setUserDetails(response.data)
                    setLoginState(true)
                    navigate('/profile');
                } else {
                    toast.error(response.message);
                }
            } else {
                const signIn = await fetch(`${BackEndPort}/SignIn`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ UserNameorEmail, Password }),
                });

                const response = await signIn.json();
                if (response.success) {
                    toast(response.message);
                    setUserDetails(response.data)
                    setLoginState(true)
                    navigate('/profile');
                } else {
                    toast.error(response.message);
                }
            }
        } catch (error) {
            console.log('error',error)
            toast.error("error occured",error);
        }
    };

    return (
        <div className="auth-container text-black">
            <div className={`auth-box ${isSignUp ? 'slide-right' : 'slide-left'}`}>
                <h3 className={`auth-title ${isSignUp ? 'fade-in' : 'fade-out'}`}>
                    {isSignUp ? 'User Sign-Up' : 'User Login'}
                </h3>
                <form onSubmit={handleSubmit} className="auth-form">
                    {isSignUp && (
                        <>
                            <InputField 
                                label="Email" 
                                type="email" 
                                value={Email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                error={errors.Email}
                            />
                            <InputField 
                                label="UserName" 
                                type="text" 
                                value={UserName} 
                                onChange={(e) => setUserName(e.target.value)} 
                                error={errors.UserName}
                            />
                            <InputField 
                                label="Name" 
                                type="text" 
                                value={Name} 
                                onChange={(e) => setName(e.target.value)} 
                                error={errors.Name}
                            />
                        </>
                    )}
                    {!isSignUp && (
                        <InputField 
                            label="Enter Email or UserName" 
                            type="text" 
                            value={UserNameorEmail} 
                            onChange={(e) => setUserNameorEmail(e.target.value)} 
                            error={errors.UserNameorEmail}
                        />
                    )}
                    <InputField 
                        label="Password" 
                        type="password" 
                        value={Password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        error={errors.Password}
                    />

                    <button
                        type="submit"
                        className="auth-button primary-button"
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="auth-button secondary-button"
                    >
                        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const InputField = ({ label, type, value, onChange, error }) => (
    <div className="input-field">
        <label className="input-label">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="input-box"
        />
        {error && <div className="input-error">{error}</div>}
    </div>
);

export default SignInAndSignUp;
