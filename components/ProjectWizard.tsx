
import React, { useState } from 'react';
import { Search, Sparkles, Wand2, ArrowLeft, ArrowRight, Loader2, CheckCircle, Terminal, Cloud } from 'lucide-react';
import { ScrapingProject } from '../types';
import { analyzeIntent, generateSpider } from '../services/geminiService';

interface ProjectWizardProps {
  onComplete: (project: ScrapingProject) => void;
  onCancel: () => void;
}

const ProjectWizard: React.FC<ProjectWizardProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [url, setUrl] = useState('');
  const [intent, setIntent] = useState('');
  const [saveToDrive, setSaveToDrive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState('');

  const handleStartAnalysis = async () => {
    if (!url || !intent) return;
    setLoading(true);
    try {
      const res = await analyzeIntent(intent, url);
      setAnalysis(res);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSpider = async () => {
    setLoading(true);
    try {
      const code = await generateSpider(intent, url, analysis.fields_to_extract, saveToDrive);
      setGeneratedCode(code);
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    const newProject: ScrapingProject = {
      id: Math.random().toString(36).substr(2, 9),
      name: analysis.suggested_name,
      targetUrl: url,
      intent,
      status: 'active',
      health: 100,
      lastRun: 'เพิ่งสร้าง',
      spiderCode: generatedCode,
      googleDriveEnabled: saveToDrive,
    };
    onComplete(newProject);
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <button onClick={onCancel} className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          ยกเลิก
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex h-1">
          <div className={`h-full transition-all duration-500 bg-blue-600 ${step >= 1 ? 'w-1/3' : 'w-0'}`} />
          <div className={`h-full transition-all duration-500 bg-blue-600 ${step >= 2 ? 'w-1/3' : 'w-0'}`} />
          <div className={`h-full transition-all duration-500 bg-blue-600 ${step >= 3 ? 'w-1/3' : 'w-0'}`} />
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="text-blue-400 w-6 h-6" />
                  ระบุเป้าหมายของคุณ
                </h2>
                <p className="text-slate-400">บอก AI ว่าคุณต้องการดูดข้อมูลอะไร ไม่ต้องเขียนโค้ดเอง</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">URL ของเว็บไซต์เป้าหมาย</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="https://example.com/products"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">อธิบายความต้องการ (ภาษาไทย)</label>
                  <textarea 
                    rows={4}
                    placeholder="เช่น ฉันต้องการเก็บชื่อสินค้า ราคา และสถานะสต็อกสินค้าจากหน้าจอนี้ และบันทึกเป็นไฟล์ทุกเช้า"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700">
                  <input 
                    type="checkbox" 
                    id="drive-save"
                    checked={saveToDrive}
                    onChange={(e) => setSaveToDrive(e.target.checked)}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                  <label htmlFor="drive-save" className="text-sm text-slate-200 cursor-pointer flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-blue-400" /> บันทึกผลลัพธ์ลง Google Drive อัตโนมัติ
                  </label>
                </div>
              </div>

              <button 
                onClick={handleStartAnalysis}
                disabled={loading || !url || !intent}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/40"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                วิเคราะห์ด้วย Gemini AI
              </button>
            </div>
          )}

          {step === 2 && analysis && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="text-emerald-400 w-6 h-6" />
                  แผนการจัดการข้อมูล
                </h2>
                <p className="text-slate-400">AI วิเคราะห์โครงสร้างเว็บและเสนอแผนดังนี้</p>
              </div>

              <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 font-semibold uppercase">ชื่อที่แนะนำ</p>
                    <p className="text-white font-medium mt-1">{analysis.suggested_name}</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800/50">
                    <p className="text-xs text-slate-500 font-semibold uppercase">ความถี่</p>
                    <p className="text-white font-medium mt-1 capitalize">{analysis.frequency_hint}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-2">ข้อมูลที่จะดูด (Fields)</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.fields_to_extract.map((field: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-blue-600/10 text-blue-400 rounded-full border border-blue-600/20 text-sm font-medium">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-slate-500 font-semibold uppercase">ความยากในการดึงข้อมูล</span>
                    <span className="text-xs text-slate-400">{analysis.difficulty_rating}/10</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${analysis.difficulty_rating * 10}%` }} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-4 border border-slate-700 text-slate-300 rounded-xl font-bold hover:bg-slate-800 transition-all"
                >
                  ย้อนกลับ
                </button>
                <button 
                  onClick={handleGenerateSpider}
                  disabled={loading}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  สร้างโค้ด Spider
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Terminal className="text-blue-400 w-6 h-6" />
                  Spider พร้อมทำงาน
                </h2>
                <p className="text-slate-400">AI สร้างโค้ด Scrapy เรียบร้อยแล้ว พร้อม Deploy ไปยัง Cluster</p>
              </div>

              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">spider.py</span>
                </div>
                <div className="p-4 max-h-[300px] overflow-y-auto font-mono text-sm text-blue-200">
                  <pre>{generatedCode}</pre>
                </div>
              </div>

              <button 
                onClick={handleFinish}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/40"
              >
                <ArrowRight className="w-5 h-5" />
                ติดตั้งโปรเจกต์ (Deploy)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectWizard;
