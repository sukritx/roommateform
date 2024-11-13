import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react'; // Import icons
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return (
      <nav className="bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="text-xl font-bold">Roommateform</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Roommateform</Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/browse" className="text-sm hover:text-primary">
              Browse Rooms
            </Link>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Button asChild variant="outline">
                    <Link to="/create-form">Create Listing</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" onClick={logout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost">
                    <Link to="/signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/browse" 
              className="block text-sm hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Rooms
            </Link>
            {isAuthenticated ? (
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/create-form" onClick={() => setIsMenuOpen(false)}>
                    Create Listing
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;