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
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent -z-10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10 -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-24 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            VoxCare Pulse
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-white/90">
            AI-Powered After-Sales Support for Volkswagen
          </p>
          <p className="text-lg mb-12 text-white/80 max-w-3xl mx-auto">
            Experience emotion-aware customer service with predictive vehicle maintenance. 
            Stay ahead of issues before they become problems.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 h-14"
              onClick={() => setLocation("/customer")}
              data-testid="button-customer-app"
            >
              Open Customer App
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 h-14"
              onClick={() => setLocation("/admin")}
              data-testid="button-admin-dashboard"
            >
              Service Center Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for seamless after-sales support and vehicle maintenance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="p-6 hover-elevate transition-all">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">98%</p>
              <p className="text-muted-foreground">Customer Satisfaction</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">75%</p>
              <p className="text-muted-foreground">AI Auto-Resolved</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">2.1min</p>
              <p className="text-muted-foreground">Avg Response Time</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">24/7</p>
              <p className="text-muted-foreground">Always Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the future of automotive after-sales support today
        </p>
        <Button 
          size="lg" 
          className="text-lg px-8 h-14"
          onClick={() => setLocation("/customer")}
          data-testid="button-get-started"
        >
          Get Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
