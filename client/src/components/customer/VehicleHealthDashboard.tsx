import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VehicleHealthCard } from "../shared/VehicleHealthCard";
import { Calendar, Wrench, AlertCircle } from "lucide-react";
import { type VehicleHealthLog, type MaintenanceAlert } from "@shared/schema";

interface VehicleHealthDashboardProps {
  vehicleId: number;
  model: string;
  mileage: number;
  healthLog?: VehicleHealthLog;
  alerts: MaintenanceAlert[];
  onBookService: () => void;
}

export function VehicleHealthDashboard({
  vehicleId,
  model,
  mileage,
  healthLog,
  alerts,
  onBookService
}: VehicleHealthDashboardProps) {
  // Calculate overall health score
  const calculateOverallHealth = () => {
    if (!healthLog) return 0;
    
    const batteryScore = healthLog.batteryHealth || 0;
    const oilScore = healthLog.engineOil === "Good" ? 100 : healthLog.engineOil === "Low" ? 50 : 20;
    const brakeScore = (healthLog.brakePadThickness || 0) > 5 ? 100 : (healthLog.brakePadThickness || 0) > 3 ? 60 : 30;
    const tempScore = (healthLog.engineTemp || 0) < 100 ? 100 : (healthLog.engineTemp || 0) < 110 ? 70 : 40;
    
    return Math.round((batteryScore + oilScore + brakeScore + tempScore) / 4);
  };

  const overallHealth = calculateOverallHealth();
  const healthColor = overallHealth > 70 ? "text-sentiment-happy" : overallHealth > 40 ? "text-sentiment-concerned" : "text-sentiment-urgent";
  const healthBg = overallHealth > 70 ? "bg-sentiment-happy" : overallHealth > 40 ? "bg-sentiment-concerned" : "bg-sentiment-urgent";

  // Determine severity based on values
  const getBatterySeverity = (health: number) => health > 70 ? "good" : health > 40 ? "warning" : "critical";
  const getOilSeverity = (level: string) => level === "Good" ? "good" : level === "Low" ? "warning" : "critical";
  const getBrakeSeverity = (thickness: number) => thickness > 5 ? "good" : thickness > 3 ? "warning" : "critical";
  const getTempSeverity = (temp: number) => temp < 100 ? "good" : temp < 110 ? "warning" : "critical";

  const daysToNextService = 14; // Calculate based on last service date

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" data-testid="vehicle-health-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{model}</h1>
          <p className="text-muted-foreground">Mileage: {mileage.toLocaleString()} km</p>
        </div>
        <Button onClick={onBookService} size="lg" data-testid="button-book-service">
          <Wrench className="mr-2 h-5 w-5" />
          Book Service
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card className="p-8">
        <div className="text-center space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Overall Vehicle Health</h2>
          <div className={`text-6xl font-bold ${healthColor}`} data-testid="text-overall-health">
            {overallHealth}%
          </div>
          <Progress value={overallHealth} className="h-4" data-testid="progress-overall-health" />
          <p className="text-sm text-muted-foreground">
            {overallHealth > 70 ? "Your vehicle is in excellent condition" : 
             overallHealth > 40 ? "Some components need attention soon" : 
             "Immediate service recommended"}
          </p>
        </div>
      </Card>

      {/* Component Health Cards */}
      {healthLog && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <VehicleHealthCard
            component="Battery Health"
            status={`Last checked: ${new Date(healthLog.recordedAt).toLocaleDateString()}`}
            value={healthLog.batteryHealth || 0}
            unit="%"
            icon="battery"
            severity={getBatterySeverity(healthLog.batteryHealth || 0)}
          />
          
          <VehicleHealthCard
            component="Engine Oil"
            status={healthLog.engineOil || "Unknown"}
            icon="oil"
            severity={getOilSeverity(healthLog.engineOil || "Unknown")}
          />
          
          <VehicleHealthCard
            component="Brake Pads"
            status={`Last checked: ${new Date(healthLog.recordedAt).toLocaleDateString()}`}
            value={healthLog.brakePadThickness || 0}
            unit="mm"
            icon="brake"
            severity={getBrakeSeverity(healthLog.brakePadThickness || 0)}
          />
          
          <VehicleHealthCard
            component="Engine Temperature"
            status={`Last checked: ${new Date(healthLog.recordedAt).toLocaleDateString()}`}
            value={healthLog.engineTemp || 0}
            unit="°C"
            icon="temp"
            severity={getTempSeverity(healthLog.engineTemp || 0)}
          />
        </div>
      )}

      {/* Next Service Countdown */}
      <Card className="p-6 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Calendar className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Next Service Recommended</h3>
            <p className="text-2xl font-bold text-accent mt-1" data-testid="text-days-to-service">
              {daysToNextService} days
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Based on your driving patterns and mileage
            </p>
            <Button variant="outline" className="mt-4" onClick={onBookService} data-testid="button-schedule-service">
              Schedule Now
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Recent Alerts
          </h2>
          {alerts.slice(0, 3).map((alert) => (
            <Card 
              key={alert.id} 
              className={`p-4 ${
                alert.severity === "high" ? "border-sentiment-urgent/50 bg-sentiment-urgent/5" :
                alert.severity === "medium" ? "border-sentiment-concerned/50 bg-sentiment-concerned/5" :
                "border-border"
              }`}
              data-testid={`alert-card-${alert.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{alert.component.replace(/_/g, " ").toUpperCase()}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                  {alert.predictedFailureDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Predicted failure: {new Date(alert.predictedFailureDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant={alert.severity === "high" ? "destructive" : "outline"}
                  onClick={onBookService}
                  data-testid={`button-alert-action-${alert.id}`}
                >
                  Book Service
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
