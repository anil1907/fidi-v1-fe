import { Eye, Printer, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { DietPlan } from "@shared/schema";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";

interface PlanCardProps {
  plan: DietPlan;
  onViewDetails: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PlanCard({ plan, onViewDetails, onEdit, onDelete }: PlanCardProps) {
  const startDate = new Date(plan.dateStart);
  const endDate = new Date(plan.dateEnd);
  const totalDays = differenceInDays(endDate, startDate) + 1;
  const daysPassed = Math.max(0, differenceInDays(new Date(), startDate));
  const progress = Math.min(100, (daysPassed / totalDays) * 100);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {/* TODO: Get client initials */}
              DN
            </span>
          </div>
          <div>
            <h4 className="font-semibold" data-testid={`text-plan-name-${plan.id}`}>
              {plan.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              Danışan ID: {plan.clientId}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onViewDetails}
            data-testid={`button-view-plan-${plan.id}`}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.print()}
            data-testid={`button-print-plan-${plan.id}`}
          >
            <Printer className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onEdit}
            data-testid={`button-edit-plan-${plan.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
            data-testid={`button-delete-plan-${plan.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Başlangıç:</span>
          <span>{format(startDate, "d MMMM yyyy", { locale: tr })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Bitiş:</span>
          <span>{format(endDate, "d MMMM yyyy", { locale: tr })}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Süre:</span>
          <span>{totalDays} gün</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>İlerleme</span>
          <span>{daysPassed}/{totalDays} gün</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex items-center justify-between">
        <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2">
          Aktif
        </Badge>
        <Button variant="ghost" onClick={onViewDetails} className="text-sm">
          Detayları Görüntüle
        </Button>
      </div>
    </Card>
  );
}
