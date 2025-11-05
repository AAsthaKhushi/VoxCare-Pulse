import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { IndianRupee, TrendingUp, Calendar, Wrench } from "lucide-react";

interface RevenueData {
  period: string;
  booked: number;
  completed: number;
  predicted: number;
}

interface RevenueInsightsProps {
  dailyData: RevenueData[];
  weeklyData: RevenueData[];
  monthlyData: RevenueData[];
  totalRevenue: number;
  predictedRevenue: number;
  servicesBooked: number;
  costSavings: number;
}

export function RevenueInsights({ 
  dailyData,
  weeklyData,
  monthlyData,
  totalRevenue,
  predictedRevenue,
  servicesBooked,
  costSavings
}: RevenueInsightsProps) {
  const summaryCards = [
    {
      title: "Total Revenue (Month)",
      value: `₹${(totalRevenue / 1000).toFixed(1)}K`,
      icon: IndianRupee,
      color: "text-sentiment-happy",
      bgColor: "bg-sentiment-happy/10",
      trend: "+12%",
    },
    {
      title: "Predicted Revenue",
      value: `₹${(predictedRevenue / 1000).toFixed(1)}K`,
      icon: TrendingUp,
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: "+8%",
    },
    {
      title: "Services Booked",
      value: servicesBooked,
      icon: Wrench,
      color: "text-sentiment-neutral",
      bgColor: "bg-sentiment-neutral/10",
      trend: "+15%",
    },
    {
      title: "Cost Savings",
      value: `₹${(costSavings / 1000).toFixed(1)}K`,
      icon: Calendar,
      color: "text-sentiment-happy",
      bgColor: "bg-sentiment-happy/10",
      subtitle: "From prevented breakdowns",
    },
  ];

  return (
    <div className="space-y-6" data-testid="revenue-insights">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Revenue Insights</h2>
        <p className="text-muted-foreground">Financial analytics and predictions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-6 w-6 ${card.color}`} />
                </div>
                {card.trend && (
                  <div className="flex items-center gap-1 text-sentiment-happy text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    {card.trend}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <p className="text-2xl font-bold" data-testid={`value-${card.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <Card className="p-6">
        <Tabs defaultValue="daily">
          <TabsList>
            <TabsTrigger value="daily" data-testid="tab-daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly" data-testid="tab-weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly" data-testid="tab-monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                />
                <Legend />
                <Bar dataKey="booked" fill="#10B981" name="Booked" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#3B82F6" name="Completed" radius={[8, 8, 0, 0]} />
                <Bar dataKey="predicted" fill="#F59E0B" name="Predicted" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                />
                <Legend />
                <Bar dataKey="booked" fill="#10B981" name="Booked" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#3B82F6" name="Completed" radius={[8, 8, 0, 0]} />
                <Bar dataKey="predicted" fill="#F59E0B" name="Predicted" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, ""]}
                />
                <Legend />
                <Bar dataKey="booked" fill="#10B981" name="Booked" radius={[8, 8, 0, 0]} />
                <Bar dataKey="completed" fill="#3B82F6" name="Completed" radius={[8, 8, 0, 0]} />
                <Bar dataKey="predicted" fill="#F59E0B" name="Predicted" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
