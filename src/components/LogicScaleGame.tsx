import React, { useState } from 'react';
import { 
  Scale, 
  Sparkles, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Flame,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LOGIC_SCALE_ITEMS } from '../data/lessonData';
import { audio } from '../services/audioService';

interface LogicScaleGameProps {
  onScoreUpdate: (score: number) => void;
  onAddXp: (xp: number) => void;
  highScore: number;
}

export const LogicScaleGame: React.FC<LogicScaleGameProps> = ({
  onScoreUpdate,
  onAddXp,
  highScore,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<{
    isCorrect: boolean;
    text: string;
    hint: string;
  } | null>(null);
  const [tiltAngle, setTiltAngle] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const currentItem = LOGIC_SCALE_ITEMS[currentIndex];

  const handleClassify = (chosenType: 'tasavvor' | 'tasdiq') => {
    if (!currentItem || isGameOver) return;

    const isCorrect = chosenType === currentItem.type;

    if (isCorrect) {
      audio.playCorrect();
      audio.playScaleClink();
      const newCombo = combo + 1;
      const points = 10 + newCombo * 5;
      const newScore = score + points;

      setScore(newScore);
      setCombo(newCombo);
      onAddXp(points);

      // Scale visual physics tilt
      setTiltAngle(chosenType === 'tasavvor' ? 12 : -12);

      setLastFeedback({
        isCorrect: true,
        text: `آفرین! «${currentItem.text}» دقیقاً یک ${chosenType === 'tasavvor' ? 'تصور' : 'تصدیق'} است.`,
        hint: currentItem.hint,
      });

      if (newScore > highScore) {
        onScoreUpdate(newScore);
      }
    } else {
      audio.playWrong();
      setCombo(0);
      setTiltAngle(chosenType === 'tasavvor' ? -8 : 8);

      setLastFeedback({
        isCorrect: false,
        text: `خطا! «${currentItem.text}» یک ${currentItem.type === 'tasavvor' ? 'تصور' : 'تصدیق'} است.`,
        hint: currentItem.hint,
      });
    }

    // Step to next item after brief moment or finish
    setTimeout(() => {
      setTiltAngle(0);
      if (currentIndex < LOGIC_SCALE_ITEMS.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setIsGameOver(true);
        try {
          confetti({ particleCount: 50, spread: 60 });
        } catch {
          // Fallback
        }
      }
    }, 1100);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setLastFeedback(null);
    setTiltAngle(0);
    setIsGameOver(false);
  };

  return (
    <div className="space-y-6 py-4">
      {/* Intro Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>مینی‌گیم تعاملی ترازوی اندیشه (صفحه ۱۸ و ۱۹ کتاب)</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            آزمایشگاه وزن‌کشی ادراکات: تصور یا تصدیق؟
          </h2>
          <p className="text-xs text-slate-400">
            ترازوی ذهن خود را فعال کنید و گزاره‌ها را با سرعت و دقت در کفه درست قرار دهید.
          </p>
        </div>

        {/* Live Scoreboard */}
        <div className="flex items-center gap-3 font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
            <span className="text-slate-400 block text-[10px]">امتیاز بازی</span>
            <span className="text-amber-400 font-bold tabular-nums text-sm">{score}</span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">پیوستگی (کمبو)</span>
              <span className="text-orange-400 font-bold tabular-nums text-sm">x{combo}</span>
            </div>
          </div>
        </div>
      </div>

      {!isGameOver && currentItem ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 lg:p-8 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Progress Status */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>کارت {currentIndex + 1} از {LOGIC_SCALE_ITEMS.length}</span>
            <span>رکورد شما: {highScore}</span>
          </div>

          {/* Animated Balance Scale Graphic */}
          <div className="relative h-44 flex items-center justify-center select-none">
            {/* Stand / Fulcrum */}
            <div className="absolute bottom-4 w-6 h-28 bg-gradient-to-t from-slate-700 to-amber-600 rounded-t-sm" />
            <div className="absolute bottom-2 w-20 h-4 bg-slate-700 rounded-full" />
            <div className="absolute top-10 w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-900 z-20 shadow-md" />

            {/* Beam with smooth dynamic rotation tilt */}
            <div
              className="relative w-80 h-3 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-full z-10 transition-transform duration-500 ease-out flex items-center justify-between"
              style={{ transform: `rotate(${tiltAngle}deg)` }}
            >
              {/* Left Pan: Tasavvor (Right visually in RTL, or clear tags) */}
              <div className="absolute -left-6 top-3 flex flex-col items-center">
                <div className="w-0.5 h-16 bg-slate-500" />
                <div className="w-24 h-10 rounded-b-full border-2 border-emerald-500/80 bg-emerald-950/80 flex items-center justify-center text-[11px] font-bold text-emerald-300 shadow-lg">
                  کفه تصور
                </div>
              </div>

              {/* Right Pan: Tasdiq */}
              <div className="absolute -right-6 top-3 flex flex-col items-center">
                <div className="w-0.5 h-16 bg-slate-500" />
                <div className="w-24 h-10 rounded-b-full border-2 border-amber-500/80 bg-amber-950/80 flex items-center justify-center text-[11px] font-bold text-amber-300 shadow-lg">
                  کفه تصدیق
                </div>
              </div>
            </div>
          </div>

          {/* Current Challenge Card */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700 text-center max-w-xl mx-auto space-y-3 shadow-inner">
            <span className="text-[11px] font-mono text-amber-400 font-semibold tracking-wider">
              گزاره آزمایشی:
            </span>
            <div className="text-lg md:text-xl font-bold text-white tracking-wide">
              « {currentItem.text} »
            </div>
            <p className="text-xs text-slate-400">
              آیا این عبارت یک مفهوم و ادراک ساده است (تصور) یا حامل حکم و قضاوت صدق/کذب است (تصدیق)؟
            </p>
          </div>

          {/* Classification Action Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto">
            <button
              onClick={() => handleClassify('tasavvor')}
              className="group p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50 hover:border-emerald-400 text-white font-bold transition-all text-center space-y-1 shadow-md"
            >
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-sm">
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>تصور است</span>
              </div>
              <span className="text-[11px] text-slate-400 block font-normal">
                (ادراک ساده بدون حکم)
              </span>
            </button>

            <button
              onClick={() => handleClassify('tasdiq')}
              className="group p-4 rounded-xl border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/50 hover:border-amber-400 text-white font-bold transition-all text-center space-y-1 shadow-md"
            >
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-sm">
                <span>تصدیق است</span>
                <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <span className="text-[11px] text-slate-400 block font-normal">
                (ادراک همراه با حکم و نسبت)
              </span>
            </button>
          </div>

          {/* Instant Feedback Drawer */}
          {lastFeedback && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed max-w-xl mx-auto transition-all ${
                lastFeedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1">
                {lastFeedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{lastFeedback.text}</span>
              </div>
              <p className="text-slate-300 mt-1">
                📌 دلیل منطقی: {lastFeedback.hint}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Celebratory Summary */
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center space-y-6 max-w-md mx-auto shadow-2xl">
          <Award className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">پایان چالش ترازوی اندیشه!</h3>
            <p className="text-xs text-slate-400">
              شما تمام ۱۲ عبارت کلیدی درس اول را دسته‌بندی کردید.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-center">
            <span className="text-xs text-slate-400 block mb-1">امتیاز نهایی شما</span>
            <span className="text-2xl font-bold text-amber-400">{score}</span>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>بازی مجدد و ارتقای رکورد</span>
          </button>
        </div>
      )}
    </div>
  );
};
