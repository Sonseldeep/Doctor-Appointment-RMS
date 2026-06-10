// "use client";

// import { useState } from "react";
// import { 
//   useMyAvailability, 
//   useCreateAvailability, 
//   useDeleteAvailability 
// } from "../hooks/use-availability";
// import { RiCalendarLine, RiTimeLine, RiDeleteBin6Line, RiAddLine } from "@remixicon/react";

// export function AvailabilityManager() {
//   const { data: slots, isLoading } = useMyAvailability();
//   const createMutation = useCreateAvailability();
//   const deleteMutation = useDeleteAvailability();

//   // Form State
//   const [date, setDate] = useState("2026-06-10");
//   const [startTime, setStartTime] = useState("09:00");
//   const [endTime, setEndTime] = useState("17:00");
//   const [duration, setDuration] = useState(30);

//  const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (startTime >= endTime) {
//     alert("Operational scheduling conflict: End time must occur after the start time.");
//     return;
//   }

//   // =========================================================================
//   // OPTION A: Standard .NET TimeOnly / TimeSpan format (e.g., "09:00:00")
//   // Default System.Text.Json configuration rejects 'Z' or dates for time types.
//   // =========================================================================
//   const formattedStart = `${startTime}:00`;
//   const formattedEnd = `${endTime}:00`;

//   // =========================================================================
//   // OPTION B: Exact Swagger Example Format (e.g., "09:00:00.000Z")
//   // Use this ONLY if Option A fails. (Uncomment below and comment out Option A)
//   // =========================================================================
//   // const formattedStart = `${startTime}:00.000Z`;
//   // const formattedEnd = `${endTime}:00.000Z`;
//   // =========================================================================

//   createMutation.mutate({
//     date, // "2026-06-10"
//     startTime: formattedStart,
//     endTime: formattedEnd,
//     slotDurationMinutes: Number(duration),
//   });
// };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//       {/* Creation Form block panel */}
//       <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm h-fit space-y-4">
//         <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
//           <RiAddLine className="text-blue-600" />
//           <h2>Add Availability Block</h2>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="text-xs font-semibold text-slate-500 block mb-1">Target Date</label>
//             <input 
//               type="date" 
//               value={date} 
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full text-sm border p-2.5 rounded-xl bg-slate-50 focus:outline-blue-500" 
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="text-xs font-semibold text-slate-500 block mb-1">Start Time</label>
//               <input 
//                 type="time" 
//                 value={startTime} 
//                 onChange={(e) => setStartTime(e.target.value)}
//                 className="w-full text-sm border p-2.5 rounded-xl bg-slate-50 focus:outline-blue-500" 
//                 required
//               />
//             </div>
//             <div>
//               <label className="text-xs font-semibold text-slate-500 block mb-1">End Time</label>
//               <input 
//                 type="time" 
//                 value={endTime} 
//                 onChange={(e) => setEndTime(e.target.value)}
//                 className="w-full text-sm border p-2.5 rounded-xl bg-slate-50 focus:outline-blue-500" 
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="text-xs font-semibold text-slate-500 block mb-1">Slot Breakdowns (Minutes)</label>
//             <select 
//               value={duration} 
//               onChange={(e) => setDuration(Number(e.target.value))}
//               className="w-full text-sm border p-2.5 bg-white rounded-xl bg-slate-50 focus:outline-blue-500"
//             >
//               <option value={15}>15 Minute Consults</option>
//               <option value={30}>30 Minute Consults</option>
//               <option value={45}>45 Minute Consults</option>
//               <option value={60}>1 Hour Consults</option>
//             </select>
//           </div>

//           <button 
//             type="submit" 
//             disabled={createMutation.isPending}
//             className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition"
//           >
//             {createMutation.isPending ? "Generating Shifts..." : "Publish Shift Block"}
//           </button>
//         </form>
//       </div>

//       {/* List display monitoring column */}
//       <div className="lg:grid lg:col-span-2 space-y-4">
//         <h2 className="font-bold text-slate-800 text-lg">Active Scheduled Availability Blocks</h2>
        
//         {isLoading ? (
//           <div className="h-32 border border-dashed rounded-2xl bg-slate-50 animate-pulse" />
//         ) : slots && slots.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {slots.map((slot) => (
//               <div key={slot.availabilityId} className="bg-white border rounded-2xl p-4 flex justify-between items-start shadow-sm border-slate-200">
//                 <div className="space-y-1.5">
//                   <div className="text-xs font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2 py-0.5 rounded-md w-fit">
//                     {slot.date}
//                   </div>
//                   <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
//                     <RiTimeLine size={16} className="text-slate-400" />
//                     <span>
//                       {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
//                       {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                   </div>
//                   <p className="text-xs text-slate-400">Interval breakdowns: {slot.slotDurationMinutes} mins</p>
//                 </div>

//                 <button 
//                   onClick={() => deleteMutation.mutate(slot.availabilityId)}
//                   disabled={deleteMutation.isPending}
//                   className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
//                   title="Remove Block"
//                 >
//                   <RiDeleteBin6Line size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
//             No dynamic availability setup detected. Add parameters to accept patient appointment sessions.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { 
  useMyAvailability, 
  useCreateAvailability, 
  useDeleteAvailability 
} from "../hooks/use-availability";
import { RiCalendarLine, RiTimeLine, RiDeleteBin6Line, RiAddLine, RiBookOpenLine } from "@remixicon/react";

// Helper to safely format "09:00:00" style strings into clean "09:00 AM" text
const formatTimeString = (timeStr: string) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? "PM" : "AM";
  const displayHour = hourNum % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Helper to format "2026-06-11" into something nicer like "Thu, Jun 11"
const formatDateString = (dateStr: string) => {
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  return dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

interface AvailabilitySlot {
  availabilityId: string;
  date: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  totalSlots: number;
  bookedSlots: number;
  freeSlots: number;
}

export function AvailabilityManager() {
  const { data: slots, isLoading } = useMyAvailability() as { data: AvailabilitySlot[] | undefined, isLoading: boolean };
  const createMutation = useCreateAvailability();
  const deleteMutation = useDeleteAvailability();

  // Form State
  const [date, setDate] = useState("2026-06-10");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [duration, setDuration] = useState(30);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (startTime >= endTime) {
      alert("Operational scheduling conflict: End time must occur after the start time.");
      return;
    }

    const formattedStart = `${startTime}:00`;
    const formattedEnd = `${endTime}:00`;

    createMutation.mutate({
      date, 
      startTime: formattedStart,
      endTime: formattedEnd,
      slotDurationMinutes: Number(duration),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Creation Form block panel */}
      <div className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm h-fit space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
          <RiAddLine className="text-blue-600" />
          <h2>Add Availability Block</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Target Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm border p-2.5 rounded-xl bg-slate-50 focus:outline-blue-500" 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Start Time</label>
              <input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full text-sm border p-2.5 rounded-xl bg-slate-50 focus:outline-blue-500" 
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">End Time</label>
              <input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full text-sm border p-2.5 rounded-xl bg-slate-50 focus:outline-blue-500" 
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Slot Breakdowns (Minutes)</label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full text-sm border p-2.5 bg-white rounded-xl bg-slate-50 focus:outline-blue-500"
            >
              <option value={15}>15 Minute Consults</option>
              <option value={30}>30 Minute Consults</option>
              <option value={45}>45 Minute Consults</option>
              <option value={60}>1 Hour Consults</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={createMutation.isPending}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {createMutation.isPending ? "Generating Shifts..." : "Publish Shift Block"}
          </button>
        </form>
      </div>

      {/* List display monitoring column */}
      <div className="lg:grid lg:col-span-2 space-y-4">
        <h2 className="font-bold text-slate-800 text-lg">Active Scheduled Availability Blocks</h2>
        
        {isLoading ? (
          <div className="h-32 border border-dashed rounded-2xl bg-slate-50 animate-pulse" />
        ) : slots && slots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {slots.map((slot) => {
              // Calculate booking progress percentage
              const bookingPercentage = slot.totalSlots > 0 
                ? (slot.bookedSlots / slot.totalSlots) * 100 
                : 0;

              return (
                <div key={slot.availabilityId} className="bg-white border rounded-2xl p-5 flex flex-col justify-between shadow-sm border-slate-200 hover:border-blue-200 transition relative overflow-hidden group">
                  
                  {/* Card Header Info */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wide bg-blue-50 px-2.5 py-1 rounded-lg">
                        <RiCalendarLine size={14} />
                        {formatDateString(slot.date)}
                      </div>
                      
                      <button 
                        onClick={() => deleteMutation.mutate(slot.availabilityId)}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition md:opacity-0 group-hover:opacity-100"
                        title="Remove Block"
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-base font-bold text-slate-800">
                      <RiTimeLine size={18} className="text-slate-400" />
                      <span>
                        {formatTimeString(slot.startTime)} - {formatTimeString(slot.endTime)}
                      </span>
                    </div>

                    {/* Meta breakdowns */}
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
                      <div>Session length: <span className="font-semibold text-slate-700">{slot.slotDurationMinutes}m</span></div>
                      <div>Total Capacity: <span className="font-semibold text-slate-700">{slot.totalSlots} slots</span></div>
                    </div>
                  </div>

                  {/* Visual Utilization Block */}
                  <div className="mt-4 pt-3 border-t border-slate-50 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500 flex items-center gap-1">
                        <RiBookOpenLine size={14} className="text-emerald-500" />
                        {slot.freeSlots} Free Available
                      </span>
                      <span className={`${slot.bookedSlots > 0 ? "text-orange-600" : "text-slate-400"}`}>
                        {slot.bookedSlots} Booked
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-500" 
                        style={{ width: `${100 - bookingPercentage}%` }}
                      />
                      <div 
                        className="h-full bg-orange-500 transition-all duration-500 -mt-2" 
                        style={{ width: `${bookingPercentage}%` }}
                      />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
            No dynamic availability setup detected. Add parameters to accept patient appointment sessions.
          </div>
        )}
      </div>
    </div>
  );
}