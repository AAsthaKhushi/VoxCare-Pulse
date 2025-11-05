import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/customer/ChatInterface";
import { VehicleHealthDashboard } from "@/components/customer/VehicleHealthDashboard";
import { BookingSystem } from "@/components/customer/BookingSystem";
import { MaintenanceAlerts } from "@/components/customer/MaintenanceAlerts";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/useWebSocket";
import { type Message, type MaintenanceAlert, type VehicleHealthLog } from "@shared/schema";
import { LANGUAGES } from "@shared/constants";
import { MessageSquare, Car, Calendar, Bell } from "lucide-react";

export default function CustomerApp() {
  const [activeTab, setActiveTab] = useState("chat");
  const [language, setLanguage] = useState(LANGUAGES.EN);
  const { toast } = useToast();

  // Mock customer ID - in production this would come from auth
  const customerId = 1;
  const vehicleId = 1;
  const conversationId = 1;

  // WebSocket for real-time chat
  const { 
    messages: wsMessages, 
    setMessages: setWsMessages, 
    sendMessage: wsSendMessage, 
    isConnected,
    isTyping 
  } = useWebSocket(conversationId);

  // Fetch initial messages from API
  const { data: initialMessages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages", conversationId],
  });

  // Sync initial messages with WebSocket state
  useEffect(() => {
    if (initialMessages.length > 0 && wsMessages.length === 0) {
      setWsMessages(initialMessages);
    }
  }, [initialMessages, wsMessages.length, setWsMessages]);

  // Fetch vehicle health
  const { data: healthLog } = useQuery<VehicleHealthLog>({
    queryKey: ["/api/vehicle-health", vehicleId],
  });

  // Fetch alerts
  const { data: alerts = [] } = useQuery<MaintenanceAlert[]>({
    queryKey: ["/api/alerts", vehicleId],
  });

  // Book service mutation
  const bookServiceMutation = useMutation({
    mutationFn: async (booking: any) => {
      return apiRequest("POST", "/api/bookings", {
        customerId,
        vehicleId,
        ...booking,
      });
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed!",
        description: "Your service has been scheduled successfully.",
      });
      setActiveTab("chat");
    },
  });

  // Alert actions
  const dismissAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return apiRequest("PATCH", `/api/alerts/${alertId}`, {
        status: "dismissed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts", vehicleId] });
      toast({
        title: "Alert Dismissed",
      });
    },
  });

  const snoozeAlertMutation = useMutation({
    mutationFn: async (alertId: number) => {
      return apiRequest("PATCH", `/api/alerts/${alertId}`, {
        status: "snoozed",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts", vehicleId] });
      toast({
        title: "Alert Snoozed",
        description: "We'll remind you in 3 days.",
      });
    },
  });

  const handleSendMessage = (message: string) => {
    wsSendMessage(message, language);
  };

  const handleBookingComplete = (booking: any) => {
    bookServiceMutation.mutate(booking);
  };

  const handleBookService = () => {
    setActiveTab("booking");
  };

  return (
    <div className="h-screen flex flex-col bg-background" data-testid="customer-app">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4">
            <TabsList className="h-14 w-full justify-start gap-2">
              <TabsTrigger value="chat" className="gap-2" data-testid="tab-chat">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="health" className="gap-2" data-testid="tab-health">
                <Car className="h-4 w-4" />
                Vehicle Health
              </TabsTrigger>
              <TabsTrigger value="booking" className="gap-2" data-testid="tab-booking">
                <Calendar className="h-4 w-4" />
                Book Service
              </TabsTrigger>
              <TabsTrigger value="alerts" className="gap-2 relative" data-testid="tab-alerts">
                <Bell className="h-4 w-4" />
                Alerts
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="chat" className="h-full m-0">
            <ChatInterface
              conversationId={conversationId}
              onSendMessage={handleSendMessage}
              messages={wsMessages}
              isTyping={isTyping}
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </TabsContent>

          <TabsContent value="health" className="h-full m-0 overflow-y-auto">
            <VehicleHealthDashboard
              vehicleId={vehicleId}
              model="Volkswagen Tiguan 2023"
              mileage={45230}
              healthLog={healthLog}
              alerts={alerts}
              onBookService={handleBookService}
            />
          </TabsContent>

          <TabsContent value="booking" className="h-full m-0 overflow-y-auto">
            <BookingSystem
              onBookingComplete={handleBookingComplete}
            />
          </TabsContent>

          <TabsContent value="alerts" className="h-full m-0 overflow-y-auto">
            <MaintenanceAlerts
              alerts={alerts}
              onBookService={(alertId) => {
                setActiveTab("booking");
              }}
              onDismiss={(alertId) => dismissAlertMutation.mutate(alertId)}
              onSnooze={(alertId) => snoozeAlertMutation.mutate(alertId)}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
