import { useState } from "react";
import { Plus, X, GripVertical, Sunrise, Sun, Moon, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTemplates } from "@/lib/hooks/useTemplates";
import type { TemplateSection, TemplateItem } from "@shared/schema";

const MEAL_TYPES = [
  { value: "Kahvaltı", label: "Kahvaltı", icon: Sunrise },
  { value: "Öğle", label: "Öğle", icon: Sun },
  { value: "Akşam", label: "Akşam", icon: Moon },
  { value: "Ara Öğün", label: "Ara Öğün", icon: Coffee },
] as const;

interface TemplateBuilderProps {
  onClose: () => void;
}

export default function TemplateBuilder({ onClose }: TemplateBuilderProps) {
  const [name, setName] = useState("Yeni Diyet Şablonu");
  const [description, setDescription] = useState("");
  const [sections, setSections] = useState<TemplateSection[]>([]);
  const { createTemplate } = useTemplates();

  const addSection = (title: TemplateSection["title"]) => {
    const newSection: TemplateSection = {
      id: Date.now().toString(),
      title,
      items: [],
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const addItem = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newItem: TemplateItem = {
          id: Date.now().toString(),
          label: "",
          amount: "",
          note: "",
        };
        return {
          ...section,
          items: [...section.items, newItem],
        };
      }
      return section;
    }));
  };

  const updateItem = (sectionId: string, itemId: string, updates: Partial<TemplateItem>) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => 
            item.id === itemId ? { ...item, ...updates } : item
          ),
        };
      }
      return section;
    }));
  };

  const removeItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId),
        };
      }
      return section;
    }));
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    try {
      await createTemplate.mutateAsync({
        name,
        description,
        sections,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create template:", error);
    }
  };

  const getMealIcon = (title: TemplateSection["title"]) => {
    const meal = MEAL_TYPES.find(m => m.value === title);
    return meal?.icon || Sunrise;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Şablon Editörü</h4>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Builder Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Şablon Adı</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-template-name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Açıklama</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Bu şablon hakkında kısa bir açıklama..."
              data-testid="textarea-template-description"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium">Öğün Bölümleri</label>
              <Select onValueChange={(value) => addSection(value as TemplateSection["title"])}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Bölüm Ekle" />
                </SelectTrigger>
                <SelectContent>
                  {MEAL_TYPES.map((meal) => (
                    <SelectItem key={meal.value} value={meal.value}>
                      {meal.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {sections.map((section) => {
                const Icon = getMealIcon(section.title);
                return (
                  <Card key={section.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium flex items-center gap-2">
                        <Icon className="w-4 h-4 text-chart-3" />
                        {section.title}
                      </h5>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSection(section.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 bg-muted px-3 py-2 rounded">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <Input
                            value={item.label}
                            onChange={(e) => updateItem(section.id, item.id, { label: e.target.value })}
                            placeholder="Öğe adı"
                            className="flex-1 h-8"
                          />
                          <Input
                            value={item.amount || ""}
                            onChange={(e) => updateItem(section.id, item.id, { amount: e.target.value })}
                            placeholder="Miktar"
                            className="w-24 h-8"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(section.id, item.id)}
                            className="h-8 w-8"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        className="w-full h-8 text-xs text-muted-foreground border border-dashed"
                        onClick={() => addItem(section.id)}
                        data-testid={`button-add-item-${section.id}`}
                      >
                        + Öğe Ekle
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div>
          <h5 className="font-medium mb-3">Önizleme</h5>
          <Card className="p-4 space-y-4">
            <div className="text-center border-b border-border pb-3">
              <h3 className="font-semibold">{name}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            
            <div className="space-y-3">
              {sections.map((section) => {
                const Icon = getMealIcon(section.title);
                return (
                  <div key={section.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-chart-3" />
                      <h4 className="font-medium">{section.title}</h4>
                    </div>
                    <ul className="text-sm space-y-1 ml-6">
                      {section.items.map((item) => (
                        <li key={item.id}>
                          • {item.label} {item.amount && `(${item.amount})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border">
        <Button variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!name.trim() || createTemplate.isPending}
          data-testid="button-save-template"
        >
          {createTemplate.isPending ? "Kaydediliyor..." : "Şablonu Kaydet"}
        </Button>
      </div>
    </div>
  );
}
