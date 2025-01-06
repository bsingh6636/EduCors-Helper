// import * as React from 'react';
// import { Link as DOMLink } from 'react-router-dom'
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Checkbox from '@mui/material/Checkbox';
// import CssBaseline from '@mui/material/CssBaseline';
// import Divider from '@mui/material/Divider';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormLabel from '@mui/material/FormLabel';
// import FormControl from '@mui/material/FormControl';
// import Link from '@mui/material/Link';
// import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
// import Stack from '@mui/material/Stack';
// import MuiCard from '@mui/material/Card';
// import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// import getSignUpTheme from './getSignUpTheme';
// import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
// import TemplateFrame from './TemplateFrame';
// import AppTheme from './AppTheme';


// const Card = styled(MuiCard)(({ theme }) => ({
//     display: 'flex',
//     flexDirection: 'column',
//     alignSelf: 'center',
//     width: '100%',
//     padding: theme.spacing(4),
//     gap: theme.spacing(2),
//     margin: 'auto',
//     boxShadow:
//         'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
//     [theme.breakpoints.up('sm')]: {
//         width: '450px',
//     },
//     ...theme.applyStyles('dark', {
//         boxShadow:
//             'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
//     }),
// }));

// const SignUpContainer = styled(Stack)(({ theme }) => ({
//     minHeight: '100%',
//     padding: theme.spacing(2),
//     [theme.breakpoints.up('sm')]: {
//         padding: theme.spacing(4),
//     },
//     backgroundImage:
//         'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
//     backgroundRepeat: 'no-repeat',
//     ...theme.applyStyles('dark', {
//         backgroundImage:
//             'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
//     }),
// }));

// const SignUp = () => {
//     const [mode, setMode] = React.useState('light');
//     const [showCustomTheme, setShowCustomTheme] = React.useState(true);
//     const defaultTheme = createTheme({ palette: { mode } });
//     const SignUpTheme = createTheme(getSignUpTheme(mode));
//     const [nameError, setNameError] = React.useState(false);
//     const [nameErrorMessage, setNameErrorMessage] = React.useState('');
//     const [emailError, setEmailError] = React.useState(false);
//     const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
//     const [passwordError, setPasswordError] = React.useState(false);
//     const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
//     // This code only runs on the client side, to determine the system color preference
//     React.useEffect(() => {
//         // Check if there is a preferred mode in localStorage
//         const savedMode = localStorage.getItem('themeMode');
//         if (savedMode) {
//             setMode(savedMode);
//         } else {
//             // If no preference is found, it uses system preference
//             const systemPrefersDark = window.matchMedia(
//                 '(prefers-color-scheme: dark)',
//             ).matches;
//             setMode(systemPrefersDark ? 'dark' : 'light');
//         }
//     }, []);

//     const toggleColorMode = () => {
//         const newMode = mode === 'dark' ? 'light' : 'dark';
//         setMode(newMode);
//         localStorage.setItem('themeMode', newMode); // Save the selected mode to localStorage
//     };

//     const toggleCustomTheme = () => {
//         setShowCustomTheme((prev) => !prev);
//     };

//     const validateInputs = () => {
//         const email = document.getElementById('email');
//         const password = document.getElementById('password');
//         const name = document.getElementById('name');

//         let isValid = true;

//         if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
//             setEmailError(true);
//             setEmailErrorMessage('Please enter a valid email address.');
//             isValid = false;
//         } else {
//             setEmailError(false);
//             setEmailErrorMessage('');
//         }

//         if (!password.value || password.value.length < 6) {
//             setPasswordError(true);
//             setPasswordErrorMessage('Password must be at least 6 characters long.');
//             isValid = false;
//         } else {
//             setPasswordError(false);
//             setPasswordErrorMessage('');
//         }

//         if (!name.value || name.value.length < 1) {
//             setNameError(true);
//             setNameErrorMessage('Name is required.');
//             isValid = false;
//         } else {
//             setNameError(false);
//             setNameErrorMessage('');
//         }

//         return isValid;
//     };

//     const handleSubmit = (event) => {
//         if (nameError || emailError || passwordError) {
//             event.preventDefault();
//             return;
//         }
//         const data = new FormData(event.currentTarget);
//         console.log({
//             name: data.get('name'),
//             lastName: data.get('lastName'),
//             email: data.get('email'),
//             password: data.get('password'),
//         });
//     };

//     return (


//         <>
//           {/* <TemplateFrame
//           toggleCustomTheme={toggleCustomTheme}
//            showCustomTheme={showCustomTheme}
//            mode={mode}
//            toggleColorMode={toggleColorMode}
//          > */}
//             <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
//                 <CssBaseline enableColorScheme />
//                 <SignUpContainer direction="column" justifyContent="space-between">
//                     <Card variant="outlined">
//                         {/* <SitemarkIcon /> */}
//                         <Typography
//                             component="h1"
//                             variant="h4"
//                             sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
//                         >
//                             Sign up
//                         </Typography>
//                         <Box
//                             component="form"
//                             onSubmit={handleSubmit}
//                             sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
//                         >
//                             <FormControl>
//                                 <FormLabel htmlFor="name">Full name</FormLabel>
//                                 <TextField
//                                     autoComplete="name"
//                                     name="name"
//                                     required
//                                     fullWidth
//                                     id="name"
//                                     placeholder="Jon Snow"
//                                     error={nameError}
//                                     helperText={nameErrorMessage}
//                                     color={nameError ? 'error' : 'primary'}
//                                 />
//                             </FormControl>
//                             <FormControl>
//                                 <FormLabel htmlFor="email">Email</FormLabel>
//                                 <TextField
//                                     required
//                                     fullWidth
//                                     id="email"
//                                     placeholder="your@email.com"
//                                     name="email"
//                                     autoComplete="email"
//                                     variant="outlined"
//                                     error={emailError}
//                                     helperText={emailErrorMessage}
//                                     color={passwordError ? 'error' : 'primary'}
//                                 />
//                             </FormControl>
//                             <FormControl>
//                                 <FormLabel htmlFor="password">Password</FormLabel>
//                                 <TextField
//                                     required
//                                     fullWidth
//                                     name="password"
//                                     placeholder="••••••"
//                                     type="password"
//                                     id="password"
//                                     autoComplete="new-password"
//                                     variant="outlined"
//                                     error={passwordError}
//                                     helperText={passwordErrorMessage}
//                                     color={passwordError ? 'error' : 'primary'}
//                                 />
//                             </FormControl>
//                             <FormControlLabel
//                                 control={<Checkbox value="allowExtraEmails" color="primary" />}
//                                 label="I want to receive updates via email."
//                             />
//                             <Button
//                                 type="submit"
//                                 fullWidth
//                                 variant="contained"
//                                 onClick={validateInputs}
//                             >
//                                 Sign up
//                             </Button>
//                             <Typography sx={{ textAlign: 'center' }}>
//                                 Already have an account?{' '}
//                                 <span>
//                                     <DOMLink
//                                         to="/signin"
//                                         variant="body2"
//                                         sx={{ alignSelf: 'center' }}
//                                     >
//                                         Sign in
//                                     </DOMLink>
//                                 </span>
//                             </Typography>
//                         </Box>
//                         {/* <Divider>
//               <Typography sx={{ color: 'text.secondary' }}>or</Typography>
//             </Divider>
//             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => alert('Sign up with Google')}
//                 startIcon={<GoogleIcon />}
//               >
//                 Sign up with Google
//               </Button>
//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => alert('Sign up with Facebook')}
//                 startIcon={<FacebookIcon />}
//               >
//                 Sign up with Facebook
//               </Button>
//             </Box> */}
//                     </Card>
//                 </SignUpContainer>
//             </ThemeProvider>
//             {/* </TemplateFrame> */}
//         </>
//     );
// }

// export default SignUp;

import * as React from 'react';
import { Link as DOMLink, useNavigate, useParams } from 'react-router-dom'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import AppTheme from './AppTheme';
import ColorModeSelect from './ColorModeSelect';
import ForgotPassword from './ForgotPassword';
import { BackEndPort } from '../import';
import { toast } from 'react-toastify';
import { Context } from '../App';
import { FaSpinner } from 'react-icons/fa6';
const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

// export default function SignIn(props) {
const SignUp = (props) => {
    const [ userName , setUserName] = React.useState('')
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [password, setPassword] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [ name , setName] = React.useState('')
    const [loading , setLoading] = React.useState(false)
    const { loginState, userDetails, setLoginState, setUserDetails } = React.useContext(Context);
    const navigate = useNavigate()
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(()=>{
        if(loginState == true){
            navigate('/profile')
        }
    },[])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (emailError || passwordError) {
            toast.error("Please fix the errors before submitting.");
            return;
        }
        setLoading(true)
        const signUp = await fetch(`${BackEndPort}/SignUp`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email : email, Password: password , Name : name , UserName : userName }),
        });

        const response = await signUp.json();
        if (response.success) {
            toast(response.message);
            setUserDetails(response.data);
            setLoginState(true);
            navigate('/profile');
        } else {
            toast.error(response.message);
        }
        setLoading(false);
    };
   
    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const name = document.getElementById('name');

        let isValid = true;

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6 ||!/(?=.*[A-Z])(?=.*[0-9])/.test(password.value)) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long, contain at least one uppercase letter, and one number.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
        if (!name.value || name.value.length < 1) {
                        setNameError(true);
                        setNameErrorMessage('Name is required.');
                        isValid = false;
                    } else {
                        setNameError(false);
                        setNameErrorMessage('');
                    }
        return isValid;
    };

    function handleEmailChange(event) {
        setEmail(event.target.value)
        validateInputs()
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value)
        validateInputs()
    }

    function handleNameChange(e){
        setName(e.target.value)
        validateInputs()
    }

    function handleUserNameCHanges(e){
        setUserName(e.target.value)
    }
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
                {/* <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} /> */}
                <Card variant="outlined">
                    {/* <SitemarkIcon /> */}
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Sign Up
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Full name</FormLabel>
                            <TextField
                                autoComplete="name"
                                name="name"
                                required
                                fullWidth
                                id="name"
                                placeholder="Brijesh SIngh"
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? 'error' : 'primary'}
                                onChange={handleNameChange}
                            />
                            
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="name">userName</FormLabel>
                            <TextField
                                autoComplete="userName"
                                name="userName"
                                required
                                fullWidth
                                id="userName"
                                placeholder="bsingh6636"
                                error={nameError}
                                helperText={nameErrorMessage}
                                color={nameError ? 'error' : 'primary'}
                                onChange={handleUserNameCHanges}
                            />
                            
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="your@email.com"
                                autoComplete="email"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? 'error' : 'primary'}
                                sx={{ ariaLabel: 'email' }}
                                onChange={handleEmailChange}
                            />
                        </FormControl>
                        <FormControl>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <FormLabel htmlFor="password">Password</FormLabel>
                {/* <Link
                  component="button"
                  type="button"
                  onClick={handleClickOpen}
                  variant="body2"
                  sx={{ alignSelf: 'baseline' }}
                >
                  Forgot your password?
                </Link> */}
              </Box>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? 'error' : 'primary'}
                                onChange={handlePasswordChange}
                            />
                        </FormControl>
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <ForgotPassword open={open} handleClose={handleClose} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            onClick={validateInputs}
                        >
                                      { loading ?  <FaSpinner className="spinner !h-7 !w-7" /> : ' Sign Up'}
 
                          
                        </Button>
                        <Typography sx={{ textAlign: 'center' }}>
                            Already have an account?{' '}
                            <span>
                                <DOMLink
                                    to="/signin"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Sign In
                                </DOMLink>
                            </span>
                        </Typography>
                    </Box>
                    {/* <Divider>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
          </Box> */}
                </Card>
            </SignInContainer>
        </AppTheme>
    );
}

export default SignUp;