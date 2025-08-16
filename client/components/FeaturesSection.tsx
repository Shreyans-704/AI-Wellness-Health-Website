import { Activity, Brain, Heart, Smartphone, Users, Zap } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Health Insights",
      description: "Get personalized recommendations based on your health data and patterns using advanced machine learning algorithms."
    },
    {
      icon: Activity,
      title: "Comprehensive Tracking",
      description: "Monitor fitness, nutrition, sleep, mood, and more. All your health metrics in one integrated platform."
    },
    {
      icon: Heart,
      title: "Wellness Coaching",
      description: "Receive guidance from our AI coach that adapts to your lifestyle and helps you build sustainable healthy habits."
    },
    {
      icon: Smartphone,
      title: "Mobile Integration",
      description: "Seamlessly sync with wearables and health apps. Access your data anywhere, anytime with our mobile-first design."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded individuals on similar health journeys. Share progress and stay motivated together."
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      description: "Get instant alerts and insights about your health metrics. Stay informed and make timely adjustments."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for 
            <span className="text-primary"> Optimal Health</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI technology with proven wellness principles 
            to help you achieve your health goals faster and more effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
