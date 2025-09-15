import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { DietPlan, InsertDietPlan } from "@shared/schema";

interface UsePlansParams {
  clientId?: string;
}

export function usePlans(params?: UsePlansParams) {
  const query = useQuery({
    queryKey: ["plans", params],
    queryFn: () => api.getPlans(params),
  });

  return query;
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: ["plans", id],
    queryFn: () => api.getPlan(id),
    enabled: !!id,
  });
}

export function usePlanMutations() {
  const { toast } = useToast();

  const createPlan = useMutation({
    mutationFn: api.createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      toast({
        title: "Başarılı",
        description: "Diyet planı başarıyla oluşturuldu.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Diyet planı oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updatePlan = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertDietPlan> }) => 
      api.updatePlan(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans", id] });
      toast({
        title: "Başarılı",
        description: "Diyet planı başarıyla güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Diyet planı güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deletePlan = useMutation({
    mutationFn: api.deletePlan,
    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plans", planId] });
      toast({
        title: "Başarılı",
        description: "Diyet planı başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Diyet planı silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  return {
    createPlan,
    updatePlan,
    deletePlan,
  };
}
