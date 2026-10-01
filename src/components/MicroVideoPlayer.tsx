import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  FastForward, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sparkles,
  Scale,
  Gauge,
  Lightbulb,
  Cpu,
  Layers
} from 'lucide-react';
import { MICRO_VIDEOS } from '../data/lessonData';
import { MicroVideoModule } from '../types/scorm';
import { audio } from '../services/audioService';

interface MicroVideoPlayerProps {
  initialVideoId?: string;
  watchedVideoIds: string[];
  onMarkVideoWatched: (videoId: string) => void;
}

export const MicroVideoPlayer: React.FC<MicroVideoPlayerProps> = ({
  initialVideoId,
  watchedVideoIds,
  onMarkVideoWatched,
}) => {
  const [selectedVideoId, setSelectedVideoId] = useState<string>(
    initialVideoId || MICRO_VIDEOS[0].id
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [voiceNarration, setVoiceNarration] = useState<boolean>(true);

  const video = MICRO_VIDEOS.find((v) => v.id === selectedVideoId) || MICRO_VIDEOS[0];
  const currentSlide = video.slides[currentSlideIndex];
  const isWatched = watchedVideoIds.includes(video.id);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync if initialVideoId changes
  useEffect(() => {
    if (initialVideoId && initialVideoId !== selectedVideoId) {
      setSelectedVideoId(initialVideoId);
      setCurrentSlideIndex(0);
      setProgress(0);
      setIsPlaying(true);
    }
  }, [initialVideoId]);

  // Handle Playback Interval
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const stepMs = 100;
    const totalMs = (currentSlide.durationSeconds * 1000) / playbackSpeed;
    const increment = (stepMs / totalMs) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => Math.min(100, prev + increment));
    }, stepMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSlide.durationSeconds, playbackSpeed]);

  // When progress reaches 100, advance to next slide or complete
  useEffect(() => {
    if (progress >= 100 && isPlaying) {
      if (currentSlideIndex < video.slides.length - 1) {
        setCurrentSlideIndex((prev) => prev + 1);
        setProgress(0);
      } else {
        setIsPlaying(false);
        onMarkVideoWatched(video.id);
        audio.playCorrect();
      }
    }
  }, [progress, isPlaying, currentSlideIndex, video.slides.length, video.id, onMarkVideoWatched]);

  // Speech Narration (if enabled)
  useEffect(() => {
    if (voiceNarration && isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentSlide.narration);
      utterance.lang = 'fa-IR';
      utterance.rate = playbackSpeed;
      window.speechSynthesis.speak(utterance);
    } else if (!isPlaying && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [currentSlideIndex, isPlaying, voiceNarration, playbackSpeed]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    audio.playScaleClink();
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < video.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setProgress(0);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setProgress(0);
    }
  };

  const handleRestart = () => {
    setCurrentSlideIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  // Render visual graphic representation inside the motion player
  const renderSlideVisual = () => {
    switch (currentSlide.visualType) {
      case 'courtroom':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-950/30 to-slate-900/90 rounded-2xl border border-amber-800/30 overflow-hidden">
            <div className="flex items-center justify-between w-full max-w-lg mb-6">
              <div className="text-center p-3 rounded-xl bg-slate-800/80 border border-slate-700 w-44">
                <span className="text-xs text-amber-400 font-bold block mb-1">پروتاگوراس (استاد)</span>
                <p className="text-[11px] text-slate-300">«چه ببازم چه ببرم، در هر صورت پولم را می‌گیرم!»</p>
              </div>
              <Scale className="w-10 h-10 text-amber-400 animate-bounce" />
              <div className="text-center p-3 rounded-xl bg-slate-800/80 border border-slate-700 w-44">
                <span className="text-xs text-cyan-400 font-bold block mb-1">اواتلوس (شاگرد)</span>
                <p className="text-[11px] text-slate-300">«چه ببازم چه ببرم، در هر صورت پولی نمی‌دهم!»</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/70 border border-amber-500/30 rounded-xl text-center max-w-md">
              <span className="text-xs text-amber-300 font-semibold block mb-0.5">گره سفسطه در دادگاه:</span>
              <p className="text-xs text-slate-300">
                هر دو مدعی‌اند قرارداد خصوصی و حکم قانونی هم‌زمان به سود آن‌هاست!
              </p>
            </div>
          </div>
        );

      case 'dashboard':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-indigo-950/40 rounded-2xl border border-indigo-800/30">
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-center space-y-2">
                <Gauge className="w-8 h-8 text-cyan-400 mx-auto" />
                <span className="text-xs font-bold text-white block">آمپرهای خودرو</span>
                <p className="text-[11px] text-slate-400">نشان‌دهنده بنزین و حرارت؛ بدون تولید سوخت و بدون حرکت!</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 text-center space-y-2">
                <div className="w-8 h-8 mx-auto flex items-center justify-center text-amber-400 text-lg font-bold">
                  ⚖️
                </div>
                <span className="text-xs font-bold text-white block">شاقول بنایی</span>
                <p className="text-[11px] text-slate-400">ترازکننده دیوار فکر؛ اما آجرها از علوم دیگر می‌آیند!</p>
              </div>
            </div>

            <span className="text-xs text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/50">
              منطق = ابزار سنجش اندیشه (خادم سایر علوم)
            </span>
          </div>
        );

      case 'concept_tree':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-emerald-950/30 rounded-2xl border border-emerald-800/30">
            <div className="flex items-center justify-center gap-6 w-full max-w-lg mb-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-center w-48">
                <span className="text-xs text-emerald-400 font-bold block mb-1">تصور (Concept)</span>
                <span className="text-xs text-slate-200">سیمرغ · کوه سهند · درخت</span>
                <p className="text-[10px] text-slate-400 mt-2">ادراک ساده بدون حکم و قضاوت</p>
              </div>

              <div className="text-slate-500 font-bold text-xl">≠</div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40 text-center w-48">
                <span className="text-xs text-amber-400 font-bold block mb-1">تصدیق (Judgment)</span>
                <span className="text-xs text-slate-200">درختان اکسیژن می‌سازند</span>
                <p className="text-[10px] text-slate-400 mt-2">ادراک با حکم و نسبت (صادق/کاذب)</p>
              </div>
            </div>

            <div className="text-xs text-center text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-700/60 max-w-md">
              تصورات با <strong className="text-emerald-400">تعریف</strong> و تصدیقات با <strong className="text-amber-400">استدلال</strong> گسترش می‌یابند.
            </div>
          </div>
        );

      default:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 text-center">
            <Scale className="w-12 h-12 text-amber-400 mb-3 animate-pulse" />
            <span className="text-sm font-bold text-white mb-1">{currentSlide.title}</span>
            <p className="text-xs text-slate-300 max-w-md">{currentSlide.subtitle}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* Module Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MICRO_VIDEOS.map((mod, index) => {
          const isSelected = mod.id === selectedVideoId;
          const isCompleted = watchedVideoIds.includes(mod.id);
          return (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedVideoId(mod.id);
                setCurrentSlideIndex(0);
                setProgress(0);
                setIsPlaying(true);
                audio.playScaleClink();
              }}
              className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-950/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-400">
                  میکروویدیو {index + 1}
                </span>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                {mod.title.split(':')[1] || mod.title}
              </h4>
              <span className="text-[11px] text-slate-500">
                {mod.durationMinutes}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Video Motion Player Canvas */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden">
        {/* Top Video Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-900/80 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
              پخش زنده موشن‌گرافی
            </span>
            <span className="text-white font-semibold truncate max-w-xs md:max-w-md">
              {video.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Button */}
            <button
              onClick={() => {
                const nextSpeed = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1;
                setPlaybackSpeed(nextSpeed);
              }}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] transition-colors"
            >
              {playbackSpeed}x
            </button>

            {/* Narration Voice Toggle */}
            <button
              onClick={() => setVoiceNarration(!voiceNarration)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={voiceNarration ? 'گوینده صوتی فعال' : 'گوینده صوتی خاموش'}
            >
              {voiceNarration ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Video Canvas Stage (4:3 or 16:9 ratio container) */}
        <div className="relative aspect-video w-full bg-slate-900/90 flex flex-col justify-between p-4 md:p-6 select-none">
          {/* Visual Presentation */}
          <div className="flex-1 flex items-center justify-center">
            {renderSlideVisual()}
          </div>

          {/* Dialogues & Narration Subtitles */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-center">
            <div className="text-xs text-amber-300 font-semibold mb-1">
              اسلاید {currentSlideIndex + 1} از {video.slides.length}: {currentSlide.title}
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed max-w-3xl mx-auto">
              {currentSlide.narration}
            </p>
          </div>
        </div>

        {/* Video Controls & Progress Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-3">
          {/* Progress Scrubber */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden relative cursor-pointer">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
              {Math.round(progress)}٪
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="اسلاید قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'توقف' : 'پخش ویدیو'}</span>
              </button>

              <button
                onClick={handleNextSlide}
                disabled={currentSlideIndex === video.slides.length - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
                title="اسلاید بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="پخش مجدد از ابتدا"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Indicators */}
            <div className="flex items-center gap-1.5">
              {video.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentSlideIndex(i);
                    setProgress(0);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlideIndex === i ? 'bg-amber-400 w-6' : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            {/* Completion Button */}
            <button
              onClick={() => {
                onMarkVideoWatched(video.id);
                audio.playCorrect();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isWatched
                  ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isWatched ? 'تکمیل شده (SCORM ثبت شد)' : 'ثبت به عنوان تماشا شده (+۲۰ XP)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Educational Summary Card */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
        <Lightbulb className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white">نکته کلیدی این مبحث:</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {video.summaryNote}
          </p>
        </div>
      </div>
    </div>
  );
};
