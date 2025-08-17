import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { useAuth } from '@clerk/clerk-react';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
      <Header />
      
      {/* Temporary Clerk Test - Remove this after testing */}
      <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50">
        <div className="text-sm">
          <strong>🔐 Clerk Status:</strong>
          <div className={`mt-1 ${isLoaded ? (isSignedIn ? 'text-green-600' : 'text-orange-600') : 'text-blue-600'}`}>
            {!isLoaded ? 'Loading...' : isSignedIn ? '✅ Signed In' : '❌ Not Signed In'}
          </div>
        </div>
      </div>
      
      <main>
        <HeroSection />
      </main>
    </div>
  );
}