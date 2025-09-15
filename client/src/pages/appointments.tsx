import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";
import AppointmentFormDialog from "@/components/appointments/AppointmentFormDialog";
import AppointmentDeleteConfirmDialog from "@/components/appointments/AppointmentDeleteConfirmDialog";
import type { Appointment } from "@shared/schema";

export default function Appointments() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const handleCreateAppointment = (date?: string, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowCreateDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Randevu Takvimu</h1>
          <p className="text-sm text-muted-foreground">
            Randevularınızı planlayın ve yönetin
          </p>
        </div>
        <Button 
          onClick={() => handleCreateAppointment()}
          data-testid="button-new-appointment"
        >
          <Plus className="w-4 h-4 mr-2" />
          Randevu Ekle
        </Button>
      </div>

      {/* Calendar */}
      <Card className="p-6">
        <AppointmentCalendar 
          onCreateAppointment={handleCreateAppointment}
          onEditAppointment={setEditingAppointment}
          onDeleteAppointment={setDeletingAppointment}
        />
      </Card>

      {/* Dialogs */}
      <AppointmentFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        mode="create"
        defaultDate={selectedDate}
        defaultTime={selectedTime}
      />

      <AppointmentFormDialog
        open={!!editingAppointment}
        onOpenChange={(open) => !open && setEditingAppointment(null)}
        appointment={editingAppointment || undefined}
        mode="edit"
      />

      <AppointmentDeleteConfirmDialog
        open={!!deletingAppointment}
        onOpenChange={(open) => !open && setDeletingAppointment(null)}
        appointment={deletingAppointment}
      />
    </div>
  );
}
