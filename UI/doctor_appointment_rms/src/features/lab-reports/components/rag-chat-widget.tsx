"use client";

import { useState, useRef, useEffect } from "react";
import { useRagChat } from "../hooks/use-rag-chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiRobot2Line, RiSendPlaneLine, RiLoader4Line, RiSparklingLine } from "@remixicon/react"; // FIX 1: Corrected icon name
import ReactMarkdown from "react-markdown";

export const RagChatWidget = ({ patientId }: { patientId: string }) => {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { mutate: askAi, isPending } = useRagChat(patientId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isPending]);

  const handleSend = (forcedQuestion?: string) => {
    const textToSend = forcedQuestion || question;
    if (!textToSend.trim()) return;

    setHistory(prev => [...prev, { role: 'user', text: textToSend }]);
    if (!forcedQuestion) setQuestion("");

    askAi(textToSend, {
      onSuccess: (data) => {
        setHistory(prev => [...prev, { role: 'ai', text: data.answer }]);
      }
    });
  };

  return (
    <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm space-y-4 max-w-2xl mx-auto">
      {/* Widget Header Area */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <RiRobot2Line className="text-blue-600" size={22} />
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">AI Clinical Assistant</h3>
            <p className="text-xs text-slate-400">Cross-examining historical longitudinal reports</p>
          </div>
        </div>
        
        {/* Quick action helper button if chat history is empty */}
        {history.length === 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-blue-200 text-blue-600 bg-blue-50/50 hover:bg-blue-50 flex gap-1 items-center"
            onClick={() => handleSend("Provide a comprehensive clinical summary of my longitudinal data trends.")}
            disabled={isPending}
          >
            <RiSparklingLine size={14} />
            Generate History Report
          </Button>
        )}
      </div>
      
      {/* Scrollable Chat Window Area */}
      <div className="space-y-4 h-[400px] overflow-y-auto pr-2 scrollbar-thin">
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <p className="text-sm italic">No inquiries submitted yet.</p>
            <p className="text-xs max-w-xs mt-1">Ask questions about overall progress or click the button above to synthesize the historical baseline.</p>
          </div>
        )}
        
        {history.map((msg, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-xl text-sm leading-relaxed transition-all ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white ml-12 rounded-tr-none shadow-sm' 
                : 'bg-slate-50 border border-slate-200 text-slate-800 mr-12 rounded-tl-none'
            }`}
          >
            {msg.role === 'user' ? (
              <p className="whitespace-pre-wrap font-medium">{msg.text}</p>
            ) : (
              /* FIX 2: Wrapped in a standard div to clear the TypeScript contract issue */
              <div className="prose prose-sm max-w-none space-y-2 prose-headings:font-bold prose-headings:text-slate-900 prose-strong:text-slate-950 prose-ul:list-disc prose-ul:pl-4 text-slate-800">
                <ReactMarkdown>
                  {msg.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {/* Dynamic Loading Bubble */}
        {isPending && (
          <div className="bg-slate-50 border border-slate-200 text-slate-500 mr-12 rounded-xl rounded-tl-none p-4 font-medium text-xs flex items-center gap-2 animate-pulse">
            <RiLoader4Line className="animate-spin text-blue-600" size={16} />
            Analyzing patient chronological timeline matrices...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Action Form Block */}
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <Input 
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about historical developments or warning thresholds..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isPending}
          className="rounded-lg border-slate-200 focus-visible:ring-blue-500 text-sm"
        />
        <Button 
          onClick={() => handleSend()} 
          disabled={isPending || !question.trim()}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm rounded-lg"
        >
          {isPending ? <RiLoader4Line className="animate-spin" /> : <RiSendPlaneLine size={18} />}
        </Button>
      </div>
    </div>
  );
};