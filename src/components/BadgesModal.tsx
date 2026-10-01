import React from 'react';
import { 
  X, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Flame, 
  Scale, 
  PlayCircle, 
  Cpu, 
  BookOpen 
} from 'lucide-react';
import { BADGES_LIST } from '../data/lessonData';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
  totalXp: number;
  level: number;
  streakDays: number;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
  totalXp,
  level,
  streakDays,
}) => {
  if (!isOpen) return null;

  const getBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const props = { className: `w-6 h-6 ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}` };
    switch (iconName) {
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'PlayCircle': return <PlayCircle {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      default: return <Award {...props} />;
    }
  };

  const unlockedCount = unlockedBadgeIds.length;
  const nextLevelXp = level * 150;
  const prevLevelXp = (level - 1) * 150;
  const currentLevelProgress = Math.min(
    100,
    Math.round(((totalXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">تالار افتخارات و نشان‌های درس اول</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gamified Summary Stats */}
        <div className="p-6 bg-slate-950/40 border-b border-slate-800 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono">
            <span className="text-[11px] text-slate-400 block mb-0.5">مجموع امتیاز</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">{totalXp} XP</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono">
            <span className="text-[11px] text-slate-400 block mb-0.5">رتبه و سطح</span>
            <span className="text-lg font-bold text-white tabular-nums">سطح {level}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-orange-400" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">پیوستگی مطالعه</span>
              <span className="text-sm font-bold text-orange-300 tabular-nums">{streakDays} روز متوالی</span>
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>پیشرفت تا سطح {level + 1}</span>
            <span>{totalXp} / {nextLevelXp} XP</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${currentLevelProgress}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <div className="text-xs text-slate-400 mb-2 font-medium flex items-center justify-between">
            <span>نشان‌های کسب شده ({unlockedCount} از {BADGES_LIST.length})</span>
            <span className="text-amber-400 text-[11px]">با فعالیت در سامانه نشان‌ها را باز کنید</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BADGES_LIST.map((b) => {
              const isUnlocked = unlockedBadgeIds.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                    isUnlocked
                      ? 'bg-amber-500/10 border-amber-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-60 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      isUnlocked
                        ? 'bg-amber-500/20 border-amber-500/40 shadow-inner'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    {isUnlocked ? getBadgeIcon(b.icon, true) : <Lock className="w-5 h-5 text-slate-600" />}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{b.title}</span>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </h4>
                      <span className="text-[10px] font-mono text-amber-400 font-semibold">
                        +{b.xpReward} XP
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-tight">
                      {b.description}
                    </p>

                    <span className="text-[10px] text-slate-500 block pt-0.5">
                      شرط: {b.requirementText}
                    </span>
                  </div>
                </div>
              );
            })}
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
