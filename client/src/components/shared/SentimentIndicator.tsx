import { Circle } from "lucide-react";
import { EMOTIONS } from "@shared/constants";

interface SentimentIndicatorProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function SentimentIndicator({ score, label, size = "md", showLabel = false }: SentimentIndicatorProps) {
  // Determine emotion based on score
  let emotion = EMOTIONS.NEUTRAL;
  
  if (score >= EMOTIONS.HAPPY.scoreMin) {
    emotion = EMOTIONS.HAPPY;
  } else if (score >= EMOTIONS.NEUTRAL.scoreMin) {
    emotion = EMOTIONS.NEUTRAL;
  } else if (score >= EMOTIONS.CONCERNED.scoreMin) {
    emotion = EMOTIONS.CONCERNED;
  } else if (score >= EMOTIONS.FRUSTRATED.scoreMin) {
    emotion = EMOTIONS.FRUSTRATED;
  } else {
    emotion = EMOTIONS.URGENT;
  }

  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (showLabel) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50 border" data-testid={`sentiment-badge-${emotion.label}`}>
        <Circle 
          className={sizeClasses[size]} 
          style={{ color: emotion.color }} 
          fill={emotion.color}
          data-testid={`sentiment-dot-${emotion.label}`}
        />
        <span className={`${textSizeClasses[size]} font-medium capitalize`} style={{ color: emotion.color }}>
          {label || emotion.label}
        </span>
      </div>
    );
  }

  return (
    <Circle 
      className={sizeClasses[size]} 
      style={{ color: emotion.color }} 
      fill={emotion.color}
      data-testid={`sentiment-dot-${emotion.label}`}
    />
  );
}
