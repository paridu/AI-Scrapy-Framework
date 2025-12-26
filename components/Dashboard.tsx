
import React from 'react';
import { Plus, Play, Pause, AlertCircle, CheckCircle2, MoreVertical, ExternalLink, Database, Sparkles } from 'lucide-react';
import { ScrapingProject } from '../types';

interface DashboardProps {
  projects: ScrapingProject[];
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ projects, onSelectProject, onAddProject }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">ภาพรวมโปรเจกต์</h2>
          <p className="text-slate-400 mt-1">จัดการและตรวจสอบสถานะ Spider ของคุณ</p>
        </div>
        <button 
          onClick={onAddProject}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus className="w-5 h-5" />
          สร้างโปรเจกต์ AI ใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'ข้อมูลที่ดูดแล้วทั้งหมด', value: '1.2M+', color: 'text-blue-400' },
          { label: 'Spider ที่ทำงานอยู่', value: projects.filter(p => p.status === 'active').length.toString(), color: 'text-emerald-400' },
          { label: 'ความพร้อมระบบ', value: '99.4%', color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl shadow-inner">
            <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/40">
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">ชื่อโปรเจกต์</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">สถานะ</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">สุขภาพ</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">รันล่าสุด</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {projects.map((project) => (
              <tr 
                key={project.id} 
                className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                onClick={() => onSelectProject(project.id)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-slate-700 transition-colors relative">
                      <Database className="w-5 h-5 text-blue-400" />
                      {project.id.startsWith('demo-') && (
                        <div className="absolute -top-1 -right-1">
                          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center gap-2">
                        {project.name}
                        {project.id.startsWith('demo-') && (
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter">Demo</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[200px]">{project.targetUrl}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    project.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  }`}>
                    {project.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {project.status === 'active' ? 'กำลังทำงาน' : project.status === 'failed' ? 'ล้มเหลว' : 'หยุดพัก'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden min-w-[100px]">
                    <div 
                      className={`h-full rounded-full ${project.health > 80 ? 'bg-emerald-500' : project.health > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                      style={{ width: `${project.health}%` }}
                    />
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-400">{project.lastRun}</td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      {project.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
