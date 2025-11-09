import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { FleetHealthOverview } from "@/components/admin/FleetHealthOverview";
import { SentimentHeatmap } from "@/components/admin/SentimentHeatmap";
import { LiveChatQueue } from "@/components/admin/LiveChatQueue";
import { RevenueInsights } from "@/components/admin/RevenueInsights";
import { 
  LayoutDashboard, 
  Car, 
  Heart, 
  MessageSquare, 
  IndianRupee 
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
  },
  {
    title: "Fleet Health",
    icon: Car,
    id: "fleet",
  },
  {
    title: "Sentiment Trends",
    icon: Heart,
    id: "sentiment",
  },
  {
    title: "Live Chat Queue",
    icon: MessageSquare,
    id: "queue",
  },
  {
    title: "Revenue Insights",
    icon: IndianRupee,
    id: "revenue",
  },
];

export default function ServiceCenterDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const { toast } = useToast();

  // Fetch dashboard metrics
  const { data: metrics } = useQuery({
    queryKey: ["/api/admin/metrics"],
    initialData: {
      incomingChats: 18,
      autoResolveRate: 75,
      escalations: 3,
      avgResponseTime: 2.1,
      customerSatisfaction: 4.6,
      activeConversations: 12,
      servicesBooked: 8,
      revenue: 125000,
    },
  });

  // Fetch fleet data
  const { data: vehicles } = useQuery({
    queryKey: ["/api/admin/fleet"],
    initialData: [
      { id: 1, vin: "WVWZZZ1KZAW123456", model: "VW Tiguan 2023", owner: "Rajesh Kumar", status: "critical", alerts: 2, lastChecked: "2 hours ago" },
      { id: 2, vin: "WVWZZZ1KZAW123457", model: "VW Polo 2022", owner: "Priya Sharma", status: "warning", alerts: 1, lastChecked: "5 hours ago" },
      { id: 3, vin: "WVWZZZ1KZAW123458", model: "VW Vento 2023", owner: "Amit Patel", status: "healthy", alerts: 0, lastChecked: "1 day ago" },
    ],
  });

  // Fetch sentiment data
  const { data: sentimentData } = useQuery({
    queryKey: ["/api/admin/sentiment"],
    initialData: [
      { time: "9 AM", happy: 0.45, neutral: 0.35, concerned: 0.12, frustrated: 0.06, urgent: 0.02, average: 0.65 },
      { time: "10 AM", happy: 0.52, neutral: 0.30, concerned: 0.10, frustrated: 0.06, urgent: 0.02, average: 0.70 },
      { time: "11 AM", happy: 0.48, neutral: 0.32, concerned: 0.12, frustrated: 0.06, urgent: 0.02, average: 0.68 },
      { time: "12 PM", happy: 0.55, neutral: 0.28, concerned: 0.10, frustrated: 0.05, urgent: 0.02, average: 0.72 },
      { time: "1 PM", happy: 0.50, neutral: 0.30, concerned: 0.12, frustrated: 0.06, urgent: 0.02, average: 0.69 },
      { time: "2 PM", happy: 0.58, neutral: 0.25, concerned: 0.10, frustrated: 0.05, urgent: 0.02, average: 0.74 },
    ],
  });

  // Fetch conversations
  const { data: conversations } = useQuery({
    queryKey: ["/api/admin/conversations"],
    initialData: [
      {
        id: 1,
        customerId: 1,
        channel: "web",
        status: "escalated",
        createdAt: new Date(),
        closedAt: null,
        customerName: "Rajesh Kumar",
        lastMessage: "This is not acceptable, I want to speak to a manager!",
        lastMessageTime: new Date(),
        messageCount: 8,
        avgSentiment: 0.15,
        waitTime: 12,
      },
      {
        id: 2,
        customerId: 2,
        channel: "web",
        status: "active",
        createdAt: new Date(),
        closedAt: null,
        customerName: "Priya Sharma",
        lastMessage: "When can I bring my car for the brake service?",
        lastMessageTime: new Date(),
        messageCount: 4,
        avgSentiment: 0.65,
        waitTime: 5,
      },
    ],
  });

  // Revenue data
  const revenueData = {
    dailyData: [
      { period: "Mon", booked: 25000, completed: 18000, predicted: 30000 },
      { period: "Tue", booked: 28000, completed: 22000, predicted: 32000 },
      { period: "Wed", booked: 30000, completed: 25000, predicted: 35000 },
      { period: "Thu", booked: 27000, completed: 21000, predicted: 31000 },
      { period: "Fri", booked: 32000, completed: 28000, predicted: 38000 },
    ],
    weeklyData: [
      { period: "Week 1", booked: 120000, completed: 95000, predicted: 140000 },
      { period: "Week 2", booked: 135000, completed: 110000, predicted: 150000 },
      { period: "Week 3", booked: 128000, completed: 105000, predicted: 145000 },
      { period: "Week 4", booked: 142000, completed: 118000, predicted: 160000 },
    ],
    monthlyData: [
      { period: "Jan", booked: 450000, completed: 380000, predicted: 520000 },
      { period: "Feb", booked: 480000, completed: 410000, predicted: 550000 },
      { period: "Mar", booked: 520000, completed: 440000, predicted: 580000 },
    ],
    totalRevenue: 520000,
    predictedRevenue: 180000,
    servicesBooked: 42,
    costSavings: 85000,
  };

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full" data-testid="service-center-dashboard">
        {/* Sidebar */}
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="px-4 py-6">
                <h2 className="text-xl font-bold text-primary">VoxCare Pulse</h2>
                <p className="text-xs text-muted-foreground">Service Center</p>
              </div>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.id)}
                        isActive={activeView === item.id}
                        data-testid={`nav-${item.id}`}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Service Center Admin</span>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {activeView === "dashboard" && <AdminDashboard metrics={metrics} />}
            {activeView === "fleet" && <FleetHealthOverview vehicles={vehicles} />}
            {activeView === "sentiment" && <SentimentHeatmap data={sentimentData} />}
            {activeView === "queue" && (
              <LiveChatQueue
                conversations={conversations}
                onTakeOver={(id) => {
                  console.log("Taking over conversation", id);
                }}
              />
            )}
            {activeView === "revenue" && <RevenueInsights {...revenueData} />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
