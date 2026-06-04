export function AdminDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Admin Panel</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-semibold">--</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Doctors</p>
          <p className="text-2xl font-semibold">--</p>
        </div>

        <div className="rounded-xl border p-5">
          <p className="text-sm text-muted-foreground">Appointments</p>
          <p className="text-2xl font-semibold">--</p>
        </div>
      </div>
    </div>
  );
}