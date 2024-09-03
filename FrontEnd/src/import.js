// Import from components
import Header from './components/Header';
import Home from './components/Home'; 
import SignInAndSignUp from './components/SignnInAndSIngUp'; 
import UserHome from './components/UserHome';
// import DashBoard from './components/DashBoard';
import UserDashBoard from './components/UserDashBoard';


// Import from pages
import Error from './pages/Error';
import SignInPrompt from './pages/SignInPrompt';

// Import from others
const BackEndPort = process.env.REACT_APP_BACKEND_SERVER;

// Export statements
export { Header, Home, SignInAndSignUp, UserHome  , UserDashBoard ,  Error, SignInPrompt , BackEndPort };
