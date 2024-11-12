import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Navbar from './components/Navbar';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
