"use client";

import React, { useState } from "react";
import { useAdminOverview } from "@/features/admin/hooks/use-admin-overview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RiUser3Line,
  RiUserHeartLine,
  RiCalendarCheckLine,
  RiStarFill,
  RiRefreshLine,
  RiLoader4Line,
  RiArrowRightUpLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine
} from "@remixicon/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export function AdminDashboard() {
  const [trendDays, setTrendDays] = useState<number>(10);
  const { data, isLoading, isFetching, refetch } = useAdminOverview(trendDays);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <RiLoader4Line size={36} className="animate-spin text-blue-600" />
        <p className="text-sm font-medium">Assembling executive analytical metrics...</p>
      </div>
    );
  }

  const users = data?.users;
  const doctors = data?.doctors;
  const appointments = data?.appointments;

  // Format historical trend dates into short readable strings
  const formattedChartData = data?.appointmentTrend.map((item) => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  })) || [];

  return (
    <div className="space-y-6">
      {/* Upper Control Ribbon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Real-time server infrastructure overview and scheduling indices.
          </p>
        </div>
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <div className="inline-flex rounded-lg border bg-white p-1 shadow-sm">
            {[7, 10, 30].map((days) => (
              <button
                key={days}
                onClick={() => setTrendDays(days)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  trendDays === days
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {days} Days
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white shadow-sm shrink-0"
          >
            <RiRefreshLine size={16} className={`${isFetching ? "animate-spin text-blue-600" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Metric Breakdown Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card: Users */}
        <Card className="shadow-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Platform Registries</CardTitle>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <RiUser3Line size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {((users?.totalPatients || 0) + (users?.totalDoctors || 0)).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Total platform active users</p>
            <div className="mt-4 flex gap-3 border-t pt-3 text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{users?.totalPatients || 0} Patients</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>{users?.totalDoctors || 0} Providers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Doctors */}
        <Card className="shadow-sm border-slate-200/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Medical Providers</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <RiUserHeartLine size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{doctors?.totalDoctors || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Practitioners registered on-site</p>
            <div className="mt-4 flex gap-3 border-t pt-3 text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{doctors?.active || 0} Active</span>
              </div>
              <div className="flex items-center gap-1 text-amber-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                <span>{doctors?.pendingApproval || 0} Pending Approval</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card: Appointments */}
        <Card className="shadow-sm border-slate-200/60 sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500">Appointment Pipeline</CardTitle>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <RiCalendarCheckLine size={18} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{appointments?.total || 0}</div>
            <div className="text-xs text-purple-600 font-medium flex items-center gap-0.5 mt-1">
              <RiArrowRightUpLine size={14} />
              <span>{appointments?.today || 0} Scheduled today</span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-1 border-t pt-2 text-[11px] text-center font-semibold text-gray-500">
              <div className="p-1 bg-slate-50 rounded">
                <span className="block text-slate-800 font-bold">{appointments?.pending || 0}</span>
                <span>Pending</span>
              </div>
              <div className="p-1 bg-blue-50/50 rounded">
                <span className="block text-blue-700 font-bold">{appointments?.confirmed || 0}</span>
                <span>Confirmed</span>
              </div>
              <div className="p-1 bg-emerald-50/50 rounded">
                <span className="block text-emerald-700 font-bold">{appointments?.completed || 0}</span>
                <span>Completed</span>
              </div>
              <div className="p-1 bg-red-50/50 rounded">
                <span className="block text-red-700 font-bold">{appointments?.cancelled || 0}</span>
                <span>Cancelled</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section and Leaderboard Panel */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Historical Operational Chart */}
        <Card className="shadow-sm border-slate-200/60 lg:col-span-2 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              Appointment Logistics Pipeline
            </CardTitle>
            <CardDescription>
              Visual trends highlighting incoming bookings against completed operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[310px] w-full mt-2 -ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBooked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="formattedDate"
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    allowDecimals={false}
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  />
                  <Tooltip
                    contentStyle={{ background: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    labelStyle={{ fontWeight: "bold", color: "#1e293b", fontSize: "12px" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", fontWeight: 500, paddingLeft: "24px" }} />
                  <Area
                    name="Booked"
                    type="monotone"
                    dataKey="bookedCount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorBooked)"
                  />
                  <Area
                    name="Completed"
                    type="monotone"
                    dataKey="completedCount"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Doctor Leaderboard Panel */}
        <Card className="shadow-sm border-slate-200/60 bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900">Top Performing Providers</CardTitle>
            <CardDescription>Highest-rated clinical specialists based on patient feedback.</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="space-y-4">
              {data?.topRatedDoctors && data.topRatedDoctors.length > 0 ? (
                data.topRatedDoctors.map((doc, idx) => (
                  <div
                    key={doc.doctorUserId}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 border border-blue-200 shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {doc.doctorName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {doc.specialization} Specialization
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end text-amber-500 font-bold text-sm">
                        <RiStarFill size={14} className="fill-amber-500" />
                        <span>{Number(doc.averageRating).toFixed(1)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {doc.totalRatings} {doc.totalRatings === 1 ? "review" : "reviews"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No physician rating records registered yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer Timestamp Ring */}
      <div className="text-right">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-50 border px-2.5 py-1 rounded-md shadow-sm">
          <RiTimeLine size={12} />
          <span>Sync State Cache Fresh: {new Date(data?.generatedAtUtc || "").toLocaleTimeString()}</span>
        </span>
      </div>
    </div>
  );
}