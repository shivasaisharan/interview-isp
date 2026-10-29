import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles, Briefcase, ArrowRight, User, Building2, CheckCircle2,
  ShieldAlert, ShieldCheck, ArrowLeft, ArrowRight as ArrowRightIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PortalSelect() {
  const { loginCandidate, loginHR } = useAuth();
  const navigate = useNavigate();

  const handleQuickCandidateLogin = async () => {
    try {
      await loginCandidate('alex.chen@example.com', 'candidate123');
      navigate('/candidate/dashboard');
    } catch (err) {
      navigate('/candidate/login');
    }
  };

  const handleQuickHrLogin = async () => {
    try {
      await loginHR('hr@smartrecruit.io', 'recruiter123');
      navigate('/hr/dashboard');
    } catch (err) {
      navigate('/hr/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-12 sm:py-16 flex flex-col justify-center">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Portal Selection
          </span>
        </div>

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Dual-Portal Role Separation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Access Portal
          </h1>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Please select your role to proceed to your dedicated portal. Candidates and HR recruiters have strictly isolated, secure environments.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Candidate Portal */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-500 transition-all flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 mb-6">
                <User className="w-7 h-7" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Job Seeker & Professional</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1 mb-3">Candidate Portal</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                Apply for open positions, upload and verify your resume, participate in turn-by-turn AI mock interviews, and review your performance scorecards.
              </p>

              <div className="space-y-2.5 mb-8 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Interactive AI voice & text interview room</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Resume analysis & skills coverage feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real-time application status tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Blind-screening PII protection</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-slate-100">
              <Link
                to="/candidate/login"
                className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                Sign In to Candidate Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/candidate/register"
                  className="flex-1 py-2.5 text-center rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Create Account
                </Link>
                <button
                  type="button"
                  onClick={handleQuickCandidateLogin}
                  className="flex-1 py-2.5 text-center rounded-xl bg-brand-50 text-brand-700 text-xs font-bold hover:bg-brand-100 transition-colors cursor-pointer"
                  title="Sign in with Alex Chen demo account"
                >
                  1-Click Demo Login
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: HR Recruiter Portal */}
          <div className="bg-slate-950 rounded-3xl p-8 border border-slate-800 shadow-xl hover:shadow-2xl hover:border-indigo-500 transition-all flex flex-col justify-between relative overflow-hidden group text-slate-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-950/50 rounded-bl-full -z-0 transition-transform group-hover:scale-110" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 mb-6">
                <Briefcase className="w-7 h-7" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Enterprise Talent Acquisition</span>
              <h2 className="text-2xl font-bold text-white mt-1 mb-3">HR Recruiter Portal</h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Post and edit job requirements, inspect candidate resumes and Q&A documents, evaluate 3-way job fit (Perfect / Fit / Unfit), and conduct direct 1-on-1 human recruiter interviews.
              </p>

              <div className="space-y-2.5 mb-8 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Edit job descriptions & competencies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Inspect candidate resumes & Q&A documents</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>🌟 Perfect / ✅ Fit / ❌ Unfit 3-way evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Exclusive human final decision authority & audit</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-3 pt-6 border-t border-slate-800">
              <Link
                to="/hr/login"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                Sign In to HR Recruiter Portal
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-between gap-3">
                <Link
                  to="/hr/register"
                  className="flex-1 py-2.5 text-center rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-900 transition-colors"
                >
                  Register Organization
                </Link>
                <button
                  type="button"
                  onClick={handleQuickHrLogin}
                  className="flex-1 py-2.5 text-center rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-800/80 text-xs font-bold hover:bg-indigo-900 transition-colors cursor-pointer"
                  title="Sign in with Sarah Jenkins demo HR account"
                >
                  1-Click Demo Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

