
import React, { useState, useMemo } from 'react';
import { 
  Cloud, 
  FileSpreadsheet, 
  FileJson, 
  Search, 
  ExternalLink, 
  MoreVertical, 
  Download, 
  Clock, 
  Folder,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  LayoutGrid,
  List,
  ArrowLeft,
  Upload,
  FolderPlus,
  Share2,
  Trash2,
  FileText,
  FileCode,
  ArrowDownToLine,
  Sparkles
} from 'lucide-react';

interface DriveFile {
  id: string;
  name: string;
  project?: string;
  size: string;
  date: string;
  type: 'csv' | 'json' | 'folder' | 'txt' | 'py';
  parentId: string | null;
}

const DriveExplorer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Mock data representing a deeper folder structure
  const allFiles: DriveFile[] = [
    { id: '1', name: 'AI-Scrapy-Exports', type: 'folder', parentId: null, size: '--', date: '5 วันที่แล้ว' },
    { id: '2', name: 'Backup_Spiders', type: 'folder', parentId: null, size: '--', date: '2 สัปดาห์ที่แล้ว' },
    { id: 'f1', name: 'prachinburi_properties_20240520.csv', project: 'ตลาดนัดบ้าน', size: '1.2 MB', date: '10 นาทีที่แล้ว', type: 'csv', parentId: '1' },
    { id: 'f2', name: 'amazon_gaming_laptops_daily.json', project: 'จับตาคู่แข่ง Amazon', size: '450 KB', date: '2 ชั่วโมงที่แล้ว', type: 'json', parentId: '1' },
    { id: 'f3', name: 'property_leads_full_export.csv', project: 'ตลาดนัดบ้าน', size: '4.8 MB', date: 'เมื่อวานนี้', type: 'csv', parentId: '1' },
    { id: 'f4', name: 'competitor_prices_v1.csv', project: 'จับตาคู่แข่ง Amazon', size: '120 KB', date: '2 วันที่แล้ว', type: 'csv', parentId: '1' },
    { id: 'f5', name: 'taladnudbaan_v2_code.py', project: 'ตลาดนัดบ้าน', size: '12 KB', date: '3 วันที่แล้ว', type: 'py', parentId: '2' },
    { id: 'f6', name: 'amazon_v1_backup.py', project: 'จับตาคู่แข่ง Amazon', size: '8 KB', date: '1 สัปดาห์ที่แล้ว', type: 'py', parentId: '2' },
    { id: 'f7', name: 'readme_notes.txt', size: '2 KB', date: 'วันนี้', type: 'txt', parentId: null },
  ];

  const currentFolder = useMemo(() => 
    allFiles.find(f => f.id === currentFolderId), 
    [currentFolderId]
  );

  const breadcrumbs = useMemo(() => {
    const path = [];
    let current = currentFolder;
    while (current) {
      path.unshift(current);
      current = allFiles.find(f => f.id === current?.parentId);
    }
    return path;
  }, [currentFolder]);

  const filteredFiles = useMemo(() => {
    return allFiles.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                           (f.project?.toLowerCase().includes(search.toLowerCase()) ?? false);
      const matchesFolder = f.parentId === currentFolderId;
      // If searching, show all matches regardless of folder, otherwise show folder contents
      return search ? matchesSearch : matchesFolder;
    });
  }, [allFiles, search, currentFolderId]);

  const handleExport = () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      alert('เริ่มการส่งออกข้อมูลทั้งหมด (94,016 รายการ) ไปยังเครื่องของคุณสำเร็จ!');
    }, 1500);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'folder': return <Folder className="w-6 h-6 text-amber-400 fill-amber-400/20" />;
      case 'csv': return <FileSpreadsheet className="w-6 h-6 text-emerald-400" />;
      case 'json': return <FileJson className="w-6 h-6 text-blue-400" />;
      case 'py': return <FileCode className="w-6 h-6 text-indigo-400" />;
      default: return <FileText className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="bg-blue-600/20 p-2 rounded-xl">
              <Cloud className="text-blue-400 w-8 h-8" />
            </div>
            Cloud Drive Explorer
          </h2>
          <p className="text-slate-400 mt-1">จัดการและส่งออกข้อมูลจากการ Scraping ของคุณ</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
          >
            {isExporting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
            Export Data Result
          </button>
          
          <div className="hidden lg:flex px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">UA</div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Cloud User</span>
              <span className="text-xs text-white font-medium">คุณครูอาร์ม</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Actions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">ดึงข้อมูล & อัปโหลด</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all font-semibold">
                <Upload className="w-4 h-4" /> อัปโหลดไฟล์
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all font-semibold border border-slate-700">
                <FolderPlus className="w-4 h-4 text-amber-400" /> สร้างโฟลเดอร์
              </button>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl shadow-xl">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">พื้นที่จัดเก็บ</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs text-slate-400">12.4 GB / 15 GB</span>
                <span className="text-xs font-bold text-white">82%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }} />
              </div>
              <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-tighter">
                <Sparkles className="w-3 h-3" /> อัปเกรดพื้นที่จัดเก็บ
              </button>
            </div>
          </div>
        </div>

        {/* Main Explorer Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-slate-800 shadow-lg">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อไฟล์ หรือ โปรเจกต์..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-blue-400 shadow-inner' : 'text-slate-500 hover:text-white'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-800 text-blue-400 shadow-inner' : 'text-slate-500 hover:text-white'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all border border-slate-700">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50">
            <button 
              onClick={() => setCurrentFolderId(null)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <Cloud className="w-3 h-3" /> My Drive
            </button>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.id}>
                <ChevronRight className="w-3 h-3 text-slate-700" />
                <button 
                  onClick={() => setCurrentFolderId(crumb.id)}
                  className="hover:text-white transition-colors cursor-pointer last:text-blue-400"
                >
                  {crumb.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {currentFolderId && (
            <button 
              onClick={() => setCurrentFolderId(currentFolder?.parentId || null)}
              className="flex items-center gap-2 text-xs text-slate-400 hover:text-white px-2 transition-all mb-2"
            >
              <ArrowLeft className="w-3 h-3" /> ย้อนกลับ
            </button>
          )}

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id} 
                  onClick={() => file.type === 'folder' ? setCurrentFolderId(file.id) : null}
                  className={`group bg-slate-900/40 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/20 flex flex-col gap-5 relative overflow-hidden cursor-pointer ${file.type === 'folder' ? 'bg-amber-400/5 border-amber-400/10 hover:border-amber-400/40' : ''}`}
                >
                  <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-400"><Share2 className="w-3 h-3" /></button>
                    <button className="p-1.5 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white"><MoreVertical className="w-3 h-3" /></button>
                  </div>
                  
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${
                    file.type === 'folder' ? 'bg-amber-400/10' : 
                    file.type === 'csv' ? 'bg-emerald-500/10' : 
                    file.type === 'json' ? 'bg-blue-500/10' : 
                    'bg-slate-800/50'
                  }`}>
                    {getFileIcon(file.type)}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-200 text-base truncate" title={file.name}>{file.name}</h4>
                    {file.project && (
                      <div className="flex items-center gap-1.5">
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight bg-slate-800 px-2 py-0.5 rounded-md">{file.project}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                      <Clock className="w-3 h-3" />
                      {file.date}
                    </div>
                    <span className="text-[10px] text-slate-600 font-bold">{file.size}</span>
                  </div>

                  {file.type !== 'folder' && (
                    <div className="flex gap-2 mt-1">
                      <button className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all border border-slate-700">
                        <Download className="w-3.5 h-3.5" /> ดาวน์โหลด
                      </button>
                      <button className="flex-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all border border-blue-600/20">
                        <ExternalLink className="w-3.5 h-3.5" /> เปิดดู
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/40 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-6 py-4">ชื่อไฟล์ / โฟลเดอร์</th>
                    <th className="px-6 py-4">โปรเจกต์</th>
                    <th className="px-6 py-4">ขนาด</th>
                    <th className="px-6 py-4">แก้ไขล่าสุด</th>
                    <th className="px-6 py-4 text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredFiles.map((file) => (
                    <tr 
                      key={file.id} 
                      onClick={() => file.type === 'folder' ? setCurrentFolderId(file.id) : null}
                      className="hover:bg-slate-800/30 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`p-1.5 rounded-lg ${
                            file.type === 'folder' ? 'bg-amber-400/10' : 
                            file.type === 'csv' ? 'bg-emerald-500/10' : 
                            file.type === 'json' ? 'bg-blue-500/10' : 
                            'bg-slate-800/50'
                          }`}>
                            {/* Fix: Added any generic to React.ReactElement to allow className override via cloneElement */}
                            {React.cloneElement(getFileIcon(file.type) as React.ReactElement<any>, { className: 'w-4 h-4' })}
                          </div>
                          <span className="text-sm font-semibold text-slate-200">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {file.project ? (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-md">{file.project}</span>
                        ) : '--'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{file.size}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{file.date}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><Download className="w-4 h-4" /></button>
                          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg"><Share2 className="w-4 h-4" /></button>
                          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><ExternalLink className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {filteredFiles.length === 0 && (
            <div className="py-24 text-center space-y-4 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto opacity-40">
                <Folder className="w-10 h-10 text-slate-600" />
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold">ไม่พบไฟล์หรือโฟลเดอร์</p>
                <p className="text-slate-600 text-xs">ลองใช้คำค้นหาอื่น หรือตรวจสอบตำแหน่งโฟลเดอร์</p>
              </div>
              <button 
                onClick={() => {setSearch(''); setCurrentFolderId(null);}}
                className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
              >
                ล้างการค้นหาและกลับหน้าหลัก
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriveExplorer;
