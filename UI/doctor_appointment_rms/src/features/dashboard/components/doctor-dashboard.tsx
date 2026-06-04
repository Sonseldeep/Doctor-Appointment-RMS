export function DoctorDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Doctor Dashboard</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Today’s Appointments</p>
          <p className="text-2xl font-semibold">--</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Pending Requests</p>
          <p className="text-2xl font-semibold">--</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Patients</p>
          <p className="text-2xl font-semibold">--</p>
        </div>
      </div>
    </div>
  );
}