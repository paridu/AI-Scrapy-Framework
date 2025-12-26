
import React, { useState } from 'react';
import { Terminal, Search, Trash2, Filter, Sparkles, Loader2, Globe, ArrowRight } from 'lucide-react';
import { analyzeLog } from '../services/geminiService';

const LogViewer: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{text: string, sources: any[]} | null>(null);

  const mockLogs = [
    "[2024-05-20 10:15:02] [INFO] Scrapy 2.11.1 started",
    "[2024-05-20 10:15:03] [INFO] Spider opened: amazon",
    "[2024-05-20 10:15:04] [DEBUG] Crawled (200) <GET https://amazon.com/s?k=gaming+laptops>",
    "[2024-05-20 10:15:05] [WARNING] Selector 'div.s-result-item' missing in response, retrying...",
    "[2024-05-20 10:15:07] [ERROR] Scraper closed (403 Forbidden) - Likely Bot Detection",
    "[2024-05-20 10:15:08] [INFO] System: AI Auto-healing triggered. Analyzing HTML structure...",
  ];

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await analyzeLog(mockLogs.join('\n'));
      setAiAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold text-white">System Logs</h2>
          <p className="text-slate-400 mt-1">Real-time terminal output from Scrapyd nodes</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl flex items-center gap-2 transition-all border border-slate-700">
            <Trash2 className="w-4 h-4" /> Clear
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={analyzing}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI Diagnostics
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-400 tracking-wider uppercase">Scrapyd_Stdout_Node_A</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search logs..."
                className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 pl-7 text-[10px] text-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1">
            {mockLogs.map((log, i) => (
              <div key={i} className={`py-0.5 ${
                log.includes('[ERROR]') ? 'text-red-400' : 
                log.includes('[WARNING]') ? 'text-amber-400' : 
                log.includes('[INFO]') ? 'text-slate-500' : 'text-slate-300'
              }`}>
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-y-auto flex flex-col">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2 shrink-0">
            <Sparkles className="text-blue-400 w-5 h-5" /> Gemini AI Agent
          </h3>
          
          <div className="flex-1">
            {aiAnalysis ? (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-sm leading-relaxed text-slate-300">
                  {aiAnalysis.text}
                </div>
                
                {aiAnalysis.sources.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Grounding Sources
                    </p>
                    <div className="space-y-1.5">
                      {aiAnalysis.sources.map((src, idx) => (
                        <a 
                          key={idx}
                          href={src.web?.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-2 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/50 transition-all text-xs text-blue-400 truncate"
                        >
                          {src.web?.title || src.web?.uri}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <button className="w-full bg-blue-600/10 text-blue-400 border border-blue-600/20 py-3 rounded-xl text-xs font-bold hover:bg-blue-600/20 transition-all flex items-center justify-center gap-2">
                  Auto-Patch Identified Issues <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm max-w-[200px]">
                  Let Gemini investigate the logs and search for technical solutions.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800 shrink-0">
            <p className="text-[10px] text-slate-500 text-center font-medium italic">
              AI uses Search Grounding for HTTP Error research.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogViewer;
