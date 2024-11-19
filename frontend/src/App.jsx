import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import FormDetails from './pages/FormDetails';
import BrowseForms from './pages/BrowseForms';
import AuthCallback from './pages/AuthCallback';
import SubmissionsDashboard from './pages/SubmissionsDashboard';
import MySubmissions from './pages/MySubmissions';
import Navbar from './components/Navbar';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

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
            <Route path="/browse" element={<BrowseForms />} />
            <Route path="/forms/:id" element={<FormDetails />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-form" element={<CreateForm />} />
              <Route path="/submissions" element={<SubmissionsDashboard />} />
              <Route path="/my-submissions" element={<MySubmissions />} />
            </Route>
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
