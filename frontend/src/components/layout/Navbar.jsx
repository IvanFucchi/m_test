import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LocationSearchMap from '../common/LocationSearchMap';

const Navbar = ({ handleSearch }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white-600 text-gray shadow-md">
      <div className="container-custom py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          {/* <Link to="/" className="text-2xl font-bold">MUSA</Link> */}
          <Link to="/" className="flex items-center">
            <img
              src="/images/logo.png"
              alt="MUSA Logo"
              className="h-24"
            />
            
          </Link>

          <LocationSearchMap onSearch={handleSearch} />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
            <Link to="/explore" className="hover:text-gray-200 transition-colors">Esplora</Link>

            {isAuthenticated ? (
              <>
                <div className="relative group">
                  <button
                    className="flex items-center hover:text-white-200 transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span className="mr-1">{user.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profilo
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard Admin
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">Accedi</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors">Registrati</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-3 space-y-3">
            <Link
              to="/"
              className="block hover:text-blue-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="block hover:text-blue-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Explore
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block hover:text-blue-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profilo
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard Admin
                  </Link>
                )}

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left hover:text-blue-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block hover:text-blue-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accedi
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-gray-600 px-4 py-2 rounded-md hover:bg-blue-50 transition-colors inline-block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrati
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
