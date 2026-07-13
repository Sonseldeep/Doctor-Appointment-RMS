import { UserManagement } from "@/features/admin/components/user-management";

export default function AdminUsersPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Patient List</h1>
        {/* <p className="text-sm text-muted-foreground mt-1">
          Monitor configurations, filtering options, and records for registered patient platform accounts.
        </p> */}
      </div>
      <UserManagement />
    </div>
  );
}