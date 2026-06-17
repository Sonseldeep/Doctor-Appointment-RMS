// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { useGetClinicalNotesHistory } from "../hooks/use-my-appointment";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { 
//   FileText, Calendar, Pill, Stethoscope, 
//   MessageSquare, ArrowLeft, ChevronRight, User, CheckCircle2 
// } from "lucide-react";

// export function PrescriptionHistoryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
//   const { data: history, isLoading } = useGetClinicalNotesHistory();
//   const { data: user } = useCurrentUser();
//   const [selectedNote, setSelectedNote] = useState<any>(null);

// //   const isDoctor = user?.role?.toLowerCase() === "doctor";
  
//   const handleClose = () => {
//     setSelectedNote(null);
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 border-none shadow-2xl">
        
//         {/* HEADER */}
//         <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10">
//           <div className="flex items-center gap-3">
//             {selectedNote ? (
//               <button onClick={() => setSelectedNote(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <ArrowLeft size={20} className="text-gray-600" />
//               </button>
//             ) : (
//               <div className="bg-blue-100 p-2 rounded-lg">
//                 <FileText className="text-blue-600" size={20} />
//               </div>
//             )}
//             <DialogTitle className="text-xl font-bold">
//               {selectedNote ? "Consultation Details" : "Medical Records"}
//             </DialogTitle>
//           </div>
//         </DialogHeader>

//         <div className="p-6 bg-slate-50 min-h-[400px]">
//           {isLoading ? (
//             <div className="py-10 text-center text-gray-500 italic">Fetching records...</div>
//           ) : selectedNote ? (
//             /* --- DETAIL VIEW --- */
//             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
//               <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
//                 <img src={isDoctor ? selectedNote.patientPhotoUrl : selectedNote.doctorPhotoUrl} className="h-16 w-16 rounded-full object-cover border" />
//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-900">{isDoctor ? selectedNote.patientName : selectedNote.doctorName}</h3>
//                   <p className="text-xs text-slate-500 font-bold uppercase">{isDoctor ? "Patient" : "Doctor"}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-1">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Observations</h4>
//                   <div className="bg-white border p-4 rounded-xl text-sm text-gray-700">{selectedNote.observations || "N/A"}</div>
//                 </div>
//                 <div className="space-y-1">
//                   <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Treatment Summary</h4>
//                   <div className="bg-white border p-4 rounded-xl text-sm text-gray-700">{selectedNote.treatmentSummary || "N/A"}</div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">Prescribed Medications</h4>
//                 <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg">
//                   {selectedNote.medications.map((med: any) => (
//                     <div key={med.id} className="flex items-center justify-between border-b border-slate-700 py-2 last:border-0">
//                       <div>
//                         <p className="font-bold text-blue-400">{med.name}</p>
//                         <p className="text-xs text-slate-400">{med.instructions}</p>
//                       </div>
//                       <p className="text-sm font-medium">{med.dosage}</p>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             /* --- LIST VIEW --- */
//             <div className="grid grid-cols-1 gap-4">
//               {history?.map((note: any) => (
//                 <button key={note.id} onClick={() => setSelectedNote(note)} className="group w-full text-left p-5 rounded-3xl border border-slate-100 bg-white hover:border-indigo-200 transition-all">
//                   <div className="flex items-start gap-4">
//                     <img src={isDoctor ? note.patientPhotoUrl : note.doctorPhotoUrl} className="h-16 w-16 rounded-2xl object-cover border" />
//                     <div className="flex-1 space-y-3">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <h4 className="font-black text-lg text-slate-900">{isDoctor ? note.patientName : note.doctorName}</h4>
//                           <p className="text-xs text-indigo-600 font-bold uppercase">{note.diagnosis}</p>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-slate-50 p-3 rounded-xl">
//                         <div className="flex justify-between text-[11px]"><span className="text-slate-400">Age:</span><span className="font-bold">{note.patientAge || "N/A"}</span></div>
//                         <div className="flex justify-between text-[11px]"><span className="text-slate-400">Gender:</span><span className="font-bold">{note.patientGender || "N/A"}</span></div>
//                         <div className="col-span-2 flex justify-between text-[11px] pt-1 border-t border-slate-200"><span className="text-slate-400">Prescribed:</span><span className="font-bold">{new Date(note.appointmentDate).toLocaleDateString()}</span></div>
//                       </div>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }