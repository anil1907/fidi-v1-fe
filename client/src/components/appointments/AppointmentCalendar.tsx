import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAppointments } from "@/lib/hooks/useAppointments";
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { tr } from "date-fns/locale";

export default function AppointmentCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  const { data: appointments, isLoading } = useAppointments({
    from: format(weekStart, "yyyy-MM-dd"),
    to: format(addDays(weekStart, 6), "yyyy-MM-dd"),
  });

  const timeSlots = Array.from({ length: 10 }, (_, i) => 
    `${String(9 + i).padStart(2, "0")}:00`
  );

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek(prev => direction === "next" ? addWeeks(prev, 1) : subWeeks(prev, 1));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h4 className="text-xl font-semibold">
            {format(currentWeek, "MMMM yyyy", { locale: tr })}
          </h4>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateWeek("prev")}
              data-testid="button-prev-week"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateWeek("next")}
              data-testid="button-next-week"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-md border border-border">
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className="rounded-r-none"
              data-testid="button-week-view"
            >
              Haftalık
            </Button>
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
              className="rounded-l-none"
              data-testid="button-month-view"
            >
              Aylık
            </Button>
          </div>
          <Button variant="outline" onClick={goToToday} data-testid="button-today">
            Bugün
          </Button>
        </div>
      </div>

      {/* Weekly Calendar View */}
      {view === "week" && (
        <Card className="overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-8 border-b border-border">
            <div className="p-4 border-r border-border"></div>
            {weekDays.map((day, index) => {
              const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
              return (
                <div
                  key={index}
                  className={`p-4 border-r border-border text-center last:border-r-0 ${
                    isToday ? "bg-primary/5" : ""
                  }`}
                >
                  <div className={`text-sm ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                    {format(day, "E", { locale: tr })}
                  </div>
                  <div className={`text-lg font-semibold ${isToday ? "text-primary" : ""}`}>
                    {format(day, "d")}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-8">
            {timeSlots.map((time, timeIndex) => (
              <div key={timeIndex} className="contents">
                <div className="p-3 border-r border-b border-border text-sm text-muted-foreground text-right">
                  {time}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const isToday = format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
                  const dayAppointments = appointments?.filter((apt: any) => 
                    format(new Date(apt.startsAt), "yyyy-MM-dd") === format(day, "yyyy-MM-dd") &&
                    format(new Date(apt.startsAt), "HH") === time.split(":")[0]
                  ) || [];

                  return (
                    <div
                      key={`${timeIndex}-${dayIndex}`}
                      className={`p-2 border-r border-b border-border min-h-[80px] last:border-r-0 ${
                        isToday ? "bg-primary/5" : ""
                      }`}
                    >
                      {dayAppointments.map((appointment: any) => (
                        <div
                          key={appointment.id}
                          className="bg-chart-2/10 border border-chart-2 rounded p-2 text-xs mb-2"
                          data-testid={`appointment-${appointment.id}`}
                        >
                          <div className="font-medium text-chart-2">
                            {appointment.title}
                          </div>
                          <div className="text-muted-foreground">
                            {format(new Date(appointment.startsAt), "HH:mm")} - {format(new Date(appointment.endsAt), "HH:mm")}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Today's Appointments */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Bugünün Randevuları</h4>
        <div className="space-y-3">
          {appointments && appointments.length > 0 ? (
            appointments
              .filter((apt: any) => format(new Date(apt.startsAt), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"))
              .map((appointment: any) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
                  data-testid={`today-appointment-${appointment.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
                    <div>
                      <div className="font-medium">{appointment.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.description || "Açıklama yok"}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {format(new Date(appointment.startsAt), "HH:mm")} - {format(new Date(appointment.endsAt), "HH:mm")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round((new Date(appointment.endsAt).getTime() - new Date(appointment.startsAt).getTime()) / (1000 * 60))} dakika
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
              Bugün için randevu yok
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
