import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  Lightbulb, 
  ChevronLeft, 
  Award,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS, ROADMAP_STAGES } from '../data/lessonData';
import { QuizQuestion } from '../types/scorm';
import { audio } from '../services/audioService';

interface QuizSystemProps {
  initialStageId?: string;
  onRecordScore: (score: number, maxScore: number, answersCount: number) => void;
  onAddXp: (xp: number) => void;
}

export const QuizSystem: React.FC<QuizSystemProps> = ({
  initialStageId,
  onRecordScore,
  onAddXp,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(initialStageId || 'all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResultCard, setShowResultCard] = useState<boolean>(false);

  const filteredQuestions = selectedFilter === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter((q) => q.stageId === selectedFilter);

  const activeQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];
  const selectedOption = userAnswers[activeQuestion?.id];
  const hasAnswered = selectedOption !== undefined;
  const isCorrect = hasAnswered && selectedOption === activeQuestion.correctOptionIndex;

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return; // Prevent changing after submission

    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: index,
    }));

    if (index === activeQuestion.correctOptionIndex) {
      audio.playCorrect();
      onAddXp(15);
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
        });
      } catch {
        // Confetti fallback
      }
    } else {
      audio.playWrong();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finished all filtered questions
      calculateFinalResults();
      setShowResultCard(true);
    }
  };

  const calculateFinalResults = () => {
    let correctCount = 0;
    filteredQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / filteredQuestions.length) * 100);
    onRecordScore(percent, 100, filteredQuestions.length);

    if (percent >= 70) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
    }
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowResultCard(false);
  };

  const totalAnswered = Object.keys(userAnswers).filter((k) =>
    filteredQuestions.some((q) => q.id === k)
  ).length;

  const currentScore = filteredQuestions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctOptionIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6 py-4">
      {/* Header and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Sparkles className="w-4 h-4" />
            <span>سیستم ارزشیابی هوشمند و تحلیل تست‌های درس اول</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            آزمون‌های چهارگزینه‌ای با بازخورد مفهومی و کنکوری
          </h2>
          <p className="text-xs text-slate-400">
            برای دانش‌آموزان ۱۶ تا ۱۷ ساله (پایه دهم) با تحلیل خطای مغالطات و نکات تست‌زنی
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>محدوده:</span>
          </div>
          <button
            onClick={() => {
              setSelectedFilter('all');
              setCurrentQuestionIndex(0);
              setShowResultCard(false);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedFilter === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            همه تست‌ها ({QUIZ_QUESTIONS.length})
          </button>

          {ROADMAP_STAGES.filter((s) => s.hasQuiz).map((stage) => {
            const count = QUIZ_QUESTIONS.filter((q) => q.stageId === stage.id).length;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setSelectedFilter(stage.id);
                  setCurrentQuestionIndex(0);
                  setShowResultCard(false);
                }}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  selectedFilter === stage.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                ایستگاه {stage.stageNumber} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card or Final Result */}
      {!showResultCard && activeQuestion ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl p-6 lg:p-8 space-y-6">
          {/* Question Metadata Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-amber-500/15 text-amber-300 font-mono font-bold">
                سوال {currentQuestionIndex + 1} از {filteredQuestions.length}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                صفحه {activeQuestion.sourceTextbookPage} کتاب درسی
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-slate-400">
              <span>
                پاسخ‌داده: <strong className="text-white">{totalAnswered}</strong> / {filteredQuestions.length}
              </span>
              <span>·</span>
              <span>
                امتیاز فعلی: <strong className="text-amber-400 font-bold">{currentScore}</strong> درست
              </span>
            </div>
          </div>

          {/* Context Note (if present) */}
          {activeQuestion.contextText && (
            <div className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 w-fit">
              📌 {activeQuestion.contextText}
            </div>
          )}

          {/* Question Prompt */}
          <h3 className="text-base lg:text-lg font-bold text-white leading-relaxed">
            {activeQuestion.questionText}
          </h3>

          {/* 4 Options */}
          <div className="space-y-3">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isTargetCorrect = idx === activeQuestion.correctOptionIndex;

              let optionClasses = 'border-slate-800 bg-slate-900/60 text-slate-200 hover:border-slate-700 hover:bg-slate-900';

              if (hasAnswered) {
                if (isTargetCorrect) {
                  optionClasses = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isTargetCorrect) {
                  optionClasses = 'border-rose-500 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500';
                } else {
                  optionClasses = 'border-slate-800/60 bg-slate-950 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`w-full text-right p-4 rounded-xl border transition-all flex items-start gap-3 ${optionClasses}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 border ${
                      hasAnswered && isTargetCorrect
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : hasAnswered && isSelected
                        ? 'bg-rose-500 border-rose-400 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </span>

                  <span className="text-xs md:text-sm leading-relaxed flex-1">
                    {option}
                  </span>

                  {hasAnswered && isTargetCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {hasAnswered && isSelected && !isTargetCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Smart Feedback Engine (Shown after selecting an answer) */}
          {hasAnswered && (
            <div
              className={`p-5 rounded-xl border space-y-3 animate-in fade-in duration-300 ${
                isCorrect
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>آفرین! پاسخ شما کاملاً دقیق و صحیح است (+۱۵ XP)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>پاسخ صحیح گزینه {activeQuestion.correctOptionIndex + 1} بود؛ بیایید علتش را بررسی کنیم:</span>
                  </>
                )}
              </div>

              {/* Rationale */}
              <p className="text-xs leading-relaxed text-slate-300">
                {isCorrect
                  ? activeQuestion.smartFeedback.correctExplanation
                  : activeQuestion.smartFeedback.wrongExplanation}
              </p>

              {/* Key Takeaway Banner */}
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg flex items-start gap-2.5 text-xs text-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-400 font-semibold block mb-0.5">
                    نکته کلیدی و کنکوری (مهم برای امتحان):
                  </strong>
                  <span>{activeQuestion.smartFeedback.keyTakeaway}</span>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-md shadow-amber-950/40"
                >
                  <span>
                    {currentQuestionIndex < filteredQuestions.length - 1
                      ? 'سوال بعدی'
                      : 'مشاهده نتیجه و ثبت در اسکورم'}
                  </span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : showResultCard ? (
        /* Final Score & Mastery Report */
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 text-center space-y-6 max-w-xl mx-auto shadow-2xl">
          <Award className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">کارنامه ارزیابی درس اول</h3>
            <p className="text-xs text-slate-400">
              نتیجه آزمون شما مستقیماً در کارنامه استاندارد اسکورم (SCORM) ثبت گردید.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center font-mono">
            <div>
              <span className="text-xs text-slate-400 block mb-1">تعداد کل سوالات</span>
              <span className="text-lg font-bold text-white">{filteredQuestions.length}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">پاسخ‌های صحیح</span>
              <span className="text-lg font-bold text-emerald-400">{currentScore}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block mb-1">درصد نهایی</span>
              <span className="text-lg font-bold text-amber-400">
                {Math.round((currentScore / filteredQuestions.length) * 100)}٪
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            {Math.round((currentScore / filteredQuestions.length) * 100) >= 70 ? (
              <p className="text-emerald-300 font-semibold">
                تبریک! شما به تسلط استاندارد (حداقل ۷۰٪) دست یافتید و وضعیت اسکورم به «قبول - Passed» ارتقا یافت.
              </p>
            ) : (
              <p className="text-amber-300">
                شما به نمره قبولی نرسیدید. پیشنهاد می‌کنیم ویدیوهای آموزشی کوتاه را مرور کرده و مجدداً در آزمون شرکت کنید.
              </p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>شرکت مجدد در این آزمون</span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
