"use client";

import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { 
  RiCalendarCheckLine, 
  RiCalendarCloseLine, 
  RiNotification3Line, 
  RiMessage3Line,
  RiCheckDoubleLine
} from "@remixicon/react";

export default function NotificationsPage() {
  const { 
    notifications, 
    isLoading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    isMarkingAllPending 
  } = useNotifications();

  // Color profiles map layout matrix depending on verification type rules
  const getNotificationStyles = (type: string, isRead: boolean) => {
    if (isRead) {
      return {
        icon: <RiMessage3Line className="text-slate-400 w-5 h-5" />,
        containerBg: "bg-white border-slate-200 opacity-75",
      };
    }

    switch (type) {
      case "AppointmentConfirmed":
        return {
          icon: <RiCalendarCheckLine className="text-emerald-600 w-5 h-5" />,
          containerBg: "bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50/60",
        };
      case "AppointmentCancelled":
        return {
          icon: <RiCalendarCloseLine className="text-red-600 w-5 h-5" />,
          containerBg: "bg-red-50/40 border-red-100 hover:bg-red-50/60",
        };
      case "AppointmentBooked":
      default:
        return {
          icon: <RiNotification3Line className="text-blue-600 w-5 h-5" />,
          containerBg: "bg-blue-50/40 border-blue-100 hover:bg-blue-50/60",
        };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      {/* Header View Panel Workspace block layout context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications Activity Hub</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review updates regarding upcoming diagnostic timelines and workspace appointment actions.
          </p>
        </div>

        {/* Mark All As Read Master Interactive Context Command Trigger */}
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

      {/* Notifications List View Feed Container Context */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-500 animate-pulse">Loading secure tracking matrix ledger...</p>
        ) : notifications.length > 0 ? (
          <div className="grid gap-3">
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
                  onClick={() => !item.isRead && markAsRead(item.id)}
                  className={`flex gap-4 p-4 rounded-xl border shadow-sm transition-all ${styles.containerBg} ${
                    !item.isRead ? "cursor-pointer transform hover:-translate-y-0.5" : ""
                  }`}
                >
                  {/* Status Profile Glyph Circle Wrapper Frame */}
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg border h-fit shadow-xs relative">
                    {styles.icon}
                    
                    {/* Live Unread Dot Accent Node indicator */}
                    {!item.isRead && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                      </span>
                    )}
                  </div>

                  {/* Body Copy Text Framing */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className={`text-sm font-semibold ${item.isRead ? "text-gray-500 line-through/none" : "text-gray-900"}`}>
                        {item.title}
                      </h4>
                      <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{formattedDate}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${item.isRead ? "text-slate-400" : "text-slate-600"}`}>
                      {item.message}
                    </p>
                  </div>
                </div>
              );
            })}
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