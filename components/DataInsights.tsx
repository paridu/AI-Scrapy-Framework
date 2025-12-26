
import React from 'react';
// Added ArrowRight to imports to fix the reported error
import { BarChart3, TrendingUp, PieChart, Info, ArrowRight } from 'lucide-react';
import { ScrapingProject } from '../types';

interface DataInsightsProps {
  projects: ScrapingProject[];
}

const DataInsights: React.FC<DataInsightsProps> = ({ projects }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white">Data Insights</h2>
        <p className="text-slate-400 mt-1">AI-processed trends and anomalies from your scraped data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placeholder Charts */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <TrendingUp className="text-blue-400 w-5 h-5" /> Volume Trends
            </h3>
            <select className="bg-slate-800 text-xs border border-slate-700 rounded-lg px-2 py-1 text-slate-300">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {[45, 60, 40, 80, 95, 70, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-600/20 rounded-t-lg relative group transition-all hover:bg-blue-600/40">
                <div 
                  className="bg-blue-600 rounded-t-lg transition-all duration-1000 ease-out absolute bottom-0 w-full" 
                  style={{ height: `${h}%` }}
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-[10px] px-2 py-1 rounded text-white whitespace-nowrap">
                  {h * 10} units
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-xl flex flex-col">
          <h3 className="font-semibold text-white mb-8 flex items-center gap-2">
            <PieChart className="text-purple-400 w-5 h-5" /> Domain Distribution
          </h3>
          <div className="flex-1 flex items-center justify-center gap-12">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-blue-600/20" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray="440" strokeDashoffset="110" className="text-blue-600" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray="440" strokeDashoffset="330" className="text-purple-500" />
              </svg>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Amazon</span>
                  <span className="text-sm font-bold text-white">75%</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">TechCrunch</span>
                  <span className="text-sm font-bold text-white">25%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-6 flex gap-4 items-start">
        <Info className="w-6 h-6 text-blue-400 shrink-0" />
        <div>
          <h4 className="font-semibold text-blue-400">AI Anomaly Detected</h4>
          <p className="text-sm text-slate-300 mt-1">
            We noticed a sudden 40% drop in item availability for the 'Gaming Laptop' project. This might indicate a supply chain shift or a target site structure change that bypassed local selectors.
          </p>
          <button className="mt-3 text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
            Run AI Diagnostic <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataInsights;
