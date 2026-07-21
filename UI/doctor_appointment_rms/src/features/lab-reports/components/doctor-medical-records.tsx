// 'use client';

// import React, { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { useDoctorPatientSearch, useDoctorPatientReports } from '../hooks/use-doctor-lab-reports';
// import { PatientSearchResult, LabReportResponse } from '../types/lab-reports.types';
// import { 
//   RiSearchLine, 
//   RiUserSearchLine, 
//   RiArrowLeftLine, 
//   RiCheckboxCircleLine, 
//   RiPulseLine,
//   RiArrowRightSLine,
//   RiUser3Line
// } from '@remixicon/react';

// export function DoctorMedicalRecords() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);

//   const { data: patients, isLoading: searchLoading } = useDoctorPatientSearch(searchTerm);
//   const { data: reports, isLoading: reportsLoading } = useDoctorPatientReports(selectedPatient?.id ?? null);

//   const getStatusBadge = (isAbnormal: boolean) => {
//     if (isAbnormal) {
//       return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 shadow-none hover:bg-amber-50 flex items-center gap-1 w-fit"><RiPulseLine className="w-3.5 h-3.5" /> Abnormal</Badge>;
//     }
//     return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none hover:bg-emerald-50 flex items-center gap-1 w-fit"><RiCheckboxCircleLine className="w-3.5 h-3.5" /> Normal</Badge>;
//   };

//   if (!selectedPatient) {
//     return (
//       <div className="p-6 space-y-6">
//         <div className="max-w-md relative">
//           <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
//           <Input
//             type="search"
//             placeholder="Search patient registry (Type names, emails)..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-9 border-slate-200 focus-visible:ring-blue-500 h-10 shadow-sm"
//           />
//         </div>

//         {searchLoading && <div className="text-sm text-slate-500 py-4 flex items-center gap-2"><RiPulseLine className="animate-spin w-4 h-4 text-blue-600" /> Finding matches...</div>}

//         {patients && patients.length > 0 ? (
//           <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
//             <Table>
//               <TableHeader className="bg-slate-50/70 border-b border-slate-200">
//                 <TableRow className="hover:bg-transparent">
//                   <TableHead className="text-slate-700 font-semibold h-11">Patient Name</TableHead>
//                   <TableHead className="text-slate-700 font-semibold h-11">Date of Birth</TableHead>
//                   <TableHead className="text-slate-700 font-semibold h-11">Contact Details</TableHead>
//                   <TableHead className="text-right text-slate-700 font-semibold h-11 pr-6">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {patients.map((patient: PatientSearchResult) => {
//                   const displayName = patient.name || 'Unknown Patient';
//                   const initial = displayName.charAt(0).toUpperCase();

//                   return (
//                     <TableRow 
//                       key={patient.id} 
//                       className="hover:bg-blue-50/40 cursor-pointer transition-all duration-150 group"
//                       onClick={() => setSelectedPatient(patient)}
//                     >
//                       <TableCell className="py-3.5">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
//                             {initial || <RiUser3Line className="w-4 h-4" />}
//                           </div>
//                           <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
//                             {displayName}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-slate-600 py-3.5">
//                         {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
//                       </TableCell>
//                       <TableCell className="py-3.5">
//                         <div className="text-xs text-slate-500 font-medium">{patient.email ?? 'No email'}</div>
//                         <div className="text-xs text-slate-400 mt-0.5">{patient.phoneNumber ?? 'No phone'}</div>
//                       </TableCell>
//                       <TableCell className="text-right py-3.5 pr-6">
//                         <div className="flex items-center justify-end gap-1">
//                           <Button 
//                             size="sm" 
//                             variant="ghost" 
//                             className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 opacity-80 group-hover:opacity-100 font-medium"
//                           >
//                             Open Records
//                           </Button>
//                           <RiArrowRightSLine className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//         ) : searchTerm.length >= 2 && !searchLoading ? (
//           <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
//             <RiUserSearchLine className="w-8 h-8 text-slate-300 mx-auto mb-2" />
//             <p className="text-sm text-slate-500">No matching clinical records found.</p>
//           </div>
//         ) : (
//           <div className="text-slate-400 text-sm py-4">Enter a search query above to look up health records.</div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5" onClick={() => setSelectedPatient(null)}>
//           <RiArrowLeftLine className="w-4 h-4" /> Return to Search Registry
//         </Button>
//       </div>

//       {/* Adjusted grid to 3 clean columns to accommodate the removal of Gender */}
//       <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
//         <div>
//           <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Patient Case File</span>
//           <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedPatient.name}</h3>
//         </div>
//         <div>
//           <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Date of Birth</span>
//           <p className="text-sm text-slate-700 mt-0.5">
//             {selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
//           </p>
//         </div>
//         <div>
//           <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Record Identifier</span>
//           <p className="text-sm font-mono text-slate-500 mt-0.5">{selectedPatient.id ? selectedPatient.id.slice(0, 8).toUpperCase() : 'N/A'}</p>
//         </div>
//       </div>

//       <div className="space-y-3">
//         <h3 className="text-base font-semibold text-slate-900">Diagnostic Reports & Panels</h3>
//         {reportsLoading ? (
//           <div className="text-sm text-slate-500 py-8 flex items-center gap-2 justify-center"><RiPulseLine className="animate-spin w-4 h-4 text-blue-600" /> Retrieving metrics from lab registry...</div>
//         ) : reports && reports.length > 0 ? (
//           <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
//             <Table>
//               <TableHeader className="bg-slate-50/70 border-b border-slate-200">
//                 <TableRow className="hover:bg-transparent">
//                   <TableHead className="text-slate-700 font-semibold h-11">Panel / Lab Source</TableHead>
//                   <TableHead className="text-slate-700 font-semibold h-11">Test Item Summary</TableHead>
//                   <TableHead className="text-slate-700 font-semibold h-11">Collected Date</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {reports.map((report: LabReportResponse) => (
//                   <TableRow key={report.id} className="hover:bg-slate-50/30 transition-colors">
//                     <TableCell className="font-semibold text-slate-900 py-3">
//                       <div>{report.panelName}</div>
//                       <div className="text-xs font-normal text-slate-400 mt-0.5">{report.labName}</div>
//                     </TableCell>
//                     <TableCell className="py-3">
//                       <div className="space-y-1.5 max-w-xl py-1">
//                         {report.observations?.map((obs, index) => (
//                           <div key={index} className="flex items-center gap-3 text-sm border-b border-slate-100/60 pb-1 last:border-none">
//                             <span className="text-slate-700 font-medium min-w-[140px]">{obs.testName}:</span>
//                             <span className="font-mono font-semibold text-slate-900">{obs.value} {obs.unit}</span>
//                             <span className="text-xs text-slate-400 font-mono">(Ref: {obs.referenceRange})</span>
//                             {getStatusBadge(obs.isAbnormal)}
//                           </div>
//                         ))}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-slate-500 text-sm whitespace-nowrap py-3">
//                       {report.observationDateTime ? new Date(report.observationDateTime).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         ) : (
//           <div className="text-slate-500 text-sm py-6 text-center border rounded-xl">No telemetry or lab observations recorded for this patient.</div>
//         )}
//       </div>
//     </div>
//   );
// }

// 'use client';

// import React, { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { RagChatWidget } from './rag-chat-widget'; // Ensure this path is correct
// import { useDoctorPatientSearch, useDoctorPatientReports } from '../hooks/use-doctor-lab-reports';
// import { PatientSearchResult, LabReportResponse } from '../types/lab-reports.types';
// import { 
//   RiSearchLine, 
//   RiUserSearchLine, 
//   RiArrowLeftLine, 
//   RiCheckboxCircleLine, 
//   RiPulseLine,
//   RiArrowRightSLine,
//   RiUser3Line,
//   RiRobot2Line
// } from '@remixicon/react';

// export function DoctorMedicalRecords() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
//   const [activeReportForChat, setActiveReportForChat] = useState<LabReportResponse | null>(null);

//   const { data: patients, isLoading: searchLoading } = useDoctorPatientSearch(searchTerm);
//   const { data: reports, isLoading: reportsLoading } = useDoctorPatientReports(selectedPatient?.id ?? null);

//   const getStatusBadge = (isAbnormal: boolean) => {
//     if (isAbnormal) {
//       return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 shadow-none hover:bg-amber-50 flex items-center gap-1 w-fit"><RiPulseLine className="w-3.5 h-3.5" /> Abnormal</Badge>;
//     }
//     return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none hover:bg-emerald-50 flex items-center gap-1 w-fit"><RiCheckboxCircleLine className="w-3.5 h-3.5" /> Normal</Badge>;
//   };

//   if (!selectedPatient) {
//     return (
//       <div className="p-6 space-y-6">
//         <div className="max-w-md relative">
//           <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
//           <Input
//             type="search"
//             placeholder="Search patient registry (Type names, emails)..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-9 border-slate-200 focus-visible:ring-blue-500 h-10 shadow-sm"
//           />
//         </div>

//         {searchLoading && <div className="text-sm text-slate-500 py-4 flex items-center gap-2"><RiPulseLine className="animate-spin w-4 h-4 text-blue-600" /> Finding matches...</div>}

//         {patients && patients.length > 0 ? (
//           <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
//             <Table>
//               <TableHeader className="bg-slate-50/70 border-b border-slate-200">
//                 <TableRow className="hover:bg-transparent">
//                   <TableHead className="text-slate-700 font-semibold h-11">Patient Name</TableHead>
//                   <TableHead className="text-slate-700 font-semibold h-11">Date of Birth</TableHead>
//                   <TableHead className="text-slate-700 font-semibold h-11">Contact Details</TableHead>
//                   <TableHead className="text-right text-slate-700 font-semibold h-11 pr-6">Action</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {patients.map((patient: PatientSearchResult) => {
//                   const displayName = patient.name || 'Unknown Patient';
//                   const initial = displayName.charAt(0).toUpperCase();

//                   return (
//                     <TableRow 
//                       key={patient.id} 
//                       className="hover:bg-blue-50/40 cursor-pointer transition-all duration-150 group"
//                       onClick={() => setSelectedPatient(patient)}
//                     >
//                       <TableCell className="py-3.5">
//                         <div className="flex items-center gap-3">
//                           <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
//                             {initial || <RiUser3Line className="w-4 h-4" />}
//                           </div>
//                           <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
//                             {displayName}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-slate-600 py-3.5">
//                         {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
//                       </TableCell>
//                       <TableCell className="py-3.5">
//                         <div className="text-xs text-slate-500 font-medium">{patient.email ?? 'No email'}</div>
//                         <div className="text-xs text-slate-400 mt-0.5">{patient.phoneNumber ?? 'No phone'}</div>
//                       </TableCell>
//                       <TableCell className="text-right py-3.5 pr-6">
//                         <div className="flex items-center justify-end gap-1">
//                           <Button 
//                             size="sm" 
//                             variant="ghost" 
//                             className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 opacity-80 group-hover:opacity-100 font-medium"
//                           >
//                             Open Records
//                           </Button>
//                           <RiArrowRightSLine className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//         ) : searchTerm.length >= 2 && !searchLoading ? (
//           <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
//             <RiUserSearchLine className="w-8 h-8 text-slate-300 mx-auto mb-2" />
//             <p className="text-sm text-slate-500">No matching clinical records found.</p>
//           </div>
//         ) : (
//           <div className="text-slate-400 text-sm py-4">Enter a search query above to look up health records.</div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5" onClick={() => setSelectedPatient(null)}>
//           <RiArrowLeftLine className="w-4 h-4" /> Return to Search Registry
//         </Button>
//       </div>

//       <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6">
//         <div>
//           <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Patient Case File</span>
//           <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedPatient.name}</h3>
//         </div>
//         <div>
//           <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Date of Birth</span>
//           <p className="text-sm text-slate-700 mt-0.5">
//             {selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
//           </p>
//         </div>
//         <div>
//           <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Record Identifier</span>
//           <p className="text-sm font-mono text-slate-500 mt-0.5">{selectedPatient.id ? selectedPatient.id.slice(0, 8).toUpperCase() : 'N/A'}</p>
//         </div>
//       </div>

//       <div className="space-y-3">
//         <h3 className="text-base font-semibold text-slate-900">Diagnostic Reports & Panels</h3>
//         {reportsLoading ? (
//           <div className="text-sm text-slate-500 py-8 flex items-center gap-2 justify-center"><RiPulseLine className="animate-spin w-4 h-4 text-blue-600" /> Retrieving metrics from lab registry...</div>
//         ) : reports && reports.length > 0 ? (
//           <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
//             <Table>
//               <TableHeader className="bg-slate-50/70 border-b border-slate-200">
//                 <TableRow className="hover:bg-transparent">
//                   <TableHead className="text-slate-700 font-semibold h-11">Panel / Lab Source</TableHead>
//                   <TableHead className="text-slate-700 font-semibold h-11">Test Item Summary</TableHead>
//                   <TableHead className="text-slate-700 font-semibold h-11">Collected Date</TableHead>
//                   <TableHead className="text-right text-slate-700 font-semibold h-11 pr-6">AI Insight</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {reports.map((report: LabReportResponse) => (
//                   <TableRow key={report.id} className="hover:bg-slate-50/30 transition-colors">
//                     <TableCell className="font-semibold text-slate-900 py-3">
//                       <div>{report.panelName}</div>
//                       <div className="text-xs font-normal text-slate-400 mt-0.5">{report.labName}</div>
//                     </TableCell>
//                     <TableCell className="py-3">
//                       <div className="space-y-1.5 max-w-xl py-1">
//                         {report.observations?.map((obs, index) => (
//                           <div key={index} className="flex items-center gap-3 text-sm border-b border-slate-100/60 pb-1 last:border-none">
//                             <span className="text-slate-700 font-medium min-w-[140px]">{obs.testName}:</span>
//                             <span className="font-mono font-semibold text-slate-900">{obs.value} {obs.unit}</span>
//                             <span className="text-xs text-slate-400 font-mono">(Ref: {obs.referenceRange})</span>
//                             {getStatusBadge(obs.isAbnormal)}
//                           </div>
//                         ))}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-slate-500 text-sm whitespace-nowrap py-3">
//                       {report.observationDateTime ? new Date(report.observationDateTime).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
//                     </TableCell>
//                     <TableCell className="text-right pr-6">
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         className="gap-2 text-blue-700 border-blue-200 hover:bg-blue-50"
//                         onClick={() => setActiveReportForChat(report)}
//                       >
//                         <RiRobot2Line className="w-4 h-4" />
//                         Ask AI
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         ) : (
//           <div className="text-slate-500 text-sm py-6 text-center border rounded-xl">No telemetry or lab observations recorded for this patient.</div>
//         )}
//       </div>

//       {/* RAG Chat Dialog */}
//       <Dialog open={!!activeReportForChat} onOpenChange={() => setActiveReportForChat(null)}>
//   <DialogContent className="max-w-lg">
//     <DialogHeader>
//       <DialogTitle>AI Clinical Assistant</DialogTitle>
//     </DialogHeader>
//     {/* Ensure you are passing the patientId here */}
//     {activeReportForChat && (
//       <RagChatWidget patientId={selectedPatient.id} />
//     )}
//   </DialogContent>
// </Dialog>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RagChatWidget } from './rag-chat-widget'; // Ensure this path is correct
import { useDoctorPatientSearch, useDoctorPatientReports } from '../hooks/use-doctor-lab-reports';
import { PatientSearchResult, LabReportResponse } from '../types/lab-reports.types';
import { 
  RiSearchLine, 
  RiUserSearchLine, 
  RiArrowLeftLine, 
  RiCheckboxCircleLine, 
  RiPulseLine,
  RiArrowRightSLine,
  RiUser3Line,
  RiRobot2Line
} from '@remixicon/react';

export function DoctorMedicalRecords() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
  
  // Updated from activeReportForChat to a global boolean toggle
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { data: patients, isLoading: searchLoading } = useDoctorPatientSearch(searchTerm);
  const { data: reports, isLoading: reportsLoading } = useDoctorPatientReports(selectedPatient?.id ?? null);

  const getStatusBadge = (isAbnormal: boolean) => {
    if (isAbnormal) {
      return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 shadow-none hover:bg-amber-50 flex items-center gap-1 w-fit"><RiPulseLine className="w-3.5 h-3.5" /> Abnormal</Badge>;
    }
    return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-none hover:bg-emerald-50 flex items-center gap-1 w-fit"><RiCheckboxCircleLine className="w-3.5 h-3.5" /> Normal</Badge>;
  };

  if (!selectedPatient) {
    return (
      <div className="p-6 space-y-6">
        <div className="max-w-md relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search patient registry (Type names, emails)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-slate-200 focus-visible:ring-blue-500 h-10 shadow-sm"
          />
        </div>

        {searchLoading && <div className="text-sm text-slate-500 py-4 flex items-center gap-2"><RiPulseLine className="animate-spin w-4 h-4 text-blue-600" /> Finding matches...</div>}

        {patients && patients.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <Table>
              <TableHeader className="bg-slate-50/70 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-700 font-semibold h-11">Patient Name</TableHead>
                  <TableHead className="text-slate-700 font-semibold h-11">Date of Birth</TableHead>
                  <TableHead className="text-slate-700 font-semibold h-11">Contact Details</TableHead>
                  <TableHead className="text-right text-slate-700 font-semibold h-11 pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient: PatientSearchResult) => {
                  const displayName = patient.name || 'Unknown Patient';
                  const initial = displayName.charAt(0).toUpperCase();

                  return (
                    <TableRow 
                      key={patient.id} 
                      className="hover:bg-blue-50/40 cursor-pointer transition-all duration-150 group"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <TableCell className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-semibold text-xs flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-colors">
                            {initial || <RiUser3Line className="w-4 h-4" />}
                          </div>
                          <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {displayName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600 py-3.5">
                        {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <div className="text-xs text-slate-500 font-medium">{patient.email ?? 'No email'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{patient.phoneNumber ?? 'No phone'}</div>
                      </TableCell>
                      <TableCell className="text-right py-3.5 pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 opacity-80 group-hover:opacity-100 font-medium"
                          >
                            Open Records
                          </Button>
                          <RiArrowRightSLine className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : searchTerm.length >= 2 && !searchLoading ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
            <RiUserSearchLine className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No matching clinical records found.</p>
          </div>
        ) : (
          <div className="text-slate-400 text-sm py-4">Enter a search query above to look up health records.</div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 flex items-center gap-1.5" onClick={() => setSelectedPatient(null)}>
          <RiArrowLeftLine className="w-4 h-4" /> Return to Search Registry
        </Button>
      </div>

      {/* Patient Header Box with Global AI Assistant Button */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-grow">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Patient Case File</span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedPatient.name}</h3>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Date of Birth</span>
            <p className="text-sm text-slate-700 mt-0.5">
              {selectedPatient.dateOfBirth ? new Date(selectedPatient.dateOfBirth).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Record Identifier</span>
            <p className="text-sm font-mono text-slate-500 mt-0.5">{selectedPatient.id ? selectedPatient.id.slice(0, 8).toUpperCase() : 'N/A'}</p>
          </div>
        </div>
        
        <div className="flex items-center md:border-l md:border-slate-200 md:pl-6">
          <Button 
            onClick={() => setIsChatOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-sm"
          >
            <RiRobot2Line className="w-4 h-4" />
            Ask AI Assistant
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900">Diagnostic Reports & Panels</h3>
        {reportsLoading ? (
          <div className="text-sm text-slate-500 py-8 flex items-center gap-2 justify-center"><RiPulseLine className="animate-spin w-4 h-4 text-blue-600" /> Retrieving metrics from lab registry...</div>
        ) : reports && reports.length > 0 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">
            <Table>
              <TableHeader className="bg-slate-50/70 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-700 font-semibold h-11">Panel / Lab Source</TableHead>
                  <TableHead className="text-slate-700 font-semibold h-11">Test Item Summary</TableHead>
                  <TableHead className="text-slate-700 font-semibold h-11">Collected Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report: LabReportResponse) => (
                  <TableRow key={report.id} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell className="font-semibold text-slate-900 py-3">
                      <div>{report.panelName}</div>
                      <div className="text-xs font-normal text-slate-400 mt-0.5">{report.labName}</div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="space-y-1.5 max-w-xl py-1">
                        {report.observations?.map((obs, index) => (
                          <div key={index} className="flex items-center gap-3 text-sm border-b border-slate-100/60 pb-1 last:border-none">
                            <span className="text-slate-700 font-medium min-w-[140px]">{obs.testName}:</span>
                            <span className="font-mono font-semibold text-slate-900">{obs.value} {obs.unit}</span>
                            <span className="text-xs text-slate-400 font-mono">(Ref: {obs.referenceRange})</span>
                            {getStatusBadge(obs.isAbnormal)}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500 text-sm whitespace-nowrap py-3">
                      {report.observationDateTime ? new Date(report.observationDateTime).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-slate-500 text-sm py-6 text-center border rounded-xl">No telemetry or lab observations recorded for this patient.</div>
        )}
      </div>

      {/* Upgraded RAG Chat Dialog tied to global toggle */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Clinical Assistant</DialogTitle>
          </DialogHeader>
          {isChatOpen && selectedPatient?.id && (
            <RagChatWidget patientId={selectedPatient.id} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}