import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Staff } from "@/lib/mock-data";
import { Clock, Users } from "lucide-react";

interface StaffScheduleProps {
  staff: Staff[];
}

export function StaffSchedule({ staff }: StaffScheduleProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Turnos de Hoy</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {staff.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary">{member.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{member.shift}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
