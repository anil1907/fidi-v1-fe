import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { usePlans } from "@/lib/hooks/usePlans";
import PlanCard from "@/components/plans/PlanCard";
import PlanPreview from "@/components/plans/PlanPreview";
import EmptyState from "@/components/common/EmptyState";

export default function Plans() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const { data: plans, isLoading } = usePlans();

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  const selectedPlan = plans?.find((p: any) => p.id === selectedPlanId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Diyet Planları</h1>
          <p className="text-sm text-muted-foreground">
            Danışanlarınız için oluşturulmuş aktif diyet planları
          </p>
        </div>
        <Button data-testid="button-new-plan">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Plan Oluştur
        </Button>
      </div>

      {/* Plans Grid */}
      {plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan: any) => (
            <PlanCard 
              key={plan.id} 
              plan={plan} 
              onViewDetails={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <EmptyState
            title="Henüz plan yok"
            description="İlk diyet planınızı oluşturarak başlayın"
            action={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Plan Oluştur
              </Button>
            }
          />
        </Card>
      )}

      {/* Plan Preview */}
      {selectedPlan && (
        <Card className="p-6">
          <PlanPreview 
            plan={selectedPlan} 
            onClose={() => setSelectedPlanId(null)} 
          />
        </Card>
      )}
    </div>
  );
}
