import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useAuth } from '@clerk/clerk-react';

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="home-bg">
        {/* Content Sections */}
        <div className="relative z-10">
          <HeroSection />
          <FeaturesSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
