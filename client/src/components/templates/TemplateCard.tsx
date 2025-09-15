import { useState } from "react";
import { Edit, Copy, Trash2, Utensils, Sunrise, Sun, Moon, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Template, TemplateSection } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { useTemplates } from "@/lib/hooks/useTemplates";
import ConfirmDialog from "@/components/common/ConfirmDialog";

interface TemplateCardProps {
  template: Template;
  onEditTemplate?: (template: Template) => void;
}

export default function TemplateCard({ template, onEditTemplate }: TemplateCardProps) {
  const sections = template.sections as TemplateSection[];
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const { deleteTemplate, createTemplate } = useTemplates();

  const getMealIcon = (title: TemplateSection["title"]) => {
    const icons = {
      "Kahvaltı": Sunrise,
      "Öğle": Sun,
      "Akşam": Moon,
      "Ara Öğün": Coffee,
    };
    return icons[title] || Sunrise;
  };

  const getSectionColor = (title: TemplateSection["title"]) => {
    const colors = {
      "Kahvaltı": "text-chart-3",
      "Öğle": "text-chart-3",
      "Akşam": "text-chart-3",
      "Ara Öğün": "text-chart-3",
    };
    return colors[title] || "text-chart-3";
  };

  const handleCopyTemplate = async () => {
    try {
      await createTemplate.mutateAsync({
        name: `${template.name} (Kopya)`,
        description: template.description,
        sections: template.sections,
      });
    } catch (error) {
      console.error("Failed to copy template:", error);
    }
  };

  const handleDeleteTemplate = async () => {
    try {
      await deleteTemplate.mutateAsync(template.id);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  return (
    <>
      <Card className="p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
            <Utensils className="w-6 h-6 text-chart-2" />
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEditTemplate?.(template)}
              data-testid={`button-edit-template-${template.id}`}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCopyTemplate}
              disabled={createTemplate.isPending}
              data-testid={`button-copy-template-${template.id}`}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setDeleteConfirmOpen(true)}
              data-testid={`button-delete-template-${template.id}`}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
        
        <h4 className="font-semibold mb-2" data-testid={`text-template-name-${template.id}`}>
          {template.name}
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          {template.description || "Açıklama yok"}
        </p>
        
        <div className="space-y-2 mb-4">
          {sections.map((section) => {
            const Icon = getMealIcon(section.title);
            const colorClass = getSectionColor(section.title);
            return (
              <div key={section.id} className="flex items-center gap-2 text-sm">
                <Icon className={`w-4 h-4 ${colorClass}`} />
                <span>{section.title}: {section.items.length} öğe</span>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Son güncelleme: {formatDistanceToNow(new Date(template.updatedAt || Date.now()), { 
              addSuffix: true, 
              locale: tr 
            })}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-chart-2/10 text-chart-2">
            0 kez kullanıldı
          </span>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteTemplate}
        title="Şablonu sil"
        description="Bu şablonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </>
  );
}
