import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { 
  MessageSquare, 
  Activity, 
  Bell, 
  BarChart3,
  Shield,
  Zap,
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: MessageSquare,
      title: "AI-Powered Chat Support",
      description: "Get instant answers with emotion-aware AI that understands your concerns",
    },
    {
      icon: Activity,
      title: "Vehicle Health Monitoring",
      description: "Real-time diagnostics and predictive maintenance alerts",
    },
    {
      icon: Bell,
      title: "Proactive Alerts",
      description: "Be notified 7-14 days before potential failures",
    },
    {
      icon: BarChart3,
      title: "Service Analytics",
      description: "Complete visibility into fleet health and service history",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security for all your data",
    },
    {
      icon: Zap,
      title: "Instant Booking",
      description: "Book service appointments in seconds through chat",
    },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="landing-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center text-white">
          <div className="inline-flex items-center justify-center mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Powered by AI & Machine Learning</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            VoxCare Pulse
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl mb-4 text-white/95 font-medium">
            AI-Powered After-Sales Support for Volkswagen
          </p>
          <p className="text-base sm:text-lg md:text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
            Experience emotion-aware customer service with predictive vehicle maintenance. 
            Stay ahead of issues before they become problems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-white/90 font-semibold text-base sm:text-lg px-8 h-12 sm:h-14 shadow-xl"
              onClick={() => setLocation("/customer")}
              data-testid="button-customer-app"
            >
              Open Customer App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/20 font-semibold text-base sm:text-lg px-8 h-12 sm:h-14 backdrop-blur-sm"
              onClick={() => setLocation("/admin")}
              data-testid="button-admin-dashboard"
            >
              Service Center Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for seamless after-sales support and vehicle maintenance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-500/50">
                <div className="inline-flex p-3 bg-blue-500/10 rounded-xl mb-4">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">98%</p>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">75%</p>
              <p className="text-sm sm:text-base text-gray-600 font-medium">AI Auto-Resolved</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">2.1min</p>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Avg Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-blue-600 mb-2">24/7</p>
              <p className="text-sm sm:text-base text-gray-600 font-medium">Always Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
            Experience the future of automotive after-sales support today
          </p>
          <Button 
            size="lg" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 font-semibold text-base sm:text-lg px-8 sm:px-12 h-12 sm:h-14 shadow-lg"
            onClick={() => setLocation("/customer")}
            data-testid="button-get-started"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">© 2025 VoxCare Pulse - Volkswagen After-Sales Support</p>
            <p className="text-xs">Built with AI & Machine Learning for smarter customer service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
