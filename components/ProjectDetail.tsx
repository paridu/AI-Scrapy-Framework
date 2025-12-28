
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RefreshCw, 
  Trash2, 
  Code, 
  Activity, 
  Loader2, 
  Sparkles, 
  Cloud, 
  Check, 
  Eye, 
  Table as TableIcon, 
  X,
  Download,
  ShieldCheck,
  Zap,
  Settings2,
  AlertTriangle,
  ToggleLeft as ToggleOff,
  ToggleRight as ToggleOn
} from 'lucide-react';
import { ScrapingProject } from '../types';
import { refactorSpider, generateMockResults } from '../services/geminiService';

interface ProjectDetailProps {
  project: ScrapingProject;
  onUpdateStatus: (id: string, status: ScrapingProject['status']) => void;
  onUpdateCode: (id: string, code: string) => void;
  onUpdateDriveSetting: (id: string, enabled: boolean) => void;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
  project, 
  onUpdateStatus, 
  onUpdateCode, 
  onUpdateDriveSetting,
  onBack 
}) => {
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Mock logs for diagnostics
  const mockActivity = [
    { time: '2 นาทีที่แล้ว', action: `ตรวจพบข้อมูลใหม่ และดึงสำเร็จรวม 94,016 รายการ`, result: 'Success' },
    { time: '1 ชั่วโมงที่แล้ว', action: 'เริ่มรันงานประจำวัน (Daily Full Crawl)', result: 'Success' },
    { time: 'เมื่อวาน', action: 'ส่งออกไฟล์ CSV ชุดใหญ่ไปยัง Google Drive', result: 'Success' },
  ];

  const logsString = mockActivity.map(l => `[${l.time}] ${l.action} - Result: ${l.result}`).join('\n');

  // Check if the current code likely lacks Drive integration logic while enabled
  const needsRefactor = useMemo(() => {
    if (project.googleDriveEnabled && !project.spiderCode.includes('GoogleDrivePipeline') && !project.spiderCode.includes('pydrive2')) {
      return true;
    }
    return false;
  }, [project.googleDriveEnabled, project.spiderCode]);

  const handleAIRefactor = async () => {
    setIsRefactoring(true);
    try {
      const updatedCode = await refactorSpider(
        project.spiderCode, 
        logsString, 
        project.intent, 
        project.googleDriveEnabled
      );
      
      if (updatedCode) {
        onUpdateCode(project.id, updatedCode);
      }
    } catch (error) {
      console.error('Failed to refactor spider:', error);
      alert('เกิดข้อผิดพลาดในการปรับปรุงโค้ด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsRefactoring(false);
    }
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    setShowPreview(true);
    try {
      const results = await generateMockResults(project.spiderCode, project.intent);
      setPreviewData(results);
    } catch (error) {
      console.error('Failed to generate preview:', error);
      setPreviewData([]);
    } finally {
      setIsPreviewing(false);
    }
  };

  const getTableHeaders = () => {
    if (!previewData || previewData.length === 0) return [];
    const keys = new Set<string>();
    previewData.forEach(item => {
      Object.keys(item).forEach(key => keys.add(key));
    });
    return Array.from(keys);
  };

  const headers = getTableHeaders();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{project.name}</h2>
            <p className="text-slate-400 mt-1 flex items-center gap-2 italic text-sm">
              เป้าหมาย: {project.intent}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handlePreview}
            disabled={isPreviewing}
            className="bg-purple-600/10 text-purple-400 border border-purple-600/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-purple-600/20 transition-all font-semibold text-sm disabled:opacity-50"
          >
            {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            ดูตัวอย่างข้อมูล
          </button>

          {project.status === 'active' ? (
            <button 
              onClick={() => onUpdateStatus(project.id, 'paused')}
              className="bg-amber-600/10 text-amber-500 border border-amber-600/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-amber-600/20 transition-all font-semibold text-sm"
            >
              <Pause className="w-4 h-4" /> หยุด
            </button>
          ) : (
            <button 
              onClick={() => onUpdateStatus(project.id, 'active')}
              className="bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-600/20 transition-all font-semibold text-sm"
            >
              <Play className="w-4 h-4" /> เริ่ม
            </button>
          )}
          <button className="bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-red-600/20 transition-all font-semibold text-sm">
            <Trash2 className="w-4 h-4" /> ลบ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Google Drive Control Panel */}
          <div className={`border p-5 rounded-2xl transition-all shadow-xl ${
            project.googleDriveEnabled ? 'bg-blue-600/5 border-blue-500/30' : 'bg-slate-900/50 border-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${project.googleDriveEnabled ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Google Drive Integration</h3>
                  <p className="text-slate-400 text-xs">บันทึกผลลัพธ์เป็น CSV ลง Drive อัตโนมัติ</p>
                </div>
              </div>
              <button 
                onClick={() => onUpdateDriveSetting(project.id, !project.googleDriveEnabled)}
                className="focus:outline-none transition-transform active:scale-95"
              >
                {project.googleDriveEnabled ? (
                  <ToggleOn className="w-10 h-10 text-blue-500" />
                ) : (
                  <ToggleOff className="w-10 h-10 text-slate-600" />
                )}
              </button>
            </div>
            
            {project.googleDriveEnabled && (
              <div className={`p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
                needsRefactor ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/5 border-blue-500/10'
              }`}>
                <div className="flex items-start gap-3">
                  {needsRefactor ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${needsRefactor ? 'text-amber-400' : 'text-blue-400'}`}>
                      {needsRefactor ? 'ตรวจพบโค้ดไม่สอดคล้องกับการตั้งค่า' : 'โค้ด Spider พร้อมใช้งานกับ Drive'}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {needsRefactor 
                        ? 'โค้ดปัจจุบันยังไม่มีส่วนการส่งออกข้อมูลไป Drive โปรดใช้ AI ปรับปรุงโค้ด' 
                        : 'ระบบจะอัปโหลดข้อมูลไปยังโฟลเดอร์ AI-Scrapy-Exports หลังรันเสร็จ'}
                    </p>
                    {needsRefactor && (
                      <button 
                        onClick={handleAIRefactor}
                        disabled={isRefactoring}
                        className="mt-3 bg-amber-500 hover:bg-amber-400 text-slate-900 text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                      >
                        {isRefactoring ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        Refactor Code ทันที
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-emerald-400 font-bold text-sm">AHP Readiness: High</p>
              <p className="text-slate-400 text-xs">ข้อมูลมีคุณลักษณะ (Attributes) ครบถ้วนสำหรับการวิเคราะห์ความสัมพันธ์เชิงพหุ</p>
            </div>
            <Zap className="w-4 h-4 text-amber-400 ml-auto animate-pulse" />
          </div>

          {showPreview && (
            <div className="bg-slate-900 border border-purple-500/30 rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-300">
              <div className="px-6 py-4 bg-purple-600/10 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-purple-200 text-sm">ตัวอย่างผลลัพธ์ข้อมูลสำหรับการทำ AHP (Batch View)</span>
                </div>
                <div className="flex items-center gap-2">
                   {!isPreviewing && previewData.length > 0 && (
                    <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium bg-purple-400/10 px-2 py-1 rounded transition-all">
                      <Download className="w-3 h-3" /> Export All (94,016)
                    </button>
                   )}
                  <button onClick={() => setShowPreview(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-0 overflow-x-auto max-h-[400px]">
                {isPreviewing ? (
                  <div className="p-20 flex flex-col items-center justify-center gap-4">
                    <div className="relative">
                      <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                      <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <p className="text-purple-300 font-medium tracking-wide">AI กำลังจำลองข้อมูลตามโค้ดของคุณ...</p>
                      <p className="text-slate-500 text-xs mt-1">วิเคราะห์ความสัมพันธ์ของ Intent และ Selector ใน Spider</p>
                    </div>
                  </div>
                ) : previewData.length > 0 ? (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-950 border-b border-slate-800">
                      <tr>
                        {headers.map((key) => (
                          <th key={key} className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-tighter text-[11px]">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {previewData.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                          {headers.map((header, j) => (
                            <td key={j} className="px-4 py-3 text-slate-300 font-medium truncate max-w-[200px]">
                              {String(row[header] ?? '-')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
                    <TableIcon className="w-8 h-8 opacity-20" />
                    <p>ไม่พบข้อมูลตัวอย่าง ลองปรับปรุงโค้ด Spider</p>
                  </div>
                )}
              </div>
              <div className="px-6 py-2 bg-purple-600/5 text-[10px] text-purple-400 font-medium italic border-t border-slate-800">
                * แสดงผลตัวอย่าง 5 จากทั้งหมด 94,016 รายการ เพื่อความรวดเร็วในการตรวจสอบ Selector
              </div>
            </div>
          )}

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-slate-200">โค้ด Spider (Python)</span>
              </div>
              <div className="flex items-center gap-2">
                {project.googleDriveEnabled && (
                  <span className="flex items-center gap-1 text-[10px] text-blue-400 font-bold bg-blue-400/10 px-2 py-0.5 rounded border border-blue-400/20">
                    <Cloud className="w-3 h-3" /> Drive Enabled
                  </span>
                )}
                <button 
                  onClick={handleAIRefactor}
                  disabled={isRefactoring}
                  className={`text-xs flex items-center gap-1 font-medium px-2 py-1 rounded transition-all border ${
                    needsRefactor 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                    : 'bg-blue-400/10 text-blue-400 border-blue-400/10 hover:bg-blue-400/20'
                  } disabled:opacity-50`}
                >
                  {isRefactoring ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3 h-3" />
                  )}
                  AI ปรับปรุงโค้ด
                </button>
              </div>
            </div>
            <div className="p-6 font-mono text-sm overflow-x-auto text-blue-100 bg-slate-950 min-h-[400px] relative group">
              {isRefactoring && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center z-10 backdrop-blur-sm">
                  <div className="bg-slate-900 border border-blue-500/30 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Sparkles className="w-12 h-12 text-blue-400 animate-pulse" />
                      <Loader2 className="w-16 h-16 text-blue-500/20 absolute -top-2 -left-2 animate-spin" />
                    </div>
                    <p className="text-blue-400 font-bold text-lg tracking-wide mb-2">Gemini กำลัง Refactor โค้ดของคุณ</p>
                    <p className="text-slate-500 text-sm max-w-[250px]">
                      วิเคราะห์ Log ล่าสุด บูรณาการตรรกะ {project.googleDriveEnabled ? 'Google Drive' : ''} และซ่อมแซม Selector อัตโนมัติ...
                    </p>
                  </div>
                </div>
              )}
              <pre className="whitespace-pre-wrap select-all">{project.spiderCode}</pre>
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
            {project.googleDriveEnabled && (
              <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center gap-2 text-xs text-blue-400 text-left">
                <Check className="w-4 h-4 shrink-0" /> ระบบบันทึกลง Google Drive พร้อมใช้งาน
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">รายละเอียดการ Deploy</h3>
              <Settings2 className="w-4 h-4 text-slate-500" />
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Node Cluster</span>
                <span className="text-slate-200">scrapyd-primary-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">จำนวนแถวที่ค้นพบ</span>
                <span className="text-white font-bold">94,016 Items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Drive Sync</span>
                <span className={`font-bold ${project.googleDriveEnabled ? 'text-blue-400' : 'text-slate-500'}`}>
                  {project.googleDriveEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">เวอร์ชัน Spider</span>
                <span className="text-slate-200">ahp-analyzer-v2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
