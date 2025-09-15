import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTemplates } from "@/lib/hooks/useTemplates";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplateBuilder from "@/components/templates/TemplateBuilder";
import EmptyState from "@/components/common/EmptyState";
import type { Template } from "@shared/schema";

export default function Templates() {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const { data: templates, isLoading } = useTemplates();

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Diyet Şablonları</h1>
          <p className="text-sm text-muted-foreground">
            Yeniden kullanılabilir diyet şablonlarınızı oluşturun ve yönetin
          </p>
        </div>
        <Button 
          onClick={() => setIsBuilderOpen(true)}
          data-testid="button-new-template"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Şablon
        </Button>
      </div>

      {/* Template Grid */}
      {templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template: any) => (
            <TemplateCard 
              key={template.id} 
              template={template} 
              onEditTemplate={setEditingTemplate}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <EmptyState
            title="Henüz şablon yok"
            description="İlk diyet şablonunuzu oluşturarak başlayın"
            action={
              <Button onClick={() => setIsBuilderOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Yeni Şablon Oluştur
              </Button>
            }
          />
        </Card>
      )}

      {/* Template Builder */}
      {isBuilderOpen && (
        <Card className="p-6">
          <TemplateBuilder onClose={() => setIsBuilderOpen(false)} />
        </Card>
      )}

      {/* Edit Template Builder */}
      {editingTemplate && (
        <Card className="p-6">
          <TemplateBuilder 
            template={editingTemplate}
            mode="edit"
            onClose={() => setEditingTemplate(null)} 
          />
        </Card>
      )}
    </div>
  );
}
