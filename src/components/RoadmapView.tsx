import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  PlayCircle, 
  HelpCircle, 
  Layers, 
  Clock, 
  BookOpen, 
  Sparkles, 
  ChevronLeft,
  Scale,
  Compass,
  Gauge,
  History,
  Cpu,
  GitFork,
  Award,
  Trophy
} from 'lucide-react';
import { ROADMAP_STAGES } from '../data/lessonData';
import { RoadmapStage } from '../types/scorm';
import { audio } from '../services/audioService';
import { Leaderboard } from './Leaderboard';

interface RoadmapViewProps {
  completedStageIds: string[];
  currentStageId: string;
  totalXp: number;
  currentUserName?: string;
  currentUserLevel?: number;
  currentUserBadgesCount?: number;
  currentUserStreak?: number;
  onSelectStage: (stage: RoadmapStage) => void;
  onOpenVideo: (videoId?: string) => void;
  onOpenInteractive: (type?: string) => void;
  onOpenQuiz: (stageId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  completedStageIds,
  currentStageId,
  totalXp,
  currentUserName = 'دانش‌آموز پایه دهم',
  currentUserLevel = 1,
  currentUserBadgesCount = 1,
  currentUserStreak = 3,
  onSelectStage,
  onOpenVideo,
  onOpenInteractive,
  onOpenQuiz,
}) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'leaderboard'>('roadmap');

  const getStageIcon = (name: string, isCompleted: boolean) => {
    const props = { className: `w-5 h-5 ${isCompleted ? 'text-amber-400' : 'text-slate-300'}` };
    switch (name) {
      case 'Compass': return <Compass {...props} />;
      case 'Scale': return <Scale {...props} />;
      case 'Gauge': return <Gauge {...props} />;
      case 'History': return <History {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'GitFork': return <GitFork {...props} />;
      case 'Award': return <Award {...props} />;
      default: return <Layers {...props} />;
    }
  };

  const completedCount = completedStageIds.length;
  const progressPercent = Math.round((completedCount / ROADMAP_STAGES.length) * 100);

  return (
    <div className="space-y-8 py-4">
      {/* Hero Banner with Avicenna's Quote and Progress */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 p-6 lg:p-8 shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Sparkles className="w-4 h-4" />
              <span>کتاب منطق پایه دهم رشته ادبیات و علوم انسانی و معارف اسلامی</span>
              <span aria-hidden="true">·</span>
              <span>درس نخست (صفحه ۱۲ تا ۲۱)</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
              منطق؛ ترازوی اندیشه و پاسدار خرد
            </h1>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 text-slate-300 text-sm leading-relaxed relative">
              <span className="text-amber-400 font-semibold block mb-1">
                سخن حکیمانه شیخ‌الرئیس بوعلی سینا (دانشنامه علائی):
              </span>
              «علم منطق علم ترازوست و علم‌های دیگر، علم سود و زیان، و هر دانشی که به ترازو سنجیده نشود، یقین‌آور نباشد؛ پس چاره نیست از آموختن علم منطق.»
            </div>
          </div>

          {/* Quick Progress Dial */}
          <div className="flex flex-col items-center justify-center p-5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-center space-y-3">
            <div className="relative flex items-center justify-center w-24 h-24">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500 transition-all duration-700"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-bold font-mono text-white tabular-nums">{progressPercent}٪</span>
                <span className="block text-[10px] text-slate-400">پیشرفت</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-300 font-medium">
                {completedCount} از {ROADMAP_STAGES.length} ایستگاه فتح شده
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                استاندارد اسکورم در حال ثبت رکورد
              </p>
            </div>
          </div>
        </div>

        {/* Ambient subtle light orb */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Responsive 2-Column Grid: Roadmap & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column: Stepped Visual Roadmap (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>مسیر گام‌به‌گام یادگیری درس ۱</span>
              <span className="text-xs font-normal text-slate-400">
                (مطابق سرفصل‌های رسمی آموزش و پرورش)
              </span>
            </h2>
            <span className="text-xs text-slate-400">
              مجموع زمان: ~۶۵ دقیقه
            </span>
          </div>

          <div className="relative border-r-2 border-slate-800 pr-6 mr-3 space-y-6">
            {ROADMAP_STAGES.map((stage, idx) => {
              const isCompleted = completedStageIds.includes(stage.id);
              const isCurrent = currentStageId === stage.id;
              const isLocked = totalXp < stage.requiredXp && !isCompleted && idx > 0 && !completedStageIds.includes(ROADMAP_STAGES[idx - 1].id);

              return (
                <div key={stage.id} className="relative group">
                  {/* Node Milestone Circle */}
                  <div
                    className={`absolute -right-[35px] top-6 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md shadow-amber-500/30'
                        : isCurrent
                        ? 'bg-slate-900 border-amber-400 text-amber-400 ring-4 ring-amber-500/20'
                        : isLocked
                        ? 'bg-slate-900 border-slate-700 text-slate-600'
                        : 'bg-slate-800 border-slate-600 text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-slate-950 font-bold" />
                    ) : isLocked ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <span className="font-mono text-xs font-bold">{stage.stageNumber}</span>
                    )}
                  </div>

                  {/* Stage Card */}
                  <div
                    onClick={() => {
                      if (!isLocked) {
                        audio.playCorrect();
                        onSelectStage(stage);
                      }
                    }}
                    className={`p-5 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-900/90 border-amber-500/50 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/30'
                        : isCompleted
                        ? 'bg-slate-900/50 border-emerald-800/40 hover:border-emerald-700/60'
                        : isLocked
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-70 cursor-not-allowed'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                            مرحله {stage.stageNumber}
                          </span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-amber-400" />
                            {stage.bookPages}
                          </span>
                          <span aria-hidden="true" className="text-slate-600">·</span>
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {stage.estimatedMinutes} دقیقه
                          </span>
                          {isCompleted && (
                            <span className="text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              تکمیل شده
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {getStageIcon(stage.iconName, isCompleted)}
                          <span>{stage.title}</span>
                        </h3>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {stage.description}
                        </p>

                        {/* Topic Highlights */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {stage.topics.slice(0, 2).map((topic, i) => (
                            <span
                              key={i}
                              className="text-[11px] text-slate-400 bg-slate-800/60 border border-slate-700/40 rounded px-2 py-0.5"
                            >
                              {topic}
                            </span>
                          ))}
                          {stage.topics.length > 2 && (
                            <span className="text-[11px] text-slate-500">
                              +{stage.topics.length - 2} مبحث دیگر
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stage Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {stage.hasVideo && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              audio.playCorrect();
                              onOpenVideo(
                                stage.stageNumber === 2 ? 'video_courtroom' :
                                stage.stageNumber === 3 ? 'video_instruments' :
                                stage.stageNumber === 5 ? 'video_concepts_assent' :
                                stage.stageNumber === 6 ? 'video_definition_syllogism' : undefined
                              );
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-300 border border-indigo-700/40 rounded-lg text-xs font-medium transition-colors"
                          >
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>ویدیو</span>
                          </button>
                        )}

                        {stage.hasInteractive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              audio.playCorrect();
                              onOpenInteractive(stage.interactiveType);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium transition-colors"
                          >
                            <Layers className="w-3.5 h-3.5" />
                            <span>کارگاه</span>
                          </button>
                        )}

                        {stage.hasQuiz && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              audio.playCorrect();
                              onOpenQuiz(stage.id);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>آزمون</span>
                          </button>
                        )}

                        <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:-translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side Column: Dynamic Leaderboard (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Leaderboard
            currentUserName={currentUserName}
            currentUserXp={totalXp}
            currentUserLevel={currentUserLevel}
            currentUserBadgesCount={currentUserBadgesCount}
            currentUserStreak={currentUserStreak}
          />
        </div>
      </div>
    </div>
  );
};
