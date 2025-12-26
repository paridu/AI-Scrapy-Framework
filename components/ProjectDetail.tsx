
import React, { useState } from 'react';
import { ArrowLeft, Play, Pause, RefreshCw, Trash2, Code, History, Activity, Loader2, Sparkles, Cloud, Check } from 'lucide-react';
import { ScrapingProject } from '../types';
import { refactorSpider } from '../services/geminiService';

interface ProjectDetailProps {
  project: ScrapingProject;
  onUpdateStatus: (id: string, status: ScrapingProject['status']) => void;
  onUpdateCode: (id: string, code: string) => void;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onUpdateStatus, onUpdateCode, onBack }) => {
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [driveEnabled, setDriveEnabled] = useState(project.googleDriveEnabled || false);

  const mockActivity = [
    { time: '2 นาทีที่แล้ว', action: 'ดูดข้อมูลสำเร็จ 420 รายการ', result: 'Success' },
    { time: '1 ชั่วโมงที่แล้ว', action: 'รันงานประจำวัน', result: 'Success' },
    { time: 'เมื่อวาน', action: 'อัปโหลด CSV ไป Google Drive', result: 'Success' },
  ];

  const logsString = mockActivity.map(l => `[${l.time}] ${l.action} - Result: ${l.result}`).join('\n');

  const handleAIRefactor = async () => {
    setIsRefactoring(true);
    try {
      const updatedCode = await refactorSpider(project.spiderCode, logsString, project.intent);
      onUpdateCode(project.id, updatedCode);
    } catch (error) {
      console.error('Failed to refactor spider:', error);
    } finally {
      setIsRefactoring(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">{project.name}</h2>
            <p className="text-slate-400 mt-1 flex items-center gap-2 italic">
              เป้าหมาย: {project.intent}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setDriveEnabled(!driveEnabled)}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-semibold border ${
              driveEnabled 
              ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' 
              : 'bg-slate-800/50 text-slate-400 border-slate-700'
            }`}
          >
            <Cloud className="w-4 h-4" /> 
            {driveEnabled ? 'บันทึก Drive เปิดอยู่' : 'เปิดบันทึก Drive'}
          </button>

          {project.status === 'active' ? (
            <button 
              onClick={() => onUpdateStatus(project.id, 'paused')}
              className="bg-amber-600/10 text-amber-500 border border-amber-600/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-600/20 transition-all font-semibold"
            >
              <Pause className="w-4 h-4" /> หยุดชั่วคราว
            </button>
          ) : (
            <button 
              onClick={() => onUpdateStatus(project.id, 'active')}
              className="bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-600/20 transition-all font-semibold"
            >
              <Play className="w-4 h-4" /> เริ่มใหม่
            </button>
          )}
          <button className="bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-600/20 transition-all font-semibold">
            <Trash2 className="w-4 h-4" /> ลบโปรเจกต์
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-200">โค้ด Spider (Python)</span>
              </div>
              <button 
                onClick={handleAIRefactor}
                disabled={isRefactoring}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium px-2 py-1 rounded bg-blue-400/10 disabled:opacity-50 transition-all"
              >
                {isRefactoring ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RefreshCw className="w-3 h-3" />
                )}
                AI ปรับปรุงโค้ด
              </button>
            </div>
            <div className="p-6 font-mono text-sm overflow-x-auto text-blue-100 bg-slate-950 min-h-[300px] relative">
              {isRefactoring && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-10">
                  <Sparkles className="w-8 h-8 text-blue-400 animate-pulse mb-2" />
                  <p className="text-blue-400 font-medium">Gemini กำลังแก้ไขโค้ดของคุณ...</p>
                </div>
              )}
              <pre className="whitespace-pre-wrap">{project.spiderCode}</pre>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> กิจกรรมล่าสุด
            </h3>
            <div className="space-y-4">
              {mockActivity.map((log, i) => (
                <div key={i} className="flex items-center justify-between text-sm py-2 border-b border-slate-800/50 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-slate-200 font-medium">{log.action}</span>
                    <span className="text-slate-500 text-xs">{log.time}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${log.result === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                    {log.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl text-center">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">ความพร้อมของระบบ</h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <circle 
                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * project.health) / 100}
                    className={`${project.health > 80 ? 'text-emerald-500' : project.health > 50 ? 'text-amber-500' : 'text-red-500'} transition-all duration-1000`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{project.health}%</span>
                  <span className="text-[10px] text-slate-500 uppercase">Uptime</span>
                </div>
              </div>
            </div>
            {driveEnabled && (
              <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center gap-2 text-xs text-blue-400">
                <Check className="w-4 h-4" /> ระบบจะบันทึก CSV ลง Google Drive
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="font-semibold text-white mb-4">รายละเอียดการ Deploy</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Node Cluster</span>
                <span className="text-slate-200">scrapyd-primary-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">การใช้หน่วยความจำ</span>
                <span className="text-slate-200">142 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">เวอร์ชัน Spider</span>
                <span className="text-slate-200">v1.2.4-AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
