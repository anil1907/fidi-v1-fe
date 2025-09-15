import { AlertTriangle } from "lucide-react";
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
import { usePlanMutations } from "@/lib/hooks/usePlans";
import type { DietPlan } from "@shared/schema";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: DietPlan | null;
}

export default function DeleteConfirmDialog({ open, onOpenChange, plan }: DeleteConfirmDialogProps) {
  const { deletePlan } = usePlanMutations();

  const handleDelete = async () => {
    if (!plan) return;
    
    try {
      await deletePlan.mutateAsync(plan.id);
      onOpenChange(false);
    } catch (error) {
      console.error("Plan deletion error:", error);
    }
  };

  if (!plan) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent data-testid="dialog-delete-confirm">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Plan Silinsin mi?</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            <strong>{plan.name}</strong> planını silmek üzeresiniz. Bu işlem geri alınamaz.
            <br />
            <br />
            Danışan: <strong>ID {plan.clientId}</strong>
            <br />
            Tarih: <strong>{plan.dateStart} - {plan.dateEnd}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel data-testid="button-cancel-delete">
            İptal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePlan.isPending}
            className="bg-destructive hover:bg-destructive/90"
            data-testid="button-confirm-delete"
          >
            {deletePlan.isPending ? "Siliniyor..." : "Evet, Sil"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}