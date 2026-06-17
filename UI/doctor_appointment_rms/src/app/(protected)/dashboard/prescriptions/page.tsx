// // import { PrescriptionHistoryPage } from "@/features/appointments/components/prescription-history-page";

// // export default function Page() {
// //   return <PrescriptionHistoryPage />;
// // }


// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useGetClinicalNotesHistory } from "@/features/appointments/hooks/use-my-appointment"; // Ensure this path matches your project
// import { useUpdateClinicalNote } from "@/features/clinical-notes/hooks/use-clinical-notes";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { Calendar, Pill, ArrowLeft, Edit3, Save, X, ChevronRight, Filter } from "lucide-react";

// export default function PrescriptionHistoryPage() {
//   const { data: history, isLoading } = useGetClinicalNotesHistory();
//   const { data: user } = useCurrentUser();
//   const updateMutation = useUpdateClinicalNote();
  
//   const [selectedNote, setSelectedNote] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState<any>(null);
  
//   // Date filter state variable (stores as "YYYY-MM-DD")
//   const [dateFilter, setDateFilter] = useState<string>("");

//   const isDoctor = user?.role?.toLowerCase() === "doctor";
  
//   const handleEditInit = (note: any) => {
//     setEditForm(JSON.parse(JSON.stringify(note)));
//     setIsEditing(true);
//   };

//   const handleUpdate = async () => {
//     if (!editForm || !editForm.id) return;
    
//     try {
//       await updateMutation.mutateAsync({
//         clinicalNoteId: editForm.id, 
//         data: {
//           diagnosis: editForm.diagnosis,
//           observations: editForm.observations,
//           treatmentSummary: editForm.treatmentSummary,
//           followUpDate: editForm.followUpDate,
//           followUpInstructions: editForm.followUpInstructions,
//           medications: editForm.medications,
//         }
//       });
//       setIsEditing(false);
//       setSelectedNote(editForm);
//     } catch (error) {
//       console.error("Failed to update note:", error);
//     }
//   };

//   const updateMedication = (index: number, field: string, value: any) => {
//     const updatedMeds = [...editForm.medications];
//     updatedMeds[index] = { ...updatedMeds[index], [field]: value };
//     setEditForm({ ...editForm, medications: updatedMeds });
//   };

//   // 1. Step: Apply local date-picker filter conditions dynamically
//   const filteredHistory = history?.filter((note: any) => {
//     if (!dateFilter) return true;
    
//     const rawDate = note.createdAt || note.date || note.followUpDate;
//     if (!rawDate) return false;
    
//     try {
//       const noteDateString = new Date(rawDate).toISOString().split("T")[0];
//       return noteDateString === dateFilter;
//     } catch (e) {
//       return false;
//     }
//   });

//   // 2. Step: Group filtered results into chronological timeline sections
//   const groupedHistory = filteredHistory?.reduce((acc: any, note: any) => {
//     const rawDate = note.createdAt || note.date || note.followUpDate;
//     const formattedDate = rawDate 
//       ? new Date(rawDate).toLocaleDateString("en-US", {
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         })
//       : "General History";

//     if (!acc[formattedDate]) acc[formattedDate] = [];
//     acc[formattedDate].push(note);
//     return acc;
//   }, {} as Record<string, any[]>) || {};

//   return (
//     <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
//       {/* Page Header (Replaces DialogHeader) */}
//       <div className="flex flex-row items-center justify-between border-b pb-6 sticky top-0 bg-white/80 backdrop-blur-md z-10">
//         <div className="flex items-center gap-3">
//           {selectedNote && (
//             <button 
//               onClick={() => { setSelectedNote(null); setIsEditing(false); }} 
//               className="p-2 hover:bg-slate-100 rounded-full transition-colors border shadow-sm bg-white"
//             >
//               <ArrowLeft size={20} className="text-slate-700" />
//             </button>
//           )}
//           <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
//             {selectedNote ? "Consultation Details" : "Prescription History"}
//           </h1>
//         </div>
//         {selectedNote && isDoctor && !isEditing && (
//           <Button variant="outline" size="sm" onClick={() => handleEditInit(selectedNote)} className="rounded-xl shadow-sm border-slate-200">
//             <Edit3 size={16} className="mr-2" /> Edit Note
//           </Button>
//         )}
//       </div>

//       {/* Main Content Body */}
//       <div className="p-6 bg-slate-50/50 min-h-[600px] rounded-3xl border border-slate-100 shadow-inner">
//         {isLoading ? (
//           <div className="py-20 text-center text-slate-500 font-medium animate-pulse">Loading records...</div>
//         ) : isEditing ? (
//           /* --- EDIT VIEW --- */
//           <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-fade-in max-w-3xl">
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-gray-500">Diagnosis</label>
//               <Input value={editForm.diagnosis} onChange={(e) => setEditForm({...editForm, diagnosis: e.target.value})} />
//             </div>
            
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-gray-500">Observations</label>
//               <textarea className="w-full p-3 border rounded-xl text-sm h-24 focus:outline-blue-500" placeholder="Document patient observations..." value={editForm.observations} onChange={(e) => setEditForm({...editForm, observations: e.target.value})} />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-gray-500">Treatment Summary</label>
//               <textarea className="w-full p-3 border rounded-xl text-sm h-24 focus:outline-blue-500" placeholder="Document treatment plan summary..." value={editForm.treatmentSummary} onChange={(e) => setEditForm({...editForm, treatmentSummary: e.target.value})} />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-gray-500">Follow-up Date</label>
//                 <Input type="datetime-local" value={editForm.followUpDate ? editForm.followUpDate.slice(0, 16) : ""} onChange={(e) => setEditForm({...editForm, followUpDate: e.target.value})} />
//               </div>
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-gray-500">Follow-up Instructions</label>
//                 <Input value={editForm.followUpInstructions} onChange={(e) => setEditForm({...editForm, followUpInstructions: e.target.value})} />
//               </div>
//             </div>
            
//             <h4 className="font-bold text-sm mt-4 text-slate-800">Edit Medications</h4>
//             {editForm.medications && editForm.medications.map((med: any, idx: number) => (
//               <div key={idx} className="grid grid-cols-2 gap-2 p-3 border rounded-xl bg-slate-50 text-xs">
//                 <Input placeholder="Med Name" value={med.name} onChange={(e) => updateMedication(idx, 'name', e.target.value)} />
//                 <Input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedication(idx, 'dosage', e.target.value)} />
//                 <Input placeholder="Freq" value={med.frequency} onChange={(e) => updateMedication(idx, 'frequency', e.target.value)} />
//                 <Input placeholder="Duration (Days)" type="number" value={med.durationInDays} onChange={(e) => updateMedication(idx, 'durationInDays', parseInt(e.target.value, 10))} />
//               </div>
//             ))}
            
//             <div className="flex gap-2 justify-end pt-4">
//               <Button variant="ghost" onClick={() => setIsEditing(false)}><X size={16} className="mr-1" /> Cancel</Button>
//               <Button onClick={handleUpdate} disabled={updateMutation.isPending}><Save size={16} className="mr-1" /> Save Changes</Button>
//             </div>
//           </div>
//         ) : selectedNote ? (
//           /* --- READ VIEW (Consultation Details) --- */
//           <div className="space-y-6 animate-fade-in max-w-4xl">
//             <div className="bg-white p-6 rounded-2xl border shadow-sm">
//               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Diagnosis</h4>
//               <p className="font-bold text-xl text-indigo-900 mt-1">{selectedNote.diagnosis}</p>
//             </div>
            
//             <div className="bg-white p-6 rounded-2xl border shadow-sm">
//               <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Observations & Treatment</h4>
//               <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedNote.observations}</p>
//               <div className="mt-4 pt-4 border-t border-slate-100">
//                 <p className="text-sm text-gray-800"><span className="font-semibold text-gray-500 mr-2">Treatment Plan:</span> {selectedNote.treatmentSummary}</p>
//               </div>
//             </div>

//             {/* Follow-up Details Section */}
// <div className="bg-white p-6 rounded-2xl border shadow-sm">
//   <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Follow-up Details</h4>
//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//     <div>
//       <p className="text-xs text-gray-500 font-semibold uppercase">Date</p>
//       <p className="text-sm text-gray-800 mt-1">
//         {selectedNote.followUpDate 
//           ? new Date(selectedNote.followUpDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }) 
//           : "Not specified"}
//       </p>
//     </div>
//     <div>
//       <p className="text-xs text-gray-500 font-semibold uppercase">Instructions</p>
//       <p className="text-sm text-gray-800 mt-1">{selectedNote.followUpInstructions || "None provided"}</p>
//     </div>
//   </div>
// </div>
            
//             <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md">
//               <h4 className="flex items-center gap-2 font-bold mb-4 text-blue-400"><Pill size={18}/> Medications</h4>
//               <div className="grid gap-3">
//                 {selectedNote.medications?.map((med: any, i: number) => (
//                   <div key={i} className="flex justify-between items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
//                     <div>
//                       <p className="font-bold text-blue-300">{med.name}</p>
//                       <p className="text-xs text-slate-400 mt-0.5">{med.instructions}</p>
//                     </div>
//                     <span className="text-sm font-mono bg-slate-800 px-3 py-1.5 rounded-lg text-slate-200 border border-slate-600">{med.dosage}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* --- LIST VIEW WITH TIMELINE AND DATE FILTER --- */
//           <div className="space-y-8 max-w-4xl">
            
//             {/* Interactive Date Filter Bar */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
//               <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//                 <Filter size={16} className="text-blue-500" />
//                 <span>Timeline Filters</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="date"
//                   value={dateFilter}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                   className="p-2 border border-slate-200 rounded-xl text-sm focus:outline-blue-500 focus:border-blue-500 bg-white shadow-sm transition"
//                 />
//                 {dateFilter && (
//                   <Button 
//                     variant="ghost" 
//                     size="sm" 
//                     onClick={() => setDateFilter("")} 
//                     className="text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl h-9 font-medium"
//                   >
//                     Clear
//                   </Button>
//                 )}
//               </div>
//             </div>

//             {/* Rendered Timeline Body */}
//             <div className="space-y-8 relative pl-6 border-l-2 border-slate-200/80 ml-4 animate-fade-in">
//               {Object.keys(groupedHistory).length === 0 ? (
//                 <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium">
//                   No clinical records match this selected date filter.
//                 </div>
//               ) : (
//                 Object.entries(groupedHistory).map(([dateGroup, items]: [string, any]) => (
//                   <div key={dateGroup} className="space-y-4 relative">
                    
//                     {/* Visual Timeline Node Anchor */}
//                     <div className="absolute -left-[31px] top-1 bg-blue-600 w-3.5 h-3.5 rounded-full border-2 border-white ring-4 ring-slate-100 shadow-sm" />
                    
//                     {/* Sticky Section Header grouped by date string */}
//                     <div className="flex items-center gap-2 mb-2 bg-slate-50/90 py-1 sticky top-[-25px] z-10 w-max pr-4 rounded-r-lg">
//                       <Calendar size={14} className="text-slate-400" />
//                       <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
//                         {dateGroup}
//                       </span>
//                     </div>

//                     {/* Consultation Nodes Grid */}
//                     <div className="grid gap-3">
//                       {items.map((note: any) => (
//                         <button 
//                           key={note.id} 
//                           onClick={() => setSelectedNote(note)} 
//                           className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left flex justify-between items-center group w-full"
//                         >
//                           <div>
//                             <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-150 text-lg">
//                               {isDoctor ? note.patientName : note.doctorName}
//                             </h4>
//                             <p className="text-xs text-indigo-600 font-bold mt-1.5 bg-indigo-50/80 inline-block px-2.5 py-1 rounded-md">
//                               {note.diagnosis}
//                             </p>
//                           </div>
//                           <div className="bg-slate-50 p-2 rounded-full group-hover:bg-blue-50 transition-colors">
//                             <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-150" />
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetClinicalNotesHistory } from "@/features/appointments/hooks/use-my-appointment";
import { useUpdateClinicalNote } from "@/features/clinical-notes/hooks/use-clinical-notes";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { Calendar, Pill, ArrowLeft, Edit3, Save, X, ChevronRight, Filter } from "lucide-react";

export default function PrescriptionHistoryPage() {
  const { data: history, isLoading } = useGetClinicalNotesHistory();
  const { data: user } = useCurrentUser();
  const updateMutation = useUpdateClinicalNote();
  
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>(null);
  
  // State for follow-up logic
  const [noFollowUpNeeded, setNoFollowUpNeeded] = useState(false);
  
  // Date filter state
  const [dateFilter, setDateFilter] = useState<string>("");

  const isDoctor = user?.role?.toLowerCase() === "doctor";
  
  const handleEditInit = (note: any) => {
    setEditForm(JSON.parse(JSON.stringify(note)));
    // If no followUpDate exists, check the box
    setNoFollowUpNeeded(!note.followUpDate);
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!editForm || !editForm.id) return;
    
    try {
      await updateMutation.mutateAsync({
        clinicalNoteId: editForm.id, 
        data: {
          diagnosis: editForm.diagnosis,
          observations: editForm.observations,
          treatmentSummary: editForm.treatmentSummary,
          // Logic: If checkbox is active, send null
          followUpDate: noFollowUpNeeded ? null : editForm.followUpDate,
          followUpInstructions: noFollowUpNeeded ? null : editForm.followUpInstructions,
          medications: editForm.medications,
        }
      });
      setIsEditing(false);
      setSelectedNote({ ...editForm, followUpDate: noFollowUpNeeded ? null : editForm.followUpDate });
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const updateMedication = (index: number, field: string, value: any) => {
    const updatedMeds = [...editForm.medications];
    updatedMeds[index] = { ...updatedMeds[index], [field]: value };
    setEditForm({ ...editForm, medications: updatedMeds });
  };

  // Timeline Filtering
  const filteredHistory = history?.filter((note: any) => {
    if (!dateFilter) return true;
    const rawDate = note.createdAt || note.date || note.followUpDate;
    if (!rawDate) return false;
    try {
      const noteDateString = new Date(rawDate).toISOString().split("T")[0];
      return noteDateString === dateFilter;
    } catch (e) { return false; }
  });

  // Timeline Grouping
  const groupedHistory = filteredHistory?.reduce((acc: any, note: any) => {
    const rawDate = note.createdAt || note.date || note.followUpDate;
    const formattedDate = rawDate 
      ? new Date(rawDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : "General History";
    if (!acc[formattedDate]) acc[formattedDate] = [];
    acc[formattedDate].push(note);
    return acc;
  }, {} as Record<string, any[]>) || {};

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-row items-center justify-between border-b pb-6 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          {selectedNote && (
            <button onClick={() => { setSelectedNote(null); setIsEditing(false); }} className="p-2 hover:bg-slate-100 rounded-full transition-colors border shadow-sm bg-white">
              <ArrowLeft size={20} className="text-slate-700" />
            </button>
          )}
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {selectedNote ? "Consultation Details" : "Prescription History"}
          </h1>
        </div>
        {selectedNote && isDoctor && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => handleEditInit(selectedNote)} className="rounded-xl shadow-sm border-slate-200">
            <Edit3 size={16} className="mr-2" /> Edit Note
          </Button>
        )}
      </div>

      <div className="p-6 bg-slate-50/50 min-h-[600px] rounded-3xl border border-slate-100 shadow-inner">
        {isLoading ? (
          <div className="py-20 text-center text-slate-500 font-medium animate-pulse">Loading records...</div>
        ) : isEditing ? (
          /* --- EDIT VIEW --- */
          <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-fade-in max-w-3xl">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Diagnosis</label>
              <Input value={editForm.diagnosis} onChange={(e) => setEditForm({...editForm, diagnosis: e.target.value})} />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Observations</label>
              <textarea className="w-full p-3 border rounded-xl text-sm h-24 focus:outline-blue-500" value={editForm.observations} onChange={(e) => setEditForm({...editForm, observations: e.target.value})} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500">Treatment Summary</label>
              <textarea className="w-full p-3 border rounded-xl text-sm h-24 focus:outline-blue-500" value={editForm.treatmentSummary} onChange={(e) => setEditForm({...editForm, treatmentSummary: e.target.value})} />
            </div>
            
            {/* Follow-up Section with Checkbox */}
            <div className="pt-4 border-t space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={noFollowUpNeeded} 
                  onChange={(e) => setNoFollowUpNeeded(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                No follow-up needed
              </label>
              
              {!noFollowUpNeeded && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Follow-up Date</label>
                    <Input type="datetime-local" value={editForm.followUpDate ? editForm.followUpDate.slice(0, 16) : ""} onChange={(e) => setEditForm({...editForm, followUpDate: e.target.value})} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-500">Follow-up Instructions</label>
                    <Input value={editForm.followUpInstructions || ""} onChange={(e) => setEditForm({...editForm, followUpInstructions: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
            
            <h4 className="font-bold text-sm mt-4 text-slate-800">Edit Medications</h4>
            {editForm.medications && editForm.medications.map((med: any, idx: number) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-xl bg-slate-50 text-xs">
                <Input placeholder="Med Name" value={med.name} onChange={(e) => updateMedication(idx, 'name', e.target.value)} />
                <Input placeholder="Dosage" value={med.dosage} onChange={(e) => updateMedication(idx, 'dosage', e.target.value)} />
                
                <select className="p-2 border rounded-lg bg-white" value={med.frequency} onChange={(e) => updateMedication(idx, 'frequency', e.target.value)}>
                    <option value="">Select Frequency</option>
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} times/day</option>)}
                </select>

                <select className="p-2 border rounded-lg bg-white" value={med.instructions} onChange={(e) => updateMedication(idx, 'instructions', e.target.value)}>
                    <option value="">Select Instruction</option>
                    <option value="Before Food">Before Food</option>
                    <option value="After Food">After Food</option>
                </select>
                
                <div className="col-span-full">
                    <Input placeholder="Duration (Days)" type="number" value={med.durationInDays} onChange={(e) => updateMedication(idx, 'durationInDays', parseInt(e.target.value, 10))} />
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="ghost" onClick={() => setIsEditing(false)}><X size={16} className="mr-1" /> Cancel</Button>
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}><Save size={16} className="mr-1" /> Save Changes</Button>
            </div>
          </div>
        ) : selectedNote ? (
          /* --- READ VIEW --- */
          <div className="space-y-6 animate-fade-in max-w-4xl">
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Diagnosis</h4>
              <p className="font-bold text-xl text-indigo-900 mt-1">{selectedNote.diagnosis}</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Observations & Treatment</h4>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedNote.observations}</p>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-gray-800"><span className="font-semibold text-gray-500 mr-2">Treatment Plan:</span> {selectedNote.treatmentSummary}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border shadow-sm">
              <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Follow-up Details</h4>
              {selectedNote.followUpDate ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Date</p>
                      <p className="text-sm text-gray-800 mt-1">
                        {new Date(selectedNote.followUpDate).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Instructions</p>
                      <p className="text-sm text-gray-800 mt-1">{selectedNote.followUpInstructions || "None provided"}</p>
                    </div>
                  </div>
              ) : (
                  <p className="text-sm text-slate-500 italic">No follow-up scheduled.</p>
              )}
            </div>
            
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md">
              <h4 className="flex items-center gap-2 font-bold mb-4 text-blue-400"><Pill size={18}/> Medications</h4>
              <div className="grid gap-3">
                {selectedNote.medications?.map((med: any, i: number) => (
                  <div key={i} className="flex flex-col gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-blue-300">{med.name}</p>
                        <p className="text-xs text-slate-400">{med.instructions}</p>
                      </div>
                      <span className="text-sm font-mono bg-slate-800 px-3 py-1.5 rounded-lg text-slate-200 border border-slate-600">{med.dosage}</span>
                    </div>
                    
                    {(med.frequency || med.durationInDays) && (
                      <div className="text-xs text-slate-300 pt-2 border-t border-slate-700/50">
                        <span className="bg-slate-700/50 px-2 py-0.5 rounded mr-2">
                          {med.frequency} times/day
                        </span>
                        <span className="bg-slate-700/50 px-2 py-0.5 rounded">
                          {med.durationInDays} days
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* --- LIST VIEW --- */
          <div className="space-y-8 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Filter size={16} className="text-blue-500" />
                <span>Timeline Filters</span>
              </div>
              <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="p-2 border border-slate-200 rounded-xl text-sm focus:outline-blue-500 bg-white" />
            </div>

            <div className="space-y-8 relative pl-6 border-l-2 border-slate-200/80 ml-4">
              {Object.keys(groupedHistory).length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed text-slate-400">No records found.</div>
              ) : (
                Object.entries(groupedHistory).map(([dateGroup, items]: [string, any]) => (
                  <div key={dateGroup} className="space-y-4 relative">
                    <div className="absolute -left-[31px] top-1 bg-blue-600 w-3.5 h-3.5 rounded-full border-2 border-white ring-4 ring-slate-100" />
                    <div className="flex items-center gap-2 mb-2 bg-slate-50/90 py-1 sticky top-[-25px] z-10 w-max pr-4">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase">{dateGroup}</span>
                    </div>
                    <div className="grid gap-3">
                      {items.map((note: any) => (
                        <button key={note.id} onClick={() => setSelectedNote(note)} className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all text-left flex justify-between items-center group w-full">
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600">{isDoctor ? note.patientName : note.doctorName}</h4>
                            <p className="text-xs text-indigo-600 font-bold mt-1.5 bg-indigo-50/80 inline-block px-2.5 py-1 rounded-md">{note.diagnosis}</p>
                          </div>
                          <ChevronRight size={18} className="text-slate-400 group-hover:text-blue-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}