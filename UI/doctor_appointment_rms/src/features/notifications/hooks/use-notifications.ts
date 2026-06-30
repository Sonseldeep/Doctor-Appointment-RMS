// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { notificationsApi } from "../api/notifications-api";

// export function useNotifications() {
//   const queryClient = useQueryClient();
  

//   const notificationsQuery = useQuery({
//     queryKey: ["notifications"],
//     queryFn: () => notificationsApi.getNotifications(),
//     refetchInterval: 15000, // Optional background auto-polling every 15 seconds
//   });

//   const markAsReadMutation = useMutation({
//     mutationFn: notificationsApi.markAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

//   const markAllAsReadMutation = useMutation({
//     mutationFn: notificationsApi.markAllAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

//   const notifications = notificationsQuery.data?.items ?? [];

//   return {
//     notifications,
//     isLoading: notificationsQuery.isLoading,
//     unreadCount: notifications.filter((n) => !n.isRead).length,
//     markAsRead: markAsReadMutation.mutate,
//     markAllAsRead: markAllAsReadMutation.mutate,
//     isMarkingAllPending: markAllAsReadMutation.isPending,
//   };
// }

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { notificationsApi, GetNotificationsParams } from "../api/notifications-api";

// export function useNotifications(params: GetNotificationsParams = {}) {
//   const queryClient = useQueryClient();
  
//   const page = params.page ?? 1;
//   const pageSize = params.pageSize ?? 10;
//   const isRead = params.isRead;

//   // Query 1: Fetches the paginated list for the current active feed window
//   const notificationsQuery = useQuery({
//     queryKey: ["notifications", "list", { page, pageSize, isRead }],
//     queryFn: () => notificationsApi.getNotifications({ page, pageSize, isRead }),
//     refetchInterval: 15000, 
//     placeholderData: (previousData) => previousData,
//   });

//   // Query 2: High-performance global counter fetch (reads metadata only)
//   const globalUnreadQuery = useQuery({
//     queryKey: ["notifications", "global-unread-count"],
//     queryFn: () => notificationsApi.getNotifications({ isRead: false, page: 1, pageSize: 1 }),
//     refetchInterval: 15000,
//   });

//   // Mutation: Mark a single notification row item as read
//   const markAsReadMutation = useMutation({
//     mutationFn: notificationsApi.markAsRead,
//     onSuccess: () => {
//       // Invalidate the root key so both the list AND global counter refresh instantly
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

//   // Mutation: Mark all notifications as read
//   const markAllAsReadMutation = useMutation({
//     mutationFn: notificationsApi.markAllAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

//   const notifications = notificationsQuery.data?.items ?? [];
  
//   // Extract the global unread count safely from the secondary query
//   const unreadCount = globalUnreadQuery.data?.totalCount ?? 0;

//   return {
//     notifications,
//     isLoading: notificationsQuery.isLoading,
//     isFetching: notificationsQuery.isFetching,
    
//     // Server pagination metadata metrics
//     totalCount: notificationsQuery.data?.totalCount ?? 0,
//     totalPages: notificationsQuery.data?.totalPages ?? 1,
//     hasNextPage: notificationsQuery.data?.hasNextPage ?? false,
//     hasPreviousPage: notificationsQuery.data?.hasPreviousPage ?? false,
    
//     // Correct global unread indicator counter
//     unreadCount,
    
//     markAsRead: markAsReadMutation.mutate,
//     markAllAsRead: markAllAsReadMutation.mutate,
//     isMarkingAllPending: markAllAsReadMutation.isPending,
//   };
// }

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, GetNotificationsParams } from "../api/notifications-api";

/**
 * ✅ HOOK 1: For Shared Layout Components (Sidebar/Navbar Badge Counter)
 * Requests ONLY a 1-row metadata shell. Prevents layout components from downloading whole list arrays.
 */
export function useNotificationCount() {
  const query = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationsApi.getNotifications({ isRead: false, page: 1, pageSize: 1 }),
    staleTime: 30000,       // Cache count for 30 seconds before even considering a network call
    refetchInterval: 30000, // Poll cleanly in the background every 30 seconds
  });

  return {
    unreadCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
  };
}

/**
 * ✅ HOOK 2: Dedicated to the Central Notifications Activity Hub View
 * Manages pagination states, list data feeds, and item mutations.
 */
export function useNotifications(params: GetNotificationsParams = {}) {
  const queryClient = useQueryClient();
  
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const isRead = params.isRead;

  const notificationsQuery = useQuery({
    queryKey: ["notifications", "list", { page, pageSize, isRead }],
    queryFn: () => notificationsApi.getNotifications({ page, pageSize, isRead }),
    staleTime: 15000,       // Data remains fresh for 15s. Prevents spammed requests on rapid view re-focus
    refetchInterval: 15000, // Polling interval
    placeholderData: (previousData) => previousData, // Smooth pagination transitions
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
      // Invalidate the entire root partition so counters and feeds sync up simultaneously
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: notificationsQuery.data?.items ?? [],
    isLoading: notificationsQuery.isLoading,
    isFetching: notificationsQuery.isFetching,
    
    totalCount: notificationsQuery.data?.totalCount ?? 0,
    totalPages: notificationsQuery.data?.totalPages ?? 1,
    hasNextPage: notificationsQuery.data?.hasNextPage ?? false,
    hasPreviousPage: notificationsQuery.data?.hasPreviousPage ?? false,
    
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    isMarkingAllPending: markAllAsReadMutation.isPending,
  };
}