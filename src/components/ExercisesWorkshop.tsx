import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Lightbulb, 
  Award, 
  RotateCcw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EXERCISE_ITEMS } from '../data/lessonData';
import { audio } from '../services/audioService';

interface ExercisesWorkshopProps {
  onAddXp: (xp: number) => void;
  onCompleteExercise: () => void;
}

export const ExercisesWorkshop: React.FC<ExercisesWorkshopProps> = ({
  onAddXp,
  onCompleteExercise,
}) => {
  // Exercise Page 21: Definition vs Argument
  const [answersP21, setAnswersP21] = useState<Record<string, string>>({});
  const [checkedP21, setCheckedP21] = useState<boolean>(false);

  // Exercise Page 21 (Sahand Concepts/Judgments)
  const sahandItems = [
    { id: 'sh1', text: 'منطق معیار تفکر است', correct: 'تصدیق' },
    { id: 'sh2', text: 'منطق', correct: 'تصور' },
    { id: 'sh3', text: 'تصدیق بخشی از علم است', correct: 'تصدیق' },
    { id: 'sh4', text: 'کوه سهند', correct: 'تصور' },
    { id: 'sh5', text: 'ارتفاعات کوه سهند', correct: 'تصور' },
    { id: 'sh6', text: 'کوه سهند مرتفع است', correct: 'تصدیق' },
  ];

  const [sahandAnswers, setSahandAnswers] = useState<Record<string, string>>({});
  const [checkedSahand, setCheckedSahand] = useState<boolean>(false);

  const handleSelectP21 = (itemId: string, choice: 'تعریف' | 'استدلال') => {
    setAnswersP21((prev) => ({ ...prev, [itemId]: choice }));
    setCheckedP21(false);
  };

  const handleVerifyP21 = () => {
    setCheckedP21(true);
    let allCorrect = true;
    EXERCISE_ITEMS.forEach((it) => {
      if (answersP21[it.id] !== it.category) allCorrect = false;
    });

    if (allCorrect) {
      audio.playCorrect();
      onAddXp(40);
      onCompleteExercise();
      try {
        confetti({ particleCount: 35, spread: 60 });
      } catch {
        // Fallback
      }
    } else {
      audio.playWrong();
    }
  };

  const handleSelectSahand = (id: string, choice: 'تصور' | 'تصدیق') => {
    setSahandAnswers((prev) => ({ ...prev, [id]: choice }));
    setCheckedSahand(false);
  };

  const handleVerifySahand = () => {
    setCheckedSahand(true);
    let allCorrect = true;
    sahandItems.forEach((it) => {
      if (sahandAnswers[it.id] !== it.correct) allCorrect = false;
    });

    if (allCorrect) {
      audio.playCorrect();
      onAddXp(40);
      onCompleteExercise();
    } else {
      audio.playWrong();
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Workshop Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
          <BookOpen className="w-4 h-4" />
          <span>کارگاه حل تمرین‌های رسمی کتاب درسی · صفحات ۱۹ و ۲۱</span>
        </div>
        <h2 className="text-xl font-bold text-white">
          آزمایشگاه حل تمرین‌ها و فعالیت‌های تکمیلی درس اول
        </h2>
        <p className="text-xs text-slate-300">
          پاسخ‌ها را تعیین کنید، صحت آن‌ها را به صورت زنده بسنجید و نکات کلیدی مصححان کنکور را مشاهده فرمایید.
        </p>
      </div>

      {/* Workshop Part 1: Page 21 Definition vs Argument */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white">
              تمرین صفحه ۲۱: تفکیک «تعریف» از «استدلال»
            </h3>
            <p className="text-xs text-slate-400">
              مشخص کنید کدام یک از گزاره‌های زیر تعریف و کدام یک استدلال هستند:
            </p>
          </div>
          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 text-xs rounded-lg border border-amber-500/20 font-mono">
            تمرین رسمی کتاب
          </span>
        </div>

        <div className="space-y-3">
          {EXERCISE_ITEMS.map((item) => {
            const userChoice = answersP21[item.id];
            const isCorrect = userChoice === item.category;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 flex-1">
                  <span className="text-xs md:text-sm text-slate-200 block font-medium">
                    « {item.statement} »
                  </span>
                  {checkedP21 && (
                    <span className="text-[11px] text-slate-400 block">
                      📌 تحلیل: {item.explanation}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleSelectP21(item.id, 'تعریف')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      userChoice === 'تعریف'
                        ? checkedP21
                          ? isCorrect
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-rose-950 border-rose-500 text-rose-300'
                          : 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    تعریف
                  </button>

                  <button
                    onClick={() => handleSelectP21(item.id, 'استدلال')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      userChoice === 'استدلال'
                        ? checkedP21
                          ? isCorrect
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-rose-950 border-rose-500 text-rose-300'
                          : 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    استدلال
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleVerifyP21}
            disabled={Object.keys(answersP21).length < EXERCISE_ITEMS.length}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition-colors"
          >
            بررسی و ثبت پاسخ‌های تمرین ص ۲۱
          </button>
        </div>
      </div>

      {/* Workshop Part 2: Page 21 Sahand Exercise */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white">
              فعالیت تکمیلی ص ۲۱ (شماره ۲): تصور یا تصدیق؟
            </h3>
            <p className="text-xs text-slate-400">
              از میان موارد زیر تصورها و تصدیق‌ها را تعیین کنید (کوه سهند و علم منطق):
            </p>
          </div>
          <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 text-xs rounded-lg border border-cyan-500/20 font-mono">
            نکته پرتکرار آزمون‌ها
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sahandItems.map((item) => {
            const userChoice = sahandAnswers[item.id];
            const isCorrect = userChoice === item.correct;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-3"
              >
                <span className="text-xs font-medium text-slate-200">
                  {item.text}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleSelectSahand(item.id, 'تصور')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                      userChoice === 'تصور'
                        ? checkedSahand
                          ? isCorrect
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-rose-950 border-rose-500 text-rose-300'
                          : 'bg-emerald-600 text-white font-bold border-emerald-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    تصور
                  </button>

                  <button
                    onClick={() => handleSelectSahand(item.id, 'تصدیق')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors border ${
                      userChoice === 'تصدیق'
                        ? checkedSahand
                          ? isCorrect
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                            : 'bg-rose-950 border-rose-500 text-rose-300'
                          : 'bg-amber-600 text-white font-bold border-amber-500'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    }`}
                  >
                    تصدیق
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleVerifySahand}
            disabled={Object.keys(sahandAnswers).length < sahandItems.length}
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs transition-colors"
          >
            بررسی و ثبت پاسخ‌های بخش کوه سهند
          </button>
        </div>
      </div>

      {/* Workshop Part 3: Deep Question Takeaways */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>تحلیل تشریحی سوال ۳ فعالیت تکمیلی (ص ۲۱):</span>
        </h3>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs leading-relaxed text-slate-300">
          <strong className="text-amber-400 block font-semibold">
            سوال: «اگر ذهن انسان به طور طبیعی بر اساس قواعدی می‌اندیشد، چه نیازی به خواندن منطق داریم و چرا به صرف خواندن کتاب‌های منطق از خطای ذهن مصون نمی‌مانیم؟»
          </strong>
          <p>
            ۱. <strong>نیاز به منطق:</strong> ذهن انسان گرچه به طور طبیعی منطقی رفتار می‌کند، اما در استدلال‌های پیچیده، تعاریف تخصصی و مواجهه با بازی‌های زبانی و سفسطه‌ها در معرض لغزش قرار دارد. علم منطق این قواعد پنهان را آشکار و مدون کرده تا سریع‌تر و دقیق‌تر خطاها را کشف کنیم.
          </p>
          <p>
            ۲. <strong>علت عدم مصونیت با صرف خواندن:</strong> منطق علمی <strong>کاربردی و مهارتی</strong> است (مانند دوچرخه‌سواری یا شنا). آگاهی از فرمول‌ها به تنهایی مهارت نمی‌آورد؛ تا زمانی که این قواعد با حل تمرین مکرر ملکه ذهن نشوند، انسان هنگام بحث و تصمیم‌گیری واقعی مصون از مغالطه نخواهد بود.
          </p>
        </div>
      </div>
    </div>
  );
};
