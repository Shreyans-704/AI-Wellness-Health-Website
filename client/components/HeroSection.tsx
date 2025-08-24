import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";
import TypewriterText from "./TypewriterText";
import AISearch from "./AISearch";

export default function HeroSection() {
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  return (
    <section className="bg-gradient-to-br from-primary/5 via-white to-secondary/10 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                🩺 <TypewriterText
                  text="Empowering Patients with Intelligent Health Solutions"
                  speed={80}
                  className="inline"
                />
              </h1>
            </div>

            {/* AI Search */}
            <AISearch />

            <div className="flex justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-black text-white hover:bg-gray-800"
                onClick={() => setIsSignInOpen(true)}
              >
                Get Started
              </Button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Secure & Private</h3>
                <p className="text-sm text-gray-600">Your health data stays protected</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                <p className="text-sm text-gray-600">Smart insights & recommendations</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Track Progress</h3>
                <p className="text-sm text-gray-600">Monitor your health journey</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
