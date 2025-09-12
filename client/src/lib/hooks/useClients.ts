import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Client, InsertClient } from "@shared/schema";

interface UseClientsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useClients(params?: UseClientsParams) {
  const query = useQuery({
    queryKey: ["clients", params],
    queryFn: () => api.getClients(params),
  });

  return query;
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ["clients", id],
    queryFn: () => api.getClient(id),
    enabled: !!id,
  });
}

export function useClientMutations() {
  const { toast } = useToast();

  const createClient = useMutation({
    mutationFn: api.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Başarılı",
        description: "Danışan başarıyla eklendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Danışan eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateClient = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertClient> }) => 
      api.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Başarılı",
        description: "Danışan başarıyla güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Danışan güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteClient = useMutation({
    mutationFn: api.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({
        title: "Başarılı",
        description: "Danışan başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Danışan silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  return {
    createClient,
    updateClient,
    deleteClient,
  };
}
