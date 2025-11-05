import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Calendar,
  IndianRupee,
  MapPin,
  X
} from "lucide-react";
import { type MaintenanceAlert } from "@shared/schema";

interface MaintenanceAlertsProps {
  alerts: MaintenanceAlert[];
  onBookService: (alertId: number) => void;
  onDismiss: (alertId: number) => void;
  onSnooze: (alertId: number) => void;
}

export function MaintenanceAlerts({ 
  alerts, 
  onBookService, 
  onDismiss, 
  onSnooze 
}: MaintenanceAlertsProps) {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          icon: AlertTriangle,
          color: "text-sentiment-urgent",
          bgColor: "bg-sentiment-urgent/10",
          borderColor: "border-sentiment-urgent/50",
          badge: "destructive",
        };
      case "medium":
        return {
          icon: AlertCircle,
          color: "text-sentiment-concerned",
          bgColor: "bg-sentiment-concerned/10",
          borderColor: "border-sentiment-concerned/50",
          badge: "default",
        };
      default:
        return {
          icon: Info,
          color: "text-sentiment-neutral",
          bgColor: "bg-sentiment-neutral/10",
          borderColor: "border-sentiment-neutral/50",
          badge: "secondary",
        };
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "critical":
        return "Critical Issue";
      case "wear_warning":
        return "Wear Warning";
      case "routine":
        return "Routine Maintenance";
      default:
        return type;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sentiment-happy/10 mb-4">
            <Info className="h-8 w-8 text-sentiment-happy" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Active Alerts</h3>
          <p className="text-muted-foreground">
            Your vehicle is in good condition. We'll notify you when maintenance is needed.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4" data-testid="maintenance-alerts">
      <h1 className="text-3xl font-bold mb-6">Maintenance Alerts</h1>
      
      {alerts.map((alert) => {
        const config = getSeverityConfig(alert.severity);
        const Icon = config.icon;
        
        return (
          <Card
            key={alert.id}
            className={`p-6 ${config.borderColor} ${config.bgColor} relative`}
            data-testid={`alert-${alert.id}`}
          >
            {/* Dismiss button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-8 w-8"
              onClick={() => onDismiss(alert.id)}
              data-testid={`button-dismiss-${alert.id}`}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="flex items-start gap-4 pr-10">
              {/* Icon */}
              <div className={`p-3 rounded-lg ${config.bgColor}`}>
                <Icon className={`h-6 w-6 ${config.color}`} />
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">
                        {alert.component.replace(/_/g, " ").toUpperCase()}
                      </h3>
                      <Badge variant={config.badge as any}>
                        {getAlertTypeLabel(alert.alertType)}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {alert.predictedFailureDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Predicted failure: {new Date(alert.predictedFailureDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  
                  {/* Mock estimated cost based on component */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    <span>
                      Estimated cost: ₹
                      {alert.component === "brake_pads" ? "2,500 - 4,000" :
                       alert.component === "oil" ? "1,500 - 2,500" :
                       alert.component === "battery" ? "4,000 - 8,000" :
                       "2,000 - 5,000"}
                    </span>
                  </div>
                </div>

                {/* Nearby Service Centers */}
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">Nearby Service Centers:</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <div>• VW Service Connaught Place (4.2 km)</div>
                    <div>• VW Service Nehru Place (6.8 km)</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => onBookService(alert.id)}
                    variant={alert.severity === "high" ? "destructive" : "default"}
                    data-testid={`button-book-${alert.id}`}
                  >
                    Book Service Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onSnooze(alert.id)}
                    data-testid={`button-snooze-${alert.id}`}
                  >
                    Remind in 3 Days
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
