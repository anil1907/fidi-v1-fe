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
  title: z.string().min(1, "Randevu başlığı zorunludur"),
  clientId: z.string().min(1, "Lütfen bir danışan seçin"),
  startsAt: z.string().min(1, "Başlangıç tarihi ve saati zorunludur"),
  endsAt: z.string().min(1, "Bitiş tarihi ve saati zorunludur"),
  description: z.string().optional(),
  status: z.enum(["scheduled", "done", "canceled"]).default("scheduled"),
}).refine((data) => {
  if (data.startsAt && data.endsAt) {
    const startTime = new Date(data.startsAt);
    const endTime = new Date(data.endsAt);
    return endTime > startTime;
  }
  return true;
}, {
  message: "Bitiş saati başlangıç saatinden sonra olmalıdır",
  path: ["endsAt"],
}).refine((data) => {
  if (data.startsAt && data.endsAt) {
    const startTime = new Date(data.startsAt);
    const endTime = new Date(data.endsAt);
    const startDate = startTime.toDateString();
    const endDate = endTime.toDateString();
    return startDate === endDate;
  }
  return true;
}, {
  message: "Randevu aynı gün içinde olmalıdır",
  path: ["endsAt"],
}).refine((data) => {
  if (data.startsAt) {
    const startTime = new Date(data.startsAt);
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const startTotalMinutes = startHour * 60 + startMinute;
    const businessStart = 9 * 60; // 09:00
    const businessEnd = 17 * 60 + 30; // 17:30
    return startTotalMinutes >= businessStart && startTotalMinutes <= businessEnd;
  }
  return true;
}, {
  message: "Başlangıç saati mesai saatleri içinde olmalıdır (09:00 - 17:30)",
  path: ["startsAt"],
}).refine((data) => {
  if (data.endsAt) {
    const endTime = new Date(data.endsAt);
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
    const endTotalMinutes = endHour * 60 + endMinute;
    const businessStart = 9 * 60 + 30; // 09:30
    const businessEnd = 18 * 60; // 18:00
    return endTotalMinutes >= businessStart && endTotalMinutes <= businessEnd;
  }
  return true;
}, {
  message: "Bitiş saati mesai saatleri içinde olmalıdır (09:30 - 18:00)",
  path: ["endsAt"],
}).refine((data) => {
  if (data.startsAt && data.endsAt) {
    const startTime = new Date(data.startsAt);
    const endTime = new Date(data.endsAt);
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return durationMinutes >= 30;
  }
  return true;
}, {
  message: "Randevu süresi en az 30 dakika olmalıdır",
  path: ["endsAt"],
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
