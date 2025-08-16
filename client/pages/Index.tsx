import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800">
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  );
}
