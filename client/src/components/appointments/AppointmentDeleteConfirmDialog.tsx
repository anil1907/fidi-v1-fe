import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAppointmentMutations } from "@/lib/hooks/useAppointments";
import type { Appointment } from "@shared/schema";

interface AppointmentDeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
}

export default function AppointmentDeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  appointment 
}: AppointmentDeleteConfirmDialogProps) {
  const { deleteAppointment } = useAppointmentMutations();

  const handleDelete = async () => {
    if (!appointment) return;
    
    try {
      await deleteAppointment.mutateAsync(appointment.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Appointment deletion error:", error);
    }
  };

  if (!appointment) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-testid="dialog-delete-appointment-confirm">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Randevu Silinsin mi?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            <strong>{appointment.title}</strong> randevusunu silmek üzeresiniz. Bu işlem geri alınamaz.
            <br />
            <br />
            Danışan: <strong>ID {appointment.clientId}</strong>
            <br />
            Tarih: <strong>{format(new Date(appointment.startsAt), "dd MMMM yyyy - HH:mm", { locale: tr })}</strong>
            <br />
            Durum: <strong>
              {appointment.status === "scheduled" ? "Planlandı" : 
               appointment.status === "done" ? "Tamamlandı" : "İptal Edildi"}
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="button-cancel-delete-appointment">
            İptal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteAppointment.isPending}
            className="bg-destructive hover:bg-destructive/90"
            data-testid="button-confirm-delete-appointment"
          >
            {deleteAppointment.isPending ? "Siliniyor..." : "Evet, Sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}