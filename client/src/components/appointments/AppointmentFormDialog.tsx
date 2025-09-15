import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { appointmentFormSchema } from "@/lib/validators";
import { useAppointmentMutations } from "@/lib/hooks/useAppointments";
import { useClients } from "@/lib/hooks/useClients";
import type { Appointment } from "@shared/schema";
import { z } from "zod";

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: Appointment;
  mode: "create" | "edit";
  defaultDate?: string;
  defaultTime?: string;
}

export default function AppointmentFormDialog({ 
  open, 
  onOpenChange, 
  appointment, 
  mode, 
  defaultDate,
  defaultTime 
}: AppointmentFormDialogProps) {
  const { createAppointment, updateAppointment } = useAppointmentMutations();
  const { data: clients } = useClients();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      title: "",
      clientId: "",
      startsAt: "",
      endsAt: "",
      description: "",
      status: "scheduled",
    },
  });

  // Set form values when editing or when defaultDate/time provided
  useEffect(() => {
    if (mode === "edit" && appointment) {
      form.reset({
        title: appointment.title,
        clientId: appointment.clientId,
        startsAt: format(new Date(appointment.startsAt), "yyyy-MM-dd'T'HH:mm"),
        endsAt: format(new Date(appointment.endsAt), "yyyy-MM-dd'T'HH:mm"),
        description: appointment.description || "",
        status: appointment.status as "scheduled" | "done" | "canceled",
      });
    } else if (mode === "create") {
      const now = new Date();
      const startDateTime = defaultDate && defaultTime 
        ? `${defaultDate}T${defaultTime}:00`
        : format(now, "yyyy-MM-dd'T'HH:mm");
      
      // Default end time is 1 hour after start time, but clamp to business hours
      let endDateTime: string;
      if (defaultDate && defaultTime) {
        const startHour = parseInt(defaultTime.split(':')[0]);
        const startMinute = parseInt(defaultTime.split(':')[1]);
        let endHour = startHour;
        let endMinute = startMinute + 30;
        
        // Handle minute overflow
        if (endMinute >= 60) {
          endHour += 1;
          endMinute = 0;
        }
        
        // If end time goes beyond 18:00, adjust to valid range
        if (endHour > 18 || (endHour === 18 && endMinute > 0)) {
          endHour = 18;
          endMinute = 0;
        }
        
        endDateTime = `${defaultDate}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
      } else {
        const endTime = new Date(now.getTime() + 60 * 60 * 1000);
        // Clamp to business hours if needed
        if (endTime.getHours() > 18) {
          endTime.setHours(18, 0, 0, 0);
        }
        endDateTime = format(endTime, "yyyy-MM-dd'T'HH:mm");
      }

      form.reset({
        title: "",
        clientId: "",
        startsAt: startDateTime,
        endsAt: endDateTime,
        description: "",
        status: "scheduled" as const,
      });
    }
  }, [mode, appointment, defaultDate, defaultTime, form]);

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const formattedData = {
        ...data,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
      };

      if (mode === "create") {
        await createAppointment.mutateAsync(formattedData);
      } else if (appointment) {
        await updateAppointment.mutateAsync({ 
          id: appointment.id, 
          data: formattedData 
        });
      }
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Appointment form submission error:", error);
    }
  };

  // Generate time options (9:00 - 17:30 for start, 9:30 - 18:00 for end)
  const startTimeOptions: string[] = [];
  const endTimeOptions: string[] = [];
  
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      startTimeOptions.push(timeString);
      
      // End time options start from 30 minutes later
      if (hour > 9 || minute >= 30) {
        endTimeOptions.push(timeString);
      }
    }
  }
  // Add 18:00 as end option only
  endTimeOptions.push("18:00");

  const extractDateAndTime = (dateTimeString: string) => {
    const date = dateTimeString.split('T')[0];
    const time = dateTimeString.split('T')[1]?.substring(0, 5);
    return { date, time };
  };

  const combineDateAndTime = (date: string, time: string) => {
    return `${date}T${time}:00`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Yeni Randevu" : "Randevuyu Düzenle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create" 
              ? "Danışanınız için yeni bir randevu oluşturun"
              : "Mevcut randevunun bilgilerini güncelleyin"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Randevu Başlığı</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: Beslenme Danışmanlığı" {...field} data-testid="input-appointment-title" />
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
                        <SelectTrigger data-testid="select-appointment-client">
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
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="startsAt"
                  render={({ field }) => {
                    const { date, time } = extractDateAndTime(field.value);
                    return (
                      <FormItem>
                        <FormLabel>Başlangıç</FormLabel>
                        <div className="space-y-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                  data-testid="button-start-date"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {date ? format(new Date(date), "dd MMMM yyyy", { locale: tr }) : "Tarih seçin"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={date ? new Date(date) : undefined}
                                onSelect={(selectedDate) => {
                                  if (selectedDate) {
                                    const newDate = format(selectedDate, "yyyy-MM-dd");
                                    field.onChange(combineDateAndTime(newDate, time || "09:00"));
                                  }
                                }}
                                disabled={(date) => date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <Select
                            value={time || ""}
                            onValueChange={(selectedTime) => {
                              field.onChange(combineDateAndTime(date || format(new Date(), "yyyy-MM-dd"), selectedTime));
                            }}
                          >
                            <SelectTrigger data-testid="select-start-time">
                              <SelectValue placeholder="Saat seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {startTimeOptions.map((timeOption: string) => (
                                <SelectItem key={timeOption} value={timeOption}>
                                  {timeOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="endsAt"
                  render={({ field }) => {
                    const { date, time } = extractDateAndTime(field.value);
                    return (
                      <FormItem>
                        <FormLabel>Bitiş</FormLabel>
                        <div className="space-y-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal"
                                  data-testid="button-end-date"
                                >
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {date ? format(new Date(date), "dd MMMM yyyy", { locale: tr }) : "Tarih seçin"}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={date ? new Date(date) : undefined}
                                onSelect={(selectedDate) => {
                                  if (selectedDate) {
                                    const newDate = format(selectedDate, "yyyy-MM-dd");
                                    field.onChange(combineDateAndTime(newDate, time || "10:00"));
                                  }
                                }}
                                disabled={(date) => date < new Date("1900-01-01")}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <Select
                            value={time || ""}
                            onValueChange={(selectedTime) => {
                              field.onChange(combineDateAndTime(date || format(new Date(), "yyyy-MM-dd"), selectedTime));
                            }}
                          >
                            <SelectTrigger data-testid="select-end-time">
                              <SelectValue placeholder="Saat seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {endTimeOptions.map((timeOption: string) => (
                                <SelectItem key={timeOption} value={timeOption}>
                                  {timeOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durum</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-appointment-status">
                        <SelectValue placeholder="Durum seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="scheduled">Planlandı</SelectItem>
                      <SelectItem value="done">Tamamlandı</SelectItem>
                      <SelectItem value="canceled">İptal Edildi</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Randevu ile ilgili notlarınızı buraya yazabilirsiniz..."
                      className="resize-none"
                      {...field}
                      data-testid="textarea-appointment-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel-appointment"
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={createAppointment.isPending || updateAppointment.isPending}
                data-testid="button-submit-appointment"
              >
                {(createAppointment.isPending || updateAppointment.isPending)
                  ? "İşlem yapılıyor..." 
                  : mode === "create" ? "Randevu Oluştur" : "Güncelle"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}