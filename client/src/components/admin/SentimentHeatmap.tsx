import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface SentimentDataPoint {
  time: string;
  happy: number;
  neutral: number;
  concerned: number;
  frustrated: number;
  urgent: number;
  average: number;
}

interface SentimentHeatmapProps {
  data: SentimentDataPoint[];
}

export function SentimentHeatmap({ data }: SentimentHeatmapProps) {
  // Calculate trend
  const latestAvg = data[data.length - 1]?.average || 0;
  const previousAvg = data[data.length - 2]?.average || 0;
  const trend = latestAvg - previousAvg;
  const trendPercent = previousAvg !== 0 ? ((trend / previousAvg) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6" data-testid="sentiment-heatmap">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sentiment Trends</h2>
          <p className="text-muted-foreground">Real-time customer emotion tracking</p>
        </div>
        
        {/* Trend Indicator */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Current Avg</p>
              <p className="text-2xl font-bold" data-testid="text-average-sentiment">
                {(latestAvg * 100).toFixed(1)}%
              </p>
            </div>
            <div className={`flex items-center gap-1 ${
              trend > 0 ? "text-sentiment-happy" : 
              trend < 0 ? "text-sentiment-urgent" : 
              "text-muted-foreground"
            }`}>
              {trend > 0 ? <TrendingUp className="h-5 w-5" /> : 
               trend < 0 ? <TrendingDown className="h-5 w-5" /> : 
               <Minus className="h-5 w-5" />}
              <span className="text-sm font-medium">{Math.abs(Number(trendPercent))}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAverage" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              domain={[0, 1]}
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
            />
            <Area 
              type="monotone" 
              dataKey="average" 
              stroke="#3B82F6" 
              fill="url(#colorAverage)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Emotion Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-sentiment-happy"></div>
            <p className="text-sm font-medium">Happy</p>
          </div>
          <p className="text-2xl font-bold">{((data[data.length - 1]?.happy || 0) * 100).toFixed(0)}%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-sentiment-neutral"></div>
            <p className="text-sm font-medium">Neutral</p>
          </div>
          <p className="text-2xl font-bold">{((data[data.length - 1]?.neutral || 0) * 100).toFixed(0)}%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-sentiment-concerned"></div>
            <p className="text-sm font-medium">Concerned</p>
          </div>
          <p className="text-2xl font-bold">{((data[data.length - 1]?.concerned || 0) * 100).toFixed(0)}%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-sentiment-frustrated"></div>
            <p className="text-sm font-medium">Frustrated</p>
          </div>
          <p className="text-2xl font-bold">{((data[data.length - 1]?.frustrated || 0) * 100).toFixed(0)}%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-sentiment-urgent"></div>
            <p className="text-sm font-medium">Urgent</p>
          </div>
          <p className="text-2xl font-bold">{((data[data.length - 1]?.urgent || 0) * 100).toFixed(0)}%</p>
        </Card>
      </div>
    </div>
  );
}
