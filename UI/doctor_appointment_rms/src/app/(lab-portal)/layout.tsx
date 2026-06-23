export default function LabPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="font-bold text-slate-800 tracking-tight">Lab Partner Portal</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
          Partner Workspace
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto py-8">
        {children}
      </main>
    </div>
  );
}