"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  trend?: number;
  backgroundColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  trend, 
  backgroundColor = "bg-gray-50" 
}: StatCardProps) {
  return (
    <div className={`rounded-xl border p-6 ${backgroundColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-2">📈 +{trend}%</p>
          )}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}