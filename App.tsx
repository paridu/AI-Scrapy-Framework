
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Database, 
  Terminal, 
  Cpu, 
  Settings, 
  Menu,
  BookOpen,
} from 'lucide-react';
import { AppView, ScrapingProject } from './types';
import Dashboard from './components/Dashboard';
import ProjectWizard from './components/ProjectWizard';
import ProjectDetail from './components/ProjectDetail';
import DataInsights from './components/DataInsights';
import LogViewer from './components/LogViewer';
import AIChatBot from './components/AIChatBot';
import HowToUse from './components/HowToUse';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const [projects, setProjects] = useState<ScrapingProject[]>([
    {
      id: '1',
      name: 'จับตาคู่แข่ง Amazon',
      targetUrl: 'https://amazon.com/s?k=gaming+laptops',
      intent: 'ติดตามราคาโน้ตบุ๊กเกมมิ่งทุกวัน',
      status: 'active',
      health: 98,
      lastRun: '2 ชั่วโมงที่แล้ว',
      spiderCode: 'import scrapy\n\nclass AmazonSpider(scrapy.Spider):\n    name = "amazon"\n    start_urls = ["https://amazon.com/s?k=gaming+laptops"]\n\n    def parse(self, response):\n        for product in response.css("div.s-result-item"):\n            yield {\n                "name": product.css("h2 span::text").get(),\n                "price": product.css("span.a-price-whole::text").get(),\n            }',
      googleDriveEnabled: true
    }
  ]);

  const addProject = (p: ScrapingProject) => {
    setProjects(prev => [...prev, p]);
    setCurrentView(AppView.DASHBOARD);
  };

  const updateProjectStatus = (id: string, status: ScrapingProject['status']) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const updateProjectCode = (id: string, code: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, spiderCode: code } : p));
  };

  const navItems = [
    { id: AppView.DASHBOARD, label: 'หน้าหลัก', icon: LayoutDashboard },
    { id: AppView.INSIGHTS, label: 'ข้อมูลวิเคราะห์', icon: Database },
    { id: AppView.LOGS, label: 'บันทึกระบบ', icon: Terminal },
    { id: AppView.HOW_TO_USE, label: 'วิธีใช้งาน', icon: BookOpen },
  ];

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            projects={projects} 
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setCurrentView(AppView.PROJECT_DETAIL);
            }}
            onAddProject={() => setCurrentView(AppView.WIZARD)}
          />
        );
      case AppView.WIZARD:
        return <ProjectWizard onComplete={addProject} onCancel={() => setCurrentView(AppView.DASHBOARD)} />;
      case AppView.PROJECT_DETAIL:
        const project = projects.find(p => p.id === selectedProjectId);
        return project ? (
          <ProjectDetail 
            project={project} 
            onUpdateStatus={updateProjectStatus}
            onUpdateCode={updateProjectCode}
            onBack={() => setCurrentView(AppView.DASHBOARD)} 
          />
        ) : <div className="p-8">ไม่พบโปรเจกต์</div>;
      case AppView.INSIGHTS:
        return <DataInsights projects={projects} />;
      case AppView.LOGS:
        return <LogViewer />;
      case AppView.HOW_TO_USE:
        return <HowToUse />;
      default:
        return <Dashboard projects={projects} onSelectProject={setSelectedProjectId} onAddProject={() => {}} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#020617] text-slate-100">
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 border-r border-slate-800 bg-[#020617] flex flex-col`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Cpu className="text-white w-6 h-6" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight">AI-Scrapy</span>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentView === item.id 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-all w-full">
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span>ตั้งค่า</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#020617]">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 bg-[#020617]/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-slate-200">
              {currentView === AppView.PROJECT_DETAIL ? 'รายละเอียดโปรเจกต์' : navItems.find(n => n.id === currentView)?.label || 'ภาพรวม'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-300">Scrapyd Engine: ออนไลน์</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>

      <AIChatBot />
    </div>
  );
};

export default App;
