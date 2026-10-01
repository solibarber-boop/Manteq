/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RoadmapView } from './components/RoadmapView';
import { MicroVideoPlayer } from './components/MicroVideoPlayer';
import { QuizSystem } from './components/QuizSystem';
import { LogicScaleGame } from './components/LogicScaleGame';
import { CourtroomDilemma } from './components/CourtroomDilemma';
import { ExercisesWorkshop } from './components/ExercisesWorkshop';
import { BadgesModal } from './components/BadgesModal';
import { ScormInspectorModal } from './components/ScormInspectorModal';
import { StudentReportCard } from './components/StudentReportCard';
import { GitHubModal } from './components/GitHubModal';
import { ShareModal } from './components/ShareModal';

import { scormService } from './services/scormService';
import { audio } from './services/audioService';
import { UserProgress, SCORMDataModel, SCORMEventLog, RoadmapStage } from './types/scorm';
import { BADGES_LIST } from './data/lessonData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('roadmap');
  const [selectedVideoId, setSelectedVideoId] = useState<string | undefined>();
  const [selectedQuizStageId, setSelectedQuizStageId] = useState<string | undefined>();

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [badgesModalOpen, setBadgesModalOpen] = useState<boolean>(false);
  const [scormInspectorOpen, setScormInspectorOpen] = useState<boolean>(false);
  const [reportCardOpen, setReportCardOpen] = useState<boolean>(false);
  const [gitHubModalOpen, setGitHubModalOpen] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [linkedGitHubUser, setLinkedGitHubUser] = useState<{ username: string; avatarUrl: string } | undefined>();

  const [scormModel, setScormModel] = useState<SCORMDataModel>(scormService.getModel());
  const [scormLogs, setScormLogs] = useState<SCORMEventLog[]>(scormService.getLogs());

  // User Gamification Progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = scormService.getSuspendData<UserProgress>();
    if (saved) return saved;

    return {
      studentName: 'دانش‌آموز پایه دهم (رشته انسانی/معارف)',
      studentId: 'STD-1403-1001',
      currentStageId: 'stage_1',
      completedStageIds: ['stage_1'],
      watchedVideoIds: [],
      completedQuizIds: [],
      quizAnswers: {},
      quizScores: {},
      totalXp: 45,
      level: 1,
      streakDays: 3,
      unlockedBadgeIds: ['b_welcome'],
      scaleGameHighScore: 0,
      courtroomSolved: false,
      exerciseCompletedCount: 0,
      lastActiveDate: new Date().toISOString(),
    };
  });

  // Subscribe to SCORM service changes
  useEffect(() => {
    const unsubscribe = scormService.subscribe((model, logs) => {
      setScormModel(model);
      setScormLogs(logs);
    });

    const commitInterval = setInterval(() => {
      scormService.commit();
    }, 15000);

    return () => {
      unsubscribe();
      clearInterval(commitInterval);
    };
  }, []);

  // Sync Progress to SCORM suspend_data
  useEffect(() => {
    scormService.saveSuspendData(progress as unknown as Record<string, unknown>);
  }, [progress]);

  const addXp = (amount: number) => {
    audio.playXpGain();
    let didLevelUp = false;
    setProgress((prev) => {
      const newXp = prev.totalXp + amount;
      const newLevel = Math.floor(newXp / 150) + 1;
      if (newLevel > prev.level) {
        didLevelUp = true;
      }

      return {
        ...prev,
        totalXp: newXp,
        level: newLevel,
      };
    });

    if (didLevelUp) {
      audio.playBadgeUnlocked();
    }
  };

  const unlockBadge = (badgeId: string) => {
    let wasUnlocked = false;
    setProgress((prev) => {
      if (prev.unlockedBadgeIds.includes(badgeId)) return prev;
      wasUnlocked = true;
      const badge = BADGES_LIST.find((b) => b.id === badgeId);
      const bonusXp = badge ? badge.xpReward : 50;
      const newTotalXp = prev.totalXp + bonusXp;
      const newLevel = Math.floor(newTotalXp / 150) + 1;

      return {
        ...prev,
        unlockedBadgeIds: [...prev.unlockedBadgeIds, badgeId],
        totalXp: newTotalXp,
        level: newLevel,
      };
    });

    if (wasUnlocked) {
      audio.playBadgeUnlocked();
    }
  };

  // Video completion callback
  const handleMarkVideoWatched = (videoId: string) => {
    let unlockedStar = false;
    let earnedXp = 20;

    setProgress((prev) => {
      if (prev.watchedVideoIds.includes(videoId)) return prev;
      const updated = [...prev.watchedVideoIds, videoId];
      const newBadges = [...prev.unlockedBadgeIds];

      if (updated.length >= 4 && !newBadges.includes('b_video_star')) {
        newBadges.push('b_video_star');
        const badge = BADGES_LIST.find((b) => b.id === 'b_video_star');
        earnedXp += badge ? badge.xpReward : 80;
        unlockedStar = true;
      }

      const newTotalXp = prev.totalXp + earnedXp;
      const newLevel = Math.floor(newTotalXp / 150) + 1;

      return {
        ...prev,
        watchedVideoIds: updated,
        unlockedBadgeIds: newBadges,
        totalXp: newTotalXp,
        level: newLevel,
      };
    });

    audio.playXpGain();
    if (unlockedStar) {
      audio.playBadgeUnlocked();
    }
  };

  // Score recorded from Quiz
  const handleRecordScore = (score: number, maxScore: number, answersCount: number) => {
    scormService.setScore(score, 0, maxScore);

    setProgress((prev) => {
      // Mark stage as completed
      const nextStageIndex = prev.completedStageIds.length + 1;
      const stageKey = `stage_${nextStageIndex}`;
      const newCompleted = prev.completedStageIds.includes(stageKey)
        ? prev.completedStageIds
        : [...prev.completedStageIds, stageKey];

      return {
        ...prev,
        completedStageIds: newCompleted,
      };
    });

    if (score >= 80) {
      unlockBadge('b_quiz_master');
    }
    if (score >= 70) {
      scormService.setLessonStatus('passed');
      unlockBadge('b_scorm_certified');
    }
  };

  // Scale Game high score updated
  const handleScaleHighScore = (score: number) => {
    setProgress((prev) => ({
      ...prev,
      scaleGameHighScore: Math.max(prev.scaleGameHighScore, score),
    }));
    if (score >= 100) {
      unlockBadge('b_scale_balancer');
    }
  };

  // Courtroom Dilemma Solved
  const handleCourtroomSolved = () => {
    setProgress((prev) => {
      const newCompleted = prev.completedStageIds.includes('stage_2')
        ? prev.completedStageIds
        : [...prev.completedStageIds, 'stage_2'];

      return {
        ...prev,
        courtroomSolved: true,
        completedStageIds: newCompleted,
      };
    });
    unlockBadge('b_court_detective');
  };

  // Exercise workshop completion
  const handleExercisesCompleted = () => {
    setProgress((prev) => {
      const newCompleted = prev.completedStageIds.includes('stage_7')
        ? prev.completedStageIds
        : [...prev.completedStageIds, 'stage_7'];

      return {
        ...prev,
        exerciseCompletedCount: prev.exerciseCompletedCount + 1,
        completedStageIds: newCompleted,
      };
    });
    unlockBadge('b_workshop_expert');
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    audio.setSoundEnabled(nextState);
  };

  const handleSelectStage = (stage: RoadmapStage) => {
    if (stage.stageNumber === 2) {
      setCurrentTab('courtroom');
    } else if (stage.stageNumber === 5) {
      setCurrentTab('scale');
    } else if (stage.stageNumber === 7) {
      setCurrentTab('exercises');
    } else if (stage.hasVideo) {
      setSelectedVideoId(
        stage.stageNumber === 2 ? 'video_courtroom' :
        stage.stageNumber === 3 ? 'video_instruments' :
        stage.stageNumber === 5 ? 'video_concepts_assent' :
        stage.stageNumber === 6 ? 'video_definition_syllogism' : undefined
      );
      setCurrentTab('videos');
    } else {
      setSelectedQuizStageId(stage.id);
      setCurrentTab('quiz');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3-Zone Top Navigation Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        totalXp={progress.totalXp}
        level={progress.level}
        streakDays={progress.streakDays}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenBadges={() => setBadgesModalOpen(true)}
        onOpenScormInspector={() => setScormInspectorOpen(true)}
        onOpenGitHub={() => setGitHubModalOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
        scormStatus={scormModel.lesson_status}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {currentTab === 'roadmap' && (
          <RoadmapView
            completedStageIds={progress.completedStageIds}
            currentStageId={progress.currentStageId}
            totalXp={progress.totalXp}
            currentUserName={progress.studentName}
            currentUserLevel={progress.level}
            currentUserBadgesCount={progress.unlockedBadgeIds.length}
            currentUserStreak={progress.streakDays}
            onSelectStage={handleSelectStage}
            onOpenVideo={(videoId) => {
              setSelectedVideoId(videoId);
              setCurrentTab('videos');
            }}
            onOpenInteractive={(type) => {
              if (type === 'courtroom') setCurrentTab('courtroom');
              else if (type === 'scale') setCurrentTab('scale');
              else if (type === 'exercises') setCurrentTab('exercises');
              else setCurrentTab('quiz');
            }}
            onOpenQuiz={(stageId) => {
              setSelectedQuizStageId(stageId);
              setCurrentTab('quiz');
            }}
          />
        )}

        {currentTab === 'videos' && (
          <MicroVideoPlayer
            initialVideoId={selectedVideoId}
            watchedVideoIds={progress.watchedVideoIds}
            onMarkVideoWatched={handleMarkVideoWatched}
          />
        )}

        {currentTab === 'scale' && (
          <LogicScaleGame
            onScoreUpdate={handleScaleHighScore}
            onAddXp={addXp}
            highScore={progress.scaleGameHighScore}
          />
        )}

        {currentTab === 'courtroom' && (
          <CourtroomDilemma
            isSolved={progress.courtroomSolved}
            onSolve={handleCourtroomSolved}
            onAddXp={addXp}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizSystem
            initialStageId={selectedQuizStageId}
            onRecordScore={handleRecordScore}
            onAddXp={addXp}
          />
        )}

        {currentTab === 'exercises' && (
          <ExercisesWorkshop
            onAddXp={addXp}
            onCompleteExercise={handleExercisesCompleted}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            سازمان پژوهش و برنامه‌ریزی آموزشی · کتاب منطق پایه دهم متوسطه (درس نخست: منطق، ترازوی اندیشه)
          </span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setScormInspectorOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              کنسول SCORM
            </button>
            <span>·</span>
            <button
              onClick={() => setReportCardOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              کارنامه و گواهی
            </button>
            <span>·</span>
            <button
              onClick={() => setGitHubModalOpen(true)}
              className="hover:text-slate-300 transition-colors"
            >
              اتصال به گیت‌هاب
            </button>
          </div>
        </div>
      </footer>

      {/* Badges and Trophy Modal */}
      <BadgesModal
        isOpen={badgesModalOpen}
        onClose={() => setBadgesModalOpen(false)}
        unlockedBadgeIds={progress.unlockedBadgeIds}
        totalXp={progress.totalXp}
        level={progress.level}
        streakDays={progress.streakDays}
      />

      {/* GitHub Integration Modal */}
      <GitHubModal
        isOpen={gitHubModalOpen}
        onClose={() => setGitHubModalOpen(false)}
        onLinkGitHubUser={(username, avatarUrl) => {
          setLinkedGitHubUser({ username, avatarUrl });
          setProgress((prev) => ({
            ...prev,
            studentName: `${username} (گیت‌هاب)`,
          }));
        }}
        linkedUser={linkedGitHubUser}
      />

      {/* Share and QR Code Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        sharedUrl={typeof window !== 'undefined' && window.location.origin.includes('run.app') 
          ? window.location.origin.replace('ais-dev-', 'ais-pre-')
          : 'https://ais-pre-wosv22gwt5dkrlp7eripma-578946259289.europe-west2.run.app'}
        onDownloadScorm={() => setScormInspectorOpen(true)}
      />

      {/* SCORM Inspector & Zip Export Modal */}
      <ScormInspectorModal
        isOpen={scormInspectorOpen}
        onClose={() => setScormInspectorOpen(false)}
        scormModel={scormModel}
        scormLogs={scormLogs}
        onOpenReportCard={() => setReportCardOpen(true)}
      />

      {/* Official Student Report Card Modal */}
      <StudentReportCard
        isOpen={reportCardOpen}
        onClose={() => setReportCardOpen(false)}
        scormModel={scormModel}
        progress={progress}
      />
    </div>
  );
}
