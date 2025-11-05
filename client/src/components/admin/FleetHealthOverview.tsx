import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ChevronUp
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
                    <Button size="sm">View Details</Button>
                    <Button size="sm" variant="outline">Contact Owner</Button>
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
    </div>
  );
}
