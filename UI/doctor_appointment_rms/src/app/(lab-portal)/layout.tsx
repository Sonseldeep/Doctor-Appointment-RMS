export default function LabPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
            L
          </div>
          <div>
            <h1 className="font-bold text-slate-800 tracking-tight leading-tight">
              Lab Partner Medilink
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Medical Report Ingestion System
            </p>
          </div>
        </div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-200">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-400">
            <path d="M7 2V4H8V8.46048L5.05193 13.3745C4.67389 14.0046 4.78913 14.8105 5.34211 15.3135C5.55627 15.5082 5.83401 15.6176 6.12217 15.6176H17.8778C18.5682 15.6176 19.1278 15.058 19.1278 14.3676C19.1278 14.0795 19.0184 13.8017 18.8237 13.5876L16 8.46048V4H17V2H7ZM11 15.6176H8.71887L11 11.8159V15.6176ZM13 15.6176V11.8159L15.2811 15.6176H13Z"></path>
          </svg>
          SECURE WORKSPACE
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}