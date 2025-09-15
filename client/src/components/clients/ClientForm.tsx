import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useClientMutations } from "@/lib/hooks/useClients";
import { clientFormSchema } from "@/lib/validators";
import type { z } from "zod";
import type { Client } from "@shared/schema";
import { useEffect } from "react";

type ClientFormData = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  client?: Client;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export default function ClientForm({ client, mode = "create", onSuccess }: ClientFormProps) {
  const { createClient, updateClient } = useClientMutations();
  
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      notes: "",
      goals: [],
    },
  });

  // Update form values when client data changes for edit mode
  useEffect(() => {
    if (mode === "edit" && client) {
      form.reset({
        firstName: client.firstName || "",
        lastName: client.lastName || "",
        email: client.email || "",
        phone: client.phone || "",
        notes: client.notes || "",
        goals: client.goals || [],
      });
    }
  }, [client, mode, form]);

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (mode === "edit" && client) {
        await updateClient.mutateAsync({ id: client.id, data });
      } else {
        await createClient.mutateAsync(data);
      }
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(`Failed to ${mode} client:`, error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad</FormLabel>
                <FormControl>
                  <Input {...field} data-testid="input-first-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soyad</FormLabel>
                <FormControl>
                  <Input {...field} data-testid="input-last-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} data-testid="input-email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefon</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-phone" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} data-testid="textarea-notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => form.reset()}
            data-testid="button-cancel"
          >
            İptal
          </Button>
          <Button 
            type="submit" 
            disabled={createClient.isPending || updateClient.isPending}
            data-testid="button-save-client"
          >
            {(createClient.isPending || updateClient.isPending) 
              ? "Kaydediliyor..." 
              : mode === "edit" ? "Güncelle" : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
