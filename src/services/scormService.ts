import { SCORMDataModel, SCORMEventLog, LessonStatus } from '../types/scorm';

type SCORMListener = (model: SCORMDataModel, logs: SCORMEventLog[]) => void;

interface SCORM12API {
  LMSInitialize: (param: string) => string;
  LMSFinish: (param: string) => string;
  LMSGetValue: (element: string) => string;
  LMSSetValue: (element: string, value: string) => string;
  LMSCommit: (param: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (errorCode: string) => string;
  LMSGetDiagnostic: (errorCode: string) => string;
}

declare global {
  interface Window {
    API?: SCORM12API;
    API_1484_11?: unknown;
  }
}

class SCORMService {
  private isInitialized = false;
  private logs: SCORMEventLog[] = [];
  private listeners: SCORMListener[] = [];
  private startTime = Date.now();

  private model: SCORMDataModel = {
    version: '1.2',
    lesson_status: 'incomplete',
    score_raw: 0,
    score_min: 0,
    score_max: 100,
    student_id: 'STD-1403-1001',
    student_name: 'دانش‌آموز پایه دهم (رشته انسانی/معارف)',
    lesson_location: 'stage_1',
    total_time: '00:00:00',
    session_time: '00:00:00',
    suspend_data: '{}',
    comments: 'ورود به سامانه تعاملی درس اول منطق پایه دهم',
  };

  constructor() {
    this.initStandaloneOrLMS();
  }

  private addLog(action: string, parameter?: string, value?: string, result: boolean | string = true) {
    const log: SCORMEventLog = {
      timestamp: new Date().toLocaleTimeString('fa-IR'),
      action,
      parameter,
      value,
      result: String(result),
    };
    this.logs.unshift(log);
    if (this.logs.length > 50) this.logs.pop();
    this.notify();
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.model }, [...this.logs]));
  }

  public subscribe(fn: SCORMListener): () => void {
    this.listeners.push(fn);
    fn({ ...this.model }, [...this.logs]);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private findLMSAPI(win: Window): SCORM12API | null {
    let currentWin: Window | null = win;
    let attempts = 0;
    while (currentWin && attempts < 10) {
      try {
        if (currentWin.API) return currentWin.API;
      } catch {
        break;
      }
      if (currentWin.parent && currentWin.parent !== currentWin) {
        currentWin = currentWin.parent;
      } else {
        break;
      }
      attempts++;
    }
    return null;
  }

  private initStandaloneOrLMS() {
    // Check localStorage cache
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('SCORM_1_LOGIC_STATE');
        if (saved) {
          const parsed = JSON.parse(saved);
          this.model = { ...this.model, ...parsed };
        }
      } catch {
        // Ignore JSON error
      }
    }

    const lmsApi = typeof window !== 'undefined' ? this.findLMSAPI(window) : null;

    if (lmsApi) {
      try {
        const initRes = lmsApi.LMSInitialize('');
        this.isInitialized = initRes === 'true';
        this.addLog('LMSInitialize', '', '', initRes);

        const status = lmsApi.LMSGetValue('cmi.core.lesson_status') as LessonStatus;
        if (status && status !== 'not attempted') {
          this.model.lesson_status = status;
        }
        const score = lmsApi.LMSGetValue('cmi.core.score.raw');
        if (score) this.model.score_raw = parseFloat(score);

        const studentName = lmsApi.LMSGetValue('cmi.core.student_name');
        if (studentName) this.model.student_name = studentName;

        const suspend = lmsApi.LMSGetValue('cmi.suspend_data');
        if (suspend && suspend !== '') this.model.suspend_data = suspend;
      } catch (err) {
        this.addLog('LMS_ERROR', 'findAPI', String(err), false);
      }
    } else {
      // Standalone Mock SCORM 1.2
      this.isInitialized = true;
      this.addLog('SCORM_MOCK_INIT', 'Standalone Mode', 'Virtual LMS Engine Active', true);

      // Register virtual API on window for external LMS compatibility testing
      if (typeof window !== 'undefined' && !window.API) {
        window.API = {
          LMSInitialize: () => 'true',
          LMSFinish: () => 'true',
          LMSGetValue: (elem: string) => {
            switch (elem) {
              case 'cmi.core.lesson_status': return this.model.lesson_status;
              case 'cmi.core.score.raw': return String(this.model.score_raw);
              case 'cmi.core.student_name': return this.model.student_name;
              case 'cmi.suspend_data': return this.model.suspend_data;
              default: return '';
            }
          },
          LMSSetValue: (elem: string, val: string) => {
            this.handleSetValue(elem, val);
            return 'true';
          },
          LMSCommit: () => {
            this.persist();
            return 'true';
          },
          LMSGetLastError: () => '0',
          LMSGetErrorString: () => 'No error',
          LMSGetDiagnostic: () => 'OK',
        };
      }
    }
  }

  private handleSetValue(element: string, value: string) {
    this.addLog('LMSSetValue', element, value, true);
    if (element === 'cmi.core.lesson_status') {
      this.model.lesson_status = value as LessonStatus;
    } else if (element === 'cmi.core.score.raw') {
      this.model.score_raw = parseFloat(value) || 0;
    } else if (element === 'cmi.core.lesson_location') {
      this.model.lesson_location = value;
    } else if (element === 'cmi.suspend_data') {
      this.model.suspend_data = value;
    }
    this.persist();
  }

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('SCORM_1_LOGIC_STATE', JSON.stringify(this.model));
      } catch {
        // Ignore
      }
    }
    this.notify();
  }

  public setLessonStatus(status: LessonStatus) {
    this.model.lesson_status = status;
    const lmsApi = typeof window !== 'undefined' ? this.findLMSAPI(window) : null;
    if (lmsApi) {
      try {
        lmsApi.LMSSetValue('cmi.core.lesson_status', status);
        lmsApi.LMSCommit('');
      } catch {
        // Fallback
      }
    }
    this.addLog('SetLessonStatus', 'cmi.core.lesson_status', status, true);
    this.persist();
  }

  public setScore(rawScore: number, min: number = 0, max: number = 100) {
    this.model.score_raw = Math.round(rawScore);
    this.model.score_min = min;
    this.model.score_max = max;
    if (this.model.score_raw >= 70 && this.model.lesson_status !== 'completed') {
      this.model.lesson_status = 'passed';
    }

    const lmsApi = typeof window !== 'undefined' ? this.findLMSAPI(window) : null;
    if (lmsApi) {
      try {
        lmsApi.LMSSetValue('cmi.core.score.raw', String(this.model.score_raw));
        lmsApi.LMSSetValue('cmi.core.score.min', String(min));
        lmsApi.LMSSetValue('cmi.core.score.max', String(max));
        if (this.model.score_raw >= 70) {
          lmsApi.LMSSetValue('cmi.core.lesson_status', 'passed');
        }
        lmsApi.LMSCommit('');
      } catch {
        // Fallback
      }
    }
    this.addLog('SetScore', 'cmi.core.score.raw', `${this.model.score_raw} / ${max}`, true);
    this.persist();
  }

  public setLessonLocation(location: string) {
    this.model.lesson_location = location;
    const lmsApi = typeof window !== 'undefined' ? this.findLMSAPI(window) : null;
    if (lmsApi) {
      try {
        lmsApi.LMSSetValue('cmi.core.lesson_location', location);
        lmsApi.LMSCommit('');
      } catch {
        // Fallback
      }
    }
    this.addLog('SetLocation', 'cmi.core.lesson_location', location, true);
    this.persist();
  }

  public saveSuspendData(data: Record<string, unknown>) {
    const str = JSON.stringify(data);
    this.model.suspend_data = str;
    const lmsApi = typeof window !== 'undefined' ? this.findLMSAPI(window) : null;
    if (lmsApi) {
      try {
        lmsApi.LMSSetValue('cmi.suspend_data', str);
        lmsApi.LMSCommit('');
      } catch {
        // Fallback
      }
    }
    this.persist();
  }

  public getSuspendData<T>(): T | null {
    try {
      if (this.model.suspend_data && this.model.suspend_data !== '{}') {
        return JSON.parse(this.model.suspend_data) as T;
      }
    } catch {
      return null;
    }
    return null;
  }

  public commit() {
    const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const hrs = String(Math.floor(elapsedSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(elapsedSeconds % 60).padStart(2, '0');
    this.model.session_time = `${hrs}:${mins}:${secs}`;

    const lmsApi = typeof window !== 'undefined' ? this.findLMSAPI(window) : null;
    if (lmsApi) {
      try {
        lmsApi.LMSSetValue('cmi.core.session_time', this.model.session_time);
        lmsApi.LMSCommit('');
      } catch {
        // Fallback
      }
    }
    this.addLog('LMSCommit', 'Session Sync', `Time: ${this.model.session_time}`, true);
    this.persist();
  }

  public getModel(): SCORMDataModel {
    return { ...this.model };
  }

  public getLogs(): SCORMEventLog[] {
    return [...this.logs];
  }
}

export const scormService = new SCORMService();
