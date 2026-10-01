import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Flame, 
  Sparkles, 
  Award, 
  Users, 
  TrendingUp, 
  UserCheck, 
  School,
  ChevronUp,
  ArrowUpRight
} from 'lucide-react';

export interface LeaderboardEntry {
  id: string;
  name: string;
  school: string;
  city: string;
  xp: number;
  level: number;
  badgesCount: number;
  streakDays: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  currentUserName: string;
  currentUserXp: number;
  currentUserLevel: number;
  currentUserBadgesCount: number;
  currentUserStreak: number;
}

const PEER_STUDENTS: Omit<LeaderboardEntry, 'isCurrentUser'>[] = [
  {
    id: 's1',
    name: 'سارا محمدی',
    school: 'دبیرستان فرزانگان ۱',
    city: 'تهران',
    xp: 540,
    level: 4,
    badgesCount: 6,
    streakDays: 7,
  },
  {
    id: 's2',
    name: 'علی رضایی',
    school: 'دبیرستان علامه حلی',
    city: 'اصفهان',
    xp: 460,
    level: 4,
    badgesCount: 5,
    streakDays: 5,
  },
  {
    id: 's3',
    name: 'فاطمه ابراهیمی',
    school: 'دبیرستان البرز',
    city: 'تهران',
    xp: 390,
    level: 3,
    badgesCount: 5,
    streakDays: 6,
  },
  {
    id: 's4',
    name: 'امیرحسین تقوی',
    school: 'نمونه دولتی شهید مطهری',
    city: 'مشهد',
    xp: 320,
    level: 3,
    badgesCount: 4,
    streakDays: 4,
  },
  {
    id: 's5',
    name: 'مریم سلیمانی',
    school: 'دبیرستان معارف اسلامی هدی',
    city: 'قم',
    xp: 250,
    level: 2,
    badgesCount: 3,
    streakDays: 3,
  },
  {
    id: 's6',
    name: 'محمدجواد شمس',
    school: 'دبیرستان شهید بهشتی',
    city: 'تبریز',
    xp: 180,
    level: 2,
    badgesCount: 2,
    streakDays: 2,
  },
  {
    id: 's7',
    name: 'زینب کاظمی',
    school: 'دبیرستان نمونه نرجس',
    city: 'شیراز',
    xp: 110,
    level: 1,
    badgesCount: 2,
    streakDays: 2,
  },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentUserName,
  currentUserXp,
  currentUserLevel,
  currentUserBadgesCount,
  currentUserStreak,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'weekly'>('all');

  // Construct dynamic leaderboard integrating the current user
  const currentUserEntry: LeaderboardEntry = {
    id: 'current_user',
    name: currentUserName || 'شما (دانش‌آموز دهم)',
    school: 'دبیرستان دوره دوم متوسطه',
    city: 'ایران',
    xp: currentUserXp,
    level: currentUserLevel,
    badgesCount: currentUserBadgesCount,
    streakDays: currentUserStreak,
    isCurrentUser: true,
  };

  const combinedList: LeaderboardEntry[] = [
    ...PEER_STUDENTS.map((p) => ({ ...p, isCurrentUser: false })),
    currentUserEntry,
  ].sort((a, b) => {
    // For weekly filter, slightly scale for variety
    const xpA = filterTab === 'weekly' ? Math.round(a.xp * 0.45) : a.xp;
    const xpB = filterTab === 'weekly' ? Math.round(b.xp * 0.45) : b.xp;
    return xpB - xpA;
  });

  const currentUserRank = combinedList.findIndex((item) => item.isCurrentUser) + 1;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/40 ring-2 ring-amber-300">
            <Crown className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-bold text-xs shadow-md shadow-slate-300/30 ring-2 ring-slate-200">
            🥈
          </div>
        );
      case 3:
        return (
          <div className="w-7 h-7 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-bold text-xs shadow-md shadow-amber-700/30 ring-2 ring-amber-600">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-mono font-bold text-xs border border-slate-700">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="p-5 lg:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl space-y-5">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm lg:text-base font-bold text-white flex items-center gap-2">
              <span>جدول برترین منطق‌دانان کشور</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal">
                پایه دهم
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              رتبه‌بندی زنده بر اساس کل امتیازات (XP)، حل تست‌ها و پیشرفت در درس اول
            </p>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterTab === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            کل دوره
          </button>
          <button
            onClick={() => setFilterTab('weekly')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterTab === 'weekly'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            لیگ هفتگی
          </button>
        </div>
      </div>

      {/* User's Standout Card */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center font-mono font-bold text-amber-400 text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
            رتبه شما: {currentUserRank}
          </div>
          <div>
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentUserEntry.name}</span>
              <span className="text-[10px] text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded font-normal">
                حساب شما
              </span>
            </span>
            <span className="text-[11px] text-slate-400">
              سطح {currentUserLevel} · {currentUserBadgesCount} نشان افتخار
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="text-right">
            <span className="text-amber-400 font-bold block tabular-nums text-sm">
              {currentUserXp} XP
            </span>
            <span className="text-[10px] text-slate-400">مجموع امتیاز</span>
          </div>
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
        </div>
      </div>

      {/* Leaderboard Table List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {combinedList.map((entry, index) => {
          const rank = index + 1;
          const isUser = entry.isCurrentUser;
          const displayXp = filterTab === 'weekly' ? Math.round(entry.xp * 0.45) : entry.xp;

          return (
            <div
              key={entry.id}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isUser
                  ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/40 shadow-md shadow-amber-950/30'
                  : rank <= 3
                  ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/50 border-slate-800/60 hover:border-slate-700/80'
              }`}
            >
              {/* Rank & Student Details */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getRankBadge(rank)}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-xs font-bold truncate ${isUser ? 'text-amber-300' : 'text-slate-100'}`}>
                      {entry.name}
                    </span>
                    {isUser && (
                      <span className="text-[10px] text-amber-400 font-medium">
                        (شما)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 truncate">
                    <span className="flex items-center gap-0.5 truncate">
                      <School className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{entry.school}</span>
                    </span>
                    <span>·</span>
                    <span className="text-slate-400 shrink-0">{entry.city}</span>
                  </div>
                </div>
              </div>

              {/* Stats & XP */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-orange-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span className="font-mono tabular-nums">{entry.streakDays} روز</span>
                </div>

                <div className="text-left font-mono">
                  <span className={`text-xs font-bold block tabular-nums ${isUser ? 'text-amber-300' : 'text-white'}`}>
                    {displayXp}
                  </span>
                  <span className="text-[10px] text-slate-500 block">XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Bottom Footer */}
      <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5 text-[11px] text-slate-400">
        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300 font-semibold">چگونه رتبه خود را ارتقا دهید؟</strong> با تماشای میکروویدیوها (+۲۰ XP)، حل تمرین‌های رسمی کتاب (+۴۰ XP)، پاسخ صحیح به آزمون‌های چهارگزینه‌ای (+۱۵ XP) و ثبت رکورد در ترازوی اندیشه، جایگاه خود را به صدر جدول برسانید!
        </p>
      </div>
    </div>
  );
};
