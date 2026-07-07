
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotifications, useNotificationCount } from "@/features/notifications/hooks/use-notifications";
import { SystemNotification } from "@/features/notifications/types/notifications.types";
import { 
  RiCalendarCheckLine, 
  RiCalendarCloseLine, 
  RiNotification3Line, 
  RiMessage3Line,
  RiCheckDoubleLine,
  RiFileTextLine,
  RiArrowLeftSLine,
  RiArrowRightSLine
} from "@remixicon/react";

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // 1. Fetch the paginated feed list natively
  const { 
    notifications, 
    isLoading, 
    isFetching,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    markAsRead, 
    markAllAsRead, 
    isMarkingAllPending 
  } = useNotifications({ page, pageSize: PAGE_SIZE });

  
  const { unreadCount } = useNotificationCount();

  const getNotificationStyles = (type: string, isRead: boolean) => {
    let icon, containerBg;

    
    const baseReadBg = "bg-white border-slate-200 hover:bg-slate-50";

    switch (type) {
      case "AppointmentConfirmed":
      case "AppointmentCompleted":
        icon = <RiCalendarCheckLine className={`${isRead ? "text-emerald-500" : "text-emerald-600"} w-5 h-5`} />;
        containerBg = isRead ? baseReadBg : "bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/60";
        break;
      case "AppointmentCancelled":
        icon = <RiCalendarCloseLine className={`${isRead ? "text-red-500" : "text-red-600"} w-5 h-5`} />;
        containerBg = isRead ? baseReadBg : "bg-red-50/40 border-red-200 hover:bg-red-50/60";
        break;
      case "LabReportReady":
      case "NewClinicalNote":
        icon = <RiFileTextLine className={`${isRead ? "text-indigo-500" : "text-indigo-600"} w-5 h-5`} />;
        containerBg = isRead ? baseReadBg : "bg-indigo-50/40 border-indigo-200 hover:bg-indigo-50/60";
        break;
      case "AppointmentBooked":
      default:
        icon = <RiNotification3Line className={`${isRead ? "text-blue-500" : "text-blue-600"} w-5 h-5`} />;
        containerBg = isRead ? baseReadBg : "bg-blue-50/40 border-blue-200 hover:bg-blue-50/60";
        break;
    }

    return { icon, containerBg };
  };

  const handleNotificationClick = (item: SystemNotification) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }

    switch (item.type) {
      case "AppointmentBooked":
      case "AppointmentConfirmed":
      case "AppointmentCancelled":
      case "AppointmentCompleted":
        router.push(`/dashboard/appointments?id=${item.appointmentId}`);
        break;
      case "LabReportReady":
        router.push(`/dashboard/medical-records?id=${item.appointmentId}`);
        break;
      case "ClinicalNoteAdded":
        router.push(`/dashboard/prescriptions?id=${item.appointmentId}`);
        break;
      default:
        console.warn("Unhandled notification type:", item.type);
        router.push("/dashboard");
        break;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications Activity Hub</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review updates regarding upcoming diagnostic timelines and workspace appointment actions.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllPending}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:bg-slate-100 disabled:text-slate-400 rounded-xl transition cursor-pointer self-start sm:self-center shadow-xs"
          >
            <RiCheckDoubleLine size={16} />
            {isMarkingAllPending ? "Processing..." : "Mark all as read"}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-500 animate-pulse">Loading secure tracking matrix ledger...</p>
        ) : notifications.length > 0 ? (
          <div className="grid gap-3">
            <div className={`grid gap-3 transition-opacity duration-200 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"}`}>
              {notifications.map((item) => {
                const styles = getNotificationStyles(item.type, item.isRead);
                const formattedDate = new Date(item.createdAtUtc).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNotificationClick(item)}
                    className={`flex gap-4 p-4 rounded-xl border shadow-sm transition-all cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.99] ${styles.containerBg}`}
                  >
                    <div className="flex-shrink-0 p-2 bg-white rounded-lg border h-fit shadow-xs relative">
                      {styles.icon}
                      {!item.isRead && (
                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        
                        <h4 className={`text-sm ${item.isRead ? "font-medium text-slate-700" : "font-semibold text-gray-900"}`}>
                          {item.title}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{formattedDate}</span>
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${item.isRead ? "text-slate-500" : "text-slate-700"}`}>
                        {item.message}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-2">
                <span className="text-xs font-semibold text-slate-500">
                  Showing page <span className="text-slate-900 font-bold">{page}</span> of{" "}
                  <span className="text-slate-900 font-bold">{totalPages}</span>
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    disabled={!hasPreviousPage || isFetching}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer shadow-xs"
                    title="Previous Page"
                  >
                    <RiArrowLeftSLine size={18} />
                  </button>
                  
                  <button
                    disabled={!hasNextPage || isFetching}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className="inline-flex items-center justify-center p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer shadow-xs"
                    title="Next Page"
                  >
                    <RiArrowRightSLine size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl py-12 px-4 bg-slate-50/50 text-center">
            <div className="p-3 bg-white border rounded-xl shadow-xs text-slate-400 mb-3">
              <RiMessage3Line size={24} />
            </div>
            <p className="text-sm font-medium text-slate-700">All clear here!</p>
            <p className="text-xs text-slate-400 mt-0.5">No new system notification ledger entries logged.</p>
          </div>
        )}
      </div>
    </div>
  );
}