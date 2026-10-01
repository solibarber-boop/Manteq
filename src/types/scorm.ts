export type SCORMVersion = '1.2' | '2004';

export type LessonStatus = 'not attempted' | 'incomplete' | 'completed' | 'passed' | 'failed';

export interface SCORMDataModel {
  version: SCORMVersion;
  lesson_status: LessonStatus;
  score_raw: number;
  score_min: number;
  score_max: number;
  score_scaled?: number;
  student_id: string;
  student_name: string;
  lesson_location: string;
  total_time: string;
  suspend_data: string;
  session_time: string;
  comments: string;
}

export interface SCORMEventLog {
  timestamp: string;
  action: string;
  parameter?: string;
  value?: string;
  result: boolean | string;
}

export interface MicroVideoSlide {
  id: string;
  title: string;
  subtitle: string;
  visualType: 'courtroom' | 'scale' | 'dashboard' | 'concept_tree' | 'market';
  dialogue?: {
    speaker: string;
    text: string;
    role: 'master' | 'student' | 'narrator' | 'judge';
  }[];
  narration: string;
  durationSeconds: number;
  bulletPoints: string[];
}

export interface MicroVideoModule {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: string;
  description: string;
  targetConcept: string;
  slides: MicroVideoSlide[];
  summaryNote: string;
}

export interface QuizQuestion {
  id: string;
  stageId: string;
  questionText: string;
  contextText?: string;
  options: string[];
  correctOptionIndex: number;
  sourceTextbookPage: number;
  smartFeedback: {
    correctExplanation: string;
    wrongExplanation: string;
    keyTakeaway: string;
    fallacyType?: string;
  };
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  bookPages: string;
  estimatedMinutes: number;
  requiredXp: number;
  topics: string[];
  hasVideo: boolean;
  hasQuiz: boolean;
  hasInteractive: boolean;
  interactiveType?: 'puzzles' | 'courtroom' | 'scale' | 'exercises' | 'timeline';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'video' | 'quiz' | 'mastery';
  unlockedAt?: string;
  requirementText: string;
  xpReward: number;
}

export interface UserProgress {
  studentName: string;
  studentId: string;
  currentStageId: string;
  completedStageIds: string[];
  watchedVideoIds: string[];
  completedQuizIds: string[];
  quizAnswers: Record<string, number>;
  quizScores: Record<string, number>;
  totalXp: number;
  level: number;
  streakDays: number;
  unlockedBadgeIds: string[];
  scaleGameHighScore: number;
  courtroomSolved: boolean;
  exerciseCompletedCount: number;
  lastActiveDate: string;
}
