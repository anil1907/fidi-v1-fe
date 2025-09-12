import { useState } from "react";
import { Plus, X, GripVertical, Sunrise, Sun, Moon, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTemplates } from "@/lib/hooks/useTemplates";
import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
          calories: undefined,
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId.startsWith('section-')) {
      // Handle section reordering
      const activeSectionId = activeId.replace('section-', '');
      const overSectionId = overId.replace('section-', '');
      
      if (activeSectionId !== overSectionId) {
        const oldIndex = sections.findIndex(s => s.id === activeSectionId);
        const newIndex = sections.findIndex(s => s.id === overSectionId);
        setSections(arrayMove(sections, oldIndex, newIndex));
      }
    } else if (activeId.startsWith('item-')) {
      // Handle item reordering within a section
      const activeItemId = activeId.replace('item-', '');
      const overItemId = overId.replace('item-', '');
      
      setSections(sections.map(section => {
        const activeItemIndex = section.items.findIndex(item => item.id === activeItemId);
        const overItemIndex = section.items.findIndex(item => item.id === overItemId);
        
        if (activeItemIndex !== -1 && overItemIndex !== -1) {
          return {
            ...section,
            items: arrayMove(section.items, activeItemIndex, overItemIndex)
          };
        }
        return section;
      }));
    }
  };

  // Sortable Section Component
  function SortableSection({ section, onRemoveSection, onAddItem, onUpdateItem, onRemoveItem, getMealIcon }: {
    section: TemplateSection;
    onRemoveSection: (id: string) => void;
    onAddItem: (sectionId: string) => void;
    onUpdateItem: (sectionId: string, itemId: string, updates: Partial<TemplateItem>) => void;
    onRemoveItem: (sectionId: string, itemId: string) => void;
    getMealIcon: (title: TemplateSection["title"]) => any;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `section-${section.id}` });
    const style = { transform: CSS.Transform.toString(transform), transition };
    const Icon = getMealIcon(section.title);

    return (
      <Card ref={setNodeRef} style={style} className="p-3" data-testid={`section-${section.id}`}>
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-medium flex items-center gap-2">
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
            <Icon className="w-4 h-4 text-chart-3" />
            {section.title}
          </h5>
          <Button variant="ghost" size="icon" onClick={() => onRemoveSection(section.id)} data-testid={`button-remove-section-${section.id}`}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <SortableContext items={section.items.map(item => `item-${item.id}`)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {section.items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                sectionId={section.id}
                onUpdateItem={onUpdateItem}
                onRemoveItem={onRemoveItem}
              />
            ))}
            <Button
              variant="ghost"
              className="w-full h-8 text-xs text-muted-foreground border border-dashed"
              onClick={() => onAddItem(section.id)}
              data-testid={`button-add-item-${section.id}`}
            >
              + Öğe Ekle
            </Button>
          </div>
        </SortableContext>
      </Card>
    );
  }

  // Sortable Item Component
  function SortableItem({ item, sectionId, onUpdateItem, onRemoveItem }: {
    item: TemplateItem;
    sectionId: string;
    onUpdateItem: (sectionId: string, itemId: string, updates: Partial<TemplateItem>) => void;
    onRemoveItem: (sectionId: string, itemId: string) => void;
  }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: `item-${item.id}` });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
      <div ref={setNodeRef} style={style} className="space-y-2 bg-muted px-3 py-2 rounded" data-testid={`item-${item.id}`}>
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
          <Input
            value={item.label}
            onChange={(e) => onUpdateItem(sectionId, item.id, { label: e.target.value })}
            placeholder="Öğe adı"
            className="flex-1 h-8"
            data-testid={`input-item-label-${item.id}`}
          />
          <Input
            value={item.amount || ""}
            onChange={(e) => onUpdateItem(sectionId, item.id, { amount: e.target.value })}
            placeholder="Miktar"
            className="w-24 h-8"
            data-testid={`input-item-amount-${item.id}`}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveItem(sectionId, item.id)}
            className="h-8 w-8"
            data-testid={`button-remove-item-${item.id}`}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Input
            value={item.note || ""}
            onChange={(e) => onUpdateItem(sectionId, item.id, { note: e.target.value })}
            placeholder="Not (opsiyonel)"
            className="flex-1 h-8 text-sm"
            data-testid={`input-item-note-${item.id}`}
          />
          <Input
            type="number"
            value={item.calories || ""}
            onChange={(e) => onUpdateItem(sectionId, item.id, { calories: e.target.value ? parseInt(e.target.value) : undefined })}
            placeholder="Kalori"
            className="w-20 h-8 text-sm"
            data-testid={`input-item-calories-${item.id}`}
          />
        </div>
      </div>
    );
  }

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

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map(s => `section-${s.id}`)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {sections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      onRemoveSection={removeSection}
                      onAddItem={addItem}
                      onUpdateItem={updateItem}
                      onRemoveItem={removeItem}
                      getMealIcon={getMealIcon}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
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
