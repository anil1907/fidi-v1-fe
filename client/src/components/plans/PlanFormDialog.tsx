import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, CalendarDays, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { planFormSchema } from "@/lib/validators";
import { usePlanMutations } from "@/lib/hooks/usePlans";
import { useClients } from "@/lib/hooks/useClients";
import { useTemplates } from "@/lib/hooks/useTemplates";
import type { DietPlan, TemplateSection, TemplateItem } from "@shared/schema";
import { z } from "zod";

type PlanFormData = z.infer<typeof planFormSchema>;

interface PlanFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan?: DietPlan;
  mode: "create" | "edit";
}

export default function PlanFormDialog({ open, onOpenChange, plan, mode }: PlanFormDialogProps) {
  const { createPlan, updatePlan } = usePlanMutations();
  const { data: clients } = useClients();
  const { data: templates } = useTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: "",
      clientId: "",
      templateId: "",
      dateStart: "",
      dateEnd: "",
      notes: "",
      sections: [],
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (mode === "edit" && plan) {
      form.reset({
        name: plan.name,
        clientId: plan.clientId,
        templateId: plan.templateId,
        dateStart: plan.dateStart,
        dateEnd: plan.dateEnd,
        notes: plan.notes || "",
        sections: plan.sections as TemplateSection[],
      });
    } else if (mode === "create") {
      form.reset({
        name: "",
        clientId: "",
        templateId: "",
        dateStart: "",
        dateEnd: "",
        notes: "",
        sections: [],
      });
    }
  }, [mode, plan, form]);

  // Watch template selection to load sections
  const watchedTemplateId = form.watch("templateId");
  useEffect(() => {
    if (watchedTemplateId && templates) {
      const template = templates.find((t: any) => t.id === watchedTemplateId);
      if (template) {
        setSelectedTemplate(template);
        form.setValue("sections", template.sections);
      }
    }
  }, [watchedTemplateId, templates, form]);

  const onSubmit = async (data: PlanFormData) => {
    try {
      const formattedData = {
        ...data,
        sections: data.sections,
      };

      if (mode === "create") {
        await createPlan.mutateAsync(formattedData);
      } else if (plan) {
        await updatePlan.mutateAsync({ 
          id: plan.id, 
          data: formattedData 
        });
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Plan form submission error:", error);
    }
  };

  const addMealItem = (sectionIndex: number) => {
    const sections = form.getValues("sections");
    const newItem: TemplateItem = {
      id: crypto.randomUUID(),
      label: "",
      amount: "",
      note: "",
      calories: 0,
    };
    
    sections[sectionIndex].items.push(newItem);
    form.setValue("sections", [...sections]);
  };

  const removeMealItem = (sectionIndex: number, itemIndex: number) => {
    const sections = form.getValues("sections");
    sections[sectionIndex].items.splice(itemIndex, 1);
    form.setValue("sections", [...sections]);
  };

  const updateMealItem = (sectionIndex: number, itemIndex: number, field: keyof TemplateItem, value: any) => {
    const sections = form.getValues("sections");
    sections[sectionIndex].items[itemIndex] = {
      ...sections[sectionIndex].items[itemIndex],
      [field]: value,
    };
    form.setValue("sections", [...sections]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Yeni Diyet Planı" : "Diyet Planını Düzenle"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Plan Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: Kilo Verme Planı" {...field} data-testid="input-plan-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Danışan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-client">
                          <SelectValue placeholder="Danışan seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients?.clients?.map((client: any) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.firstName} {client.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şablon</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-template">
                          <SelectValue placeholder="Şablon seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates?.map((template: any) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Tarih Aralığı</label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name="dateStart"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                data-testid="button-date-start"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value ? format(new Date(field.value), "dd/MM/yyyy", { locale: tr }) : "Başlangıç"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateEnd"
                    render={({ field }) => (
                      <FormItem>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                                data-testid="button-date-end"
                              >
                                <CalendarDays className="mr-2 h-4 w-4" />
                                {field.value ? format(new Date(field.value), "dd/MM/yyyy", { locale: tr }) : "Bitiş"}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value ? new Date(field.value) : undefined}
                              onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Plan ile ilgili özel notlarınızı buraya yazabilirsiniz..."
                      className="resize-none"
                      {...field}
                      data-testid="textarea-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Meal Sections */}
            {selectedTemplate && (
              <div className="space-y-4">
                <Separator />
                <h3 className="text-lg font-semibold">Öğün Planı</h3>
                
                {form.watch("sections").map((section: TemplateSection, sectionIndex: number) => (
                  <Card key={section.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {section.items.map((item: TemplateItem, itemIndex: number) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-4">
                            <Input
                              placeholder="Yiyecek/İçecek"
                              value={item.label}
                              onChange={(e) => updateMealItem(sectionIndex, itemIndex, "label", e.target.value)}
                              data-testid={`input-item-label-${sectionIndex}-${itemIndex}`}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              placeholder="Miktar"
                              value={item.amount || ""}
                              onChange={(e) => updateMealItem(sectionIndex, itemIndex, "amount", e.target.value)}
                              data-testid={`input-item-amount-${sectionIndex}-${itemIndex}`}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              placeholder="Kalori"
                              value={item.calories || ""}
                              onChange={(e) => updateMealItem(sectionIndex, itemIndex, "calories", parseInt(e.target.value) || 0)}
                              data-testid={`input-item-calories-${sectionIndex}-${itemIndex}`}
                            />
                          </div>
                          <div className="col-span-3">
                            <Input
                              placeholder="Not"
                              value={item.note || ""}
                              onChange={(e) => updateMealItem(sectionIndex, itemIndex, "note", e.target.value)}
                              data-testid={`input-item-note-${sectionIndex}-${itemIndex}`}
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeMealItem(sectionIndex, itemIndex)}
                              data-testid={`button-remove-item-${sectionIndex}-${itemIndex}`}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addMealItem(sectionIndex)}
                        className="w-full"
                        data-testid={`button-add-item-${sectionIndex}`}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Yeni Öğe Ekle
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={createPlan.isPending || updatePlan.isPending}
                data-testid="button-submit"
              >
                {mode === "create" ? "Plan Oluştur" : "Güncelle"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}