"use client";

import React from "react";
import Scheduler, { Resource } from "devextreme-react/scheduler";
import { useGetMyAppointments } from "../hooks/use-my-appointment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";


const statusPriorities = [
  { id: "Confirmed", color: "#2563eb" }, 
  { id: "Pending", color: "#eab308" },   
  { id: "Completed", color: "#10b981" },
  { id: "Cancelled", color: "#ef4444" }, 
];

const views: ("day" | "week" | "month")[] = ["day", "week", "month"];

export default function AppointmentsCalendar() {
  
  const { data, isLoading, isError } = useGetMyAppointments(1, 50); 

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-500 font-medium">Loading clinical calendar...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        Failed to pull calendar appointments. Please refresh and try again.
      </div>
    );
  }

  
  const appointmentsList = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Calendar Schedule</h1>
        <p className="text-slate-500">Track allocations, view gaps, and oversee real-time client transitions.</p>
      </div>

      <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-4">
          <Scheduler
            dataSource={appointmentsList}
            views={views}
            defaultCurrentView="week"
            defaultCurrentDate={new Date()}
            height={680}
            startDayHour={7}
            endDayHour={21}
            startDateExpr="startUtc"
            endDateExpr="endUtc"
            textExpr="patientName"
            descriptionExpr="notes"
            showAllDayPanel={false}
            timeZone="UTC"
            
            editing={{ 
                allowAdding: false, 
                allowDeleting: false, 
                allowUpdating: false, 
                allowDragging: false, 
                allowResizing: false 
            }}
            >
            
            <Resource
              fieldExpr="status"
              allowMultiple={false}
              dataSource={statusPriorities}
              label="Status"
            />
          </Scheduler>
        </CardContent>
      </Card>
    </div>
  );
}