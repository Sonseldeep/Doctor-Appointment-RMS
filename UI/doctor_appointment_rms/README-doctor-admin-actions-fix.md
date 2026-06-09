# Doctor Admin Actions Fix

## What was happening
The admin dashboard was showing `Failed to approve doctor` and `Failed to suspend doctor` even though the doctor status was actually updated.

## What I changed
- Updated the admin doctor API helper to treat approve/suspend as `204 No Content` requests instead of expecting a JSON response body.
- Updated the React Query mutations to show success toasts without reading `data.doctor` from a missing response payload.
- Aligned the admin UI status checks from `Approved` to `Active` so the frontend matches the backend status enum.
- Kept the action requests using `doctor.userId`, which matches the backend route parameter.

## Why I made those changes
- The backend controller returns success with no JSON body after it updates the doctor, so the frontend was throwing in the success handler after the request had already succeeded.
- The backend uses `Active`, `Suspended`, and `Pending`, not `Approved`, so the UI labels and conditional rendering needed to match the real API state.
- Using the correct ID and status vocabulary prevents false failure messages and keeps the dashboard state consistent after refreshes.

## Files updated
- `src/features/admin/api/admin-doctor-api.ts`
- `src/features/admin/hooks/use-admin-doctors.ts`
- `src/features/admin/components/doctor-actions.tsx`
- `src/features/admin/components/doctors-table.tsx`
- `src/features/admin/components/admin-doctors-management.tsx`
- `src/features/admin/types/admin-doctor.types.ts`

## Validation
- Verified the touched admin files with Biome.
- One unrelated warning remains in `src/features/admin/components/doctors-table.tsx` for the raw `<img>` tag.
- `tsc --noEmit` still reports an unrelated role-guard type error outside this fix.
