import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi, GetNotificationsParams } from "../api/notifications-api";


export function useNotificationCount() {
  const query = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationsApi.getNotifications({ isRead: false, page: 1, pageSize: 1 }),
    staleTime: Infinity,
  });

  return {
    unreadCount: query.data?.totalCount ?? 0,
    isLoading: query.isLoading,
  };
}


export function useNotifications(params: GetNotificationsParams = {}) {
  const queryClient = useQueryClient();
  
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const isRead = params.isRead;

  // Query 1: Fetches the paginated list for the current active feed window
  const notificationsQuery = useQuery({
    queryKey: ["notifications", "list", { page, pageSize, isRead }],
    queryFn: () => notificationsApi.getNotifications({ page, pageSize, isRead }),
    staleTime: Infinity,
    placeholderData: (previousData) => previousData, // Smooth pagination transitions
  });

  // Mutation: Mark a single notification row item as read
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