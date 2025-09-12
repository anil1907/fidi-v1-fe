import { BarChart3, Calendar, ClipboardList, FileText, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import ClientTable from "@/components/clients/ClientTable";

const stats = [
  {
    title: "Toplam Danışan",
    value: "0",
    change: "+0 bu hafta",
    icon: Users,
    color: "text-primary bg-primary/10",
  },
  {
    title: "Aktif Planlar",
    value: "0",
    change: "+0 bu hafta",
    icon: ClipboardList,
    color: "text-chart-2 bg-chart-2/10",
  },
  {
    title: "Bu Hafta Randevu",
    value: "0",
    change: "0 bugün",
    icon: Calendar,
    color: "text-chart-3 bg-chart-3/10",
  },
  {
    title: "Şablon Sayısı",
    value: "0",
    change: "0 yeni şablon",
    icon: FileText,
    color: "text-chart-4 bg-chart-4/10",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold" data-testid={`stat-${stat.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Clients */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Son Danışanlar</h3>
          <p className="text-sm text-muted-foreground">
            Yakın zamanda eklenen danışanlarınız
          </p>
        </div>
        <ClientTable limit={5} />
      </Card>
    </div>
  );
}
