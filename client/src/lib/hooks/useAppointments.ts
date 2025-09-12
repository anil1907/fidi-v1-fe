import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Appointment, InsertAppointment } from "@shared/schema";

interface UseAppointmentsParams {
  clientId?: string;
  from?: string;
  to?: string;
}

export function useAppointments(params?: UseAppointmentsParams) {
  const query = useQuery({
    queryKey: ["appointments", params],
    queryFn: () => api.getAppointments(params),
  });

  return query;
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => api.getAppointment(id),
    enabled: !!id,
  });
}

export function useAppointmentMutations() {
  const { toast } = useToast();

  const createAppointment = useMutation({
    mutationFn: api.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Başarılı",
        description: "Randevu başarıyla oluşturuldu.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Randevu oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateAppointment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertAppointment> }) => 
      api.updateAppointment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Başarılı",
        description: "Randevu başarıyla güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Randevu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteAppointment = useMutation({
    mutationFn: api.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast({
        title: "Başarılı",
        description: "Randevu başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Randevu silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  return {
    createAppointment,
    updateAppointment,
    deleteAppointment,
  };
}
