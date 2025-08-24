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
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F6638b6e3f08849eb91b735b1c7b57266%2Fcdff2b8e04844f57ab85e0438404980d?format=webp&width=800"
              alt="WellnessAI Logo"
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-xl font-bold text-white">WellnessAI</span>
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
