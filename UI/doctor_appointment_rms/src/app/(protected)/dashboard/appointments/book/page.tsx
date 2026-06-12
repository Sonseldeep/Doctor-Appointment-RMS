"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { DoctorsList } from "@/features/doctors/components/doctors-list";
import { Doctor } from "@/features/doctors/types/doctor.types";
import { appointmentsApi } from "@/features/appointments/api/appointments-api";

interface Slot {
  slotId: string;
  startTime: string; // e.g., "09:00:00"
  endTime: string;   // e.g., "09:45:00"
  isBooked: boolean;
}

interface AvailabilityResponse {
  availabilityId: string;
  date: string;       // e.g., "2026-06-12"
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  totalSlots: number;
  bookedSlots: number;
  freeSlots: number;
  slots: Slot[];
}

interface ConfirmedSlotDetails {
  dateStr: string;
  startTime: string;
  endTime: string;
  slotId: string;
  dateLabel: string;
}

export default function AppointmentBookingPage() {
  return (
    <Suspense fallback={
      <div className="p-12 text-center text-sm font-medium text-slate-500 animate-pulse">
        Initializing appointment scheduling engine...
      </div>
    }>
      <BookingWizard />
    </Suspense>
  );
}

function BookingWizard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const doctorIdFromUrl = searchParams.get("doctorId");

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [confirmedSlot, setConfirmedSlot] = useState<ConfirmedSlotDetails | null>(null);
  
  // Form states for Step 3
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (doctorIdFromUrl) {
      setSelectedDoctorId(doctorIdFromUrl);
      setStep(2);
    } else {
      setStep(1);
    }
  }, [doctorIdFromUrl]);

  const handleSelectDoctorInWizard = (id: string) => {
    setSelectedDoctorId(id);
    router.push(`/dashboard/appointments/book?doctorId=${id}`);
  };

  const handleSlotSelectionComplete = (
    dateStr: string,
    startTime: string,
    endTime: string,
    slotId: string,
    dateLabel: string
  ) => {
    setConfirmedSlot({ dateStr, startTime, endTime, slotId, dateLabel });
    setStep(3);
  };

  // Automated timezone calculation & centralized payload execution handler
  const handleFinalBooking = async () => {
    if (!selectedDoctorId || !confirmedSlot) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Construct local timestamp strings directly (e.g. "2026-06-12T09:00:00")
      const localStart = `${confirmedSlot.dateStr}T${confirmedSlot.startTime}`;
      const localEnd = `${confirmedSlot.dateStr}T${confirmedSlot.endTime}`;

      // Payload structure mapping out both casing targets alongside the vital slot identification key
      const payload = {
        slotId: confirmedSlot.slotId,
        SlotId: confirmedSlot.slotId, // PascalCase structural alignment for C# controller matching
        doctorUserId: selectedDoctorId,
        DoctorUserId: selectedDoctorId,
        startUtc: localStart,
        StartUtc: localStart,
        endUtc: localEnd,
        EndUtc: localEnd,
        notes: notes.trim(),
        Notes: notes.trim()
      };

      // Uses your built-in Axios instance to cleanly attach auth cookies/headers
      await appointmentsApi.createAppointment(payload as any);

      setIsSuccess(true);
    } catch (err: any) {
      // Unpack raw response dictionary fields if validation boundaries collapse
      let errorMessage = "An unresolved network transmission error occurred.";
      if (err?.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage = err.response.data;
        } else if (err.response.data.errors) {
          errorMessage = JSON.stringify(err.response.data.errors);
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          errorMessage = JSON.stringify(err.response.data);
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      setApiError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-6">
      
      {/* 🧭 Stepper Progress Indicator */}
      <div className="flex items-center justify-center max-w-xl mx-auto relative mb-12">
        <div className="absolute left-0 right-0 h-0.5 bg-slate-200 -z-10" />
        <div 
          className="absolute left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-300" 
          style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
        />

        <div className="flex flex-col items-center bg-slate-50 px-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>1</div>
          <span className="text-xs font-medium text-slate-600 mt-2">Select Doctor</span>
        </div>

        <div className="flex flex-col items-center bg-slate-50 px-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>2</div>
          <span className="text-xs font-medium text-slate-600 mt-2">Choose Date & Time</span>
        </div>

        <div className="flex flex-col items-center bg-slate-50 px-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step === 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>3</div>
          <span className="text-xs font-medium text-slate-600 mt-2">Confirm</span>
        </div>
      </div>

      {/* 🖥️ Step Window Switcher */}
      <div>
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Find a Doctor</h2>
            <DoctorsList 
              onSelectDoctor={(doc: Doctor) => {
                handleSelectDoctorInWizard(doc.doctorProfileId || doc.userId);
              }} 
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <button 
              onClick={() => router.push("/dashboard/appointments/book")} 
              className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1 mb-2"
            >
              ← Back to Doctor Selection
            </button>
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight">Choose Date & Time</h2>
            
            {selectedDoctorId && (
              <DateTimePicker 
                doctorId={selectedDoctorId} 
                onConfirm={handleSlotSelectionComplete} 
              />
            )}
          </div>
        )}

        {step === 3 && (
          <div className="bg-white p-8 border border-slate-200 rounded-2xl max-w-xl mx-auto shadow-sm space-y-6">
            {isSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">✓</div>
                <h3 className="text-xl font-bold text-slate-900">Appointment Booked!</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">Your medical consultation block has been successfully verified and saved to the backend schedule.</p>
                <button 
                  onClick={() => router.push("/dashboard/appointments")}
                  className="mt-4 bg-blue-600 text-white font-medium text-xs px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
                >
                  View Appointments List
                </button>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900">Confirm Appointment</h3>
                  <p className="text-sm text-slate-400 mt-0.5">Please finalize your checkup notes prior to scheduling.</p>
                </div>

                {/* Reservation Summary Panel */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-2 text-sm">
                  <p className="text-slate-600"><span className="font-semibold text-slate-800">Date:</span> {confirmedSlot?.dateLabel}</p>
                  <p className="text-slate-600">
                    <span className="font-semibold text-slate-800">Time Selected:</span> {confirmedSlot?.startTime.slice(0, 5)} - {confirmedSlot?.endTime.slice(0, 5)}
                  </p>
                  {/* <p className="text-xs font-mono text-slate-400 mt-3 pt-2 border-t border-slate-200/60 overflow-hidden text-ellipsis whitespace-nowrap">
                    Slot Verification Code: {confirmedSlot?.slotId}
                  </p> */}
                </div>

                {/* Check-up Notes Text Input Workspace */}
                <div className="space-y-2 text-left">
                  <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Notes for Check-up
                  </label>
                  <textarea
                    id="notes"
                    rows={4}
                    disabled={isSubmitting}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe your current medical concerns, symptoms, or secondary consultation requirements here..."
                    className="w-full p-3.5 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all disabled:bg-slate-50"
                  />
                </div>

                {apiError && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 font-medium text-xs rounded-xl text-left max-h-40 overflow-y-auto font-mono">
                     {apiError}
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setStep(2)}
                    className="w-1/3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleFinalBooking}
                    className="w-2/3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving to database...
                      </>
                    ) : (
                      "Confirm and Schedule"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 *  DATE & TIME PICKER Component
 */
function DateTimePicker({ 
  doctorId, 
  onConfirm 
}: { 
  doctorId: string; 
  onConfirm: (dateStr: string, startTime: string, endTime: string, slotId: string, dateLabel: string) => void 
}) {
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dayAvailability, setDayAvailability] = useState<AvailabilityResponse | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      dates.push(`${yyyy}-${mm}-${dd}`);
    }
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "Unknown Date";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { weekday: 'long', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    if (!doctorId || !selectedDate) return;

    let isMounted = true;

    async function fetchAvailabilityForSelectedDate() {
      setIsLoading(true);
      setDayAvailability(null);
      setSelectedSlot(null);

      try {
        const response = await fetch(`https://localhost:5001/api/doctors/${doctorId}/availability/${selectedDate}`);
        if (!response.ok) return;

        const data: AvailabilityResponse = await response.json();
        if (isMounted) {
          setDayAvailability(data);
        }
      } catch (err) {
        console.error("Failed to sync clinical dates:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchAvailabilityForSelectedDate();

    return () => {
      isMounted = false;
    };
  }, [doctorId, selectedDate]);

  return (
    <div className="grid gap-8 md:grid-cols-2 pt-2">
      {/* Select Date Side */}
      <div className="space-y-4 text-left">
        <h3 className="text-base font-bold text-slate-900">Select Date</h3>
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {availableDates.map((dateStr) => {
            const isSelected = selectedDate === dateStr;
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => setSelectedDate(dateStr)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-semibold transition-all duration-150 ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm"
                    : "border-slate-200/80 bg-white text-slate-800 hover:border-slate-300"
                }`}
              >
                {formatDateLabel(dateStr)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Select Time Side */}
      <div className="space-y-4 text-left">
        <h3 className="text-base font-bold text-slate-900">Select Time</h3>
        
        {isLoading && (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="h-[52px] bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && !dayAvailability && (
          <div className="p-8 text-center border border-dashed rounded-xl text-sm text-slate-400 bg-slate-50/50">
            This practitioner has not opened up calendar dates yet.
          </div>
        )}

        {!isLoading && dayAvailability && dayAvailability.slots?.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {dayAvailability.slots.map((slot) => {
              const isSelected = selectedSlot?.slotId === slot.slotId;
              const visualTime = slot.startTime ? slot.startTime.slice(0, 5) : "00:00";
              
              return (
                <button
                  key={slot.slotId}
                  type="button"
                  disabled={slot.isBooked}
                  onClick={() => setSelectedSlot(slot)}
                  className={`p-3.5 text-center rounded-xl border text-sm font-semibold transition-all duration-150 ${
                    slot.isBooked
                      ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed line-through"
                      : isSelected
                      ? "border-blue-600 bg-blue-600 text-white shadow-md"
                      : "border-slate-200/80 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {visualTime}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {dayAvailability && selectedSlot && (
        <div className="col-span-2 flex justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onConfirm(
              dayAvailability.date, 
              selectedSlot.startTime, 
              selectedSlot.endTime, 
              selectedSlot.slotId,
              formatDateLabel(dayAvailability.date)
            )}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2.5 px-6 rounded-xl transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}