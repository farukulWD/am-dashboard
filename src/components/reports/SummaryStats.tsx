import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";

interface SummaryStat {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
}

interface SummaryStatsProps {
  stats: SummaryStat[];
}

export default function SummaryStats({ stats }: SummaryStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change} from last period</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 