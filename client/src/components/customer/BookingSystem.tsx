import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Check, MapPin, Clock, IndianRupee } from "lucide-react";
import { SERVICE_CENTERS, SERVICE_TYPES } from "@shared/constants";

interface BookingSystemProps {
  onBookingComplete: (booking: {
    serviceType: string;
    serviceCenter: string;
    date: Date;
    timeSlot: string;
  }) => void;
  preselectedService?: string;
}

export function BookingSystem({ onBookingComplete, preselectedService }: BookingSystemProps) {
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState(preselectedService || "");
  const [serviceCenter, setServiceCenter] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState("");

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (serviceType && serviceCenter && selectedDate && timeSlot) {
        onBookingComplete({
          serviceType,
          serviceCenter,
          date: selectedDate,
          timeSlot,
        });
      }
    }
  };

  const canContinue = () => {
    switch (step) {
      case 1:
        return serviceType !== "";
      case 2:
        return serviceCenter !== "";
      case 3:
        return selectedDate !== undefined;
      case 4:
        return timeSlot !== "";
      default:
        return false;
    }
  };

  const selectedServiceCenter = SERVICE_CENTERS.find(sc => sc.id === serviceCenter);
  const selectedServiceType = Object.entries(SERVICE_TYPES).find(([key]) => key === serviceType)?.[1];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" data-testid="booking-system">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step >= s ? "bg-primary border-primary text-primary-foreground" : "border-muted"
            }`}>
              {step > s ? <Check className="h-5 w-5" /> : s}
            </div>
            {s < 4 && (
              <div className={`flex-1 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Service Type */}
      {step === 1 && (
        <div className="space-y-4" data-testid="step-service-type">
          <h2 className="text-2xl font-bold">Select Service Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(SERVICE_TYPES).map(([key, service]) => (
              <Card
                key={key}
                className={`p-6 cursor-pointer hover-elevate transition-all ${
                  serviceType === key ? "border-primary ring-2 ring-primary" : ""
                }`}
                onClick={() => setServiceType(key)}
                data-testid={`card-service-${key.toLowerCase()}`}
              >
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  {service.estimatedTime}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <IndianRupee className="inline h-4 w-4 mr-1" />
                  ₹{service.costRange[0].toLocaleString()} - ₹{service.costRange[1].toLocaleString()}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Service Center */}
      {step === 2 && (
        <div className="space-y-4" data-testid="step-service-center">
          <h2 className="text-2xl font-bold">Choose Service Center</h2>
          <RadioGroup value={serviceCenter} onValueChange={setServiceCenter}>
            <div className="space-y-3">
              {SERVICE_CENTERS.map((center) => (
                <Card
                  key={center.id}
                  className={`p-6 cursor-pointer hover-elevate transition-all ${
                    serviceCenter === center.id ? "border-primary ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setServiceCenter(center.id)}
                  data-testid={`card-center-${center.id}`}
                >
                  <div className="flex items-start gap-4">
                    <RadioGroupItem value={center.id} id={center.id} />
                    <div className="flex-1">
                      <Label htmlFor={center.id} className="text-lg font-semibold cursor-pointer">
                        {center.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        {center.location} • {center.distance} km away
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {center.availableSlots.map((slot) => (
                          <span
                            key={slot}
                            className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent font-medium"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Step 3: Date Selection */}
      {step === 3 && (
        <div className="space-y-4" data-testid="step-date-selection">
          <h2 className="text-2xl font-bold">Select Date</h2>
          <Card className="p-6 flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              className="rounded-md border"
              data-testid="calendar-date-picker"
            />
          </Card>
        </div>
      )}

      {/* Step 4: Time Slot */}
      {step === 4 && (
        <div className="space-y-4" data-testid="step-time-slot">
          <h2 className="text-2xl font-bold">Choose Time Slot</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedServiceCenter?.availableSlots.map((slot) => (
              <Button
                key={slot}
                variant={timeSlot === slot ? "default" : "outline"}
                className="h-16 text-base"
                onClick={() => setTimeSlot(slot)}
                data-testid={`button-timeslot-${slot.replace(/[:\s]/g, '-')}`}
              >
                <Clock className="mr-2 h-5 w-5" />
                {slot}
              </Button>
            ))}
          </div>

          {/* Booking Summary */}
          {timeSlot && (
            <Card className="p-6 bg-accent/5 border-accent/20 mt-6">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{selectedServiceType?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Center:</span>
                  <span className="font-medium">{selectedServiceCenter?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{timeSlot}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Estimated Cost:</span>
                  <span className="font-semibold">
                    ₹{selectedServiceType?.costRange[0].toLocaleString()} - ₹{selectedServiceType?.costRange[1].toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Time:</span>
                  <span className="font-medium">{selectedServiceType?.estimatedTime}</span>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          data-testid="button-back"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!canContinue()}
          data-testid="button-continue"
        >
          {step === 4 ? "Confirm Booking" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
