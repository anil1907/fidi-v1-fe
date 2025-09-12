import { z } from "zod";
import { insertClientSchema, insertTemplateSchema, insertDietPlanSchema, insertAppointmentSchema } from "@shared/schema";

// Client form validation
export const clientFormSchema = insertClientSchema.extend({
  email: z.string().email("Geçerli bir email adresi girin").optional().or(z.literal("")),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  notes: z.string().optional(),
  goals: z.array(z.string()).optional(),
});

// Template form validation
export const templateFormSchema = insertTemplateSchema.extend({
  name: z.string().min(1, "Şablon adı gereklidir"),
  description: z.string().optional(),
  sections: z.array(z.object({
    id: z.string(),
    title: z.enum(["Kahvaltı", "Öğle", "Akşam", "Ara Öğün"]),
    items: z.array(z.object({
      id: z.string(),
      label: z.string().min(1, "Öğe adı gereklidir"),
      amount: z.string().optional(),
      note: z.string().optional(),
      calories: z.number().optional(),
    })),
  })),
});

// Diet plan form validation
export const planFormSchema = insertDietPlanSchema.extend({
  name: z.string().min(1, "Plan adı gereklidir"),
  clientId: z.string().min(1, "Danışan seçimi gereklidir"),
  templateId: z.string().min(1, "Şablon seçimi gereklidir"),
  dateStart: z.string().min(1, "Başlangıç tarihi gereklidir"),
  dateEnd: z.string().min(1, "Bitiş tarihi gereklidir"),
  notes: z.string().optional(),
  sections: z.array(z.object({
    id: z.string(),
    title: z.enum(["Kahvaltı", "Öğle", "Akşam", "Ara Öğün"]),
    items: z.array(z.object({
      id: z.string(),
      label: z.string(),
      amount: z.string().optional(),
      note: z.string().optional(),
      calories: z.number().optional(),
    })),
  })),
});

// Appointment form validation
export const appointmentFormSchema = insertAppointmentSchema.extend({
  title: z.string().min(1, "Randevu başlığı gereklidir"),
  clientId: z.string().min(1, "Danışan seçimi gereklidir"),
  startsAt: z.string().min(1, "Başlangıç tarihi gereklidir"),
  endsAt: z.string().min(1, "Bitiş tarihi gereklidir"),
  description: z.string().optional(),
  status: z.enum(["scheduled", "done", "canceled"]).default("scheduled"),
});

// Search and filter validation
export const searchSchema = z.object({
  query: z.string().optional(),
  page: z.number().min(1).optional(),
  pageSize: z.number().min(1).max(100).optional(),
  status: z.enum(["all", "active", "inactive", "completed"]).optional(),
});

export const dateRangeSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});
