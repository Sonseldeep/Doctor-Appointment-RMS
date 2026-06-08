"use client";

import { useState } from "react";
import { useCreateAppointment } from "../hooks/use-create-appointment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookAppointmentFormProps {
  onSuccess?: () => void;
}

export function BookAppointmentForm({ onSuccess }: BookAppointmentFormProps) {
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const { mutate: bookAppointment, isPending } = useCreateAppointment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId || !date || !time) {
      alert("Please fill all required fields");
      return;
    }

    const startUtc = new Date(`${date}T${time}`).toISOString();
    const endUtc = new Date(new Date(startUtc).getTime() + 60 * 60 * 1000).toISOString(); // 1 hour duration

    bookAppointment(
      {
        doctorUserId: doctorId,
        startUtc,
        endUtc,
        notes,
      },
      {
        onSuccess: () => {
          setDoctorId("");
          setDate("");
          setTime("");
          setNotes("");
          onSuccess?.();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Doctor ID *</label>
        <Input
          type="text"
          placeholder="Enter doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date *</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Time *</label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          placeholder="Add any notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Booking..." : "Book Appointment"}
      </Button>
    </form>
  );
}