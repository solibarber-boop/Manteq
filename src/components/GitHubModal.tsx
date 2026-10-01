import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Terminal, 
  Sparkles, 
  FolderGit2, 
  KeyRound, 
  UploadCloud, 
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { audio } from '../services/audioService';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLinkGitHubUser: (username: string, avatarUrl: string) => void;
  linkedUser?: { username: string; avatarUrl: string };
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  onLinkGitHubUser,
  linkedUser,
}) => {
  const [token, setToken] = useState<string>('');
  const [repoName, setRepoName] = useState<string>('manteq-g10-scorm');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{
    repoUrl: string;
    owner: string;
  } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleVerifyAndSync = async () => {
    if (!token.trim()) {
      setErrorMsg('لطفاً توکن دسترسی شخصی (GitHub Personal Access Token) خود را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Verify User
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      if (!userRes.ok) {
        throw new Error('توکن گیت‌هاب نامعتبر است یا منقضی شده است. دسترسی "repo" مورد نیاز است.');
      }

      const userData = await userRes.json();
      onLinkGitHubUser(userData.login, userData.avatar_url);

      // 2. Create Repository
      const createRepoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: repoName.trim() || 'manteq-g10-scorm',
          description: 'بسته تعاملی درس ۱ منطق پایه دهم منطبق بر استاندارد SCORM 1.2',
          private: isPrivate,
          auto_init: false,
        }),
      });

      let repoData;
      if (createRepoRes.status === 422) {
        // Repository already exists, fetch it
        const getRepoRes = await fetch(`https://api.github.com/repos/${userData.login}/${repoName.trim()}`, {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });
        repoData = await getRepoRes.json();
      } else if (!createRepoRes.ok) {
        const errJson = await createRepoRes.json();
        throw new Error(errJson.message || 'خطا در ساخت مخزن گیت‌هاب');
      } else {
        repoData = await createRepoRes.json();
      }

      audio.playCorrect();
      setSuccessInfo({
        repoUrl: repoData.html_url,
        owner: userData.login,
      });
    } catch (err: unknown) {
      audio.playWrong();
      setErrorMsg(err instanceof Error ? err.message : 'خطای برقراری ارتباط با گیت‌هاب');
    } finally {
      setIsLoading(false);
    }
  };

  const terminalCommands = `git remote add origin https://github.com/${linkedUser?.username || '<نام‌کاربری-گیت‌هاب>'}/${repoName}.git
git branch -M main
git push -u origin main`;

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(terminalCommands);
    setCopiedCmd(true);
    audio.playCorrect();
    setTimeout(() => setCopiedCmd(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                اتصال پروژه به گیت‌هاب (GitHub Integration)
              </h3>
              <p className="text-[11px] text-slate-400">
                همگام‌سازی مستقیم سورس‌کد، ساخت خودکار مخزن یا اتصال از طریق ترمینال
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Linked User Profile (If connected) */}
          {linkedUser && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-800/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={linkedUser.avatarUrl}
                  alt={linkedUser.username}
                  className="w-10 h-10 rounded-full border border-emerald-500"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <span>{linkedUser.username}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-emerald-400">حساب کاربری گیت‌هاب متصل است</span>
                </div>
              </div>
            </div>
          )}

          {/* Method 1: Auto Sync via GitHub Token */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>روش اول: اتصال مستقیم با Personal Access Token (پیشنهادی)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              با ایجاد یک توکن در گیت‌هاب با دسترسی <code className="text-amber-300 font-mono">repo</code>، مخزن به صورت خودکار در حساب شما ایجاد و متصل می‌شود:
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">
                  توکن دسترسی گیت‌هاب (Personal Access Token):
                </label>
                <input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=Manteq%20G10%20SCORM%20App"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-amber-400 hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <span>ساخت توکن در گیت‌هاب (کلیک کنید)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">
                    نام مخزن (Repository Name):
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isPrivate"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900"
                  />
                  <label htmlFor="isPrivate" className="text-slate-300 text-xs cursor-pointer">
                    مخزن خصوصی (Private) باشد
                  </label>
                </div>
              </div>

              <button
                onClick={handleVerifyAndSync}
                disabled={isLoading}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isLoading ? 'در حال برقراری ارتباط با GitHub...' : 'اتصال و ایجاد مخزن در گیت‌هاب'}</span>
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 flex items-center gap-2 text-[11px]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successInfo && (
              <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 space-y-1 text-[11px]">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>مخزن گیت‌هاب با موفقیت ایجاد و متصل شد!</span>
                </div>
                <a
                  href={successInfo.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 hover:underline flex items-center gap-1 font-mono"
                >
                  <span>{successInfo.repoUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Method 2: Command Line CLI Guide */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>روش دوم: اتصال از طریق ترمینال (Git CLI):</span>
              </span>

              <button
                onClick={handleCopyCommands}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedCmd ? 'کپی شد!' : 'کپی دستورات'}</span>
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed" dir="ltr">
              {terminalCommands}
            </div>

            <p className="text-[11px] text-slate-400">
              مخزن محلی Git با موفقیت در پروژه راه‌اندازی و کامیت اولیه ساخته شده است. کافیست دستورات فوق را در خط فرمان اجرا فرمایید.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
