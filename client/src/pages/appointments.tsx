import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AppointmentCalendar from "@/components/appointments/AppointmentCalendar";

export default function Appointments() {
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
        <Button data-testid="button-new-appointment">
          <Plus className="w-4 h-4 mr-2" />
          Randevu Ekle
        </Button>
      </div>

      {/* Calendar */}
      <Card className="p-6">
        <AppointmentCalendar />
      </Card>
    </div>
  );
}
