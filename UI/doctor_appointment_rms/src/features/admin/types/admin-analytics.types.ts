export interface UserStats {
  totalPatients: number;
  totalDoctors: number;
}

export interface DoctorStats {
  totalDoctors: number;
  pendingApproval: number;
  active: number;
  suspended: number;
}

export interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  today: number;
}

export interface AppointmentTrendItem {
  date: string;
  bookedCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface TopRatedDoctorItem {
  doctorUserId: string;
  doctorName: string;
  specialization: string;
  averageRating: number;
  totalRatings: number;
}

export interface AdminOverviewResponse {
  users: UserStats;
  doctors: DoctorStats;
  appointments: AppointmentStats;
  appointmentTrend: AppointmentTrendItem[];
  topRatedDoctors: TopRatedDoctorItem[];
  generatedAtUtc: string;
}