import { Card } from "@/components/ui/card";
import { 
  MessageSquare, 
  AlertTriangle, 
  Clock, 
  Star,
  TrendingUp,
  Users,
  Wrench,
  IndianRupee
} from "lucide-react";

interface DashboardMetrics {
  incomingChats: number;
  autoResolveRate: number;
  escalations: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  activeConversations: number;
  servicesBooked: number;
  revenue: number;
}

interface AdminDashboardProps {
  metrics: DashboardMetrics;
}

export function AdminDashboard({ metrics }: AdminDashboardProps) {
  const statCards = [
    {
      title: "Incoming Chats",
      value: metrics.incomingChats,
      subtitle: `${metrics.autoResolveRate}% auto-resolved`,
      icon: MessageSquare,
      color: "text-sentiment-neutral",
      bgColor: "bg-sentiment-neutral/10",
    },
    {
      title: "Escalations",
      value: metrics.escalations,
      subtitle: "Requiring human assistance",
      icon: AlertTriangle,
      color: "text-sentiment-concerned",
      bgColor: "bg-sentiment-concerned/10",
    },
    {
      title: "Avg Response Time",
      value: `${metrics.avgResponseTime} min`,
      subtitle: "Across all channels",
      icon: Clock,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Customer Satisfaction",
      value: `${metrics.customerSatisfaction}/5.0`,
      subtitle: "Based on feedback",
      icon: Star,
      color: "text-sentiment-happy",
      bgColor: "bg-sentiment-happy/10",
    },
  ];

  const secondaryMetrics = [
    {
      title: "Active Conversations",
      value: metrics.activeConversations,
      icon: Users,
      trend: "+12%",
    },
    {
      title: "Services Booked Today",
      value: metrics.servicesBooked,
      icon: Wrench,
      trend: "+8%",
    },
    {
      title: "Revenue (Today)",
      value: `₹${(metrics.revenue / 1000).toFixed(1)}K`,
      icon: IndianRupee,
      trend: "+15%",
    },
  ];

  return (
    <div className="space-y-6" data-testid="admin-dashboard">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Service Center Dashboard</h1>
        <p className="text-muted-foreground">Real-time monitoring and analytics</p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover-elevate transition-all" data-testid={`metric-card-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold" data-testid={`value-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-2">{stat.subtitle}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {secondaryMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                  <div className="flex items-center gap-1 text-sentiment-happy text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    {metric.trend}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Summary */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">{Math.round(metrics.autoResolveRate)}%</p>
            <p className="text-sm text-muted-foreground mt-1">AI Resolution Rate</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {metrics.avgResponseTime < 3 ? "Fast" : metrics.avgResponseTime < 5 ? "Good" : "Slow"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Response Speed</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{metrics.escalations}</p>
            <p className="text-sm text-muted-foreground mt-1">Pending Escalations</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {metrics.customerSatisfaction >= 4.5 ? "Excellent" : metrics.customerSatisfaction >= 4.0 ? "Good" : "Fair"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Service Quality</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
