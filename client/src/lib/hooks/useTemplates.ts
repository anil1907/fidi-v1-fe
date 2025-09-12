import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Template, InsertTemplate } from "@shared/schema";

export function useTemplates() {
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["templates"],
    queryFn: api.getTemplates,
  });

  const createTemplate = useMutation({
    mutationFn: api.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Başarılı",
        description: "Şablon başarıyla oluşturuldu.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Şablon oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertTemplate> }) => 
      api.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Başarılı",
        description: "Şablon başarıyla güncellendi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Şablon güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: api.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      toast({
        title: "Başarılı",
        description: "Şablon başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Şablon silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}

export function useTemplate(id: string) {
  return useQuery({
    queryKey: ["templates", id],
    queryFn: () => api.getTemplate(id),
    enabled: !!id,
  });
}
