export interface CreateAppointmentPayload {
  doctorUserId: string;
  startUtc: string;
  endUtc: string;
  notes: string;
}

export async function createAppointment(payload: CreateAppointmentPayload): Promise<void> {
  if (typeof window !== "undefined") {
    console.log("=== 🔍 DEBUGGING AUTHENTICATION TOKEN ===");
    console.log("All available keys in LocalStorage:", Object.keys(localStorage));
    console.log("Value of 'token':", localStorage.getItem("token"));
    console.log("Value of 'accessToken':", localStorage.getItem("accessToken"));
    console.log("=========================================");
  }

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