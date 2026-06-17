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

//   const isDoctor = user?.role?.toLowerCase() === "doctor";
  
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
//               {selectedNote ? "Consultation Details" : "Prescription History"}
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

// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useGetClinicalNotesHistory } from "../hooks/use-my-appointment";
// import { useUpdateClinicalNote } from "@/features/clinical-notes/hooks/use-clinical-notes";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { FileText, Calendar, Pill, ArrowLeft, Edit3, Save, X, ChevronRight } from "lucide-react";

// export function PrescriptionHistoryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
//   const { data: history, isLoading } = useGetClinicalNotesHistory();
//   const { data: user } = useCurrentUser();
//   const updateMutation = useUpdateClinicalNote();
  
//   const [selectedNote, setSelectedNote] = useState<any>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState<any>(null);

//   const isDoctor = user?.role?.toLowerCase() === "doctor";
  
//   const handleEditInit = (note: any) => {
//     // Corrected ID access for logging (optional, but good for verification)
//     if (note && note.id) {
//       console.log("Initializing edit for clinicalNoteId:", note.id);
//     }
//     setEditForm(JSON.parse(JSON.stringify(note)));
//     setIsEditing(true);
//   };

//   const handleUpdate = async () => {
//     // ADDED SAFETY CHECK (matches your console log debug)
//     if (!editForm || !editForm.id) {
//       console.error("Missing critical clinicalNoteId (editForm.id)", editForm);
//       return;
//     }
    
//     try {
//       await updateMutation.mutateAsync({
//         // CORRECTED: Accessing 'id' (as shown in your console log)
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
//       // Error handling is managed by the mutation hook, but we can log context here
//       console.error("Failed to complete PUT update request chain:", error);
//     }
//   };

//   const updateMedication = (index: number, field: string, value: any) => {
//     const updatedMeds = [...editForm.medications];
//     updatedMeds[index] = { ...updatedMeds[index], [field]: value };
//     setEditForm({ ...editForm, medications: updatedMeds });
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
//         <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10 flex flex-row items-center justify-between">
//           <div className="flex items-center gap-3">
//             {selectedNote && (
//               <button onClick={() => { setSelectedNote(null); setIsEditing(false); }} className="p-2 hover:bg-gray-100 rounded-full">
//                 <ArrowLeft size={20} />
//               </button>
//             )}
//             <DialogTitle className="text-xl font-bold">{selectedNote ? "Consultation Details" : "Prescription History"}</DialogTitle>
//           </div>
//           {selectedNote && isDoctor && !isEditing && (
//             <Button variant="outline" size="sm" onClick={() => handleEditInit(selectedNote)}>
//               <Edit3 size={16} className="mr-2" /> Edit Note
//             </Button>
//           )}
//         </DialogHeader>

//         <div className="p-6 bg-slate-50 min-h-[500px]">
//           {isLoading ? (
//             <div className="py-10 text-center">Loading records...</div>
//           ) : isEditing ? (
//             /* --- EDIT FORM (Mappings corrected to match API request body) --- */
//             <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-gray-500">Diagnosis</label>
//                 <Input value={editForm.diagnosis} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, diagnosis: e.target.value})} />
//               </div>
              
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-gray-500">Observations</label>
//                 <textarea className="w-full p-3 border rounded-xl text-sm h-24" placeholder="Document patient observations..." value={editForm.observations} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({...editForm, observations: e.target.value})} />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-gray-500">Treatment Summary</label>
//                 <textarea className="w-full p-3 border rounded-xl text-sm h-24" placeholder="Document treatment plan summary..." value={editForm.treatmentSummary} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({...editForm, treatmentSummary: e.target.value})} />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-gray-500">Follow-up Date</label>
//                   {/* Safely slice the date string if it exists */}
//                   <Input type="datetime-local" value={editForm.followUpDate ? editForm.followUpDate.slice(0, 16) : ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, followUpDate: e.target.value})} />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-gray-500">Follow-up Instructions</label>
//                   <Input value={editForm.followUpInstructions} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, followUpInstructions: e.target.value})} />
//                 </div>
//               </div>
              
//               <h4 className="font-bold text-sm mt-4">Edit Medications</h4>
//               {editForm.medications && editForm.medications.map((med: any, idx: number) => (
//                 <div key={idx} className="grid grid-cols-2 gap-2 p-3 border rounded-xl bg-slate-50 text-xs">
//                   <Input placeholder="Med Name" value={med.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMedication(idx, 'name', e.target.value)} />
//                   <Input placeholder="Dosage" value={med.dosage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMedication(idx, 'dosage', e.target.value)} />
//                   <Input placeholder="Freq" value={med.frequency} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMedication(idx, 'frequency', e.target.value)} />
//                   <Input placeholder="Duration (Days)" type="number" value={med.durationInDays} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMedication(idx, 'durationInDays', parseInt(e.target.value, 10))} />
//                 </div>
//               ))}
              
//               <div className="flex gap-2 justify-end pt-4">
//                 <Button variant="ghost" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</Button>
//                 <Button onClick={handleUpdate} disabled={updateMutation.isPending}><Save size={16} /> Save Changes</Button>
//               </div>
//             </div>
//           ) : selectedNote ? (
//             /* --- READ VIEW --- */
//             <div className="space-y-6">
//               <div className="bg-white p-5 rounded-2xl border">
//                 <h4 className="text-[10px] font-bold text-gray-400 uppercase">Diagnosis</h4>
//                 <p className="font-bold text-lg text-indigo-900">{selectedNote.diagnosis}</p>
//               </div>
//               <div className="bg-white p-5 rounded-2xl border">
//                 <h4 className="text-xs font-bold text-gray-400 mb-2">Observations & Treatment</h4>
//                 <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedNote.observations}</p>
//                 <p className="text-sm text-gray-600 mt-2 italic border-t pt-2">Treatment Plan: {selectedNote.treatmentSummary}</p>
//               </div>
//               <div className="bg-slate-900 text-white p-6 rounded-3xl">
//                 <h4 className="flex items-center gap-2 font-bold mb-4"><Pill size={18}/> Medications</h4>
//                 {selectedNote.medications?.map((med: any, i: number) => (
//                   <div key={i} className="flex justify-between py-3 border-b border-slate-700 last:border-0">
//                     <div>
//                       <p className="font-bold text-blue-400">{med.name}</p>
//                       <p className="text-xs opacity-70">{med.instructions}</p>
//                     </div>
//                     <span className="text-sm font-mono">{med.dosage}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* --- LIST VIEW --- */
//             <div className="grid gap-3">
//               {history?.map((note: any) => (
//                 // CORRECTED KEY ACCESS: Accessing 'id' instead of 'clinicalNoteId'
//                 <button key={note.id} onClick={() => setSelectedNote(note)} className="bg-white p-5 rounded-2xl border hover:shadow-md transition text-left flex justify-between items-center">
//                   <div>
//                     <h4 className="font-bold text-slate-900">{isDoctor ? note.patientName : note.doctorName}</h4>
//                     <p className="text-xs text-indigo-600 font-bold">{note.diagnosis}</p>
//                   </div>
//                   <ChevronRight size={18} className="text-gray-300" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useGetClinicalNotesHistory } from "../hooks/use-my-appointment";
// import { useUpdateClinicalNote } from "@/features/clinical-notes/hooks/use-clinical-notes";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { FileText, Calendar, Pill, ArrowLeft, Edit3, Save, X, ChevronRight, Filter } from "lucide-react";

// export function PrescriptionHistoryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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
//     if (note && note.id) {
//       console.log("Initializing edit for clinicalNoteId:", note.id);
//     }
//     setEditForm(JSON.parse(JSON.stringify(note)));
//     setIsEditing(true);
//   };

//   const handleUpdate = async () => {
//     if (!editForm || !editForm.id) {
//       console.error("Missing critical clinicalNoteId (editForm.id)", editForm);
//       return;
//     }
    
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
//       console.error("Failed to complete PUT update request chain:", error);
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
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       {/* INCREASED MODAL WIDTH BOUNDS HERE */}
//       <DialogContent className="sm:max-w-[1000px] w-[95%] max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl transition-all duration-300">
//         <DialogHeader className="p-6 border-b bg-white sticky top-0 z-10 flex flex-row items-center justify-between">
//           <div className="flex items-center gap-3">
//             {selectedNote && (
//               <button onClick={() => { setSelectedNote(null); setIsEditing(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
//                 <ArrowLeft size={20} />
//               </button>
//             )}
//             <DialogTitle className="text-xl font-bold">
//               {selectedNote ? "Consultation Details" : "Prescription History"}
//             </DialogTitle>
//           </div>
//           {selectedNote && isDoctor && !isEditing && (
//             <Button variant="outline" size="sm" onClick={() => handleEditInit(selectedNote)} className="rounded-xl">
//               <Edit3 size={16} className="mr-2" /> Edit Note
//             </Button>
//           )}
//         </DialogHeader>

//         <div className="p-6 bg-slate-50 min-h-[500px]">
//           {isLoading ? (
//             <div className="py-10 text-center text-slate-500 font-medium">Loading records...</div>
//           ) : isEditing ? (
//             /* --- EDIT VIEW --- */
//             <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 animate-fade-in">
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-gray-500">Diagnosis</label>
//                 <Input value={editForm.diagnosis} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, diagnosis: e.target.value})} />
//               </div>
              
//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-gray-500">Observations</label>
//                 <textarea className="w-full p-3 border rounded-xl text-sm h-24 focus:outline-blue-500" placeholder="Document patient observations..." value={editForm.observations} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({...editForm, observations: e.target.value})} />
//               </div>

//               <div className="space-y-1.5">
//                 <label className="text-xs font-semibold text-gray-500">Treatment Summary</label>
//                 <textarea className="w-full p-3 border rounded-xl text-sm h-24 focus:outline-blue-500" placeholder="Document treatment plan summary..." value={editForm.treatmentSummary} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditForm({...editForm, treatmentSummary: e.target.value})} />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-gray-500">Follow-up Date</label>
//                   <Input type="datetime-local" value={editForm.followUpDate ? editForm.followUpDate.slice(0, 16) : ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, followUpDate: e.target.value})} />
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="text-xs font-semibold text-gray-500">Follow-up Instructions</label>
//                   <Input value={editForm.followUpInstructions} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({...editForm, followUpInstructions: e.target.value})} />
//                 </div>
//               </div>
              
//               <h4 className="font-bold text-sm mt-4 text-slate-800">Edit Medications</h4>
//               {editForm.medications && editForm.medications.map((med: any, idx: number) => (
//                 <div key={idx} className="grid grid-cols-2 gap-2 p-3 border rounded-xl bg-slate-50 text-xs">
//                   <Input placeholder="Med Name" value={med.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMedication(idx, 'name', e.target.value)} />
//                   <Input placeholder="Dosage" value={med.dosage} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMedication(idx, 'dosage', e.target.value)} />
//                   <Input placeholder="Freq" value={med.frequency} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMedication(idx, 'frequency', e.target.value)} />
//                   <Input placeholder="Duration (Days)" type="number" value={med.durationInDays} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMedication(idx, 'durationInDays', parseInt(e.target.value, 10))} />
//                 </div>
//               ))}
              
//               <div className="flex gap-2 justify-end pt-4">
//                 <Button variant="ghost" onClick={() => setIsEditing(false)}><X size={16} className="mr-1" /> Cancel</Button>
//                 <Button onClick={handleUpdate} disabled={updateMutation.isPending}><Save size={16} className="mr-1" /> Save Changes</Button>
//               </div>
//             </div>
//           ) : selectedNote ? (
//             /* --- READ VIEW --- */
//             <div className="space-y-6 animate-fade-in">
//               <div className="bg-white p-5 rounded-2xl border">
//                 <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Diagnosis</h4>
//                 <p className="font-bold text-lg text-indigo-900">{selectedNote.diagnosis}</p>
//               </div>
//               <div className="bg-white p-5 rounded-2xl border">
//                 <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Observations & Treatment</h4>
//                 <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedNote.observations}</p>
//                 <p className="text-sm text-gray-600 mt-2 italic border-t pt-2">Treatment Plan: {selectedNote.treatmentSummary}</p>
//               </div>
//               <div className="bg-slate-900 text-white p-6 rounded-3xl">
//                 <h4 className="flex items-center gap-2 font-bold mb-4 text-blue-400"><Pill size={18}/> Medications</h4>
//                 {selectedNote.medications?.map((med: any, i: number) => (
//                   <div key={i} className="flex justify-between py-3 border-b border-slate-700 last:border-0">
//                     <div>
//                       <p className="font-bold text-blue-400">{med.name}</p>
//                       <p className="text-xs opacity-70 mt-0.5">{med.instructions}</p>
//                     </div>
//                     <span className="text-sm font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 self-start">{med.dosage}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             /* --- LIST VIEW WITH TIMELINE AND DATE FILTER --- */
//             <div className="space-y-6">
              
//               {/* Interactive Date Filter Bar */}
//               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/60 shadow-xs">
//                 <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//                   <Filter size={16} className="text-blue-500" />
//                   <span>Timeline Filters</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="date"
//                     value={dateFilter}
//                     onChange={(e) => setDateFilter(e.target.value)}
//                     className="p-2 border border-slate-200 rounded-xl text-sm focus:outline-blue-500 focus:border-blue-500 bg-white shadow-2xs transition"
//                   />
//                   {dateFilter && (
//                     <Button 
//                       variant="ghost" 
//                       size="sm" 
//                       onClick={() => setDateFilter("")} 
//                       className="text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl h-9 font-medium"
//                     >
//                       Clear
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               {/* Rendered Timeline Body */}
//               <div className="space-y-6 relative pl-4 border-l-2 border-slate-200/80 ml-2 animate-fade-in">
//                 {Object.keys(groupedHistory).length === 0 ? (
//                   <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 text-slate-400 font-medium">
//                     No clinical records match this selected date filter.
//                   </div>
//                 ) : (
//                   Object.entries(groupedHistory).map(([dateGroup, items]: [string, any]) => (
//                     <div key={dateGroup} className="space-y-3 relative">
                      
//                       {/* Visual Timeline Node Anchor */}
//                       <div className="absolute -left-[25px] top-1 bg-blue-600 w-3 h-3 rounded-full border-2 border-white ring-4 ring-slate-100 shadow-sm" />
                      
//                       {/* Sticky Section Header grouped by date string */}
//                       <div className="flex items-center gap-1.5 mb-1 bg-slate-50/90 py-0.5 sticky top-[-25px] z-10">
//                         <Calendar size={13} className="text-slate-400" />
//                         <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
//                           {dateGroup}
//                         </span>
//                       </div>

//                       {/* Consultation Nodes Grid */}
//                       <div className="grid gap-3">
//                         {items.map((note: any) => (
//                           <button 
//                             key={note.id} 
//                             onClick={() => setSelectedNote(note)} 
//                             className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition text-left flex justify-between items-center group w-full"
//                           >
//                             <div>
//                               <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-150">
//                                 {isDoctor ? note.patientName : note.doctorName}
//                               </h4>
//                               <p className="text-xs text-indigo-600 font-bold mt-0.5 bg-indigo-50/60 inline-block px-2 py-0.5 rounded-md">
//                                 {note.diagnosis}
//                               </p>
//                             </div>
//                             <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-150" />
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
