import { Link } from "react-router-dom";
import { Heart, Brain, Users, Mail, Phone, MapPin, Shield, Zap, TrendingUp, Stethoscope, Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Platform Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AI Wellness</span>
            </div>
            <p className="text-sm text-gray-400">
              Advanced AI-powered medical reasoning platform for intelligent healthcare decisions.
            </p>
          </div>

          {/* Navigation Sections */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <Stethoscope className="h-4 w-4 mr-2 text-blue-400" />
              Platform Sections
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span> Home & AI Query
                </Link>
              </li>
              <li>
                <Link to="/personal-details" className="text-sm hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span> Patient Profile
                </Link>
              </li>
              <li>
                <Link to="/health" className="text-sm hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span> Health Assessment
                </Link>
              </li>
              <li>
                <Link to="/contact-info" className="text-sm hover:text-blue-400 transition-colors flex items-center">
                  <span className="mr-2">→</span> Healthcare Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-400" />
              Key Features
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center">
                <Brain className="h-4 w-4 mr-2 text-blue-400" />
                AI Medical Reasoning
              </li>
              <li className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-400" />
                Vital Sign Analysis
              </li>
              <li className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                Real-time Monitoring
              </li>
              <li className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-400" />
                HIPAA Compliant
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <Mail className="h-4 w-4 mr-2 text-blue-400" />
              Contact Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Mail className="h-4 w-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">support@aiwellness.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-4 w-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">+1-800-MEDICAL</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">Healthcare District, USA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mt-8">
          {/* Features Grid */}
          <div className="mb-8">
            <h4 className="font-semibold text-white mb-4 text-center">Comprehensive Medical AI Capabilities</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors">
                <Brain className="h-5 w-5 mx-auto mb-2 text-blue-400" />
                <p className="text-xs font-medium">Differential Diagnosis</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors">
                <Heart className="h-5 w-5 mx-auto mb-2 text-red-400" />
                <p className="text-xs font-medium">Vital Monitoring</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors">
                <Zap className="h-5 w-5 mx-auto mb-2 text-yellow-400" />
                <p className="text-xs font-medium">Treatment Planning</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-700 transition-colors">
                <TrendingUp className="h-5 w-5 mx-auto mb-2 text-green-400" />
                <p className="text-xs font-medium">Progress Tracking</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; 2024 AI Wellness Platform. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-300 transition-colors">HIPAA Notice</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
