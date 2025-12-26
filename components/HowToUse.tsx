
import React from 'react';
import { BookOpen, Search, Wand2, Cloud, Terminal, Sparkles, CheckCircle } from 'lucide-react';

const HowToUse: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          วิธีใช้งาน <span className="text-blue-500">AI-Scrapy Framework</span>
        </h2>
        <p className="text-slate-400 text-lg">
          เปลี่ยนความต้องการของคุณให้เป็นระบบดูดข้อมูลอัตโนมัติในไม่กี่คลิก
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
          <div className="bg-blue-600/20 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Search className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">1. ระบุเป้าหมาย (Intent)</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            ใส่ URL ของเว็บไซต์ที่ต้องการ และอธิบายสิ่งที่ต้องการดูดข้อมูลเป็นภาษาไทย 
            เช่น "อยากได้ชื่อสินค้าและราคาจากหน้าแรกของ Shopee ทุกเช้า"
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
          <div className="bg-purple-600/20 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Sparkles className="text-purple-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">2. AI วิเคราะห์และวางแผน</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Gemini AI จะวิเคราะห์โครงสร้างเว็บและเสนอชื่อฟิลด์ข้อมูลที่ควรเก็บ 
            รวมถึงประเมินความยากง่ายในการดึงข้อมูลให้คุณโดยอัตโนมัติ
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
          <div className="bg-emerald-600/20 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Cloud className="text-emerald-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">3. เชื่อมต่อ Google Drive</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            คุณสามารถเปิดโหมด "บันทึกลง Google Drive อัตโนมัติ" เพื่อให้ระบบสร้างไฟล์ CSV 
            และอัปโหลดเข้า Drive ของคุณทันทีที่การทำงานเสร็จสิ้น
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-4">
          <div className="bg-amber-600/20 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Terminal className="text-amber-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">4. ตรวจสอบและซ่อมแซม</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            หากโครงสร้างเว็บเปลี่ยน ระบบ AI จะตรวจพบจาก Log และช่วยคุณเขียนโค้ดใหม่ (Auto-Healing) 
            เพียงคลิกเดียว Spider ของคุณก็จะกลับมาทำงานได้เหมือนเดิม
          </p>
        </div>
      </div>

      <div className="bg-blue-600/10 border border-blue-500/30 p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <CheckCircle className="w-6 h-6" /> เคล็ดลับเพิ่มเติม
        </h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex gap-2">• ใช้ช่องแชท AI ด้านขวาล่างเพื่อสอบถามปัญหาเทคนิคหรือขอโค้ดตัวอย่าง</li>
          <li className="flex gap-2">• ข้อมูลที่วิเคราะห์ได้จะถูกรวบรวมไว้ที่เมนู "ข้อมูลวิเคราะห์" (Data Insights)</li>
          <li className="flex gap-2">• การบันทึกลง Google Drive จำเป็นต้องตั้งค่า OAuth2 ในส่วนการตั้งค่าระบบ</li>
        </ul>
      </div>
    </div>
  );
};

export default HowToUse;
