import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scale, Menu, X, User, LogIn, LogOut, Briefcase, Users, Settings, MessageCircle, FileText, Gavel } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const profileButtonRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on mobile menu button or inside mobile menu
      if (mobileButtonRef.current && mobileButtonRef.current.contains(event.target)) {
        return;
      }
      if (mobileMenuRef.current && mobileMenuRef.current.contains(event.target)) {
        return;
      }
      // If clicking outside, close mobile menu
      setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is on profile button or inside profile menu
      if (profileButtonRef.current && profileButtonRef.current.contains(event.target)) {
        return;
      }
      if (profileMenuRef.current && profileMenuRef.current.contains(event.target)) {
        return;
      }
      // If clicking outside, close profile menu
      setIsProfileOpen(false);
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsProfileOpen(false);
    setIsMenuOpen(false);
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
        { name: 'Messages', href: '/messages' },
      ];
    }

    if (user?.role === 'lawyer') {
      return [
        ...commonItems,
        { name: 'Find Cases', href: '/cases' },
        { name: 'My Applications', href: '/lawyer/applications' },
        { name: 'My Profile', href: '/lawyer/profile' },
        { name: 'Messages', href: '/messages' },
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

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close profile menu when opening mobile menu
    if (!isMenuOpen) {
      setIsProfileOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-[#081c2b]/95 backdrop-blur-sm shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
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

            {/* Auth Buttons / User Menu - Desktop */}
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
                    ref={profileButtonRef}
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

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div 
                      ref={profileMenuRef}
                      className="absolute right-0 mt-2 w-80 bg-[#153a56] rounded-lg shadow-xl border border-[#1e4a6e] overflow-hidden"
                    >
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
                            <Link
                           to="/messages"
                                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                               onClick={() => setIsProfileOpen(false)}
                            >
                              <MessageCircle className="w-4 h-4" />
                              Messages
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
                              to="/lawyer/profile-setup"
                              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Gavel className="w-4 h-4" />
                              My Law Profile
                            </Link>
                            <Link
                              to="/lawyer/applications"
                               className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <FileText className="w-4 h-4" />
                              Browse Cases
                            </Link>
                            <Link
                               to="/messages"
                                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-[#1e4a6e] hover:text-[#f4ab5b] transition-colors"
                               onClick={() => setIsProfileOpen(false)}
                            >
                              <MessageCircle className="w-4 h-4" />
                                   Messages
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
              ref={mobileButtonRef}
              onClick={toggleMobileMenu}
              className="md:hidden text-white p-2 z-50 relative"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          
          {/* Mobile Menu Panel */}
          <div 
            ref={mobileMenuRef}
            className="absolute top-16 left-0 right-0 bg-[#081c2b] shadow-xl animate-slide-down"
          >
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Navigation Links */}
              <div className="px-4 py-6 border-b border-[#1e4a6e]">
                <div className="flex flex-col space-y-4">
                  {getNavItems().map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-gray-300 hover:text-[#f4ab5b] py-2 text-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Auth Section for Mobile */}
              <div className="px-4 py-6">
                {!isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-2 px-4 py-3 text-[#f4ab5b] border border-[#e89432] rounded-lg hover:bg-[#e89432] hover:text-[#081c2b] transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-[#e89432] text-[#081c2b] rounded-lg font-semibold hover:bg-[#f4ab5b] transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3 p-3 bg-[#153a56] rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#f4ab5b] to-[#d47a1a] rounded-full flex items-center justify-center text-[#081c2b] font-bold text-lg">
                        {getUserInitials()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{getUserDisplayName()}</p>
                        <p className="text-sm text-gray-400">{user?.email}</p>
                        <p className="text-xs text-[#f4ab5b] capitalize mt-1">{user?.role}</p>
                      </div>
                    </div>

                    {/* Mobile Menu Items based on role */}
                    <div className="space-y-2">
                      {user?.role === 'client' && (
                        <>
                          <Link
                            to="/client/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#153a56] hover:text-[#f4ab5b] rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Users className="w-5 h-5" />
                            Client Dashboard
                          </Link>
                          <Link
                            to="/client/cases"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#153a56] hover:text-[#f4ab5b] rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <FileText className="w-5 h-5" />
                            My Cases
                          </Link>
                          <Link
                            to="/client/post-case"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#153a56] hover:text-[#f4ab5b] rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <MessageCircle className="w-5 h-5" />
                            Post a Case
                          </Link>
                        </>
                      )}

                      {user?.role === 'lawyer' && (
                        <>
                          <Link
                            to="/lawyer/dashboard"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#153a56] hover:text-[#f4ab5b] rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Briefcase className="w-5 h-5" />
                            Lawyer Dashboard
                          </Link>
                          <Link
                            to="/lawyer/profile-setup"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#153a56] hover:text-[#f4ab5b] rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Gavel className="w-5 h-5" />
                            My Law Profile
                          </Link>
                          <Link
                            to="/lawyer/applications"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#153a56] hover:text-[#f4ab5b] rounded-lg transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <FileText className="w-5 h-5" />
                            Browse Cases
                          </Link>
                        </>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#153a56] hover:text-[#f4ab5b] rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        Account Settings
                      </Link>

                      <hr className="my-2 border-[#1e4a6e]" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-[#153a56] hover:text-red-300 rounded-lg transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animation CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;