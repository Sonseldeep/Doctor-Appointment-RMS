export interface CreateAppointmentPayload {
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  notes: string;
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<void> {


  // Try to read both common names for now
  const token = typeof window !== "undefined" 
    ? (localStorage.getItem("token") || localStorage.getItem("accessToken")) 
    : null;

  const response = await fetch("https://localhost:5001/api/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(
      errorBody?.message || `Server responded with status code ${response.status}`
    );
  }
}