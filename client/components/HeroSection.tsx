import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, TrendingUp, Stethoscope } from "lucide-react";
import TypewriterText from "./TypewriterText";
import AISearch from "./AISearch";

export default function HeroSection() {
  const navigate = useNavigate();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-6">
                <span className="text-blue-700 font-semibold text-sm">🏥 Powered by Medical AI</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                🔬 <TypewriterText
                  text="Your Personal AI Health Advisor"
                  speed={80}
                  className="inline"
                />
              </h1>
              <p className="text-xl font-bold text-black max-w-3xl mx-auto">
                Intelligent diagnosis support, real-time health monitoring, and clinical decision-making powered by advanced AI technology
              </p>
            </div>

            {/* AI Search */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex items-center mb-4">
                <Stethoscope className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Medical AI Query</h3>
              </div>
              <AISearch />
              <p className="text-sm text-gray-500 mt-4">Ask about symptoms, medications, medical conditions, and get AI-powered insights</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => navigate('/personal-details')}
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Clinical Reasoning</h4>
                <p className="text-xs text-gray-600">Differential diagnosis support</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">AI-Powered</h4>
                <p className="text-xs text-gray-600">Evidence-based recommendations</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Real-time Monitoring</h4>
                <p className="text-xs text-gray-600">Track vital signs & trends</p>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 hover:border-blue-300 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">HIPAA Compliant</h4>
                <p className="text-xs text-gray-600">Secure data protection</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
