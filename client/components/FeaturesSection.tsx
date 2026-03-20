import { Activity, Brain, Heart, Stethoscope, TrendingUp, Pill, AlertTriangle, BarChart3, Shield, Zap, Users, BookOpen } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI Medical Reasoning",
      description: "Advanced AI analyzes symptoms and medical history using evidence-based medical knowledge to provide diagnostic insights."
    },
    {
      icon: Stethoscope,
      title: "Differential Diagnosis",
      description: "Get AI-powered differential diagnosis suggestions based on symptom patterns and clinical presentations."
    },
    {
      icon: Heart,
      title: "Vital Sign Analysis",
      description: "Real-time monitoring and analysis of heart rate, blood pressure, SpO2, temperature and other critical vitals."
    },
    {
      icon: Pill,
      title: "Drug Interaction Checker",
      description: "Check for potential drug interactions, contraindications, and adverse reactions with your current medications."
    },
    {
      icon: TrendingUp,
      title: "Health Trend Analysis",
      description: "Track and visualize your health metrics over time with AI-powered trend analysis and predictions."
    },
    {
      icon: AlertTriangle,
      title: "Risk Assessment",
      description: "AI evaluates cardiovascular, metabolic, and other health risks based on your profile and medical history."
    },
    {
      icon: BarChart3,
      title: "Clinical Decision Support",
      description: "Evidence-based recommendations for diagnosis, treatment plans, and preventive care strategies."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "All patient data is encrypted and stored securely in compliance with HIPAA regulations."
    },
    {
      icon: Zap,
      title: "Real-time Alerts",
      description: "Instant notifications for abnormal readings, medication reminders, and urgent health concerns."
    },
    {
      icon: Users,
      title: "Provider Integration",
      description: "Seamlessly share reports with your healthcare provider for coordinated medical care."
    },
    {
      icon: BookOpen,
      title: "Medical Education",
      description: "Learn about conditions, treatments, and preventive measures with AI-generated medical explanations."
    },
    {
      icon: Activity,
      title: "Comprehensive Tracking",
      description: "Monitor fitness, nutrition, sleep, medication adherence, and other health parameters in one platform."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Medical AI Capabilities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced medical AI platform integrates clinical decision support with personalized health monitoring 
            to empower patients and support healthcare providers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all hover:border-blue-200 border border-gray-200">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="h-7 w-7 text-blue-600" />
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
