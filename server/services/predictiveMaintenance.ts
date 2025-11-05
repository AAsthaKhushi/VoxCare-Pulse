import { type VehicleHealthLog } from "@shared/schema";

interface MaintenancePredict {
  component: string;
  daysUntilFailure: number;
  severity: "low" | "medium" | "high";
  alertType: "routine" | "wear_warning" | "critical";
  message: string;
  predictedFailureDate: Date;
  estimatedCostMin: number;
  estimatedCostMax: number;
}

export function predictMaintenanceNeeds(
  healthLog: VehicleHealthLog,
  lastServiceDate: Date | null,
  mileage: number
): MaintenancePredict[] {
  const predictions: MaintenancePredict[] = [];
  const now = new Date();

  // Battery prediction
  if (healthLog.batteryHealth !== null && healthLog.batteryHealth < 70) {
    const daysUntilFailure = Math.round(
      ((healthLog.batteryHealth - 40) / 1.5) * 30 // Degradation rate: 1.5% per month
    );
    
    predictions.push({
      component: "battery",
      daysUntilFailure,
      severity: healthLog.batteryHealth < 50 ? "high" : "medium",
      alertType: healthLog.batteryHealth < 50 ? "critical" : "wear_warning",
      message: `Your battery health is at ${healthLog.batteryHealth}%. We recommend inspection ${daysUntilFailure < 14 ? "immediately" : `within ${daysUntilFailure} days`}.`,
      predictedFailureDate: new Date(now.getTime() + daysUntilFailure * 24 * 60 * 60 * 1000),
      estimatedCostMin: 4000,
      estimatedCostMax: 8000,
    });
  }

  // Oil change prediction
  const daysSinceService = lastServiceDate
    ? Math.floor((now.getTime() - new Date(lastServiceDate).getTime()) / (1000 * 60 * 60 * 24))
    : 180;
  
  if (daysSinceService > 150 || healthLog.engineOil === "Low" || healthLog.engineOil === "Critical") {
    const daysUntilDue = healthLog.engineOil === "Critical" ? 0 : 180 - daysSinceService;
    
    predictions.push({
      component: "oil",
      daysUntilFailure: Math.max(0, daysUntilDue),
      severity: healthLog.engineOil === "Critical" ? "high" : daysSinceService > 165 ? "medium" : "low",
      alertType: healthLog.engineOil === "Critical" ? "critical" : "routine",
      message: `Engine oil is ${healthLog.engineOil || "due for change"}. ${healthLog.engineOil === "Critical" ? "Immediate service required!" : `Service recommended in ${daysUntilDue} days.`}`,
      predictedFailureDate: new Date(now.getTime() + Math.max(0, daysUntilDue) * 24 * 60 * 60 * 1000),
      estimatedCostMin: 1500,
      estimatedCostMax: 2500,
    });
  }

  // Brake pad prediction
  if (healthLog.brakePadThickness !== null && healthLog.brakePadThickness < 6) {
    const dailyWearRate = 0.02; // mm per day (approximate)
    const safeThreshold = 2; // mm minimum safe thickness
    const daysUntilFailure = Math.round(
      (healthLog.brakePadThickness - safeThreshold) / dailyWearRate
    );
    
    predictions.push({
      component: "brake_pads",
      daysUntilFailure: Math.max(0, daysUntilFailure),
      severity: healthLog.brakePadThickness < 3 ? "high" : healthLog.brakePadThickness < 4.5 ? "medium" : "low",
      alertType: healthLog.brakePadThickness < 3 ? "critical" : "wear_warning",
      message: `Your brake pads are at ${healthLog.brakePadThickness}mm thickness. We recommend inspection ${daysUntilFailure < 7 ? "immediately" : `within ${daysUntilFailure} days`}.`,
      predictedFailureDate: new Date(now.getTime() + Math.max(0, daysUntilFailure) * 24 * 60 * 60 * 1000),
      estimatedCostMin: 2500,
      estimatedCostMax: 4000,
    });
  }

  // Engine temperature check
  if (healthLog.engineTemp !== null && healthLog.engineTemp > 100) {
    predictions.push({
      component: "cooling_system",
      daysUntilFailure: healthLog.engineTemp > 110 ? 0 : 7,
      severity: healthLog.engineTemp > 110 ? "high" : "medium",
      alertType: healthLog.engineTemp > 110 ? "critical" : "wear_warning",
      message: `Engine temperature is ${healthLog.engineTemp}°C. ${healthLog.engineTemp > 110 ? "Immediate inspection required!" : "Cooling system check recommended."}`,
      predictedFailureDate: new Date(now.getTime() + (healthLog.engineTemp > 110 ? 0 : 7) * 24 * 60 * 60 * 1000),
      estimatedCostMin: 2000,
      estimatedCostMax: 5000,
    });
  }

  // Tire pressure check
  const tirePressures = [
    healthLog.tirePressureFl,
    healthLog.tirePressureFr,
    healthLog.tirePressureRl,
    healthLog.tirePressureRr,
  ].filter((p) => p !== null) as number[];

  const lowPressureTires = tirePressures.filter((p) => p < 30);
  if (lowPressureTires.length > 0) {
    predictions.push({
      component: "tires",
      daysUntilFailure: 3,
      severity: "medium",
      alertType: "wear_warning",
      message: `${lowPressureTires.length} tire(s) have low pressure. Check and inflate soon.`,
      predictedFailureDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      estimatedCostMin: 500,
      estimatedCostMax: 1500,
    });
  }

  // Routine maintenance based on mileage
  const mileageSinceService = lastServiceDate ? 10000 : 15000; // Simplified
  if (mileageSinceService > 8000) {
    const daysUntilDue = Math.round((10000 - mileageSinceService) / 50); // Assuming 50km/day average
    
    if (daysUntilDue < 30) {
      predictions.push({
        component: "routine_service",
        daysUntilFailure: Math.max(0, daysUntilDue),
        severity: daysUntilDue < 7 ? "medium" : "low",
        alertType: "routine",
        message: `Your vehicle is due for routine maintenance in ${Math.max(0, daysUntilDue)} days based on mileage.`,
        predictedFailureDate: new Date(now.getTime() + Math.max(0, daysUntilDue) * 24 * 60 * 60 * 1000),
        estimatedCostMin: 3000,
        estimatedCostMax: 5000,
      });
    }
  }

  return predictions;
}

export function generateOBDData(): Partial<VehicleHealthLog> {
  // Generate realistic mock OBD-II data
  return {
    batteryHealth: Math.round(70 + Math.random() * 30), // 70-100%
    engineOil: Math.random() > 0.7 ? "Good" : Math.random() > 0.5 ? "Low" : "Good",
    brakePadThickness: parseFloat((3 + Math.random() * 4).toFixed(1)), // 3-7mm
    tirePressureFl: parseFloat((28 + Math.random() * 7).toFixed(1)), // 28-35 PSI
    tirePressureFr: parseFloat((28 + Math.random() * 7).toFixed(1)),
    tirePressureRl: parseFloat((28 + Math.random() * 7).toFixed(1)),
    tirePressureRr: parseFloat((28 + Math.random() * 7).toFixed(1)),
    engineTemp: parseFloat((85 + Math.random() * 20).toFixed(1)), // 85-105°C
    coolantLevel: Math.random() > 0.8 ? "Low" : "Good",
  };
}
