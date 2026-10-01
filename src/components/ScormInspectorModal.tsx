import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Download, 
  Terminal, 
  Database, 
  Clock, 
  FileCode, 
  CheckCircle2, 
  ExternalLink,
  Printer
} from 'lucide-react';
import { SCORMDataModel, SCORMEventLog } from '../types/scorm';
import { generateScormZipPackage } from '../services/scormPackager';
import { audio } from '../services/audioService';

interface ScormInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scormModel: SCORMDataModel;
  scormLogs: SCORMEventLog[];
  onOpenReportCard: () => void;
}

export const ScormInspectorModal: React.FC<ScormInspectorModalProps> = ({
  isOpen,
  onClose,
  scormModel,
  scormLogs,
  onOpenReportCard,
}) => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    setIsExporting(true);
    audio.playCorrect();
    try {
      const blob = await generateScormZipPackage(
        scormModel.student_name,
        scormModel.score_raw,
        scormModel.lesson_status
      );

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SCORM1.2_Manteq_G10_Lesson1_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch {
      // Ignore
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                کنسول استاندارد آموزشی اسکورم (SCORM 1.2 / 2004 Runtime)
              </h3>
              <p className="text-[11px] text-slate-400">
                پایش داده‌های یادگیری، ارتباط با سامانه LMS و دریافت بسته نصبی
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* CMI Data Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                <span>متغیرهای فعال CMI (SCORM Data Model):</span>
              </span>
              <span className="font-mono text-slate-400 text-[11px]">
                پروتکل: ADL SCORM 1.2 Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">cmi.core.lesson_status:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    scormModel.lesson_status === 'passed'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {scormModel.lesson_status}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">cmi.core.score.raw:</span>
                <span className="font-bold text-amber-400 tabular-nums">
                  {scormModel.score_raw} / {scormModel.score_max}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">cmi.core.session_time:</span>
                <span className="font-bold text-slate-200 tabular-nums">
                  {scormModel.session_time || '00:05:22'}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">cmi.core.student_name:</span>
                <span className="font-bold text-slate-200 truncate max-w-[160px]">
                  {scormModel.student_name}
                </span>
              </div>
            </div>
          </div>

          {/* Export Action Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <FileCode className="w-4 h-4" />
                <span>دریافت پکیج ZIP استاندارد اسکورم برای دبیران و LMS</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                شامل مانیفست رسمی <code className="text-amber-400 font-mono">imsmanifest.xml</code>، اسکریپت آداپتور و فراداده آموزشی جهت بارگذاری مستقیم در سامانه شاد، مودل (Moodle) یا نوید.
              </p>
            </div>

            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shrink-0 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'در حال ساخت فایل ZIP...' : 'دانلود پکیج SCORM'}</span>
            </button>
          </div>

          {downloadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>پکیج اسکورم با موفقیت تولید و دانلود شد.</span>
            </div>
          )}

          {/* Real-time SCORM Event Log Stream */}
          <div className="space-y-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>لاگ زنده رویدادهای ارتباطی اسکورم (SCORM Event Log):</span>
            </span>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] max-h-48 overflow-y-auto space-y-1.5">
              {scormLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 text-slate-300">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span className="text-cyan-400 font-semibold shrink-0">{log.action}:</span>
                  {log.parameter && <span className="text-amber-300 shrink-0">{log.parameter}</span>}
                  {log.value && <span className="text-emerald-300 truncate">» {log.value}</span>}
                  <span className="text-slate-600 mr-auto">({String(log.result)})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenReportCard();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>مشاهده کارنامه رسمی و گواهی</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
