import { X, Printer, Sunrise, Sun, Moon, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { DietPlan, TemplateSection } from "@shared/schema";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface PlanPreviewProps {
  plan: DietPlan;
  onClose: () => void;
}

export default function PlanPreview({ plan, onClose }: PlanPreviewProps) {
  const sections = plan.sections as TemplateSection[];

  const getMealIcon = (title: TemplateSection["title"]) => {
    const icons = {
      "Kahvaltı": Sunrise,
      "Öğle": Sun,
      "Akşam": Moon,
      "Ara Öğün": Coffee,
    };
    return icons[title] || Sunrise;
  };

  const getMealTime = (title: TemplateSection["title"]) => {
    const times = {
      "Kahvaltı": "08:00",
      "Öğle": "13:00",
      "Akşam": "19:00",
      "Ara Öğün": "16:00",
    };
    return times[title] || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <h4 className="font-semibold">Plan Önizleme</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.print()}
            data-testid="button-print-plan"
          >
            <Printer className="w-4 h-4 mr-2" />
            Yazdır
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Card className="p-8 print:shadow-none print:border-none print:bg-white">
        {/* Plan Header */}
        <div className="text-center mb-8 border-b border-border pb-6 print:border-black">
          <h1 className="text-2xl font-bold mb-2">Kişisel Beslenme Programı</h1>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Plan:</strong> {plan.name}</p>
            <p><strong>Tarih Aralığı:</strong> {format(new Date(plan.dateStart), "d MMMM yyyy", { locale: tr })} - {format(new Date(plan.dateEnd), "d MMMM yyyy", { locale: tr })}</p>
            <p><strong>Hazırlayan:</strong> Dyt. Ayşe Yılmaz</p>
          </div>
        </div>

        {/* Daily Plan */}
        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = getMealIcon(section.title);
            const mealTime = getMealTime(section.title);
            const totalCalories = section.items.reduce((sum, item) => sum + (item.calories || 0), 0);
            
            return (
              <div key={section.id}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border print:border-gray-300">
                  <Icon className="w-5 h-5 text-chart-3 print:hidden" />
                  <h3 className="text-lg font-semibold">
                    {section.title} {mealTime && `(${mealTime})`}
                  </h3>
                </div>
                <ul className="space-y-2 text-sm ml-4">
                  {section.items.map((item) => (
                    <li key={item.id} className="flex justify-between">
                      <span>• {item.label} {item.amount && `(${item.amount})`}</span>
                      {item.calories && (
                        <span className="text-muted-foreground">{item.calories} kcal</span>
                      )}
                    </li>
                  ))}
                </ul>
                {totalCalories > 0 && (
                  <div className="mt-2 pt-2 border-t border-muted text-sm font-medium">
                    <span className="float-right">Toplam: {totalCalories} kcal</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Daily Summary */}
        <div className="mt-8 p-4 bg-muted rounded-lg print:bg-gray-100">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Günlük Toplam Kalori:</span>
            <span className="text-xl font-bold text-primary">
              {sections.reduce((total, section) => 
                total + section.items.reduce((sum, item) => sum + (item.calories || 0), 0), 0
              )} kcal
            </span>
          </div>
        </div>

        {/* Notes */}
        {plan.notes && (
          <div className="mt-6 p-4 border border-border rounded-lg print:border-gray-300">
            <h4 className="font-semibold mb-2">Notlar:</h4>
            <p className="text-sm text-muted-foreground">{plan.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground print:border-gray-300">
          <p>Bu program size özel hazırlanmıştır. Başka kişilerle paylaşmayın.</p>
          <p className="mt-1">Dyt. Ayşe Yılmaz - Nutrisyonel Danışmanlık</p>
        </div>
      </Card>
    </div>
  );
}
