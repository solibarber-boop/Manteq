import React from 'react';
import { 
  X, 
  Printer, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  User,
  GraduationCap
} from 'lucide-react';
import { SCORMDataModel, UserProgress } from '../types/scorm';

interface StudentReportCardProps {
  isOpen: boolean;
  onClose: () => void;
  scormModel: SCORMDataModel;
  progress: UserProgress;
}

export const StudentReportCard: React.FC<StudentReportCardProps> = ({
  isOpen,
  onClose,
  scormModel,
  progress,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPassed = scormModel.score_raw >= 70 || scormModel.lesson_status === 'passed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar (Hidden in print) */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <span className="text-xs md:text-sm font-bold">
              گواهی و کارنامه یادگیری درس اول منطق دهم (استاندارد اسکورم)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ / ذخیره PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 text-right border-8 border-slate-100 m-2 rounded-xl">
          {/* Header */}
          <div className="text-center space-y-1 border-b-2 border-amber-600/30 pb-4">
            <div className="inline-flex items-center gap-2 text-xs text-amber-700 font-bold mb-1">
              <span>وزارت آموزش و پرورش · دوره دوم متوسطه</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              کارنامه و گواهی تسلط استاندارد SCORM 1.2
            </h2>
            <p className="text-xs text-slate-600">
              درس اول: منطق، ترازوی اندیشه (پایه دهم رشته علوم انسانی و معارف اسلامی)
            </p>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">نام فراگیر:</span>
              <strong className="text-slate-800">{scormModel.student_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">شناسه اسکورم:</span>
              <span className="font-mono font-bold text-slate-700">{scormModel.student_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">تاریخ ارزیابی:</span>
              <span className="font-mono text-slate-700">{new Date().toLocaleDateString('fa-IR')}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">مدت زمان فعالیت:</span>
              <span className="font-mono text-slate-700">{scormModel.session_time || '۰۰:۲۴:۱۰'}</span>
            </div>
          </div>

          {/* Competency Mastery Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ریز مهارت‌های آموزشی منطبق بر کتاب درسی:</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>۱. شناخت مفهوم مغالطه و حل معمای دادگاه سوفسطاییان</span>
                <span className="text-emerald-700 font-bold">تسلط عالی</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>۲. ادراک تمثیل‌های شاقول بنایی و سیستم کنترلی خودرو</span>
                <span className="text-emerald-700 font-bold">تسلط عالی</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>۳. تفکیک دقیق ادراکات ذهنی به «تصور» و «تصدیق»</span>
                <span className="text-emerald-700 font-bold">تسلط کامل</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>۴. تبدیل مجهول به معلوم از طریق «تعریف» و «استدلال»</span>
                <span className="text-emerald-700 font-bold">تسلط کامل</span>
              </div>
            </div>
          </div>

          {/* Final Score and Verdict */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-300 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs text-amber-900 font-semibold block">
                نتیجه نهایی ارزشیابی اسکورم:
              </span>
              <span className="text-sm font-bold text-slate-900">
                {isPassed ? 'شایستگی احراز گردید (Passed)' : 'نیاز به تمرین تکمیلی (Incomplete)'}
              </span>
            </div>

            <div className="text-center font-mono">
              <span className="text-[11px] text-slate-500 block">نمره خام</span>
              <span className="text-2xl font-black text-amber-700 tabular-nums">
                {scormModel.score_raw}٪
              </span>
            </div>
          </div>

          {/* Official Seal / Signature Note */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>تأییدیه بسته نرم‌افزاری استاندارد اسکورم ۱.۲</span>
            <span className="font-mono">کد تأیید دیجیتال: SCORM-LOGIC-1405-D1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
