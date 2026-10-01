import React, { useState } from 'react';
import { 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Gavel, 
  RotateCcw,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { COURTROOM_DATA } from '../data/lessonData';
import { audio } from '../services/audioService';

interface CourtroomDilemmaProps {
  isSolved: boolean;
  onSolve: () => void;
  onAddXp: (xp: number) => void;
}

export const CourtroomDilemma: React.FC<CourtroomDilemmaProps> = ({
  isSolved,
  onSolve,
  onAddXp,
}) => {
  const [selectedVerdictId, setSelectedVerdictId] = useState<string | null>(
    isSolved ? 'logical_resolution' : null
  );

  const handleSelectVerdict = (id: string, isCorrect?: boolean) => {
    setSelectedVerdictId(id);
    if (isCorrect) {
      audio.playCorrect();
      audio.playBadgeUnlocked();
      onSolve();
      onAddXp(60);
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch {
        // Fallback
      }
    } else {
      audio.playWrong();
    }
  };

  const activeOption = COURTROOM_DATA.verdictOptions.find((o) => o.id === selectedVerdictId);

  return (
    <div className="space-y-6 py-4">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/40 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
          <Scale className="w-4 h-4" />
          <span>شبیه‌ساز تعاملی دادگاه باستان · صفحات ۱۴ و ۱۵ کتاب درسی</span>
        </div>
        <h2 className="text-xl font-extrabold text-white">
          {COURTROOM_DATA.title}
        </h2>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {COURTROOM_DATA.context}
        </p>
      </div>

      {/* Two Pillars: Master's Argument vs Student's Argument */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Master's Argument */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-amber-800/40 space-y-4 shadow-lg relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              {COURTROOM_DATA.masterArgument.title}
            </span>
            <span className="text-[11px] text-slate-400">سوفسطایی بزرگ یونان</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <strong className="text-amber-300 block mb-1">مقدمه اول:</strong>
              {COURTROOM_DATA.masterArgument.premise1}
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <strong className="text-amber-300 block mb-1">مقدمه دوم:</strong>
              {COURTROOM_DATA.masterArgument.premise2}
            </div>
            <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/50 text-amber-200 font-semibold">
              <strong className="text-amber-400 block mb-1">نتیجه‌گیری استاد:</strong>
              {COURTROOM_DATA.masterArgument.conclusion}
            </div>
          </div>
        </div>

        {/* Student's Counter-Argument */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-800/40 space-y-4 shadow-lg relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              {COURTROOM_DATA.studentArgument.title}
            </span>
            <span className="text-[11px] text-slate-400">شاگرد هوشمند وکالت</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <strong className="text-cyan-300 block mb-1">مقدمه اول:</strong>
              {COURTROOM_DATA.studentArgument.premise1}
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <strong className="text-cyan-300 block mb-1">مقدمه دوم:</strong>
              {COURTROOM_DATA.studentArgument.premise2}
            </div>
            <div className="p-3 bg-cyan-950/40 rounded-xl border border-cyan-800/50 text-cyan-200 font-semibold">
              <strong className="text-cyan-400 block mb-1">نتیجه‌گیری شاگرد:</strong>
              {COURTROOM_DATA.studentArgument.conclusion}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Verdict Chamber */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Gavel className="w-5 h-5 text-amber-400" />
          <span>شما به عنوان قاضی دادگاه چه حکمی صادر می‌کنید؟</span>
        </div>
        <p className="text-xs text-slate-400">
          برای دیدن پیامد منطقی هر رأی، یکی از گزینه‌های زیر را انتخاب کنید:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {COURTROOM_DATA.verdictOptions.map((opt) => {
            const isSelected = selectedVerdictId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => handleSelectVerdict(opt.id, opt.isCorrect)}
                className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? opt.isCorrect
                      ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30'
                      : 'bg-amber-950/40 border-amber-500 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold mb-2 flex items-center justify-between">
                  <span>{opt.label}</span>
                  {isSelected && opt.isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {opt.isCorrect ? '✅ حکم منطقی و ابطال مغالطه' : '⚠️ مواجهه با بن‌بست تناقض'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Verdict Analysis */}
        {activeOption && (
          <div
            className={`p-5 rounded-xl border text-xs md:text-sm leading-relaxed animate-in fade-in duration-300 ${
              activeOption.isCorrect
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                : 'bg-slate-950 border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>تحلیل قضایی و منطقی دادگاه:</span>
            </div>
            <p>{activeOption.feedback}</p>
          </div>
        )}
      </div>
    </div>
  );
};
