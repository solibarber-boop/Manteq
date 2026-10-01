import React from 'react';
import { Volume2, VolumeX, Award, ShieldCheck, Flame, Sparkles, FolderGit2, Share2 } from 'lucide-react';
import { audio } from '../services/audioService';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  totalXp: number;
  level: number;
  streakDays: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenBadges: () => void;
  onOpenScormInspector: () => void;
  onOpenGitHub: () => void;
  onOpenShare: () => void;
  scormStatus: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  totalXp,
  level,
  streakDays,
  soundEnabled,
  onToggleSound,
  onOpenBadges,
  onOpenScormInspector,
  onOpenGitHub,
  onOpenShare,
  scormStatus,
}) => {
  const navItems = [
    { id: 'roadmap', label: 'نقشه راه یادگیری' },
    { id: 'videos', label: 'ویدیوهای کوتاه' },
    { id: 'scale', label: 'بازی ترازوی اندیشه' },
    { id: 'courtroom', label: 'دادگاه سوفسطایی' },
    { id: 'quiz', label: 'آزمون تستی هوشمند' },
    { id: 'exercises', label: 'تمرین‌های کتاب' },
  ];

  const getStatusBadge = () => {
    switch (scormStatus) {
      case 'passed':
        return { label: 'قبول (Passed)', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800' };
      case 'completed':
        return { label: 'تکمیل (Completed)', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800' };
      default:
        return { label: 'در جریان (SCORM Active)', color: 'text-amber-400 bg-amber-950/60 border-amber-800' };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Text Element (Front-end Constitution Rule) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('roadmap')}
            className="text-right group focus:outline-none"
          >
            <span className="text-lg lg:text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              منطق پایه دهم · ترازوی اندیشه
            </span>
            <span className="block text-xs text-slate-400 font-normal">
              بسته تعاملی استاندارد اسکورم (SCORM)
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  audio.playCorrect();
                  onSelectTab(item.id);
                }}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Gamified Stats */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* XP & Level */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs font-medium text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-mono tabular-nums font-bold">{totalXp}</span>
            <span className="text-[11px] text-slate-400">XP</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">سطح {level}</span>
          </div>

          {/* Study Streak */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-800/80 border border-slate-700/60 rounded-lg text-xs font-medium text-orange-300">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-mono tabular-nums">{streakDays}</span>
            <span className="text-[11px] text-slate-400">روز</span>
          </div>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'قطع صداهای تعاملی' : 'وصل صداهای تعاملی'}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={onOpenShare}
            title="اشتراک‌گذاری سایت درس ۱ با دیگران"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">اشتراک‌گذاری</span>
          </button>

          {/* Badges Modal Trigger */}
          <button
            onClick={onOpenBadges}
            title="تالار نشان‌ها و دستاوردها"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">نشان‌ها</span>
          </button>

          {/* GitHub Integration Modal Trigger */}
          <button
            onClick={onOpenGitHub}
            title="اتصال به گیت‌هاب (GitHub Sync)"
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <FolderGit2 className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">گیت‌هاب</span>
          </button>

          {/* SCORM Inspector & Status */}
          <button
            onClick={onOpenScormInspector}
            title="کنسول استاندارد اسکورم و دانلود بسته LMS"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg text-xs font-medium transition-colors ${statusInfo.color}`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="hidden lg:inline">{statusInfo.label}</span>
            <span className="lg:hidden">SCORM</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="flex md:hidden items-center gap-1 overflow-x-auto pt-2 pb-1 scrollbar-none">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              currentTab === item.id
                ? 'bg-amber-500/20 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
