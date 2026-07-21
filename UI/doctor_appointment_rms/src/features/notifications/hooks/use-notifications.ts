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

  const notificationsQuery = useQuery({
    queryKey: ["notifications", "list", { page, pageSize, isRead }],
    queryFn: () => notificationsApi.getNotifications({ page, pageSize, isRead }),
    staleTime: Infinity,
    placeholderData: (previousData) => previousData, 
  });

  const markAsReadMutation = useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => {
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