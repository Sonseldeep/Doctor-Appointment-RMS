"use client";

interface HealthAlert {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "reminder" | "alert" | "action";
}

interface HealthAlertsProps {
  alerts?: HealthAlert[];
}

export function HealthAlerts({ 
  alerts = [
    {
      id: "1",
      title: "Prescription Reminder",
      description: "Your Lisinopril prescription expires in 3 days",
      icon: "⏰",
      type: "reminder"
    },
    {
      id: "2",
      title: "Follow-up Due",
      description: "Time for your annual health checkup",
      icon: "❤️",
      type: "action"
    }
  ]
}: HealthAlertsProps) {
  const borderColor = {
    reminder: "border-l-4 border-l-yellow-400",
    alert: "border-l-4 border-l-red-400",
    action: "border-l-4 border-l-blue-400",
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg">Health Alerts</h3>
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg border bg-white p-4 ${borderColor[alert.type]}`}
        >
          <div className="flex gap-3">
            <span className="text-xl">{alert.icon}</span>
            <div>
              <p className="font-medium text-sm">{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}