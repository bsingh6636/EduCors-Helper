// Import from components
import Header from './components/Header';
import Dashboard from './components/Dashboard'; 
import SignInAndSignUp from './components/SignnInAndSIngUp'; 
import UserHome from './components/UserHome';

// Import from pages
import Error from './pages/Error';
import SignInPrompt from './pages/SignInPrompt';

// Import from others
const BackEndPort = process.env.REACT_APP_BACKEND_SERVER;

// Export statements
export { Header, Dashboard, SignInAndSignUp, UserHome , Error, SignInPrompt , BackEndPort };
