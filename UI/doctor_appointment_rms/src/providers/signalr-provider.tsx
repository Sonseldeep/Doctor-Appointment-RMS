"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { env } from "@/lib/env";
import { tokenStorage } from "@/features/auth/utils/auth-storage";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

interface SignalRContextType {
  connection: HubConnection | null;
  status: ConnectionStatus;
}

const SignalRContext = createContext<SignalRContextType>({
  connection: null,
  status: 'disconnected',
});

export const useSignalR = () => useContext(SignalRContext);

export function SignalRProvider({ children }: { children: React.ReactNode }) {
  const { data: user } = useCurrentUser();
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const connectionRef = useRef<HubConnection | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Guard Clauses: Don't connect if no token or user not loaded
    const token = tokenStorage.getAccessToken();
    if (!token || !user) return;

    // 2. Initialize connection
    const connection = new HubConnectionBuilder()
      .withUrl(`${env.API_URL}/hubs/notifications`, {
        accessTokenFactory: () => tokenStorage.getAccessToken() ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    // 3. Lifecycle Handlers
    connection.onreconnecting(() => setStatus('reconnecting'));
    connection.onreconnected(() => {
        setStatus('connected');
        // Professional Touch: Refetch on reconnect to catch missed updates
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });

        queryClient.invalidateQueries({ queryKey: ["lab-reports"] });
        queryClient.invalidateQueries({ queryKey: ["doctor", "patients"] });
    });
    connection.onclose(() => setStatus('disconnected'));

    // 4. Business Logic Events
    
    // Notification listener
    connection.on("ReceiveNotification", (data: any) => {
      console.log("SignalR: New notification received", data);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    connection.on("DashboardStatsChanged", (data: any) => {
      console.log("SignalR: Admin stats changed event received! Re-fetching analytics...", data);
      queryClient.invalidateQueries({ queryKey: ["admin", "overview"] });
    });

    // Reusable utility function to clear appointment caches cleanly
    const invalidateAppointmentsCache = (eventType: string, data: any) => {
      console.log(`SignalR: [${eventType}] event received! Updating cache...`, data);
      
      // Invalidating the root ["appointments"] key hits all sub-queries
      // (like filters, pagination, or dashboards) across both patient and doctor layouts.
      queryClient.invalidateQueries({ 
        queryKey: ["appointments"],
        exact: false,
        refetchType: 'all'
      });
    };

    const invalidateLabReportsCache = (eventType: string, data: any) => {
      console.log(`SignalR: [${eventType}] event received! Updating lab reports cache...`, data);
      queryClient.invalidateQueries({ 
        queryKey: ["lab-reports"],
        exact: false,
        refetchType: 'all'
      });
      queryClient.invalidateQueries({
        queryKey: ["doctor", "patients"],
        exact: false,
        refetchType: 'all'
      });
    };

    // New Booking Pipeline Listeners (PascalCase and camelCase/lowercase variants)
    connection.on("AppointmentBooked", (data: any) => invalidateAppointmentsCache("AppointmentBooked", data));
    connection.on("appointmentbooked", (data: any) => invalidateAppointmentsCache("appointmentbooked", data));

    // Status Badge & State Pipeline Listeners (PascalCase and camelCase/lowercase variants)
    connection.on("AppointmentStatusChanged", (data: any) => invalidateAppointmentsCache("AppointmentStatusChanged", data));
    connection.on("appointmentstatuschanged", (data: any) => invalidateAppointmentsCache("appointmentstatuschanged", data));

    // Real-time Lab Reports Pipeline Listeners
    connection.on("LabReportAdded", (data: any) => invalidateLabReportsCache("LabReportAdded", data));
    connection.on("labreportadded", (data: any) => invalidateLabReportsCache("labreportadded", data));

    // 5. Start Logic
    const startConnection = async () => {
      setStatus('connecting');
      try {
        await connection.start();
        setStatus('connected');
      } catch (err) {
        console.error("SignalR: Connection failed", err);
        setStatus('disconnected');
      }
    };

    startConnection();

    // 6. Professional Cleanup: Capture the connection in local var for safe cleanup
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [user, queryClient]); // Added user to dependencies

  return (
    <SignalRContext.Provider value={{ connection: connectionRef.current, status }}>
      {children}
    </SignalRContext.Provider>
  );
}