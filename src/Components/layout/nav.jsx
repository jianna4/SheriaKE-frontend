import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, User, LogIn, LogOut, Briefcase, Users, Settings, MessageCircle, FileText, Gavel } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
  };

  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { name: 'Home', href: '/' },
      { name: 'AI Chat', href: '/chat' },
    ];

    if (!isAuthenticated) {
      return [
        ...commonItems,
        { name: 'Find a Lawyer', href: '/lawyers' },
      ];
    }

    if (user?.role === 'client') {
      return [
        ...commonItems,
        { name: 'Find a Lawyer', href: '/lawyers' },
        { name: 'My Cases', href: '/client/cases' },
        { name: 'Post Case', href: '/client/post-case' },
      ];
    }

    if (user?.role === 'lawyer') {
      return [
        ...commonItems,
        { name: 'Find Cases', href: '/cases' },
        { name: 'My Applications', href: '/lawyer/applications' },
        { name: 'My Profile', href: '/lawyer/profile' },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { name: 'Admin Panel', href: '/admin/dashboard' },
        { name: 'Manage Users', href: '/admin/users' },
      ];
    }

    return commonItems;
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.username || 'User';
  };

  // Get user avatar initials
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#081c2b]/95 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-[#e89432] p-2 rounded-lg transform transition-transform group-hover:scale-105">
              <Scale className="w-6 h-6 text-[#081c2b]" />
            </div>
            <span className="text-xl font-bold text-white">
              Sheria<span className="text-[#f4ab5b]">KE</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {getNavItems().map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-[#f4ab5b] transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[#f4ab5b] border border-[#e89432] rounded-lg hover:bg-[#e89432] hover:text-[#081c2b] transition-all flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-[#e89432] text-[#081c2b] rounded-lg font-semibold hover:bg-[#f4ab5b] transition-all"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(!isProfileOpen);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#153a56] transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#f4ab5b] to-[#d47a1a] rounded-full flex items-center justify-center text-[#081c2b] font-bold">
                    {getUserInitials()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium text-white">{getUserDisplayName()}</p>
                    <p className="text-xs text-[#f4ab5b] capitalize">{user?.role}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[#153a56] rounded-lg shadow-xl border border-[#1e4a6e] overflow-hidden">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-[#1e4a6e]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#f4ab5b] to-[#d47a1a] rounded-full flex items-center justify-center text-[#081c2b] font-bold text-lg">
                          {getUserInitials()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{getUserDisplayName()}</p>
                          <p className="text-sm text-gray-400">{user?.email}</p>
                          <p className="text-xs text-[#f4ab5b] capitalize mt-1">{user?.role}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items based on role */}
                    <div className="py-2">
                      {user?.role === 'client' && (
                        <>
                          <Link
                            to="/client/dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Users className="w-4 h-4" />
                            Client Dashboard
                          </Link>
                          <Link
                            to="/client/cases"
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FileText className="w-4 h-4" />
                            My Cases
                          </Link>
                          <Link
                            to="/client/post-case"
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Post a Case
                          </Link>
                        </>
                      )}

                      {user?.role === 'lawyer' && (
                        <>
                          <Link
                            to="/lawyer/dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Briefcase className="w-4 h-4" />
                            Lawyer Dashboard
                          </Link>
                          <Link
                            to="/lawyer/profile"
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Gavel className="w-4 h-4" />
                            My Law Profile
                          </Link>
                          <Link
                            to="/lawyer/cases"
                            className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FileText className="w-4 h-4" />
                            Browse Cases
                          </Link>
                        </>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Account Settings
                      </Link>

                      <hr className="my-2 border-[#1e4a6e]" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-[#1e4a6e] hover:text-red-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1e4a6e]">
            <div className="flex flex-col gap-3">
              {getNavItems().map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-300 hover:text-[#f4ab5b] py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated ? (
                <div className="flex gap-3 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center px-4 py-2 text-[#f4ab5b] border border-[#e89432] rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 text-center px-4 py-2 bg-[#e89432] text-[#081c2b] rounded-lg font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#1e4a6e]">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#f4ab5b] to-[#d47a1a] rounded-full flex items-center justify-center text-[#081c2b] font-bold">
                      {getUserInitials()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-[#f4ab5b] capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 px-4 py-2 text-red-400 text-left hover:bg-[#153a56] rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;