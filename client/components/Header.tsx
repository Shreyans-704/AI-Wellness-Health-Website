import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, User, Activity } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-900/95 to-blue-800/95 backdrop-blur-sm shadow-lg border-b border-blue-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 relative flex items-center justify-center">
              {/* Circuit Heartbeat Logo */}
              <svg
                viewBox="0 0 100 100"
                className="w-10 h-10 text-teal-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {/* Heartbeat line concept */}
                <path d="M 20 50 L 35 50 L 40 40 L 45 60 L 50 50 L 80 50" strokeLinecap="round" strokeLinejoin="round" />
                {/* Circuit dots */}
                <circle cx="20" cy="50" r="3" fill="currentColor" />
                <circle cx="35" cy="50" r="3" fill="currentColor" />
                <circle cx="80" cy="50" r="3" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white">AI Wellness</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-blue-100 hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/personal-details" className="text-blue-100 hover:text-white transition-colors">
              Personal Details
            </Link>
            <Link to="/health" className="text-blue-100 hover:text-white transition-colors">
              Health
            </Link>
            <Link to="/contact-info" className="text-blue-100 hover:text-white transition-colors">
              Contact Info
            </Link>
            
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-800/50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            title="Toggle navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-800/50">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-blue-100 hover:text-white transition-colors py-2">
                HOME
              </Link>
              <Link to="/personal-details" className="text-blue-100 hover:text-white transition-colors py-2">
                Personal Details
              </Link>
              <Link to="/health" className="text-blue-100 hover:text-white transition-colors py-2">
                Health
              </Link>
              <Link to="/contact-info" className="text-blue-100 hover:text-white transition-colors py-2">
                Contact Info
              </Link>
              <div className="pt-4 border-t border-blue-800/50">
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
