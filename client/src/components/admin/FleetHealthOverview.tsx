import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Battery,
  Droplet,
  Disc,
  Gauge,
  Calendar,
  MapPin,
  MessageSquare,
  Mail,
  Phone,
  Bell
} from "lucide-react";

interface Vehicle {
  id: number;
  vin: string;
  model: string;
  owner: string;
  status: "healthy" | "warning" | "critical";
  alerts: number;
  lastChecked: string;
}

interface FleetHealthOverviewProps {
  vehicles: Vehicle[];
}

export function FleetHealthOverview({ vehicles }: FleetHealthOverviewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedVehicle, setExpandedVehicle] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const { toast } = useToast();

  const criticalCount = vehicles.filter(v => v.status === "critical").length;
  const warningCount = vehicles.filter(v => v.status === "warning").length;
  const healthyCount = vehicles.filter(v => v.status === "healthy").length;

  const filteredVehicles = vehicles.filter(v => 
    v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "critical":
        return {
          icon: AlertTriangle,
          color: "text-sentiment-urgent",
          bgColor: "bg-sentiment-urgent/10",
          badgeVariant: "destructive",
          label: "Critical",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-sentiment-concerned",
          bgColor: "bg-sentiment-concerned/10",
          badgeVariant: "default",
          label: "Warning",
        };
      default:
        return {
          icon: CheckCircle2,
          color: "text-sentiment-happy",
          bgColor: "bg-sentiment-happy/10",
          badgeVariant: "secondary",
          label: "Healthy",
        };
    }
  };

  return (
    <div className="space-y-6" data-testid="fleet-health-overview">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Fleet Health Overview</h1>
        <p className="text-muted-foreground">Monitor all vehicles in real-time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 border-sentiment-urgent/50 bg-sentiment-urgent/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Critical Issues</p>
              <p className="text-3xl font-bold text-sentiment-urgent" data-testid="count-critical">{criticalCount}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-sentiment-urgent" />
          </div>
        </Card>

        <Card className="p-6 border-sentiment-concerned/50 bg-sentiment-concerned/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Alerts Pending</p>
              <p className="text-3xl font-bold text-sentiment-concerned" data-testid="count-warning">{warningCount}</p>
            </div>
            <AlertCircle className="h-12 w-12 text-sentiment-concerned" />
          </div>
        </Card>

        <Card className="p-6 border-sentiment-happy/50 bg-sentiment-happy/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Healthy Vehicles</p>
              <p className="text-3xl font-bold text-sentiment-happy" data-testid="count-healthy">{healthyCount}</p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-sentiment-happy" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by VIN, model, or owner..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>

      {/* Vehicle List */}
      <div className="space-y-3">
        {filteredVehicles.map((vehicle) => {
          const config = getStatusConfig(vehicle.status);
          const Icon = config.icon;
          const isExpanded = expandedVehicle === vehicle.id;

          return (
            <Card 
              key={vehicle.id} 
              className="overflow-hidden hover-elevate transition-all"
              data-testid={`vehicle-card-${vehicle.id}`}
            >
              <div 
                className="p-6 cursor-pointer"
                onClick={() => setExpandedVehicle(isExpanded ? null : vehicle.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${config.bgColor}`}>
                      <Icon className={`h-6 w-6 ${config.color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg">{vehicle.model}</h3>
                        <Badge variant={config.badgeVariant as any}>{config.label}</Badge>
                        {vehicle.alerts > 0 && (
                          <Badge variant="outline">{vehicle.alerts} Alerts</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-mono">{vehicle.vin}</span>
                        <span>•</span>
                        <span>{vehicle.owner}</span>
                        <span>•</span>
                        <span>Last checked: {vehicle.lastChecked}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="icon">
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Battery</p>
                      <p className="font-semibold">85%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Engine Oil</p>
                      <p className="font-semibold">Good</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Brake Pads</p>
                      <p className="font-semibold">4.5 mm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Mileage</p>
                      <p className="font-semibold">45,230 km</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowDetailsDialog(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setShowContactDialog(true);
                      }}
                    >
                      Contact Owner
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No vehicles match your search criteria.</p>
        </Card>
      )}

      {/* Vehicle Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Vehicle Diagnostic Report</DialogTitle>
            <DialogDescription>
              Complete health analysis for {selectedVehicle?.model}
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-6">
              {/* Vehicle Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">VIN</p>
                  <p className="font-mono font-semibold">{selectedVehicle.vin}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-semibold">{selectedVehicle.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Model</p>
                  <p className="font-semibold">{selectedVehicle.model}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Check</p>
                  <p className="font-semibold">{selectedVehicle.lastChecked}</p>
                </div>
              </div>

              {/* Diagnostic Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">System Status</h3>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Battery className="h-5 w-5 text-sentiment-happy" />
                    <h4 className="font-semibold">Battery Health</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Charge</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Voltage</span>
                      <span className="font-semibold">12.6V</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expected Life</span>
                      <span className="font-semibold">2.5 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="secondary">Good</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Droplet className="h-5 w-5 text-blue-500" />
                    <h4 className="font-semibold">Engine Oil</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Oil Level</span>
                      <span className="font-semibold">Good</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Oil Quality</span>
                      <span className="font-semibold">90%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next Change</span>
                      <span className="font-semibold">2,500 km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="secondary">Good</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Disc className="h-5 w-5 text-orange-500" />
                    <h4 className="font-semibold">Brake System</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Front Pads</span>
                      <span className="font-semibold">4.5 mm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Rear Pads</span>
                      <span className="font-semibold">5.2 mm</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Brake Fluid</span>
                      <span className="font-semibold">Good</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant="secondary">Good</Badge>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Gauge className="h-5 w-5 text-purple-500" />
                    <h4 className="font-semibold">Performance</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Mileage</span>
                      <span className="font-semibold">45,230 km</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Fuel Economy</span>
                      <span className="font-semibold">15.2 km/l</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Engine Hours</span>
                      <span className="font-semibold">1,245 hrs</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Recommendations</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-blue-900 dark:text-blue-100">Scheduled Maintenance Due</p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Book 45,000 km service within next 500 km</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-900">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-green-900 dark:text-green-100">Overall Health Good</p>
                      <p className="text-sm text-green-700 dark:text-green-300">All critical systems functioning normally</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={() => {
                  toast({
                    title: "Service Booking",
                    description: "Opening service booking form...",
                  });
                  setShowDetailsDialog(false);
                }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Service
                </Button>
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Owner Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Vehicle Owner</DialogTitle>
            <DialogDescription>
              Send notification to {selectedVehicle?.owner}
            </DialogDescription>
          </DialogHeader>
          
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedVehicle.owner}</p>
                    <p className="text-sm text-muted-foreground">{selectedVehicle.model}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-semibold">+91 98765 43210</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-semibold">owner@example.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registered</span>
                    <span className="font-semibold">Jan 2023</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => {
                      toast({
                        title: "SMS Sent",
                        description: `Maintenance reminder sent to ${selectedVehicle.owner}`,
                      });
                      setShowContactDialog(false);
                    }}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-sm">Send SMS</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => {
                      toast({
                        title: "Email Sent",
                        description: `Service reminder email sent to ${selectedVehicle.owner}`,
                      });
                      setShowContactDialog(false);
                    }}
                  >
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">Send Email</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => {
                      toast({
                        title: "Calling Owner",
                        description: `Initiating call to ${selectedVehicle.owner}...`,
                      });
                      setShowContactDialog(false);
                    }}
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-sm">Call Owner</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col gap-2 p-4"
                    onClick={() => {
                      toast({
                        title: "Push Notification",
                        description: `App notification sent to ${selectedVehicle.owner}`,
                      });
                      setShowContactDialog(false);
                    }}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="text-sm">App Notify</span>
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full" onClick={() => setShowContactDialog(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
