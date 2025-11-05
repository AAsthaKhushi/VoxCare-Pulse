import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Battery, 
  Droplet, 
  Disc, 
  Gauge, 
  ThermometerSun,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface VehicleHealthCardProps {
  component: string;
  status: string;
  value?: number | string;
  unit?: string;
  icon?: "battery" | "oil" | "brake" | "tire" | "temp";
  severity?: "good" | "warning" | "critical";
}

const iconMap: Record<string, LucideIcon> = {
  battery: Battery,
  oil: Droplet,
  brake: Disc,
  tire: Gauge,
  temp: ThermometerSun,
};

export function VehicleHealthCard({ 
  component, 
  status, 
  value, 
  unit = "", 
  icon = "battery",
  severity = "good"
}: VehicleHealthCardProps) {
  const Icon = iconMap[icon] || Battery;
  
  const severityConfig = {
    good: {
      color: "text-sentiment-happy",
      bgColor: "bg-sentiment-happy/10",
      borderColor: "border-sentiment-happy/20",
      progressColor: "bg-sentiment-happy",
    },
    warning: {
      color: "text-sentiment-concerned",
      bgColor: "bg-sentiment-concerned/10",
      borderColor: "border-sentiment-concerned/20",
      progressColor: "bg-sentiment-concerned",
    },
    critical: {
      color: "text-sentiment-urgent",
      bgColor: "bg-sentiment-urgent/10",
      borderColor: "border-sentiment-urgent/20",
      progressColor: "bg-sentiment-urgent",
    },
  };

  const config = severityConfig[severity];
  const numericValue = typeof value === 'number' ? value : undefined;

  return (
    <Card className={`p-6 hover-elevate transition-all duration-200 ${config.borderColor}`} data-testid={`vehicle-health-card-${component.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex flex-col gap-4">
        {/* Icon and status */}
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-lg ${config.bgColor}`}>
            <Icon className={`h-6 w-6 ${config.color}`} />
          </div>
          {severity === "critical" && (
            <AlertTriangle className="h-5 w-5 text-sentiment-urgent" data-testid="icon-alert" />
          )}
          {severity === "good" && (
            <CheckCircle2 className="h-5 w-5 text-sentiment-happy" data-testid="icon-check" />
          )}
        </div>

        {/* Component name */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{component}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            {numericValue !== undefined ? (
              <>
                <span className="text-2xl font-bold">{value}</span>
                {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
              </>
            ) : (
              <span className={`text-lg font-semibold ${config.color}`}>{status}</span>
            )}
          </div>
        </div>

        {/* Progress bar for numeric values */}
        {numericValue !== undefined && (
          <Progress 
            value={numericValue} 
            className="h-2"
            data-testid={`progress-${component.toLowerCase().replace(/\s+/g, '-')}`}
          />
        )}

        {/* Status text */}
        <p className="text-xs text-muted-foreground" data-testid={`text-status-${component.toLowerCase().replace(/\s+/g, '-')}`}>
          {status}
        </p>
      </div>
    </Card>
  );
}
