import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  CheckCircle2, 
  ExternalLink, 
  QrCode, 
  Smartphone, 
  Download, 
  Globe,
  GraduationCap
} from 'lucide-react';
import { audio } from '../services/audioService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl: string;
  onDownloadScorm: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  sharedUrl,
  onDownloadScorm,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    audio.playCorrect();
    setTimeout(() => setCopied(false), 3000);
  };

  // Generate QR code using quickchart api or qrserver
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(sharedUrl)}&bgcolor=090d16&color=f59e0b`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                اشتراک‌گذاری سایت درس ۱ منطق با دانش‌آموزان و دبیران
              </h3>
              <p className="text-[11px] text-slate-400">
                لینک وب آنلاین، کیوآرکد برای ورود با گوشی، و بسته اسکورم LMS
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
          {/* Method 1: Public Live URL */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>۱. لینک مستقیم و آنلاین سایت (قابل دسترس برای همه):</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">فعال و آنلاین</span>
            </div>

            <p className="text-slate-400 text-[11px]">
              این پیوند را می‌توانید در گروه کلاسی، شاد، بله، ایتا یا تلگرام برای دانش‌آموزان ارسال کنید:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={sharedUrl}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-amber-300 font-mono text-[11px] select-all focus:outline-none"
                dir="ltr"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'کپی شد!' : 'کپی لینک'}</span>
              </button>
              <a
                href={sharedUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="باز کردن در برگه جدید"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Method 2: Mobile QR Code */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-32 h-32 rounded-xl bg-slate-900 border border-amber-500/30 p-2 flex items-center justify-center shrink-0">
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-full h-full object-contain rounded"
              />
            </div>

            <div className="space-y-1.5 text-right flex-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>۲. ورود سریع با اسکن بارکد (QR Code):</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                دانش‌آموزان ۱۶-۱۷ ساله می‌توانند دوربین گوشی یا تبلت خود را روی این بارکد بگیرند تا مستقیماً بدون نیاز به تایپ آدرس، وارد محیط تعاملی و بازی‌وار درس اول شوند.
              </p>
            </div>
          </div>

          {/* Method 3: LMS SCORM Package */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-800/40 flex items-center justify-between gap-3">
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <GraduationCap className="w-4 h-4" />
                <span>۳. اشتراک در سامانه آموزشی مدرسه (LMS شاد / مودل / نوید):</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                اگر دبیر مایل است پیشرفت و نمرات دانش‌آموزان در سیستم مدرسه ثبت شود، پکیج اسکورم را بارگذاری کند.
              </p>
            </div>

            <button
              onClick={() => {
                onClose();
                onDownloadScorm();
              }}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors text-[11px] shrink-0 flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>کنسول SCORM</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
