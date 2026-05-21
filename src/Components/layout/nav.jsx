import React, { useState } from 'react';
import { Scale, Menu, X, User, LogIn } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-navy-900/95 backdrop-blur-sm shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-gold-500 p-2 rounded-lg transform transition-transform group-hover:scale-105">
              <Scale className="w-6 h-6 text-navy-900" />
            </div>
            <span className="text-xl font-bold text-white">
              Sheria<span className="text-gold-400">KE</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-gray-300 hover:text-gold-400 transition-colors">Home</a>
            <a href="#features" className="text-gray-300 hover:text-gold-400 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-gold-400 transition-colors">How It Works</a>
            <a href="/lawyers" className="text-gray-300 hover:text-gold-400 transition-colors">Find a Lawyer</a>
            <a href="/chat" className="text-gray-300 hover:text-gold-400 transition-colors">AI Chat</a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="px-4 py-2 text-gold-400 border border-gold-400 rounded-lg hover:bg-gold-400 hover:text-navy-900 transition-all flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </a>
            <a href="/signup" className="px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold hover:bg-gold-400 transition-all">
              Get Started
            </a>
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
          <div className="md:hidden py-4 border-t border-navy-800">
            <div className="flex flex-col gap-3">
              <a href="#home" className="text-gray-300 hover:text-gold-400 py-2">Home</a>
              <a href="#features" className="text-gray-300 hover:text-gold-400 py-2">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-gold-400 py-2">How It Works</a>
              <a href="/lawyers" className="text-gray-300 hover:text-gold-400 py-2">Find a Lawyer</a>
              <a href="/chat" className="text-gray-300 hover:text-gold-400 py-2">AI Chat</a>
              <div className="flex gap-3 pt-2">
                <a href="/login" className="flex-1 text-center px-4 py-2 text-gold-400 border border-gold-400 rounded-lg">Sign In</a>
                <a href="/signup" className="flex-1 text-center px-4 py-2 bg-gold-500 text-navy-900 rounded-lg font-semibold">Get Started</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;