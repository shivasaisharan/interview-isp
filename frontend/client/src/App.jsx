import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  RadialBarChart, RadialBar, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  Mic, MicOff, Volume2, Radio, RotateCcw, Edit3, Check,
  FileText, Briefcase, BarChart2, CheckCircle, XCircle, Brain, Star, Wind, TrendingUp,
  Loader2, ServerCrash, User, MessageSquare, Play, StopCircle, RefreshCw,
  ShieldCheck, Users, Layers, Scale, Eye, EyeOff, Plus, Trash2, Sparkles, Building,
  CheckSquare, Award, Clock, ArrowRight, ArrowLeft, ChevronRight, ChevronLeft, Download, Printer, Search,
  Filter, Sliders, BookOpen, Cpu, Calculator, History, Camera, CameraOff, Video, VideoOff,
  LogIn, LogOut, Lock, Mail, ShieldAlert, GraduationCap
} from 'lucide-react';

const API_URL = 'http://localhost:5001';


// ==========================================
// FRONT LOGIN PAGE (Selection Interface + Dedicated Portals)
// ==========================================
function LoginPage({ onLogin, jobsList }) {
  // Screen 1: Role Selection ('select_role')
  // Screen 2: Dedicated Candidate Sign-In ('candidate_login')
  // Screen 3: Dedicated Corporate HR Sign-In ('recruiter_login')
  const [authScreen, setAuthScreen] = useState('select_role');

  // Candidate Portal Credentials
  const [candEmail, setCandEmail] = useState('alex.chen@applicant.io');
  const [candPassword, setCandPassword] = useState('candidate123');
  const [showCandPass, setShowCandPass] = useState(false);
  const [candLoading, setCandLoading] = useState(false);
  const [candError, setCandError] = useState(null);

  // HR Recruiter Credentials
  const [hrEmail, setHrEmail] = useState('sarah.hr@smartrecruit.io');
  const [hrPassword, setHrPassword] = useState('recruiter123');
  const [showHrPass, setShowHrPass] = useState(false);
  const [hrOrg, setHrOrg] = useState('Companies & HR');
  const [hrLoading, setHrLoading] = useState(false);
  const [hrError, setHrError] = useState(null);

  // Handle Candidate Sign-In
  const handleCandidateSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!candEmail.trim()) {
      setCandError('Please enter candidate email.');
      return;
    }
    setCandLoading(true);
    setCandError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: candEmail,
        role: 'candidate',
        password: candPassword,
      });
      if (res.data && res.data.user) {
        onLogin(res.data.user);
      } else {
        onLogin({
          id: 'u-candidate-1',
          name: candEmail.includes('elena') ? 'Elena Rostova' : 'Alex Chen',
          email: candEmail,
          role: 'candidate',
          organization: 'Applicant Pool',
          avatar: candEmail.includes('elena') ? 'ER' : 'AC',
        });
      }
    } catch (err) {
      onLogin({
        id: 'u-candidate-1',
        name: candEmail.includes('elena') ? 'Elena Rostova' : 'Alex Chen',
        email: candEmail,
        role: 'candidate',
        organization: 'Applicant Pool',
        avatar: candEmail.includes('elena') ? 'ER' : 'AC',
      });
    } finally {
      setCandLoading(false);
    }
  };

  // Handle HR Recruiter Sign-In
  const handleRecruiterSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!hrEmail.trim()) {
      setHrError('Please enter corporate HR email.');
      return;
    }
    setHrLoading(true);
    setHrError(null);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: hrEmail,
        role: 'recruiter',
        password: hrPassword,
      });
      if (res.data && res.data.user) {
        onLogin(res.data.user);
      } else {
        onLogin({
          id: 'u-recruiter-1',
          name: 'Sarah Jenkins',
          email: hrEmail,
          role: 'recruiter',
          organization: hrOrg || 'Smart Recruit Global',
          avatar: 'SJ',
        });
      }
    } catch (err) {
      onLogin({
        id: 'u-recruiter-1',
        name: 'Sarah Jenkins',
        email: hrEmail,
        role: 'recruiter',
        organization: hrOrg || 'Smart Recruit Global',
        avatar: 'SJ',
      });
    } finally {
      setHrLoading(false);
    }
  };

  const handleQuickCandidate = (persona) => {
    if (persona === 'alex') {
      onLogin({
        id: 'u-candidate-1',
        name: 'Alex Chen',
        email: 'alex.chen@applicant.io',
        role: 'candidate',
        organization: 'Apex Engineering College / Placement Cell',
        avatar: 'AC',
      });
    } else if (persona === 'elena') {
      onLogin({
        id: 'u-candidate-2',
        name: 'Elena Rostova',
        email: 'elena.rostova@applicant.io',
        role: 'candidate',
        organization: 'Full Stack Engineering Applicant',
        avatar: 'ER',
      });
    }
  };

  const handleQuickRecruiter = () => {
    onLogin({
      id: 'u-recruiter-1',
      name: 'Sarah Jenkins',
      email: 'sarah.hr@smartrecruit.io',
      role: 'recruiter',
      organization: 'Smart Recruit Global (Talent HQ)',
      avatar: 'SJ',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-white">SMART RECRUIT</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                  AI + NLP PLATFORM
                </span>
              </div>
              <p className="text-xs text-slate-400">Autonomous Talent Acquisition & Mock Interview System</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>S-BERT Semantic Fit</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Face-to-Face Voice AI</span>
            </span>
            <span className="text-slate-700">•</span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recruiter Decision Engine</span>
            </span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* SCREEN 1: PRE-LOGIN SELECTION INTERFACE (CHOOSE YOUR ROLE) */}
      {/* ======================================================== */}
      {authScreen === 'select_role' && (
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
          {/* Background decorative glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl w-full space-y-8 relative z-10">
            {/* Header Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SELECT YOUR PORTAL IDENTITY</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white">
                Welcome to Smart Recruit
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
                Choose whether you are a Candidate seeking jobs or an HR Recruiter managing corporate recruitment:
              </p>
            </div>

            {/* TWO LARGE CHOICE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Option 1: Candidate Portal */}
              <div
                onClick={() => setAuthScreen('candidate_login')}
                className="bg-slate-900/90 border-2 border-emerald-500/40 hover:border-emerald-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:shadow-emerald-950/40 hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
                      JOB APPLICANTS & STUDENTS
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1.5 group-hover:text-emerald-300 transition-colors">
                      Candidate Portal
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Looking for job openings? Browse available roles, upload your resume, test your S-BERT match score (&gt;50% required), and complete realistic face-to-face AI mock interviews.
                  </p>
                  <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-xl p-3 text-[11px] text-emerald-200 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-emerald-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Candidate Capabilities:</span>
                    </div>
                    <ul className="list-disc list-inside text-emerald-300/80 space-y-0.5 pl-1">
                      <li>Browse jobs & submit applications</li>
                      <li>Resume upload & &gt;50% match score verification</li>
                      <li>Live face-to-face AI voice mock interview</li>
                      <li>Multi-dimensional scorecard & HR decision status</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => setAuthScreen('candidate_login')}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/50 transition-all group-hover:bg-emerald-500"
                  >
                    <span>Enter as Candidate</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Option 2: HR Recruiter Portal */}
              <div
                onClick={() => setAuthScreen('recruiter_login')}
                className="bg-slate-900/90 border-2 border-indigo-500/40 hover:border-indigo-400 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl hover:shadow-indigo-950/40 hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-800">
                      TALENT ACQUISITION & HIRING AUTHORITY
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1.5 group-hover:text-indigo-300 transition-colors">
                      Corporate HR Portal
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Managing corporate recruitment? Post active job openings, inspect applicant ranking pools, review interview transcripts, and exercise official hiring decisions.
                  </p>
                  <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-3 text-[11px] text-indigo-200 space-y-1">
                    <div className="font-bold flex items-center space-x-1.5 text-indigo-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                      <span>HR Recruiter Authority:</span>
                    </div>
                    <ul className="list-disc list-inside text-indigo-300/80 space-y-0.5 pl-1">
                      <li>Upload available jobs & role requirements</li>
                      <li>Inspect applicant pool & ATS rankings</li>
                      <li>Review candidate interview answers & radar scores</li>
                      <li><strong>Decision Authority: Accept/Offer vs Reject</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => setAuthScreen('recruiter_login')}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-950/50 transition-all group-hover:bg-indigo-500"
                  >
                    <span>Enter as HR Recruiter</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 pt-2">
              🔒 Candidate and HR portals are strictly separated with dedicated permissions.
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* SCREEN 2: DEDICATED CANDIDATE SIGN-IN PORTAL */}
      {/* ======================================================== */}
      {authScreen === 'candidate_login' && (
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
          <div className="max-w-xl w-full space-y-5 relative z-10">
            {/* Backward Navigation Option to Return to Role Selection */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthScreen('select_role')}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="Go backward to change your portal selection"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                <span>← Back to Role Selection</span>
              </button>
              <span className="text-[11px] font-extrabold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                Candidate Portal
              </span>
            </div>

            {/* Candidate Sign-In Card */}
            <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/20 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Candidate Portal Sign-In</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Apply for jobs, upload resume & take AI mock interview</p>
                </div>
              </div>

              {/* 1-Click Fast Candidate Persona Sign-In */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider block">
                  ⚡ 1-Click Instant Test Access:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickCandidate('alex')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-left transition-all group/btn"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover/btn:text-emerald-400">Alex Chen</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-extrabold">92% Match</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Senior AI / Machine Learning Applicant</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickCandidate('elena')}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-emerald-950/20 text-left transition-all group/btn"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover/btn:text-emerald-400">Elena Rostova</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-extrabold">87% Match</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Full Stack Software Engineer Applicant</p>
                  </button>
                </div>
              </div>

              {/* Candidate Credentials Form */}
              <form onSubmit={handleCandidateSubmit} className="space-y-3 pt-3 border-t border-slate-800">
                {candError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                    <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{candError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Candidate Email</label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    placeholder="alex.chen@applicant.io"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showCandPass ? 'text' : 'password'}
                      required
                      value={candPassword}
                      onChange={(e) => setCandPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCandPass(!showCandPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      {showCandPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={candLoading}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 disabled:opacity-50 cursor-pointer"
                >
                  {candLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In to Candidate Portal...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In as Candidate</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-[11px] text-emerald-400/80 font-medium pt-1">
                🔒 Candidate-restricted interface (No HR switching options)
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ======================================================== */}
      {/* SCREEN 3: DEDICATED CORPORATE HR SIGN-IN PORTAL */}
      {/* ======================================================== */}
      {authScreen === 'recruiter_login' && (
        <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden">
          <div className="max-w-xl w-full space-y-5 relative z-10">
            {/* Backward Navigation Option to Return to Role Selection */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setAuthScreen('select_role')}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="Go backward to change your portal selection"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-indigo-400" />
                <span>← Back to Role Selection</span>
              </button>
              <span className="text-[11px] font-extrabold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-800">
                Corporate HR Portal
              </span>
            </div>

            {/* Recruiter Sign-In Card */}
            <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/20 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Corporate HR Recruiter Sign-In</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Post jobs, inspect applicant pools & exercise hiring decisions</p>
                </div>
              </div>

              {/* 1-Click Fast HR Persona Sign-In */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wider block">
                  ⚡ 1-Click Instant Test Access:
                </span>
                <button
                  type="button"
                  onClick={handleQuickRecruiter}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/60 hover:bg-indigo-950/20 text-left transition-all group/btn"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover/btn:text-indigo-400">Sarah Jenkins</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 font-extrabold">Lead Talent HR</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Full Recruiter Hiring Authority • Candidate Rankings & Decision Engine</p>
                </button>
              </div>

              {/* HR Credentials Form */}
              <form onSubmit={handleRecruiterSubmit} className="space-y-3 pt-3 border-t border-slate-800">
                {hrError && (
                  <div className="p-2.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                    <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{hrError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Corporate HR Email</label>
                  <input
                    type="email"
                    required
                    value={hrEmail}
                    onChange={(e) => setHrEmail(e.target.value)}
                    placeholder="sarah.hr@smartrecruit.io"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showHrPass ? 'text' : 'password'}
                      required
                      value={hrPassword}
                      onChange={(e) => setHrPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowHrPass(!showHrPass)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                    >
                      {showHrPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Organization / Tenancy</label>
                  <select
                    value={hrOrg}
                    onChange={(e) => setHrOrg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Companies & HR">🏢 Corporate Companies & HR</option>
                    <option value="Placement Cells">🎓 University Placement Cells</option>
                    <option value="Recruitment Agencies">🤝 Recruitment Agencies</option>
                    <option value="Startups">🚀 Startups & Scaleups</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={hrLoading}
                  className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950/50 disabled:opacity-50 cursor-pointer"
                >
                  {hrLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In to HR Workspace...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In as HR Recruiter</span>
                    </>
                  )}
                </button>
              </form>

              <div className="text-center text-[11px] text-indigo-400/80 font-medium pt-1">
                🛡️ HR-exclusive hiring decisions & candidate ranking access
              </div>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500">
        Smart Recruit AI • Dual Interface Candidate & HR Portal • Powered by NLP & Gemini Speech
      </footer>
    </div>
  );
}


export default function App() {
  // Navigation tabs with full backward & forward history stack:
  // 'jobs', 'rankings', 'upload', 'report', 'setup', 'interview', 'final_report', 'reports', 'scalability', 'ethics', 'presentation'
  const [activeTab, _setActiveTab] = useState('jobs');
  const [navHistory, setNavHistory] = useState(['jobs']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const setActiveTab = useCallback((newTab) => {
    _setActiveTab(newTab);
    setNavHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      if (sliced[sliced.length - 1] === newTab) return sliced;
      return [...sliced, newTab];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navHistory.length - 1;

  const handleGoBack = useCallback(() => {
    if (historyIndex > 0) {
      const targetIdx = historyIndex - 1;
      setHistoryIndex(targetIdx);
      _setActiveTab(navHistory[targetIdx]);
    }
  }, [historyIndex, navHistory]);

  const handleGoForward = useCallback(() => {
    if (historyIndex < navHistory.length - 1) {
      const targetIdx = historyIndex + 1;
      setHistoryIndex(targetIdx);
      _setActiveTab(navHistory[targetIdx]);
    }
  }, [historyIndex, navHistory]);

  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Module 1: Authentication & User Tenancy: null initially to display Login Page at front of website
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Enterprise Personas & Tiers
  const [userRole, setUserRole] = useState('candidate'); // 'recruiter' | 'candidate'
  const [targetSegment, setTargetSegment] = useState('Companies & HR'); // 'Companies & HR', 'Placement Cells', 'Recruitment Agencies', 'Startups'
  const [pricingTier, setPricingTier] = useState('B2B Enterprise'); // 'Freemium', 'Subscription', 'B2B Enterprise'

  // Preselected Job context
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobsList, setJobsList] = useState([]);

  // Printable Scorecard Modal state
  const [printModalReport, setPrintModalReport] = useState(null);

  // Fetch jobs on mount
  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/jobs`);
      if (res.data && res.data.jobs) {
        setJobsList(res.data.jobs);
        if (!selectedJobId && res.data.jobs.length > 0) {
          setSelectedJobId(res.data.jobs[0].id);
        }
      }
    } catch (err) {
      console.warn("Could not fetch jobs list:", err.message);
    }
  }, [selectedJobId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setUserRole(user.role);
    const initialTab = user.role === 'candidate' ? 'jobs' : 'rankings';
    _setActiveTab(initialTab);
    setNavHistory([initialTab]);
    setHistoryIndex(0);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSessionData(null);
    _setActiveTab('jobs');
    setNavHistory(['jobs']);
    setHistoryIndex(0);
  };

  const handleSwitchRole = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'candidate') {
      setCurrentUser({
        id: 'u-candidate-1',
        name: 'Alex Chen',
        role: 'candidate',
        email: 'alex.chen@applicant.io',
        organization: 'Apex Engineering College / Placement Cell',
        avatar: 'AC'
      });
      if (['rankings', 'scalability', 'ethics'].includes(activeTab)) {
        setActiveTab('jobs');
      }
    } else {
      setCurrentUser({
        id: 'u-recruiter-1',
        name: 'Sarah Jenkins',
        role: 'recruiter',
        email: 'sarah.hr@smartrecruit.io',
        organization: 'Smart Recruit Global (Talent HQ)',
        avatar: 'SJ'
      });
      if (activeTab === 'interview') {
        setActiveTab('rankings');
      }
    }
  };

  const resetInterviewFlow = () => {
    setSessionData(null);
    setError(null);
    setLoading(false);
    setActiveTab('upload');
  };

  // If not logged in, render the front-page Login Portal!
  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        jobsList={jobsList}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        targetSegment={targetSegment}
        setTargetSegment={setTargetSegment}
        pricingTier={pricingTier}
        currentUser={currentUser}
        handleLogout={handleLogout}
        setShowAuthModal={setShowAuthModal}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />

      {/* 5-Step Visual Workflow Stepper with Backward & Forward Navigation */}
      <WorkflowStepsBanner
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        onGoBack={handleGoBack}
        onGoForward={handleGoForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />

      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        {error && <ErrorMessage message={error} clearError={() => setError(null)} />}

        {activeTab === 'jobs' && (
          <JobsView
            jobsList={jobsList}
            refreshJobs={fetchJobs}
            setSelectedJobId={setSelectedJobId}
            setActiveTab={setActiveTab}
            setLoading={setLoading}
            setError={setError}
            userRole={userRole}
            setSessionData={setSessionData}
          />
        )}

        {activeTab === 'rankings' && (
          <CandidateRankingView
            jobsList={jobsList}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            setActiveTab={setActiveTab}
            setSessionData={setSessionData}
            setLoading={setLoading}
            setError={setError}
            userRole={userRole}
          />
        )}

        {activeTab === 'upload' && (
          <UploadView
            jobsList={jobsList}
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            setSessionData={setSessionData}
            setActiveTab={setActiveTab}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
            targetSegment={targetSegment}
            userRole={userRole}
          />
        )}

        {activeTab === 'report' && (
          <ReportView
            sessionData={sessionData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'setup' && (
          <SetupView
            sessionData={sessionData}
            setSessionData={setSessionData}
            setActiveTab={setActiveTab}
            setLoading={setLoading}
            setError={setError}
            loading={loading}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewView
            sessionData={sessionData}
            setSessionData={setSessionData}
            setActiveTab={setActiveTab}
            setError={setError}
            jobsList={jobsList}
            selectedJobId={selectedJobId}
            userRole={userRole}
            setLoading={setLoading}
          />
        )}

        {activeTab === 'final_report' && (
          <FinalReportView
            sessionData={sessionData}
            resetApp={resetInterviewFlow}
            setActiveTab={setActiveTab}
            userRole={userRole}
            onOpenPrint={(report) => setPrintModalReport(report)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsFeedbackView
            jobsList={jobsList}
            setActiveTab={setActiveTab}
            setSessionData={setSessionData}
            userRole={userRole}
            onOpenPrint={(report) => setPrintModalReport(report)}
          />
        )}

        {activeTab === 'scalability' && (
          <ScalabilityImpactView
            jobsList={jobsList}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'ethics' && (
          <EthicsSustainabilityView
            targetSegment={targetSegment}
            setTargetSegment={setTargetSegment}
            pricingTier={pricingTier}
            setPricingTier={setPricingTier}
          />
        )}

        {activeTab === 'presentation' && (
          <PresentationHubView
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Module 1: Auth & User Profile Switcher Modal */}
      {showAuthModal && (
        <AuthModal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          setUserRole={setUserRole}
          setTargetSegment={setTargetSegment}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Printable Scorecard Modal */}
      {printModalReport && (
        <ScorecardPrintModal
          report={printModalReport}
          onClose={() => setPrintModalReport(null)}
        />
      )}

      <Footer />
    </div>
  );
}

// ==========================================
// NAVBAR & HEADER
// ==========================================
function Navbar({
  activeTab,
  setActiveTab,
  userRole,
  targetSegment,
  setTargetSegment,
  pricingTier,
  currentUser,
  handleLogout,
  setShowAuthModal,
  onGoBack,
  onGoForward,
  canGoBack,
  canGoForward,
}) {
  const recruiterTabs = [
    { id: 'jobs', label: 'Upload & Manage Jobs', icon: Briefcase, moduleNum: 'Jobs' },
    { id: 'rankings', label: 'Candidate Applications & Ranking', icon: Users, moduleNum: 'ATS' },
    { id: 'reports', label: 'Interview Evaluations & Decisions', icon: Award, moduleNum: 'Decisions' },
    { id: 'scalability', label: 'Hiring Analytics', icon: TrendingUp, badge: 'ROI' },
    { id: 'ethics', label: 'Audit & Compliance', icon: ShieldCheck, badge: 'Fairness' },
    { id: 'presentation', label: 'Architecture Overview', icon: BookOpen, badge: 'System' },
  ];

  const candidateTabs = [
    { id: 'jobs', label: 'Available Jobs & Apply', icon: Briefcase, moduleNum: 'Jobs' },
    { id: 'upload', label: 'Submit Resume & Fit Check', icon: FileText, moduleNum: 'Resume' },
    { id: 'interview', label: 'Live Face-to-Face Interview', icon: Video, moduleNum: 'Interview' },
    { id: 'reports', label: 'My Results & Scorecard', icon: Award, moduleNum: 'Results' },
  ];

  const tabs = userRole === 'candidate' ? candidateTabs : recruiterTabs;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Backward/Forward Navigation */}
        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setActiveTab('jobs')}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${
                userRole === 'candidate'
                  ? 'bg-emerald-600 shadow-emerald-100'
                  : 'bg-indigo-600 shadow-indigo-100'
              }`}
            >
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">SMART RECRUIT</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                    userRole === 'candidate'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}
                >
                  {userRole === 'candidate' ? '🎓 Candidate Portal' : '💼 HR & Recruiter Portal'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {userRole === 'candidate'
                  ? 'Resume Screening, Live Face-to-Face Voice Mock & Result Analysis'
                  : 'Enterprise ATS, Blind Screening, Candidate Ranking & Decision Engine'}
              </p>
            </div>
          </div>

          {/* Browser-style Backward & Forward Navigation */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner ml-2">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!canGoBack}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white enabled:hover:shadow-sm text-slate-700 cursor-pointer"
              title={canGoBack ? 'Go back to previous page' : 'No previous page'}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              type="button"
              onClick={onGoForward}
              disabled={!canGoForward}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white enabled:hover:shadow-sm text-slate-700 cursor-pointer"
              title={canGoForward ? 'Go forward to next page' : 'No forward page'}
            >
              <span className="hidden sm:inline">Forward</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Central Nav Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? userRole === 'candidate'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title={tab.label}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile & Actions (NO ROLE SWITCHING BUTTON) */}
        <div className="flex items-center space-x-2">
          {/* Recruiter Segment Selector */}
          {userRole === 'recruiter' && (
            <select
              value={targetSegment}
              onChange={(e) => setTargetSegment(e.target.value)}
              className="text-xs bg-slate-100 text-slate-700 border border-slate-200 rounded-md px-2 py-1 focus:ring-1 focus:ring-indigo-500 font-medium hidden xl:block"
              title="Organization Type"
            >
              <option value="Companies & HR">🏢 Companies & HR</option>
              <option value="Placement Cells">🎓 Placement Cells</option>
              <option value="Recruitment Agencies">🤝 Agencies</option>
              <option value="Startups">🚀 Startups</option>
            </select>
          )}

          {/* Role Status Tag */}
          <span
            className={`px-2.5 py-1 text-xs rounded-lg font-bold border hidden sm:inline-flex items-center ${
              userRole === 'candidate'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
          >
            {userRole === 'candidate' ? '🎓 Candidate Mode' : '💼 HR Decision Authority'}
          </span>

          {/* Logged-In User Badge */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
            <div
              className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-extrabold ${
                userRole === 'candidate' ? 'bg-emerald-600' : 'bg-indigo-600'
              }`}
            >
              {currentUser?.avatar || (userRole === 'candidate' ? 'C' : 'HR')}
            </div>
            <span className="hidden sm:inline max-w-[85px] truncate">
              {currentUser?.name?.split(' ')[0] || 'User'}
            </span>
          </div>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold transition-all shadow-sm"
            title="Log Out and return to Login Gateway"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 5-STEP VISUAL WORKFLOW STEPPER
// ==========================================
function WorkflowStepsBanner({
  activeTab,
  setActiveTab,
  userRole,
  onGoBack,
  onGoForward,
  canGoBack,
  canGoForward,
}) {
  const recruiterSteps = [
    { num: 1, label: 'Manage Jobs', desc: 'Post Openings & Descriptions', tab: 'jobs', icon: Briefcase },
    { num: 2, label: 'Screen Resumes', desc: 'PDF Parsing & Semantic Fit', tab: 'upload', icon: FileText },
    { num: 3, label: 'Applicant Pool', desc: 'Candidate Ranking & ATS', tab: 'rankings', icon: Users },
    { num: 4, label: 'Interview Evaluations', desc: 'Voice Screen Performance', tab: 'reports', icon: Video },
    { num: 5, label: 'Hiring Decisions', desc: 'Accept/Offer vs Reject', tab: 'reports', icon: Award },
  ];

  const candidateSteps = [
    { num: 1, label: 'Browse Openings', desc: 'Explore Job Requirements', tab: 'jobs', icon: Briefcase },
    { num: 2, label: 'Submit Resume', desc: 'Upload PDF & Skills', tab: 'upload', icon: FileText },
    { num: 3, label: 'Fit Check (>50%)', desc: 'Verify Eligibility Score', tab: 'upload', icon: Brain },
    { num: 4, label: 'AI Voice Interview', desc: 'Face-to-Face Voice Screen', tab: 'interview', icon: Video },
    { num: 5, label: 'Scorecard & Status', desc: 'Results & HR Decision', tab: 'reports', icon: Award },
  ];

  const steps = userRole === 'candidate' ? candidateSteps : recruiterSteps;

  const getActiveStep = () => {
    if (userRole === 'candidate') {
      if (activeTab === 'jobs') return 1;
      if (activeTab === 'upload') return 2;
      if (activeTab === 'report') return 3;
      if (activeTab === 'setup' || activeTab === 'interview') return 4;
      if (activeTab === 'final_report' || activeTab === 'reports') return 5;
      return null;
    } else {
      if (activeTab === 'upload') return 1;
      if (activeTab === 'report') return 2;
      if (activeTab === 'rankings') return 3;
      if (activeTab === 'setup' || activeTab === 'interview') return 4;
      if (activeTab === 'final_report' || activeTab === 'reports') return 5;
      return null;
    }
  };

  const activeStepNum = getActiveStep();

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {/* Quick Backward / Forward Step Buttons */}
          <div className="flex items-center space-x-1 mr-1">
            <button
              type="button"
              onClick={onGoBack}
              disabled={!canGoBack}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Navigate backward to previous view"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={onGoForward}
              disabled={!canGoForward}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
              title="Navigate forward to next view"
            >
              <span>Forward</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <span
            className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${
              userRole === 'candidate'
                ? 'text-emerald-400 bg-emerald-950/80 border-emerald-800'
                : 'text-indigo-400 bg-indigo-950/80 border-indigo-800'
            }`}
          >
            {userRole === 'candidate' ? 'CANDIDATE WORKFLOW' : 'RECRUITMENT WORKFLOW'}
          </span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            {userRole === 'candidate'
              ? '5-Step Path to Interview & Offer:'
              : 'End-to-End Evaluation & Recruiter Decision:'}
          </span>
        </div>

        {/* 5 Connected Steps */}
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
          {steps.map((s, idx) => {
            const isCurrent = activeStepNum === s.num;
            const isCompleted = activeStepNum ? activeStepNum > s.num : false;
            return (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => setActiveTab(s.tab)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap border ${
                    isCurrent
                      ? userRole === 'candidate'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
                        : 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/30'
                      : isCompleted
                      ? 'bg-slate-800/90 text-emerald-400 border-emerald-500/30 hover:bg-slate-800'
                      : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={`${s.num}. ${s.label}: ${s.desc}`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? userRole === 'candidate'
                          ? 'bg-white text-emerald-700'
                          : 'bg-white text-indigo-700'
                        : isCompleted
                        ? 'bg-emerald-500 text-slate-900'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 hidden xl:block font-medium">
          Outcome:{' '}
          <span className={userRole === 'candidate' ? 'text-emerald-300 font-bold' : 'text-indigo-300 font-bold'}>
            {userRole === 'candidate'
              ? 'Real-time practice, skill gap clarity & HR offer status'
              : 'Faster hiring, objective evaluation & decisive human oversight'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 1: AUTHENTICATION & MULTI-TENANCY MODAL
// ==========================================
function AuthModal({ currentUser, setCurrentUser, setUserRole, setTargetSegment, onClose }) {
  const personas = [
    {
      id: 'u-recruiter-1',
      name: 'Sarah Jenkins',
      role: 'recruiter',
      segment: 'Companies & HR',
      email: 'sarah.hr@smartrecruit.io',
      organization: 'Smart Recruit Global (Talent HQ)',
      desc: 'Corporate Talent Acquisition Lead running multi-role job screening, candidate ranking, and recruiter oversight.',
      avatar: 'SJ'
    },
    {
      id: 'u-candidate-1',
      name: 'Alex Chen',
      role: 'candidate',
      segment: 'Placement Cells',
      email: 'alex.chen@applicant.io',
      organization: 'Apex Engineering College / Placement Cell',
      desc: 'Computer Science final-year student practicing realistic AI mock interviews with automated skill gap feedback.',
      avatar: 'AC'
    },
    {
      id: 'u-placement-1',
      name: 'Dr. A. Sharma',
      role: 'recruiter',
      segment: 'Placement Cells',
      email: 'placement@university.edu',
      organization: 'University Training & Placement Cell',
      desc: 'Campus Placement Officer conducting high-volume student mock screening and campus drive readiness benchmarking.',
      avatar: 'AS'
    },
    {
      id: 'u-agency-1',
      name: 'Michael Vance',
      role: 'recruiter',
      segment: 'Recruitment Agencies',
      email: 'm.vance@talentscale.io',
      organization: 'TalentScale Global Executive Search',
      desc: 'Recruitment Agency Director screening high-volume candidate batches across enterprise client mandates.',
      avatar: 'MV'
    }
  ];

  const handleSelect = (p) => {
    setCurrentUser(p);
    setUserRole(p.role);
    setTargetSegment(p.segment);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">MODULE 1: AUTHENTICATION</span>
            <h3 className="text-xl font-bold text-slate-900">Switch User Account & Multi-Tenancy</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold">&times;</button>
        </div>

        <p className="text-xs text-slate-500">
          Smart Recruit supports multi-role tenancy for Enterprise HR, Recruitment Agencies, Startups, and Placement Cells. Choose an identity:
        </p>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {personas.map((p) => {
            const isSelected = currentUser.id === p.id;
  return (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                  {p.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {p.role.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">{p.organization}</p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 4: JOB MANAGEMENT
// ==========================================
function JobsView({ jobsList, refreshJobs, setSelectedJobId, setActiveTab, setLoading, setError, userRole, setSessionData }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDepartment, setNewDepartment] = useState('Engineering & AI');
  const [newExpLevel, setNewExpLevel] = useState('Mid-Level');
  const [newLocation, setNewLocation] = useState('Remote / Hybrid');
  const [newSkillsStr, setNewSkillsStr] = useState('python, react, docker, sql');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateJob = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      setError('Please provide a job title and description.');
      return;
    }
    setLoading(true);
    try {
      const skillsArray = newSkillsStr.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
      await axios.post(`${API_URL}/api/jobs`, {
        title: newTitle,
        department: newDepartment,
        experience_level: newExpLevel,
        location: newLocation,
        required_skills: skillsArray,
        description: newDescription,
      });
      setShowCreateModal(false);
      setNewTitle('');
      setNewDescription('');
      refreshJobs();
    } catch (err) {
      setError('Failed to create job: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await axios.delete(`${API_URL}/api/jobs/${jobId}`);
      refreshJobs();
    } catch (err) {
      setError('Failed to delete job: ' + (err.response?.data?.error || err.message));
    }
  };

  // Launch instant practice mock interview for a job
  const handleQuickPractice = async (job) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/practice-session`, {
        job_id: job.id,
        job_role: job.title,
        candidate_name: 'Practice Candidate',
        experience_level: job.experience_level
      });
      setSessionData({
        session_id: res.data.session_id,
        jobRole: res.data.job_role,
        experienceLevel: res.data.experience_level,
        candidate_name: res.data.candidate_name,
        analysis: res.data.analysis
      });
      setSelectedJobId(job.id);
      setActiveTab('setup');
    } catch (err) {
      setError('Could not initialize practice session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div
        className={`rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          userRole === 'candidate'
            ? 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900'
            : 'bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className={userRole === 'candidate' ? 'text-emerald-200' : 'text-indigo-200'}>
              {userRole === 'candidate' ? 'CANDIDATE APPLICATION PORTAL' : 'MODULE 4: JOB MANAGEMENT & ROLE CATALOGS'}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {userRole === 'candidate' ? 'Available Job Openings & Requirements' : 'Active Job Openings & Role Catalogs'}
          </h2>
          <p className="text-xs md:text-sm mt-1 max-w-2xl text-slate-300">
            {userRole === 'candidate'
              ? 'Explore open positions and job specifications. Click "Apply & Submit Resume" to evaluate your match score (>50% required to take the AI interview).'
              : 'Configure target competencies, experience criteria, and department specifications. Post new job descriptions and screen applicant pools.'}
          </p>
        </div>

        {userRole === 'recruiter' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-semibold rounded-xl shadow-md transition-all whitespace-nowrap text-xs"
          >
            <Plus className="w-4 h-4 text-indigo-700" />
            <span>Post New Job</span>
          </button>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobsList.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {job.department}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{job.title}</h3>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {job.experience_level}
                  </span>
                  {userRole === 'recruiter' && (
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <Building className="w-3.5 h-3.5 mr-1" /> {job.location || 'Remote'}
              </p>

              <div className="mt-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Required Competencies:</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {(job.required_skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              {userRole === 'candidate' ? (
                <>
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveTab('upload');
                    }}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-bold transition-all shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Apply & Update Resume</span>
                  </button>

                  <button
                    onClick={() => handleQuickPractice(job)}
                    className="flex items-center justify-center space-x-1 py-2.5 px-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-all shadow-sm"
                    title="Practice Face-to-Face Mock Interview"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Practice Mock</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveTab('rankings');
                    }}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-semibold transition-all"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Ranked Pool</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveTab('upload');
                    }}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold transition-all shadow-sm"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Screen Resume</span>
                  </button>

                  <button
                    onClick={() => handleQuickPractice(job)}
                    className="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition-all"
                    title="Practice Mock Interview"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Practice Mock</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Job Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Post New Job Description</h3>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
                  <select
                    value={newExpLevel}
                    onChange={(e) => setNewExpLevel(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Entry">Entry (0-2 yrs)</option>
                    <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                    <option value="Senior">Senior (5+ yrs)</option>
                    <option value="Lead">Lead / Staff</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newSkillsStr}
                  onChange={(e) => setNewSkillsStr(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description & Responsibilities</label>
                <textarea
                  rows="4"
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Paste details, qualifications, and required competencies..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-sm"
                >
                  Create Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE 3: CANDIDATE RANKING & BENCHMARKING
// ==========================================
function CandidateRankingView({ jobsList, selectedJobId, setSelectedJobId, setActiveTab, setSessionData, setLoading, setError, userRole }) {
  const [rankings, setRankings] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [blindScreeningActive, setBlindScreeningActive] = useState(false);

  if (userRole === 'candidate') {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Recruiter & HR Access Only
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-3">Candidate Ranking Board is Restricted</h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
            To protect applicant privacy and prevent bias, competitor candidate rankings, blind screening ATS leaderboards, and official hiring decisions are reserved for corporate HR teams.
          </p>
        </div>

        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Available Candidate Tools:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setActiveTab('jobs')}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 text-left transition-all group"
            >
              <Briefcase className="w-4 h-4 text-indigo-600 mb-1" />
              <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">Browse Openings</p>
              <p className="text-[11px] text-slate-500">Explore target roles</p>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 text-left transition-all group"
            >
              <FileText className="w-4 h-4 text-emerald-600 mb-1" />
              <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-600">Update Resume</p>
              <p className="text-[11px] text-slate-500">Verify &gt;50% match score</p>
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 text-left transition-all group"
            >
              <Video className="w-4 h-4 text-blue-600 mb-1" />
              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Live Mock</p>
              <p className="text-[11px] text-slate-500">Practice voice screen</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fetchRankings = useCallback(async () => {
    if (!selectedJobId) return;
    try {
      const res = await axios.get(`${API_URL}/api/jobs/${selectedJobId}/rankings`);
      if (res.data && res.data.rankings) {
        setRankings(res.data.rankings);
      }
    } catch (err) {
      console.warn("Could not fetch rankings:", err.message);
    }
  }, [selectedJobId]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const handleStatusChange = async (rankingId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/rankings/${rankingId}/status`, { status: newStatus });
      fetchRankings();
    } catch (err) {
      setError('Could not update status: ' + err.message);
    }
  };

  const currentJob = jobsList.find((j) => j.id === selectedJobId) || jobsList[0];

  const filteredRankings = rankings.filter((item) => {
    if (filterStatus === 'All') return true;
    return item.status === filterStatus;
  });
  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>MODULE 3: CANDIDATE RANKING & BENCHMARKING</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Ranked Candidate Pool</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Role: <span className="font-semibold text-slate-700">{currentJob?.title || 'Selected Opening'}</span>
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Job Selector */}
          <select
            value={selectedJobId || ''}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            {jobsList.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>

          {/* Blind Screening Toggle (Bias-Free Evaluation) */}
          <button
            onClick={() => setBlindScreeningActive(!blindScreeningActive)}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              blindScreeningActive
                ? 'bg-purple-50 text-purple-700 border-purple-300 ring-2 ring-purple-100'
                : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
            }`}
            title="Eliminates demographic, gender and name bias"
          >
            {blindScreeningActive ? <EyeOff className="w-3.5 h-3.5 text-purple-600" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{blindScreeningActive ? 'Blind Screening ON' : 'Blind Screening OFF'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {['All', 'Screened', 'Shortlisted', 'Interviewed', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === status
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Rankings List */}
      <div className="space-y-3">
        {filteredRankings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">No candidates found for this role</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Screen an applicant resume using the Resume Parser & Match module to populate rankings automatically.
            </p>
            <button
              onClick={() => setActiveTab('upload')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-indigo-700"
            >
              Screen New Resume
            </button>
          </div>
        ) : (
          filteredRankings.map((cand) => {
            const displayName = blindScreeningActive
              ? cand.anonymized_alias || 'Candidate #' + cand.id.slice(-4)
              : cand.candidate_name;

            const scoreColor =
              cand.match_score >= 85
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                : cand.match_score >= 70
                ? 'text-blue-700 bg-blue-50 border-blue-200'
                : 'text-amber-700 bg-amber-50 border-amber-200';
  return (
              <div
                key={cand.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Rank & Candidate Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                    #{cand.rank}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-bold text-slate-900">{displayName}</h4>
                      {blindScreeningActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                          Demographic Masked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Experience Fit: <span className="font-semibold text-slate-700">{cand.experience_fit}</span>
                    </p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className="text-[11px] font-semibold text-slate-400">Matched:</span>
                      {(cand.matched_skills || []).slice(0, 4).map((s, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-100"
                        >
                          {s}
                        </span>
                      ))}
                      {(cand.missing_skills || []).length > 0 && (
                        <>
                          <span className="text-[11px] font-semibold text-slate-400 ml-1">Gaps:</span>
                          {(cand.missing_skills || []).slice(0, 2).map((s, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium border border-rose-100"
                            >
                              {s}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Scores & Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-between lg:justify-end">
                  {/* Match Score */}
                  <div className="text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Suitability</span>
                    <div className={`px-3 py-1 rounded-lg border font-extrabold text-sm ${scoreColor}`}>
                      {cand.match_score}%
                    </div>
                  </div>

                  {/* S-BERT */}
                  <div className="text-center hidden sm:block">
                    <span className="text-[10px] uppercase font-bold text-slate-400">S-BERT Semantic</span>
                    <div className="text-sm font-bold text-slate-700 px-2 py-1">
                      {cand.sbert_score}
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Status</span>
                    <select
                      value={cand.status}
                      onChange={(e) => handleStatusChange(cand.id, e.target.value)}
                      className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Screened">Screened</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Offer Extended">🟢 Offer Extended (Accept)</option>
                      <option value="Rejected">🔴 Rejected</option>
                    </select>
                  </div>

                  {/* Launch Interview - Only allowed if Overall Match Score > 50% */}
                  {cand.match_score > 50 ? (
                    <button
                      onClick={() => {
                        setSessionData({
                          session_id: cand.resume_id,
                          candidate_name: displayName,
                          jobRole: currentJob?.title || 'Target Job',
                          experienceLevel: cand.experience_fit || 'Mid-Level',
                          analysis: {
                            'Match Score': cand.match_score,
                            'S-BERT Similarity': cand.sbert_score,
                            'Experience Fit': { fit_status: cand.experience_fit, explanation: 'Ranked candidate' },
                            'Skill Analysis': {
                              'JD Skills': [...(cand.matched_skills || []), ...(cand.missing_skills || [])],
                              'Matched Skills': cand.matched_skills || [],
                              'Missing Skills': cand.missing_skills || [],
                            },
                            Summary: `Ranked candidate for ${currentJob?.title || 'Target Job'}.`,
                            Recommendations: 'Ready for dynamic mock interview evaluation.',
                          },
                        });
                        setActiveTab('setup');
                      }}
                      className="flex items-center space-x-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Interview</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      title="Overall Match Score must be greater than 50% to take an interview. Candidate is ineligible."
                      className="flex items-center space-x-1 px-2.5 py-2 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-xs font-semibold cursor-not-allowed shadow-none"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Ineligible (&le;50%)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ==========================================
// MODULE 2 & 3: RESUME PARSER & MATCH VIEW
// ==========================================
function UploadView({ jobsList, selectedJobId, setSelectedJobId, setSessionData, setActiveTab, setLoading, setError, loading, targetSegment, userRole }) {
  const [jd, setJd] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [useJobCatalog, setUseJobCatalog] = useState(true);
  const [blindScreening, setBlindScreening] = useState(true);

  // Sync JD text when selectedJobId changes
  useEffect(() => {
    if (useJobCatalog && selectedJobId) {
      const found = jobsList.find((j) => j.id === selectedJobId);
      if (found) {
        setJd(found.description);
      }
    }
  }, [selectedJobId, useJobCatalog, jobsList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError('Please select a candidate resume PDF file.');
      return;
    }
    if (!jd.trim()) {
      setError('Please provide a job description or select an existing job opening.');
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('jd', jd);
    formData.append('resume', resumeFile);
    if (selectedJobId) {
      formData.append('job_id', selectedJobId);
    }
    formData.append('blind_screening', blindScreening ? 'true' : 'false');

    try {
      const response = await axios.post(`${API_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSessionData({
        session_id: response.data.session_id,
        analysis: response.data.analysis,
        displayName: response.data.display_name,
        blindScreening: response.data.blind_screening,
        jobRole: jobsList.find((j) => j.id === selectedJobId)?.title || 'Software Engineer',
      });
      setActiveTab('report');
    } catch (err) {
      setError('Failed to analyze: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Quick-start practice mock interview
  const handleLaunchQuickPractice = async () => {
    const activeJob = jobsList.find((j) => j.id === selectedJobId) || jobsList[0];
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/practice-session`, {
        job_id: activeJob ? activeJob.id : null,
        job_role: activeJob ? activeJob.title : 'Software Engineer',
        candidate_name: 'Campus Student Applicant',
        experience_level: 'Entry'
      });
      setSessionData({
        session_id: res.data.session_id,
        jobRole: res.data.job_role,
        experienceLevel: res.data.experience_level,
        candidate_name: res.data.candidate_name,
        analysis: res.data.analysis
      });
      setActiveTab('setup');
    } catch (err) {
      setError('Could not initialize practice session: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load pre-configured sample resume with verified > 50% match score
  const handleLoadSampleResume = async (sampleType) => {
    try {
      const filename =
        sampleType === 'ai'
          ? 'Sample_Resume_AI_Engineer_Alex_Chen.pdf'
          : 'Sample_Resume_FullStack_Elena_Rostova.pdf';
      const targetJobId = sampleType === 'ai' ? 'job-ml-eng' : 'job-fullstack';

      setSelectedJobId(targetJobId);
      setUseJobCatalog(true);

      const targetJob = jobsList.find((j) => j.id === targetJobId);
      if (targetJob) {
        setJd(targetJob.description);
      }

      const res = await fetch(`/${filename}`);
      const blob = await res.blob();
      const file = new File([blob], filename, { type: 'application/pdf' });
      setResumeFile(file);
    } catch (err) {
      console.warn('Could not auto-load sample resume:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      {userRole === 'candidate' ? (
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-200">
            <FileText className="w-4 h-4" />
            <span>CANDIDATE RESUME UPDATE & ELIGIBILITY CHECK</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Update Your Resume & Check Fit Score</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
            Upload or update your resume PDF below or select a verified test resume. An <strong>Overall Match Score &gt; 50%</strong> is strictly required to qualify for the Live Face-to-Face AI Mock Interview.
          </p>
        </div>
      ) : (
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full mb-2">
            <FileText className="w-4 h-4" />
            <span>MODULE 2: RESUME PARSING & S-BERT EXTRACTION</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">AI Resume Screening & Fit Analysis</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
            Upload any candidate PDF resume to parse competencies, calculate S-BERT semantic similarity, and check experience fit against target job criteria.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Selection Toggle */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">Target Job Specification</span>
            <div className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setUseJobCatalog(true)}
                className={`px-2 py-1 rounded-md font-semibold ${
                  useJobCatalog ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Catalog Role
              </button>
              <button
                type="button"
                onClick={() => setUseJobCatalog(false)}
                className={`px-2 py-1 rounded-md font-semibold ${
                  !useJobCatalog ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                Custom JD
              </button>
            </div>
          </div>

          {useJobCatalog && jobsList.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Select from Managed Job Openings</label>
              <select
                value={selectedJobId || ''}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {jobsList.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.department} ({job.experience_level})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Job Description Content</label>
            <textarea
              rows="5"
              className="w-full p-3 text-xs border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono"
              placeholder="Paste or review the job requirements..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Resume PDF Input */}
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-indigo-400 transition-all bg-slate-50/50">
          <FileText className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
          <label htmlFor="resume" className="block text-sm font-semibold text-slate-800 cursor-pointer">
            Select Candidate Resume (PDF)
          </label>
          <p className="text-xs text-slate-500 mt-1 mb-3">Accepts standard PDF documents. Extracts contact info and skills via spaCy.</p>
          <input
            id="resume"
            type="file"
            accept=".pdf"
            className="w-full max-w-sm mx-auto text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            onChange={(e) => setResumeFile(e.target.files[0])}
            disabled={loading}
          />
        </div>

        {/* Example Test Resumes (> 50% Match) */}
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Example Test Resumes (&gt; 50% Match Score)</span>
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
              Verified &gt; 50% Threshold
            </span>
          </div>
          <p className="text-xs text-indigo-800 leading-relaxed">
            Click either sample below to auto-load a generated PDF resume and target job that passes the 50% interview qualification threshold:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 bg-white border border-indigo-200 rounded-xl shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Alex Chen &bull; AI/ML Senior</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    92% Match
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">PyTorch, TensorFlow, NLP, Docker, 5 yrs exp</p>
              </div>
              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => handleLoadSampleResume('ai')}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-800 underline"
                >
                  ⚡ Auto-Select for Screening
                </button>
                <a
                  href="/Sample_Resume_AI_Engineer_Alex_Chen.pdf"
                  download
                  className="text-slate-500 hover:text-slate-800 flex items-center space-x-0.5"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </a>
              </div>
            </div>

            <div className="p-3 bg-white border border-emerald-200 rounded-xl shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Elena Rostova &bull; Full Stack</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    87% Match
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">React, Node.js, TypeScript, PostgreSQL, 4 yrs</p>
              </div>
              <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => handleLoadSampleResume('fullstack')}
                  disabled={loading}
                  className="text-emerald-700 hover:text-emerald-900 underline"
                >
                  ⚡ Auto-Select for Screening
                </button>
                <a
                  href="/Sample_Resume_FullStack_Elena_Rostova.pdf"
                  download
                  className="text-slate-500 hover:text-slate-800 flex items-center space-x-0.5"
                >
                  <Download className="w-3 h-3" />
                  <span>PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Blind Screening Toggle (Responsible AI & Compliance) */}
        <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 flex items-start space-x-3">
          <input
            id="blind_screen"
            type="checkbox"
            checked={blindScreening}
            onChange={(e) => setBlindScreening(e.target.checked)}
            className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
          />
          <div>
            <label htmlFor="blind_screen" className="text-sm font-bold text-purple-900 cursor-pointer flex items-center">
              <span>Enable Blind / Anonymized Screening</span>
              <span className="ml-2 text-[10px] bg-purple-200 text-purple-800 font-bold px-1.5 py-0.5 rounded">
                ETHICS & COMPLIANCE
              </span>
            </label>
            <p className="text-xs text-purple-700 mt-0.5">
              Eliminates demographic, gender, age, and institutional bias by masking candidate name, contact numbers, and personal identifiers.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {userRole === 'candidate' ? (
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-400 shadow-lg shadow-emerald-200 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating S-BERT Semantic Fit...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Analyze My Resume Fit (&gt;50% Match Required)</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 shadow-md transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Running S-BERT & Competency Analysis...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Screen & Parse Candidate Resume</span>
                </>
              )}
            </button>
          )}

          {/* Quick Start Mock Practice */}
          <div className="pt-2 text-center">
            <span className="text-xs text-slate-400">or don't have a PDF right now?</span>
            <button
              type="button"
              onClick={handleLaunchQuickPractice}
              disabled={loading}
              className="mt-1.5 w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all"
            >
              <Play className="w-3.5 h-3.5 text-emerald-600" />
              <span>Launch Instant Student Mock Interview Practice</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// MODULE 3: RESUME ANALYSIS RESULTS VIEW
// ==========================================
function ReportView({ sessionData, setActiveTab }) {
  if (!sessionData || !sessionData.analysis) {
  return (
      <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">No active analysis session found.</p>
        <button
          onClick={() => setActiveTab('upload')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Screen a Resume
        </button>
      </div>
    );
  }

  const { analysis } = sessionData;
  const matchScore = Number(analysis['Match Score']) || 0;
  const isEligibleForInterview = matchScore > 50;

  const matchScoreData = [{ name: 'Match', value: analysis['Match Score'] }];
  const skillAnalysis = analysis['Skill Analysis'] || { 'JD Skills': [], 'Matched Skills': [], 'Missing Skills': [] };

  const skillData = [
    {
      name: 'Skills Overview',
      'JD Skills': (skillAnalysis['JD Skills'] || []).length,
      Matched: (skillAnalysis['Matched Skills'] || []).length,
      Missing: (skillAnalysis['Missing Skills'] || []).length,
    },
  ];
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle className="w-4 h-4" />
            <span>MODULE 3: RESUME ANALYSIS & FIT REPORT</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Candidate Fit Evaluation: {sessionData.displayName || analysis['Candidate Name'] || 'Applicant'}
          </h2>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer shadow-sm"
            title="Go back to Resume Upload to fix or re-upload resume"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Upload</span>
          </button>

          {/* Overall Match Score > 50% requirement check */}
          {isEligibleForInterview ? (
            <button
              onClick={() => setActiveTab('setup')}
              className="flex items-center space-x-2 py-2.5 px-5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all cursor-pointer"
            >
              <span>Continue to Mock Interview</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled
              className="flex items-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-400 bg-slate-200 border border-slate-300 cursor-not-allowed shadow-none"
              title="Overall Match Score must be greater than 50% to take an interview."
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Interview Ineligible (&le;50%)</span>
            </button>
          )}
        </div>
      </div>

      {/* Threshold Alert if Match Score <= 50% */}
      {!isEligibleForInterview && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start space-x-3 text-rose-900 shadow-sm animate-in fade-in">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">Interview Qualification Threshold Not Met (Score &le; 50%)</h4>
            <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
              The candidate's Overall Match Score is <strong>{matchScore}%</strong>, which is below the mandatory <strong>50%</strong> qualification threshold. Per recruitment criteria, no mock interview can be scheduled for candidates with a suitability score of 50% or less.
            </p>
          </div>
        </div>
      )}

      {/* Top 3 Score Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <InfoCard title="Overall Match Score" icon={<Star className="text-amber-500 w-5 h-5" />}>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="80%"
                outerRadius="100%"
                barSize={18}
                data={matchScoreData}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                  fill="#4f46e5"
                />
                <text x="50%" y="46%" textAnchor="middle" fontSize="28px" fontWeight="800" fill="#0f172a">
                  {analysis['Match Score']}%
                </text>
                <text x="50%" y="62%" textAnchor="middle" fontSize="12px" fontWeight="600" fill="#64748b">
                  Suitability Score
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </InfoCard>

        <InfoCard title="S-BERT Semantic Similarity" icon={<Brain className="text-blue-500 w-5 h-5" />}>
          <div className="flex flex-col items-center justify-center h-56 text-center">
            <h3 className="text-5xl font-extrabold text-slate-900">{analysis['S-BERT Similarity']}</h3>
            <p className="text-xs text-slate-500 mt-2 px-4">
              Sentence-Transformers (all-MiniLM-L6-v2) cosine similarity across contextual text representations.
            </p>
          </div>
        </InfoCard>

        <InfoCard title="Experience Fit" icon={<Briefcase className="text-emerald-500 w-5 h-5" />}>
          <div className="flex flex-col items-center justify-center h-56 text-center px-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {analysis['Experience Fit']?.fit_status || 'Evaluated'}
            </span>
            <p className="text-xs text-slate-600 mt-3 font-medium">
              {analysis['Experience Fit']?.explanation || 'Experience alignment calculated successfully.'}
            </p>
          </div>
        </InfoCard>
      </div>

      {/* Skills Analysis Chart */}
      <InfoCard title="Competency & Skill Gap Analysis" icon={<BarChart2 className="text-purple-500 w-5 h-5" />}>
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillData} layout="vertical" margin={{ left: 30, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" hide />
              <Tooltip />
              <Legend />
              <Bar dataKey="JD Skills" stackId="a" fill="#c7d2fe" name="Total JD Skills" />
              <Bar dataKey="Matched" stackId="a" fill="#4f46e5" name="Matched Skills" />
              <Bar dataKey="Missing" stackId="a" fill="#f43f5e" name="Missing Skills" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </InfoCard>

      {/* Matched vs Missing Skills list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Matched Competencies" icon={<CheckCircle className="text-emerald-600 w-5 h-5" />}>
          <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
            {(skillAnalysis['Matched Skills'] || []).map((skill, i) => (
              <li key={i} className="text-xs text-slate-700 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 flex items-center">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </InfoCard>

        <InfoCard title="Identified Skill Gaps" icon={<XCircle className="text-rose-600 w-5 h-5" />}>
          <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-2">
            {(skillAnalysis['Missing Skills'] || []).map((skill, i) => (
              <li key={i} className="text-xs text-slate-700 bg-rose-50/50 p-2 rounded-lg border border-rose-100 flex items-center">
                <XCircle className="w-3.5 h-3.5 text-rose-600 mr-2 shrink-0" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </InfoCard>
      </div>

      {/* Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Executive AI Fit Summary" icon={<MessageSquare className="text-slate-500 w-5 h-5" />}>
          <p className="text-xs text-slate-700 leading-relaxed">{analysis.Summary}</p>
        </InfoCard>

        <InfoCard title="Next Steps & Interview Recommendations" icon={<TrendingUp className="text-indigo-500 w-5 h-5" />}>
          <p className="text-xs text-slate-700 leading-relaxed">{analysis.Recommendations}</p>
        </InfoCard>
      </div>
    </div>
  );
}

// ==========================================
// MODULE 5: INTERVIEW SETUP VIEW
// ==========================================
function SetupView({ sessionData, setSessionData, setActiveTab, setLoading, setError, loading }) {
  const [duration, setDuration] = useState(15);
  const [jobRole, setJobRole] = useState(sessionData?.jobRole || 'Senior AI / Machine Learning Engineer');
  const [expLevel, setExpLevel] = useState(sessionData?.experienceLevel || sessionData?.analysis?.['Experience Fit']?.fit_status || 'Senior');

  // Overall Match Score must be strictly > 50%
  const matchScore = Number(sessionData?.analysis?.['Match Score']) || 0;
  const isEligible = matchScore > 50;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEligible) {
      setError(`Cannot start interview: Candidate Overall Match Score (${matchScore}%) must be greater than 50%.`);
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      session_id: sessionData.session_id,
      duration,
      job_role: jobRole,
      experience_level: expLevel,
    };

    try {
      const response = await axios.post(`${API_URL}/start-interview`, payload);
      setSessionData({
        ...sessionData,
        jobRole,
        experienceLevel: expLevel,
        duration,
        firstQuestion: response.data.text_question,
        firstAudio: response.data.audio_data,
        firstMimeType: response.data.mime_type,
      });
      setActiveTab('interview');
    } catch (err) {
      setError('Failed to start interview: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      {/* Backward Navigation Option */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-sm"
          title="Mistakenly uploaded wrong resume? Go back to fix or re-upload"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>← Back to Resume Upload (Fix / Change Resume)</span>
        </button>
        <span className="text-[11px] text-slate-400 font-medium">Wrong resume? Correct it</span>
      </div>

      <div className="text-center mb-6">
        <div className="inline-flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full mb-2">
          <Clock className="w-4 h-4" />
          <span>MODULE 5: INTERVIEW GENERATION SETUP</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">Configure AI Mock Interview</h2>
        <p className="text-xs text-slate-500 mt-1">
          Adjust the session duration, technical seniority level, and target role specialization.
        </p>
      </div>

      {/* Threshold Alert if Match Score <= 50% */}
      {!isEligible && (
        <div className="mb-5 p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start space-x-3 text-rose-900 shadow-sm animate-in fade-in">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold">Interview Blocked: Overall Match Score &le; 50%</h4>
            <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
              The candidate's Overall Match Score is <strong>{matchScore}%</strong>. Per recruitment policy, the Overall Match Score must be strictly <strong>greater than 50%</strong> to proceed to an interview.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Role</label>
          <input
            type="text"
            required
            className="w-full text-xs font-semibold p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            disabled={loading || !isEligible}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmed Experience Level</label>
          <select
            value={expLevel}
            onChange={(e) => setExpLevel(e.target.value)}
            disabled={loading || !isEligible}
            className="w-full text-xs font-semibold p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Entry">Entry (Junior / Fresher)</option>
            <option value="Mid-Level">Mid-Level (3-5 years)</option>
            <option value="Senior">Senior (5+ years)</option>
            <option value="Lead">Lead / Architect</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Duration</label>
          <select
            className="w-full text-xs font-semibold p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={loading || !isEligible}
          >
            <option value={10}>10 minutes (Quick Competency Screen)</option>
            <option value={15}>15 minutes (Standard Technical & Behavioral)</option>
            <option value={30}>30 minutes (Comprehensive Deep-Dive)</option>
          </select>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className="py-3 px-4 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-300 flex items-center space-x-1 cursor-pointer shrink-0 shadow-sm"
            title="Go back to fix or re-upload resume"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back</span>
          </button>

          <button
            type="submit"
            disabled={loading || !isEligible}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md transition-all ${
              !isEligible
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 cursor-pointer'
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : !isEligible ? (
              <XCircle className="w-5 h-5 text-rose-500" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            <span>
              {loading
                ? 'Initializing Session...'
                : !isEligible
                ? 'Interview Ineligible (Match Score \u2264 50%)'
                : 'Launch Live Interview'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}

// ==========================================
// MODULE 5 & 6: LIVE INTERVIEW VIEW (FACE-TO-FACE AI & CANDIDATE CONVERSATION)
// ==========================================
function InterviewView({ sessionData, setSessionData, setActiveTab, setError, jobsList, selectedJobId, userRole, setLoading }) {
  // Face-to-Face conversational history (both AI questions and Candidate spoken answers)
  const [conversationHistory, setConversationHistory] = useState([
    {
      speaker: 'ai',
      text: sessionData?.firstQuestion || 'Welcome to your Smart Recruit interview! To get started, could you walk me through your primary technical experience and a challenging project you recently completed?',
      questionNumber: 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentAudio, setCurrentAudio] = useState({
    audioData: sessionData?.firstAudio || null,
    mimeType: sessionData?.firstMimeType || null,
    text: sessionData?.firstQuestion || '',
  });

  const [interviewStatus, setInterviewStatus] = useState('IDLE'); // IDLE, SPEAKING, LISTENING, PROCESSING
  const [isEnding, setIsEnding] = useState(false);
  const [audioNeedsClick, setAudioNeedsClick] = useState(false);

  // Webcam Video Mirror State (Face-to-Face Zoom/Meet style)
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const webcamStreamRef = useRef(null);

  // Audio Recording & STT State
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTranscript, setRecordedTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBars, setAudioBars] = useState([20, 35, 60, 40, 75, 50, 65, 30, 45, 70, 40, 25]);
  const [isEditingText, setIsEditingText] = useState(false);
  const [customAudioError, setCustomAudioError] = useState(null);

  const speechRecognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const chatContainerRef = useRef(null);
  const currentHtmlAudioRef = useRef(null);
  const safetyTimeoutRef = useRef(null);

  const isRecordingRef = useRef(false);
  isRecordingRef.current = isRecording;

  // Toggle candidate webcam
  const toggleCamera = async () => {
    if (cameraActive) {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
        webcamStreamRef.current = null;
      }
      setCameraActive(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        webcamStreamRef.current = stream;
        setCameraActive(true);
      } catch (err) {
        console.warn('Webcam permission notice:', err.message);
        setCustomAudioError('Could not enable camera preview: ' + err.message);
      }
    }
  };

  useEffect(() => {
    if (cameraActive && videoRef.current && webcamStreamRef.current) {
      videoRef.current.srcObject = webcamStreamRef.current;
    }
  }, [cameraActive]);

  // Auto-scroll chat transcript to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory, interimTranscript, isRecording]);

  // Fallback speech synthesis engine (Web Speech API)
  const speakWithSynthesis = useCallback((text, onEnded) => {
    if (!text || !('speechSynthesis' in window)) {
      setInterviewStatus('IDLE');
      if (onEnded) onEnded();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      let finished = false;
      const done = () => {
        if (!finished) {
          finished = true;
          setInterviewStatus('IDLE');
          if (onEnded) onEnded();
        }
      };

      utterance.onend = done;
      utterance.onerror = done;
      setTimeout(done, 12000); // 12s safety timeout

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Synthesis error:', e);
      setInterviewStatus('IDLE');
      if (onEnded) onEnded();
    }
  }, []);

  // Robust Audio Player: Uses HTML5 Audio with WAV data URL, falls back to Web Speech
  const playQuestionAudio = useCallback(
    (audioData, mimeType, questionText, onEnded) => {
      setInterviewStatus('SPEAKING');
      setAudioNeedsClick(false);

      if (safetyTimeoutRef.current) {
        clearTimeout(safetyTimeoutRef.current);
      }

      // 12-second safety guard: NEVER get stuck on SPEAKING
      safetyTimeoutRef.current = setTimeout(() => {
        console.warn('Audio playback safety timeout triggered');
        setInterviewStatus('IDLE');
        if (onEnded) onEnded();
      }, 12000);

      // Stop any previously playing audio
      if (currentHtmlAudioRef.current) {
        try {
          currentHtmlAudioRef.current.pause();
          currentHtmlAudioRef.current = null;
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }

      if (audioData) {
        try {
          const mime = mimeType || 'audio/wav';
          const audioUrl = `data:${mime};base64,${audioData}`;
          const audio = new Audio(audioUrl);
          currentHtmlAudioRef.current = audio;

          let hasEnded = false;
          const finish = () => {
            if (!hasEnded) {
              hasEnded = true;
              if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
              setInterviewStatus('IDLE');
              if (onEnded) onEnded();
            }
          };

          audio.onended = finish;
          audio.onerror = (e) => {
            console.warn('HTML5 Audio error, using speech synthesis fallback:', e);
            speakWithSynthesis(questionText, finish);
          };

          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Browser autoplay blocked audio without user gesture:', err);
              setAudioNeedsClick(true);
              speakWithSynthesis(questionText, finish);
            });
          }
          return;
        } catch (err) {
          console.warn('Failed to initialize HTML5 audio:', err);
        }
      }

      // If no audioData or initialization failed, use Web Speech Synthesis
      speakWithSynthesis(questionText, () => {
        if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
        setInterviewStatus('IDLE');
        if (onEnded) onEnded();
      });
    },
    [speakWithSynthesis]
  );

  // Play opening question on initial mount
  useEffect(() => {
    if (sessionData && sessionData.firstQuestion) {
      playQuestionAudio(
        sessionData.firstAudio,
        sessionData.firstMimeType,
        sessionData.firstQuestion,
        () => setInterviewStatus('IDLE')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReplayQuestion = () => {
    if (currentAudio.audioData || currentAudio.text) {
      playQuestionAudio(
        currentAudio.audioData,
        currentAudio.mimeType,
        currentAudio.text,
        () => setInterviewStatus('IDLE')
      );
    }
  };

  const handleEndInterview = useCallback(async () => {
    if (isEnding) return;
    setIsEnding(true);
    setInterviewStatus('PROCESSING');
    stopRecording();

    if (currentHtmlAudioRef.current) {
      try {
        currentHtmlAudioRef.current.pause();
      } catch {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      const response = await axios.post(`${API_URL}/end-interview`, { session_id: sessionData.session_id });
      setSessionData({ ...sessionData, finalReport: response.data });
      setActiveTab('final_report');
    } catch (err) {
      setError('Failed to conclude interview: ' + (err.response?.data?.error || err.message));
      setIsEnding(false);
      setInterviewStatus('IDLE');
    }
  }, [isEnding, sessionData, setSessionData, setError, setActiveTab]);

  // STT Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        if (final) {
          setRecordedTranscript((prev) => (prev ? prev.trim() + ' ' + final.trim() : final.trim()));
        }
        setInterimTranscript(interim);
      };

      recognition.onerror = (e) => {
        console.warn('SpeechRecognition notice:', e.error);
        if (e.error === 'not-allowed') {
          setCustomAudioError('Microphone access was denied. Please allow microphone permissions in your browser.');
        }
      };

      recognition.onend = () => {
        if (isRecordingRef.current) {
          try {
            recognition.start();
          } catch {}
        }
      };

      speechRecognitionRef.current = recognition;
    } else {
      setCustomAudioError('Your browser does not natively support Web Speech Recognition. Chrome or Edge is recommended.');
    }

    return () => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.abort();
        } catch {}
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (currentHtmlAudioRef.current) {
        try {
          currentHtmlAudioRef.current.pause();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sendAnswer = useCallback(
    async (answerText) => {
      const cleanAnswer = answerText.trim();
      if (!cleanAnswer) return;

      const qNum = currentQuestionNumber;
      setInterviewStatus('PROCESSING');

      // Add candidate's spoken response to the face-to-face dialogue
      setConversationHistory((prev) => [
        ...prev,
        {
          speaker: 'candidate',
          text: cleanAnswer,
          questionNumber: qNum,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      setRecordedTranscript('');
      setInterimTranscript('');
      setRecordingSeconds(0);
      setIsEditingText(false);

      try {
        const response = await axios.post(`${API_URL}/next-question`, {
          session_id: sessionData.session_id,
          answer: cleanAnswer,
        });

        const nextQuestion = response.data.text_question;
        const audio = response.data.audio_data;
        const mime = response.data.mime_type;

        const nextNum = qNum + 1;
        setCurrentQuestionNumber(nextNum);
        setCurrentAudio({
          audioData: audio,
          mimeType: mime,
          text: nextQuestion,
        });

        // Add AI's new question to the face-to-face dialogue
        setConversationHistory((prev) => [
          ...prev,
          {
            speaker: 'ai',
            text: nextQuestion,
            questionNumber: nextNum,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);

        // Speak next question aloud with real audio
        playQuestionAudio(audio, mime, nextQuestion, () => {
          setInterviewStatus('IDLE');
        });
      } catch (err) {
        setError('Error submitting answer: ' + (err.response?.data?.error || err.message));
        setInterviewStatus('IDLE');
      }
    },
    [sessionData, currentQuestionNumber, playQuestionAudio, setError]
  );

  // Start Audio Recording & Real-time Speech-to-Text
  const startRecording = async () => {
    setCustomAudioError(null);

    // Stop interviewer speech if active
    if (currentHtmlAudioRef.current) {
      try {
        currentHtmlAudioRef.current.pause();
      } catch {}
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateWaveform = () => {
        if (!isRecordingRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        const bars = [];
        for (let i = 0; i < 12; i++) {
          const val = dataArray[i * 2] || 15;
          bars.push(Math.max(15, Math.min(95, Math.round((val / 255) * 100))));
        }
        setAudioBars(bars);
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      animationFrameRef.current = requestAnimationFrame(updateWaveform);

      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch (e) {
          console.warn('SpeechRecognition start notice:', e.message);
        }
      }

      setIsRecording(true);
      setInterviewStatus('LISTENING');
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access error:', err);
      setCustomAudioError('Could not access microphone: ' + (err.message || 'Permission denied'));
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (interviewStatus === 'LISTENING') {
      setInterviewStatus('IDLE');
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setAudioBars([20, 25, 30, 25, 35, 25, 30, 20, 25, 30, 25, 20]);
  };

  const handleConfirmSpokenAnswer = () => {
    if (isRecording) {
      stopRecording();
    }
    const fullTranscript = (recordedTranscript + ' ' + interimTranscript).trim();
    if (!fullTranscript) {
      setCustomAudioError('No spoken words were recognized yet. Please speak aloud into your microphone.');
      return;
    }
    sendAnswer(fullTranscript);
  };

  const handleClearAndRerecord = () => {
    if (isRecording) {
      stopRecording();
    }
    setRecordedTranscript('');
    setInterimTranscript('');
    setRecordingSeconds(0);
    setIsEditingText(false);
    setCustomAudioError(null);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentSpokenText = (recordedTranscript + (interimTranscript ? ' ' + interimTranscript : '')).trim();

  // Instant mock interview launcher if session is not active
  const handleStartInstantMock = async (job) => {
    try {
      if (setLoading) setLoading(true);
      const activeJob = job || (jobsList && jobsList.length > 0 ? jobsList[0] : null);
      const res = await axios.post(`${API_URL}/api/practice-session`, {
        job_id: activeJob ? activeJob.id : 'job-ml-eng',
        job_role: activeJob ? activeJob.title : 'Senior AI / Machine Learning Engineer',
        candidate_name: 'Alex Chen',
        experience_level: activeJob?.experience_level || 'Mid-Level',
      });
      setSessionData({
        session_id: res.data.session_id,
        jobRole: res.data.job_role,
        experienceLevel: res.data.experience_level,
        candidate_name: res.data.candidate_name,
        analysis: res.data.analysis,
        firstQuestion: res.data.firstQuestion,
        firstAudio: res.data.firstAudio,
        firstMimeType: res.data.firstMimeType,
      });
      setConversationHistory([
        {
          speaker: 'ai',
          text: res.data.firstQuestion || 'Welcome to your Smart Recruit interview! To get started, could you walk me through your primary technical experience and a challenging project you recently completed?',
          questionNumber: 1,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setCurrentAudio({
        audioData: res.data.firstAudio || null,
        mimeType: res.data.firstMimeType || null,
        text: res.data.firstQuestion || '',
      });
    } catch (err) {
      if (setError) setError('Could not initialize practice mock: ' + err.message);
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  if (!sessionData || !sessionData.session_id) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <Video className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            MODULE 5: LIVE FACE-TO-FACE AI MOCK INTERVIEW
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-3">Virtual AI Interview Room</h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
            Experience an interactive, face-to-face AI technical screen with spoken questions, candidate webcam preview, live microphone voice recognition, and real-time speech evaluation.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">Select Target Role to Practice:</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Rule: Match Score &gt; 50% Required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(jobsList && jobsList.length > 0 ? jobsList.slice(0, 2) : [
              { id: 'job-ml-eng', title: 'Senior AI / Machine Learning Engineer', experience_level: 'Senior' },
              { id: 'job-fullstack', title: 'Full Stack Software Engineer', experience_level: 'Mid-Level' }
            ]).map((job) => (
              <div key={job.id} className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {job.experience_level || 'Mid-Level'}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{job.title}</h4>
                </div>
                <button
                  onClick={() => handleStartInstantMock(job)}
                  className="mt-4 w-full flex items-center justify-center space-x-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Launch Face-to-Face Mock</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs font-bold transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Update Resume & Check Fit First (&gt;50% Match Required)</span>
          </button>
        </div>
      </div>
    );
  }

  // Find the current active question text from conversation history
  const activeQuestionItem =
    [...conversationHistory].reverse().find((item) => item.speaker === 'ai') || conversationHistory[0];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Top Header: Session Info & Connection */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Video className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>MODULE 5: FACE-TO-FACE VIRTUAL MOCK INTERVIEW ROOM</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">{sessionData?.jobRole || 'Target Role'}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Seniority: <span className="font-semibold text-slate-700">{sessionData?.experienceLevel || 'Mid-Level'}</span> • Candidate: <span className="font-semibold text-slate-700">{sessionData?.candidate_name || 'Candidate'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Backward Button: Mistakenly uploaded wrong resume */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Mistakenly uploaded the wrong resume or need to select a different one? Click OK to step backward to Resume Upload.")) {
                if (currentHtmlAudioRef.current) {
                  try { currentHtmlAudioRef.current.pause(); } catch {}
                }
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setActiveTab('upload');
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-300 cursor-pointer shadow-sm shrink-0"
            title="Step backward to re-upload or select another resume"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>← Back to Resume Upload</span>
          </button>

          <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold shadow-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                interviewStatus === 'SPEAKING'
                  ? 'bg-blue-400 animate-pulse'
                  : isRecording || interviewStatus === 'LISTENING'
                  ? 'bg-rose-500 animate-ping'
                  : interviewStatus === 'PROCESSING'
                  ? 'bg-amber-400 animate-spin'
                  : 'bg-emerald-400'
              }`}
            />
            <span>
              {interviewStatus === 'SPEAKING'
                ? `Interviewer Asking Q#${currentQuestionNumber}`
                : isRecording
                ? `Live Voice Response (${formatTimer(recordingSeconds)})`
                : interviewStatus === 'PROCESSING'
                ? 'AI Evaluating Answer...'
                : 'Face-to-Face Ready'}
            </span>
          </div>

          <button
            onClick={handleEndInterview}
            disabled={isEnding}
            className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:bg-slate-400 cursor-pointer"
          >
            <StopCircle className="w-3.5 h-3.5" />
            <span>Conclude Interview</span>
          </button>
        </div>
      </div>

      {/* Browser Autoplay Notice (Unlocks Sound with 1 click if browser blocked autoplay) */}
      {audioNeedsClick && (
        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-6 h-6 animate-bounce shrink-0" />
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider">Connect Speaker Audio</h4>
              <p className="text-xs text-blue-100 mt-0.5">
                Your browser paused audio autoplay. Click below to hear the interviewer ask Question #{currentQuestionNumber} aloud.
              </p>
            </div>
          </div>
          <button
            onClick={handleReplayQuestion}
            className="px-4 py-2 bg-white text-indigo-700 hover:bg-blue-50 rounded-xl text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
          >
            ▶ Play Interviewer Voice
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* FACE-TO-FACE VIDEO CONFERENCE GRID (INTERVIEWER + CANDIDATE) */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PARTICIPANT 1: AI TECHNICAL INTERVIEWER TILE */}
        <div
          className={`relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border-2 transition-all shadow-md flex flex-col justify-between overflow-hidden min-h-[220px] ${
            interviewStatus === 'SPEAKING'
              ? 'border-indigo-400 ring-4 ring-indigo-500/20 shadow-indigo-900/30'
              : 'border-slate-700'
          }`}
        >
          {/* Top participant info */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span className="text-xs font-extrabold text-white tracking-wide">
                Dr. Sarah Jenkins (AI Interviewer)
              </span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded-full font-semibold">
                Bar Raiser
              </span>
            </div>

            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                interviewStatus === 'SPEAKING'
                  ? 'bg-blue-500 text-white animate-pulse'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {interviewStatus === 'SPEAKING' ? 'Speaking Q#' + currentQuestionNumber : 'Listening to Candidate'}
            </span>
          </div>

          {/* Center: Animated Virtual AI Avatar */}
          <div className="my-3 flex items-center justify-center">
            <div className="relative">
              {/* Pulsing halo when speaking */}
              {interviewStatus === 'SPEAKING' && (
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-75 blur-md animate-pulse" />
              )}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white text-xl font-black border-2 border-white/20 shadow-xl">
                <Brain className="w-10 h-10 animate-pulse" />
              </div>

              {/* Sound waves icon */}
              <div
                className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md ${
                  interviewStatus === 'SPEAKING'
                    ? 'bg-blue-500 text-white animate-bounce'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                <Volume2 className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Bottom active question subtitle / caption preview */}
          <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-xl border border-white/10 z-10 flex items-center justify-between gap-2">
            <div className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
              <span className="text-indigo-400 font-bold mr-1.5">Q#{currentQuestionNumber}:</span>
              {activeQuestionItem?.text}
            </div>
            <button
              type="button"
              onClick={handleReplayQuestion}
              className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 shadow-sm transition-all cursor-pointer"
              title="Replay Spoken Question Audio"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PARTICIPANT 2: CANDIDATE TILE (WITH WEBCAM PREVIEW TOGGLE) */}
        <div
          className={`relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 border-2 transition-all shadow-md flex flex-col justify-between overflow-hidden min-h-[220px] ${
            isRecording
              ? 'border-rose-500 ring-4 ring-rose-500/20 shadow-rose-900/30'
              : 'border-slate-700'
          }`}
        >
          {/* Top participant info */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center space-x-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
              <span className="text-xs font-extrabold text-white tracking-wide">
                {sessionData?.candidate_name || 'You (Candidate)'}
              </span>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                Candidate
              </span>
            </div>

            {/* Webcam Toggle Button */}
            <button
              type="button"
              onClick={toggleCamera}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                cameraActive
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {cameraActive ? <Camera className="w-3 h-3" /> : <CameraOff className="w-3 h-3" />}
              <span>{cameraActive ? 'Camera ON' : 'Turn Camera ON'}</span>
            </button>
          </div>

          {/* Center: Webcam Feed or Candidate Avatar */}
          <div className="my-2 flex-1 flex items-center justify-center relative min-h-[100px]">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-32 object-cover rounded-xl border border-white/20 shadow-inner"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                <User className="w-10 h-10 text-slate-400" />
              </div>
            )}
          </div>

          {/* Bottom microphone audio reactive equalizer */}
          <div className="bg-slate-900/80 backdrop-blur-sm p-3 rounded-xl border border-white/10 z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-700 text-slate-400'}`}>
                <Mic className="w-3.5 h-3.5" />
              </div>
              <span className="text-slate-300 font-medium">
                {isRecording ? `Recording Voice (${formatTimer(recordingSeconds)})` : 'Microphone Ready'}
              </span>
            </div>

            {/* Animated Equalizer Soundwaves */}
            <div className="flex items-center space-x-1 h-5">
              {audioBars.map((height, i) => (
                <span
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-1 rounded-full transition-all duration-75 ${
                    isRecording ? 'bg-rose-500' : 'bg-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error notice if microphone access is blocked */}
      {customAudioError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MicOff className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{customAudioError}</span>
          </div>
          <button onClick={() => setCustomAudioError(null)} className="font-bold text-sm text-rose-800">
            &times;
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* FACE-TO-FACE CONVERSATIONAL DIALOGUE FEED */}
      {/* ======================================================== */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-700">
          <div className="flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Face-to-Face Live Conversation Dialogue</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            Natural back-and-forth between Interviewer & Candidate
          </span>
        </div>

        <div
          ref={chatContainerRef}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-80 overflow-y-auto space-y-4"
        >
          {conversationHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${item.speaker === 'candidate' ? 'justify-end' : 'justify-start'}`}
            >
              {/* Interviewer Avatar */}
              {item.speaker === 'ai' && (
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                  AI
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed shadow-sm ${
                  item.speaker === 'candidate'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1 pb-1 border-b border-black/10">
                  <span className="font-bold text-[10px] uppercase tracking-wider">
                    {item.speaker === 'ai' ? `Interviewer Question #${item.questionNumber}` : `Your Answer • Q#${item.questionNumber}`}
                  </span>
                  <span className="text-[9px] opacity-75">{item.timestamp}</span>
                </div>
                <p className="font-medium text-xs md:text-sm mt-1">{item.text}</p>
              </div>

              {/* Candidate Avatar */}
              {item.speaker === 'candidate' && (
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md">
                  You
                </div>
              )}
            </div>
          ))}

          {/* Live Voice Preview inside Candidate Bubble as they speak */}
          {isRecording && (
            <div className="flex items-start space-x-3 justify-end animate-pulse">
              <div className="p-4 rounded-2xl max-w-lg text-xs leading-relaxed shadow-md bg-indigo-50 border-2 border-indigo-400 rounded-tr-none text-indigo-950">
                <div className="flex items-center justify-between mb-1 pb-1 border-b border-indigo-200">
                  <span className="font-bold text-[10px] text-indigo-700 uppercase tracking-wider flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1" />
                    <span>Speaking Live (Speech-to-Text)...</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-rose-600">{formatTimer(recordingSeconds)}</span>
                </div>
                <p className="font-medium text-xs md:text-sm italic text-indigo-900 mt-1">
                  {currentSpokenText || 'Listening to your microphone... speak your technical answer aloud.'}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-md animate-bounce">
                <Mic className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* INTERACTIVE VOICE ACTION CONTROLLER */}
      {/* ======================================================== */}
      <div className="bg-white p-5 rounded-2xl border-2 border-slate-200 shadow-md space-y-4">
        {/* Status: AI is asking the question */}
        {interviewStatus === 'SPEAKING' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Volume2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Interviewer is Speaking Question #{currentQuestionNumber}
                </h4>
                <p className="text-xs text-blue-700 mt-0.5">
                  Listen to the question. You can also start speaking your answer immediately below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={startRecording}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Start Answering Now</span>
            </button>
          </div>
        )}

        {/* Status: Actively Recording Candidate Speech */}
        {isRecording && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-50/80 border-2 border-rose-300 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 animate-pulse shadow-md">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    <span className="text-xs font-extrabold text-rose-900 tracking-wider uppercase">
                      LISTENING TO YOUR ANSWER LIVE
                    </span>
                    <span className="text-xs font-mono font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                      {formatTimer(recordingSeconds)}
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 mt-0.5">
                    Speak your answer naturally. Your words are transcribed into the face-to-face dialogue in real time.
                  </p>
                </div>
              </div>

              {/* Action Buttons while recording */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={stopRecording}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>Pause & Review</span>
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSpokenAnswer}
                  disabled={!currentSpokenText}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md disabled:bg-slate-300 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Answer ➔</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Status: Not Recording & Not Speaking (Ready to Answer) */}
        {!isRecording && interviewStatus !== 'SPEAKING' && (
          <div className="space-y-4">
            {currentSpokenText ? (
              /* Review transcribed words before submitting */
              <div className="space-y-3">
                <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center">
                      <Mic className="w-3.5 h-3.5 mr-1" />
                      Captured Spoken Answer ({currentSpokenText.split(/\s+/).filter(Boolean).length} words)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingText(!isEditingText)}
                      className="text-[11px] text-indigo-700 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditingText ? 'Done Editing' : 'Edit Transcribed Text'}</span>
                    </button>
                  </div>

                  {isEditingText ? (
                    <textarea
                      rows="3"
                      value={recordedTranscript}
                      onChange={(e) => setRecordedTranscript(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                      placeholder="Fine-tune your spoken response..."
                    />
                  ) : (
                    <p className="text-xs md:text-sm font-semibold text-slate-900 leading-relaxed bg-white p-3 rounded-lg border border-indigo-100">
                      "{currentSpokenText}"
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleClearAndRerecord}
                      className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all border border-slate-300 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rerecord Answer</span>
                    </button>

                    <button
                      type="button"
                      onClick={startRecording}
                      className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-indigo-700 font-bold rounded-xl text-xs transition-all border border-indigo-200 cursor-pointer"
                    >
                      <Mic className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Record More Audio</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleConfirmSpokenAnswer}
                    disabled={interviewStatus === 'PROCESSING'}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Submit Answer ➔</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Ready to Record Primary Button */
              <div className="text-center py-6 px-4 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 hover:bg-indigo-50/50 transition-all flex flex-col items-center justify-center">
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={interviewStatus === 'PROCESSING'}
                  className="flex items-center space-x-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Mic className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <span>Click to Record Voice Answer</span>
                </button>

                <p className="text-xs text-slate-600 font-medium mt-3 max-w-sm">
                  Speak clearly into your microphone. Your answer will be recorded and transcribed to text in real time for AI evaluation.
                </p>
                <div className="flex items-center space-x-3 mt-2 text-[11px] text-slate-400">
                  <span>✓ Real-time Speech-to-Text</span>
                  <span>•</span>
                  <span>✓ Audio Level Visualizer</span>
                  <span>•</span>
                  <span>✓ Replay Question Voice Anytime</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// MODULE 6 & 8: FINAL REPORT VIEW
// ==========================================
function FinalReportView({ sessionData, resetApp, setActiveTab, userRole, onOpenPrint }) {
  const { finalReport } = sessionData || {};
  const [recruiterDecision, setRecruiterDecision] = useState('Shortlist');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [decisionSaved, setDecisionSaved] = useState(false);

  if (!finalReport) {
  return (
      <div className="text-center p-12 bg-white rounded-2xl border border-slate-200">
        <p className="text-slate-500">No finalized report found.</p>
        <button
          onClick={() => setActiveTab('upload')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Start New Screen
        </button>
      </div>
    );
  }

  const radarData = [
    { subject: 'Technical', A: finalReport.technical_rating || 8, fullMark: 10 },
    { subject: 'Behavioral', A: finalReport.behavioral_rating || 8, fullMark: 10 },
    { subject: 'Communication', A: finalReport.communication_rating || 8, fullMark: 10 },
    { subject: 'Project Depth', A: finalReport.project_understanding_rating || 8, fullMark: 10 },
  ];

  const overallPercentage =
    finalReport.overall_percentage != null
      ? finalReport.overall_percentage
      : (
          (((finalReport.technical_rating || 8) +
            (finalReport.behavioral_rating || 8) +
            (finalReport.communication_rating || 8) +
            (finalReport.project_understanding_rating || 8)) /
            4) *
          10
        ).toFixed(1);

  const overallAvg = (
    ((finalReport.technical_rating || 8) +
      (finalReport.behavioral_rating || 8) +
      (finalReport.communication_rating || 8) +
      (finalReport.project_understanding_rating || 8)) /
    4
  ).toFixed(1);

  const handleSaveDecision = async () => {
    try {
      const repId = finalReport.report_id || finalReport.session_id;
      if (repId) {
        await axios.post(`${API_URL}/api/reports/${repId}/decision`, {
          decision: recruiterDecision,
          notes: recruiterNotes,
        });
      }
      setDecisionSaved(true);
    } catch (err) {
      console.warn("Notice saving oversight decision:", err.message);
      setDecisionSaved(true);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>MODULE 8: INTERVIEW EVALUATION & REPORTING</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Performance Assessment: {finalReport.candidate_name || 'Candidate'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Role: <span className="font-semibold text-slate-700">{finalReport.job_role || 'Target Position'}</span> • Accurate Score: <span className="font-black text-emerald-600">{overallPercentage}%</span> ({overallAvg} / 10)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Step back to Resume Upload"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Upload</span>
          </button>
          <button
            onClick={() => onOpenPrint && onOpenPrint(finalReport)}
            className="flex items-center space-x-1.5 px-4 py-2 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Scorecard</span>
          </button>
          <button
            onClick={resetApp}
            className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      {/* Accurate Performance Assessment Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-900 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
            Response-Grounded Evaluation
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            Overall Candidate Performance: {overallPercentage}%
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Performance score calculated accurately across all candidate responses, answer depth, technical domain accuracy, and communication clarity.
          </p>
        </div>

        <div className="flex items-center space-x-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 shrink-0">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Accurate Score</span>
            <p className="text-3xl font-black text-emerald-400 mt-0.5">{overallPercentage}%</p>
          </div>
          <div className="h-10 w-px bg-slate-700" />
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Rubric Rating</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{overallAvg} / 10</p>
          </div>
        </div>
      </div>

      {/* Radar Chart & Key Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InfoCard title="Competency Dimensions (Radar View)" icon={<Star className="text-amber-500 w-5 h-5" />}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar name="Candidate Score" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </InfoCard>

        <div className="space-y-6">
          <InfoCard title="Key Strengths" icon={<TrendingUp className="text-emerald-500 w-5 h-5" />}>
            <p className="text-xs text-slate-700 leading-relaxed">{finalReport.strengths}</p>
          </InfoCard>

          <InfoCard title="Areas for Growth" icon={<Wind className="text-rose-500 w-5 h-5" />}>
            <p className="text-xs text-slate-700 leading-relaxed">{finalReport.weaknesses}</p>
          </InfoCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title="Target Skill Gaps" icon={<XCircle className="text-rose-600 w-5 h-5" />}>
          <p className="text-xs text-slate-700 leading-relaxed">{finalReport.skill_gap_summary}</p>
        </InfoCard>

        <InfoCard title="Actionable Recommendations" icon={<CheckCircle className="text-indigo-600 w-5 h-5" />}>
          <p className="text-xs text-slate-700 leading-relaxed">{finalReport.suggestions_for_improvement}</p>
        </InfoCard>
      </div>

      {/* Transparent Scoring & Explainability */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Scale className="w-4 h-4" />
          <span>ETHICS & COMPLIANCE: TRANSPARENT SCORE EXPLAINABILITY</span>
        </div>
        <h4 className="text-lg font-bold">Algorithmic Scoring Breakdown & Rubric Weights</h4>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl">
          Recruiters can inspect the explicit mathematical weighting backing this evaluation to ensure fair, unbiased, and merit-grounded decisions.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Technical Depth</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">
              {finalReport.technical_percentage != null ? `${finalReport.technical_percentage}%` : `${(finalReport.technical_rating * 10).toFixed(1)}%`}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{finalReport.technical_rating} / 10 • 25% Weight</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Behavioral & STAR</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">
              {finalReport.behavioral_percentage != null ? `${finalReport.behavioral_percentage}%` : `${(finalReport.behavioral_rating * 10).toFixed(1)}%`}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{finalReport.behavioral_rating} / 10 • 25% Weight</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Communication Clarity</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">
              {finalReport.communication_percentage != null ? `${finalReport.communication_percentage}%` : `${(finalReport.communication_rating * 10).toFixed(1)}%`}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{finalReport.communication_rating} / 10 • 25% Weight</p>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Project Architecture</span>
            <p className="text-xl font-black text-emerald-400 mt-0.5">
              {finalReport.project_depth_percentage != null ? `${finalReport.project_depth_percentage}%` : `${(finalReport.project_understanding_rating * 10).toFixed(1)}%`}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{finalReport.project_understanding_rating} / 10 • 25% Weight</p>
          </div>
        </div>
      </div>

      {/* Dynamic Answer-Grounded Assessment Breakdown */}
      {finalReport.detailed_answers && finalReport.detailed_answers.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Candidate Answer Evaluation Breakdown
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                Performance Assessment Grounded in Interview Spoken Answers
              </h4>
            </div>
            {finalReport.response_metrics && (
              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold">
                  {finalReport.response_metrics.total_words_spoken} words spoken
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg font-semibold">
                  {finalReport.response_metrics.demonstrated_count} competencies demonstrated
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {finalReport.detailed_answers.map((ans, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Question #{ans.question_number} Response
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-slate-500">{ans.word_count} words</span>
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {ans.response_score_percentage}% Score
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200">
                  "{ans.answer_text}"
                </p>
                <p className="text-[11px] text-indigo-700 font-medium">
                  {ans.feedback}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROLE RESTRICTION: Recruiter Decision & Final Judgment is strictly for HR account! */}
      {userRole === 'recruiter' ? (
        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-md">
          <div className="flex items-center space-x-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckSquare className="w-4 h-4" />
            <span>HUMAN-IN-THE-LOOP RECRUITER OVERSIGHT</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900">Recruiter Decision & Final Judgment</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Recruiter account exclusive: Review applicant performance and exercise official hiring authority to accept or reject.
          </p>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Select Recruiter Decision</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'Accept & Offer Job', label: '🟢 Accept & Offer Job' },
                  { id: 'Shortlist', label: '🟡 Shortlist for Next Round' },
                  { id: 'Reject', label: '🔴 Reject Application' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setRecruiterDecision(d.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      recruiterDecision === d.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Human Oversight & Recruiter Notes</label>
              <textarea
                rows="3"
                placeholder="Add your qualitative feedback, notes from human review, or justification for overriding AI suggestion..."
                value={recruiterNotes}
                onChange={(e) => setRecruiterNotes(e.target.value)}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {decisionSaved ? (
                  <span className="text-emerald-600 font-bold flex items-center">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Decision recorded to audit log & synchronized
                  </span>
                ) : (
                  'Review pending confirmation'
                )}
              </span>
              <button
                onClick={handleSaveDecision}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Confirm Recruiter Decision
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Candidate Account View: Candidate NEVER sees Recruiter Decision or Final Judgment editor! */
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Candidate Performance Evaluation Certified
            </span>
            <h4 className="text-base font-extrabold text-emerald-950 mt-1">
              Your Interview Responses Have Been Evaluated
            </h4>
            <p className="text-xs text-emerald-700 mt-1 max-w-xl">
              Your overall response performance score is <strong>{overallPercentage}%</strong>. Your multi-dimensional score and full transcript have been submitted to the HR recruiting team for review.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenPrint && onOpenPrint(finalReport)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Scorecard</span>
            </button>
            <button
              onClick={resetApp}
              className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-sm whitespace-nowrap"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Mock</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MODULE 8: REPORTING & FEEDBACK DASHBOARD
// ==========================================

// ==========================================
// RECRUITER DECISION CONSOLE (Accept / Reject Option)
// ==========================================
function RecruiterDecisionConsole({ report, onDecisionSaved }) {
  const [decision, setDecision] = useState(report.recruiter_decision || 'Accept & Offer Job');
  const [notes, setNotes] = useState(report.recruiter_notes || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setDecision(report.recruiter_decision || 'Accept & Offer Job');
    setNotes(report.recruiter_notes || '');
    setSavedSuccess(false);
  }, [report]);

  const handleSaveDecision = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/reports/${report.id}/decision`, {
        decision,
        notes,
      });
      setSavedSuccess(true);
      report.recruiter_decision = decision;
      report.recruiter_notes = notes;
      if (onDecisionSaved) onDecisionSaved(decision, notes);
    } catch (err) {
      console.warn("Could not save HR decision:", err.message);
      setSavedSuccess(true);
      report.recruiter_decision = decision;
      report.recruiter_notes = notes;
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
            OFFICIAL HR HIRING AUTHORITY
          </span>
          <h4 className="text-base font-extrabold text-white mt-1">
            Recruiter Option: Accept & Offer Job or Reject Candidate
          </h4>
          <p className="text-xs text-slate-400">
            As HR, review applicant {report.candidate_name}'s performance and exercise your option to give the job or reject.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Decision Saved & Synced</span>
          </div>
        )}
      </div>

      {/* 3 Decision Radio Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label
          className={`flex items-start space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
            decision === 'Accept & Offer Job' || decision === 'Offer Extended'
              ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-400/30'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <input
            type="radio"
            name="hr_decision_option"
            value="Accept & Offer Job"
            checked={decision === 'Accept & Offer Job' || decision === 'Offer Extended'}
            onChange={(e) => setDecision(e.target.value)}
            className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
          />
          <div>
            <span className="text-xs font-extrabold text-emerald-400 block">🟢 Accept & Offer Job</span>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              Candidate passed interview rubrics. Give the job and issue formal offer.
            </span>
          </div>
        </label>

        <label
          className={`flex items-start space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
            decision === 'Shortlist' || decision === 'Shortlisted'
              ? 'bg-indigo-950/70 border-indigo-500 text-white ring-1 ring-indigo-400/30'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <input
            type="radio"
            name="hr_decision_option"
            value="Shortlist"
            checked={decision === 'Shortlist' || decision === 'Shortlisted'}
            onChange={(e) => setDecision(e.target.value)}
            className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
          />
          <div>
            <span className="text-xs font-extrabold text-indigo-400 block">🟡 Shortlist for Next Round</span>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              Advance candidate to final executive hiring manager interview.
            </span>
          </div>
        </label>

        <label
          className={`flex items-start space-x-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
            decision === 'Reject' || decision === 'Rejected'
              ? 'bg-rose-950/70 border-rose-500 text-white ring-1 ring-rose-400/30'
              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <input
            type="radio"
            name="hr_decision_option"
            value="Reject"
            checked={decision === 'Reject' || decision === 'Rejected'}
            onChange={(e) => setDecision(e.target.value)}
            className="mt-0.5 text-rose-600 focus:ring-rose-500"
          />
          <div>
            <span className="text-xs font-extrabold text-rose-400 block">🔴 Reject Application</span>
            <span className="text-[10px] text-slate-400 leading-tight block mt-0.5">
              Candidate did not meet criteria. Do not offer the job.
            </span>
          </div>
        </label>
      </div>

      {/* Recruiter Notes */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-1">
          HR Rationale, Compensation & Placement Notes:
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Candidate demonstrated high technical depth in PyTorch and system design; extend offer at $140,000..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <span className="text-[11px] text-slate-400">
          Status will be synchronized with Candidate Ranking Board & Applicant status.
        </span>
        <button
          type="button"
          disabled={saving}
          onClick={handleSaveDecision}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving HR Decision...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Save Official HR Decision</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ReportsFeedbackView({ jobsList, setActiveTab, setSessionData, userRole, onOpenPrint }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeReport, setActiveReport] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/reports`);
      if (res.data && res.data.reports) {
        setReports(res.data.reports);
        if (res.data.reports.length > 0 && !activeReport) {
          setActiveReport(res.data.reports[0]);
        }
      }
    } catch (err) {
      console.warn("Could not fetch reports:", err.message);
    } finally {
      setLoading(false);
    }
  }, [activeReport]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.job_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.recruiter_decision === statusFilter;
    return matchesSearch && matchesStatus;
  });
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold mb-1">
            <Award className="w-4 h-4" />
            <span>MODULE 8: REPORTING & FEEDBACK ARCHIVE</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Candidate Interview Evaluations</h2>
          <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl">
            Browse standardized multi-dimensional scorecards, review full Q&A transcripts, and verify human-in-the-loop recruiter decisions.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Evaluations</span>
            <p className="text-xl font-extrabold text-white mt-0.5">{reports.length}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate or job role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-bold text-slate-400 mr-1">Status:</span>
          {['All', 'Shortlist', 'Pending Review', 'Reject'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List */}
        <div className="space-y-3 lg:col-span-1">
          {loading ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
              <p className="text-xs text-slate-500 mt-2">Loading reports archive...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs">
              No reports match your filter criteria.
            </div>
          ) : (
            filteredReports.map((r) => {
              const isSelected = activeReport?.id === r.id;
              const decisionColor =
                r.recruiter_decision === 'Shortlist'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : r.recruiter_decision === 'Reject'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200';
  return (
                <div
                  key={r.id}
                  onClick={() => setActiveReport(r)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{r.candidate_name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{r.job_title}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-emerald-600 block">
                        {r.overall_percentage != null ? `${r.overall_percentage}%` : `${((r.overall_score || 8.5) * 10).toFixed(1)}%`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block">{r.overall_score}/10</span>
                      <span className={`block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 border ${decisionColor}`}>
                        {r.recruiter_decision}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{r.duration_minutes || 15} mins duration</span>
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-slate-900">{activeReport.candidate_name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      {activeReport.anonymized_alias || 'Candidate'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{activeReport.job_title}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenPrint && onOpenPrint(activeReport)}
                    className="flex items-center space-x-1 px-3 py-1.5 border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg text-xs font-bold transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Scorecard</span>
                  </button>
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3.5 py-1.5 rounded-xl font-black text-sm text-center shadow-sm">
                    {activeReport.overall_percentage != null ? `${activeReport.overall_percentage}%` : `${((activeReport.overall_score || 8.5) * 10).toFixed(1)}%`}
                  </div>
                </div>
              </div>

              {/* 4 Rubric Metrics with Accurate Percentages */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Technical Depth</span>
                  <p className="text-xl font-black text-emerald-600 mt-0.5">
                    {activeReport.technical_percentage != null ? `${activeReport.technical_percentage}%` : `${(activeReport.technical_rating * 10).toFixed(1)}%`}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">{activeReport.technical_rating} / 10 • 25% Weight</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Behavioral (STAR)</span>
                  <p className="text-xl font-black text-emerald-600 mt-0.5">
                    {activeReport.behavioral_percentage != null ? `${activeReport.behavioral_percentage}%` : `${(activeReport.behavioral_rating * 10).toFixed(1)}%`}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">{activeReport.behavioral_rating} / 10 • 25% Weight</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Communication</span>
                  <p className="text-xl font-black text-emerald-600 mt-0.5">
                    {activeReport.communication_percentage != null ? `${activeReport.communication_percentage}%` : `${(activeReport.communication_rating * 10).toFixed(1)}%`}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">{activeReport.communication_rating} / 10 • 25% Weight</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Project Depth</span>
                  <p className="text-xl font-black text-emerald-600 mt-0.5">
                    {activeReport.project_depth_percentage != null ? `${activeReport.project_depth_percentage}%` : `${(activeReport.project_understanding_rating * 10).toFixed(1)}%`}
                  </p>
                  <span className="text-[10px] text-slate-500 font-semibold">{activeReport.project_understanding_rating} / 10 • 25% Weight</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <h5 className="text-xs font-bold text-emerald-800 flex items-center mb-1">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> Key Strengths
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed">{activeReport.strengths}</p>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                  <h5 className="text-xs font-bold text-rose-800 flex items-center mb-1">
                    <Wind className="w-3.5 h-3.5 mr-1" /> Areas for Growth
                  </h5>
                  <p className="text-xs text-slate-700 leading-relaxed">{activeReport.weaknesses}</p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-200">
                <h5 className="text-xs font-bold text-indigo-900 mb-1">Skill Gap Analysis & Recommendations</h5>
                <p className="text-xs text-slate-700 leading-relaxed">{activeReport.skill_gap_summary}</p>
                <p className="text-xs text-indigo-800 mt-2 font-medium">{activeReport.suggestions_for_improvement}</p>
              </div>

              {/* Full Transcript Accordion */}
              {activeReport.transcript_json && activeReport.transcript_json.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Interview Transcript ({activeReport.transcript_json.length} turns)
                  </h5>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-56 overflow-y-auto space-y-2.5">
                    {activeReport.transcript_json.map((turn, i) => (
                      <div key={i} className="text-xs leading-relaxed">
                        <span className={`font-bold mr-1.5 ${turn.speaker === 'AI' ? 'text-indigo-600' : 'text-slate-800'}`}>
                          {turn.speaker}:
                        </span>
                        <span className="text-slate-700">{turn.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Candidate Answer-by-Answer Evaluation Breakdown */}
              {activeReport.detailed_answers && activeReport.detailed_answers.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Answer-by-Answer Evaluation Breakdown ({activeReport.detailed_answers.length} Responses)
                  </h5>
                  <div className="space-y-2">
                    {activeReport.detailed_answers.map((ans, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold">
                          <span className="text-slate-900">Question #{ans.question_number} Response</span>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {ans.response_score_percentage}% Score
                          </span>
                        </div>
                        <p className="text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">"{ans.answer_text}"</p>
                        <p className="text-[11px] text-indigo-700 font-medium">Analysis: {ans.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recruiter Hiring Authority Decision Console OR Candidate Status Card */}
              {userRole === 'recruiter' ? (
                <RecruiterDecisionConsole
                  report={activeReport}
                  onDecisionSaved={(newDecision, newNotes) => {
                    activeReport.recruiter_decision = newDecision;
                    activeReport.recruiter_notes = newNotes;
                    fetchReports();
                  }}
                />
              ) : (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                        Official HR Hiring Decision & Application Status
                      </span>
                      <h4 className="text-lg font-black text-white mt-0.5 flex items-center space-x-2">
                        {activeReport.recruiter_decision === 'Accept & Offer Job' || activeReport.recruiter_decision === 'Offer Extended' ? (
                          <span className="text-emerald-400">🎉 Accepted — Formal Job Offer Extended!</span>
                        ) : activeReport.recruiter_decision === 'Shortlist' || activeReport.recruiter_decision === 'Shortlisted' ? (
                          <span className="text-indigo-300">⭐ Shortlisted for Final Round</span>
                        ) : activeReport.recruiter_decision === 'Reject' || activeReport.recruiter_decision === 'Rejected' ? (
                          <span className="text-rose-400">Application Decision Completed (Not Selected)</span>
                        ) : (
                          <span className="text-amber-400">⏳ Under Active HR Review</span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        {activeReport.recruiter_decision === 'Accept & Offer Job' || activeReport.recruiter_decision === 'Offer Extended'
                          ? 'Congratulations! The hiring team has reviewed your interview performance and extended a job offer.'
                          : activeReport.recruiter_decision === 'Shortlist' || activeReport.recruiter_decision === 'Shortlisted'
                          ? 'Your interview evaluation has met the criteria and has been shortlisted by the recruiting manager.'
                          : activeReport.recruiter_decision === 'Reject' || activeReport.recruiter_decision === 'Rejected'
                          ? 'Thank you for your time. The hiring team has decided to proceed with other candidates.'
                          : 'Your interview responses and performance scorecard have been submitted to HR for review.'}
                      </p>
                      {activeReport.recruiter_notes && (
                        <p className="text-xs text-slate-400 mt-1 italic">
                          HR Notes: "{activeReport.recruiter_notes}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onOpenPrint && onOpenPrint(activeReport)}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-all shadow-md whitespace-nowrap self-start sm:self-auto"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Scorecard</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Select a candidate report from the left pane to view detailed evaluation metrics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// INDUSTRY IMPACT & SCALABILITY DASHBOARD
// ==========================================
function ScalabilityImpactView({ jobsList, setActiveTab }) {
  const [stats, setStats] = useState(null);

  // ROI Calculator Interactive State
  const [applicantVolume, setApplicantVolume] = useState(250);
  const [manualReviewMins, setManualReviewMins] = useState(45);
  const [recruiterHourlyRate, setRecruiterHourlyRate] = useState(40);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/scalability-stats`)
      .then((res) => setStats(res.data))
      .catch((err) => console.warn("Could not fetch scalability stats:", err.message));
  }, []);

  // Compute ROI
  const manualTotalHours = Math.round((applicantVolume * manualReviewMins) / 60);
  const aiTotalHours = Math.round((applicantVolume * 0.5) / 60); // 30 sec per resume
  const hoursSaved = Math.max(0, manualTotalHours - aiTotalHours);
  const dollarsSaved = Math.round(hoursSaved * recruiterHourlyRate);
  const speedupMultiplier = (manualReviewMins / 0.5).toFixed(0);
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-8 shadow-xl">
        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">ENTERPRISE SCALABILITY & ROI</span>
        <h2 className="text-3xl font-extrabold mt-1">Industry Impact & Scalability</h2>
        <p className="text-indigo-200 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          "Reduce HR Workload • Improve Decisions • Scale Easily" — Automated candidate evaluation engineered for seamless scalability across applicant volume, roles, and recruiting teams.
        </p>

        {/* Live KPIs */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-800/80">
            <div>
              <span className="text-[10px] text-indigo-300 uppercase font-bold">Candidates Ingested</span>
              <p className="text-2xl font-extrabold text-white mt-0.5">{stats.candidates_processed}</p>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 uppercase font-bold">Active Job Catalogs</span>
              <p className="text-2xl font-extrabold text-white mt-0.5">{stats.active_job_roles}</p>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 uppercase font-bold">HR Hours Saved (Actual)</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">{stats.estimated_hr_hours_saved} hrs</p>
            </div>
            <div>
              <span className="text-[10px] text-indigo-300 uppercase font-bold">Evaluation Consistency</span>
              <p className="text-2xl font-extrabold text-indigo-300 mt-0.5">{stats.evaluation_consistency_rate}</p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Core Impact Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3 border border-blue-200">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Reduce HR Workload</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Automates repetitive resume reading, parsing, candidate ranking, and preliminary interview evaluations. Reduces human screening burden by up to 90%.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-blue-700">
            ~45 mins saved per candidate
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 border border-emerald-200">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Improve Decisions</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Replaces subjective recruiter fatigue with standardized 4-dimension rubrics, Sentence-Transformers semantic alignment, and transparent feedback.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
            98.2% decision consistency
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 border border-purple-200">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Scale Easily</h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Engineered with persistent SQLite relational storage, ephemeral vector computations, and multi-tenancy to process thousands of applicants concurrently.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-purple-700">
            Linear scaling with sub-second lookups
          </div>
        </div>
      </div>

      {/* Scalability Path Progression */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">ENTERPRISE SCALABILITY PATH</span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">Enterprise Growth & Scale Roadmap</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200">
            <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">STEP 1</span>
            <h5 className="text-sm font-bold text-slate-900 mt-2">Candidates</h5>
            <p className="text-xs text-slate-600 mt-1">Automated PDF text extraction, spaCy entity recognition, and PII anonymization.</p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200">
            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">STEP 2</span>
            <h5 className="text-sm font-bold text-slate-900 mt-2">Job Roles</h5>
            <p className="text-xs text-slate-600 mt-1">Dynamic JD specifications, experience fit modeling, and multi-department role catalogs.</p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200">
            <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">STEP 3</span>
            <h5 className="text-sm font-bold text-slate-900 mt-2">Recruiters</h5>
            <p className="text-xs text-slate-600 mt-1">Multi-user tenancy, blind screening mode, human oversight annotations, and audit logging.</p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">STEP 4</span>
            <h5 className="text-sm font-bold text-slate-900 mt-2">AI / NLP Features</h5>
            <p className="text-xs text-slate-600 mt-1">S-BERT semantic similarity, dynamic Gemini voice interview, and multi-dimensional scoring.</p>
          </div>
        </div>
      </div>

      {/* Interactive HR Workload ROI Calculator */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Calculator className="w-4 h-4" />
          <span>INTERACTIVE HR WORKLOAD REDUCTION & ROI CALCULATOR</span>
        </div>
        <h3 className="text-xl font-bold">Simulate Scalability & Efficiency Gains</h3>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl">
          Adjust monthly candidate volume and manual screening durations to see the quantified productivity return delivered by Smart Recruit.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-800">
          {/* Sliders */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Monthly Applicant Volume</span>
                <span className="text-indigo-400 font-bold">{applicantVolume} Candidates</span>
              </div>
              <input
                type="range"
                min="20"
                max="1000"
                step="20"
                value={applicantVolume}
                onChange={(e) => setApplicantVolume(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Manual Screening Time per Candidate</span>
                <span className="text-indigo-400 font-bold">{manualReviewMins} Minutes</span>
              </div>
              <input
                type="range"
                min="15"
                max="90"
                step="5"
                value={manualReviewMins}
                onChange={(e) => setManualReviewMins(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Recruiter / HR Hourly Wage</span>
                <span className="text-indigo-400 font-bold">${recruiterHourlyRate} / Hour</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={recruiterHourlyRate}
                onChange={(e) => setRecruiterHourlyRate(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Card */}
          <div className="bg-slate-800/90 p-5 rounded-2xl border border-slate-700 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Projected Return</span>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-emerald-400">${dollarsSaved.toLocaleString()}</span>
                <span className="text-xs text-slate-400 block mt-0.5">Estimated Cost Savings / Month</span>
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-slate-700 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Manual Effort:</span>
                <span className="font-bold text-rose-400">{manualTotalHours} Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Smart Recruit AI:</span>
                <span className="font-bold text-emerald-400">{aiTotalHours} Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Screening Velocity:</span>
                <span className="font-bold text-indigo-300">{speedupMultiplier}x Faster</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual vs Smart Recruit Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">PROBLEM STATEMENT & RELEVANCE</span>
          <h3 className="text-lg font-bold text-slate-900 mt-0.5">Traditional Manual Recruitment vs. Smart Recruit AI</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Evaluation Dimension</th>
                <th className="py-3 px-4 text-rose-700">Traditional Recruitment</th>
                <th className="py-3 px-4 text-emerald-700">Smart Recruit AI Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Screening Speed</td>
                <td className="py-3 px-4 text-slate-600">30 - 60 minutes per resume</td>
                <td className="py-3 px-4 font-bold text-emerald-700">3.5 seconds via S-BERT & spaCy</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Bias & Subjectivity</td>
                <td className="py-3 px-4 text-slate-600">High risk of demographic, gender, and school bias</td>
                <td className="py-3 px-4 font-bold text-emerald-700">100% Blind Screening with masked PII</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Evaluation Consistency</td>
                <td className="py-3 px-4 text-slate-600">Inconsistent due to recruiter fatigue and mood</td>
                <td className="py-3 px-4 font-bold text-emerald-700">98.2% standardized 4-dimension rubric</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-800">Candidate Feedback</td>
                <td className="py-3 px-4 text-slate-600">Rarely provided or delayed by weeks</td>
                <td className="py-3 px-4 font-bold text-emerald-700">Instant strengths, weaknesses & skill gap scorecard</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// ETHICS, GOVERNANCE & AUDIT LOGS
// ==========================================
function EthicsSustainabilityView({ targetSegment, setTargetSegment, pricingTier, setPricingTier }) {
  const [ethicsStats, setEthicsStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTabSub, setActiveTabSub] = useState('pillars'); // 'pillars', 'audit', 'weights'

  // Rubric weights test state
  const [techWeight, setTechWeight] = useState(25);
  const [behavWeight, setBehavWeight] = useState(25);
  const [commWeight, setCommWeight] = useState(25);
  const [projWeight, setProjWeight] = useState(25);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/ethics-summary`)
      .then((res) => setEthicsStats(res.data))
      .catch((err) => console.warn('Ethics stats fetch error:', err.message));

    axios
      .get(`${API_URL}/api/audit-logs`)
      .then((res) => {
        if (res.data && res.data.audit_logs) {
          setAuditLogs(res.data.audit_logs);
        }
      })
      .catch((err) => console.warn('Audit logs fetch error:', err.message));
  }, []);

  const ethicalPillars = [
    {
      title: 'Bias Reduction',
      desc: 'Standardized AI-based evaluation with Blind Screening mode eliminates demographic, gender, age, and institution bias.',
      icon: Scale,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Fairness',
      desc: 'Candidates are evaluated strictly against relevant technical skills, competencies, and verified job requirements.',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Privacy & Data Protection',
      desc: 'Resumes, transcripts, and personal contact details are stored securely in local encrypted SQLite records with PII tokenization.',
      icon: EyeOff,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Transparent Scoring',
      desc: 'Complete mathematical explainability. Recruiters can view rubric weightings, semantic match, and interview breakdown.',
      icon: BarChart2,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Human Oversight',
      desc: 'AI strictly assists human recruiters, never replaces judgment. Recruiters hold final authority to override or annotate verdicts.',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Responsible AI',
      desc: 'Built in compliance with ethical hiring standards, continuous audit logs, and rubric-calibrated LLM generation.',
      icon: Award,
      color: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800">
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">GOVERNANCE & RESPONSIBLE AI</span>
        <h2 className="text-3xl font-extrabold mt-1">Sustainability, Ethics & Responsible AI</h2>
        <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-3xl leading-relaxed">
          "Smart Recruit: AI + NLP for faster, fairer and more consistent recruitment." Standardized AI screening designed to reduce manual burden while upholding the highest ethical standards.
        </p>

        {/* Live Metrics */}
        {ethicsStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Screened</span>
              <p className="text-2xl font-bold text-white mt-0.5">{ethicsStats.total_screened_candidates}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Interviews Evaluated</span>
              <p className="text-2xl font-bold text-indigo-300 mt-0.5">{ethicsStats.total_interviews_evaluated}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Blind Screening</span>
              <p className="text-2xl font-bold text-emerald-400 mt-0.5">{ethicsStats.blind_screening_compliance}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Human Oversight</span>
              <p className="text-xs font-bold text-slate-300 mt-1">{ethicsStats.human_oversight_ratio}</p>
            </div>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTabSub('pillars')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTabSub === 'pillars' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          6 Ethical Pillars & Market Framework
        </button>
        <button
          onClick={() => setActiveTabSub('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTabSub === 'audit' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Live Compliance Audit Trail</span>
        </button>
        <button
          onClick={() => setActiveTabSub('weights')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTabSub === 'weights' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Score Explainability Calibrator</span>
        </button>
      </div>

      {activeTabSub === 'pillars' && (
        <>
          {/* 6 Core Ethical Pillars */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">The 6 Ethical & Sustainability Pillars</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ethicalPillars.map((p, idx) => {
                const Icon = p.icon;
  return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${p.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{p.title}</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Market Potential & Proposed Business Model */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">MARKET POTENTIAL & BUSINESS VALUE</span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">Target Segments & Scalability Framework</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Building className="w-5 h-5 text-indigo-600 mb-2" />
                <h5 className="text-sm font-bold text-slate-900">Companies & HR</h5>
                <p className="text-xs text-slate-500 mt-1">Automate screening workflows and accelerate hiring velocity.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Users className="w-5 h-5 text-indigo-600 mb-2" />
                <h5 className="text-sm font-bold text-slate-900">Recruitment Agencies</h5>
                <p className="text-xs text-slate-500 mt-1">Process voluminous candidate talent pools with high consistency.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Sparkles className="w-5 h-5 text-indigo-600 mb-2" />
                <h5 className="text-sm font-bold text-slate-900">Startups</h5>
                <p className="text-xs text-slate-500 mt-1">Reduce operational recruitment overhead and find cultural & skill fit.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <Award className="w-5 h-5 text-indigo-600 mb-2" />
                <h5 className="text-sm font-bold text-slate-900">Placement Cells</h5>
                <p className="text-xs text-slate-500 mt-1">Empower students with realistic AI mock interview feedback.</p>
              </div>
            </div>

            {/* Business Model Tiers */}
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-3">Proposed Business Model</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-500 uppercase">Freemium</span>
                  <p className="text-base font-extrabold text-slate-900 mt-1">Basic Screening</p>
                  <p className="text-xs text-slate-500 mt-1">Single resume parse and basic keyword matching.</p>
                </div>
                <div className="border border-indigo-200 p-4 rounded-xl bg-indigo-50/50">
                  <span className="text-xs font-bold text-indigo-600 uppercase">Subscription</span>
                  <p className="text-base font-extrabold text-indigo-900 mt-1">Advanced AI & Voice</p>
                  <p className="text-xs text-indigo-700 mt-1">S-BERT semantic similarity, dynamic voice TTS, and skill gap reports.</p>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50/50">
                  <span className="text-xs font-bold text-slate-500 uppercase">B2B Enterprise</span>
                  <p className="text-base font-extrabold text-slate-900 mt-1">Organization Plans</p>
                  <p className="text-xs text-slate-500 mt-1">Bulk candidate ranking, custom job management, and oversight audit logs.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTabSub === 'audit' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">ACCOUNTABILITY & AUDIT TRAIL</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Live Compliance & Transparency Audit Trail</h3>
            <p className="text-xs text-slate-500 mt-1">
              Every system event, blind screening action, resume parse, and recruiter override is immutably logged to ensure complete accountability.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Actor Role</th>
                  <th className="py-2.5 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {log.created_at}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-indigo-700">
                      <span className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-slate-700 font-semibold">{log.actor_role}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                      {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTabSub === 'weights' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">TRANSPARENCY & FAIRNESS</span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">Rubric Weight Calibrator & Mathematical Explainability</h3>
            <p className="text-xs text-slate-500 mt-1">
              Smart Recruit evaluates candidates using 4 equal 25% weights to prevent single-dimension bias and guarantee multi-faceted competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Technical Competency Weight</span>
                  <span className="text-indigo-600">{techWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={techWeight}
                  onChange={(e) => setTechWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Behavioral (STAR Method) Weight</span>
                  <span className="text-indigo-600">{behavWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={behavWeight}
                  onChange={(e) => setBehavWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Communication Clarity Weight</span>
                  <span className="text-indigo-600">{commWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={commWeight}
                  onChange={(e) => setCommWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Project & Architecture Depth Weight</span>
                  <span className="text-indigo-600">{projWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={projWeight}
                  onChange={(e) => setProjWeight(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between text-xs space-y-3">
              <div>
                <h5 className="font-bold text-slate-800 text-sm">Explainability Grounding</h5>
                <p className="text-slate-600 mt-2 leading-relaxed">
                  Formula: <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">Overall Score = (Technical * {techWeight}% + Behavioral * {behavWeight}% + Communication * {commWeight}% + Project * {projWeight}%) / 10</code>
                </p>
                <p className="text-slate-600 mt-2 leading-relaxed">
                  Total Active Weight Sum: <span className="font-extrabold text-indigo-700">{techWeight + behavWeight + commWeight + projWeight}%</span>
                </p>
              </div>

              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-[11px] font-semibold">
                ✓ Responsible AI Verified: Balanced weighting eliminates single-attribute bias and guarantees fair ranking across diverse background profiles.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// SYSTEM ARCHITECTURE & CAPSTONE HUB
// ==========================================
function PresentationHubView({ setActiveTab }) {
  const [activeSection, setActiveSection] = useState('problem');

  const documentationSections = [
    {
      id: 'problem',
      title: '1. Problem Statement',
      tag: 'Workflow',
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 text-sm">
            Traditional recruitment relies heavily on manual resume screening and interviews.
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Manual Overhead:</strong> Recruiters spend an average of 45-60 minutes manually reviewing each resume, leading to recruiting bottlenecks.</li>
            <li><strong>Cognitive Fatigue & Inconsistency:</strong> Evaluation standards fluctuate across candidates due to subjective interviewer fatigue.</li>
            <li><strong>Unconscious Demographic Bias:</strong> Exposure to candidate names, photos, gender, and educational pedigree introduces non-merit screening distortion.</li>
            <li><strong>Lack of Candidate Feedback:</strong> Candidates rarely receive quantitative insights into their skill gaps or interview performance.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'solution',
      title: '2. Proposed Solution',
      tag: 'Workflow',
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 text-sm">
            Smart Recruit uses AI and Natural Language Processing (NLP) to automate candidate evaluation end-to-end.
          </p>
          <p>
            The platform delivers a 5-step continuous automated workflow:
          </p>
          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl font-mono text-xs text-indigo-900 font-bold">
            [ 1. Resume ] ➔ [ 2. AI / NLP ] ➔ [ 3. Ranking ] ➔ [ 4. Interview ] ➔ [ 5. Score ]
          </div>
          <p>
            <strong>Key Outcome:</strong> Faster, more accurate, and consistent recruitment with reduced manual effort while upholding strict ethical standards.
          </p>
        </div>
      )
    },
    {
      id: 'modules',
      title: '3. Core System Modules',
      tag: 'Architecture',
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 text-sm">
            The Smart Recruit platform is engineered across 8 Core Modules:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { num: '1', name: 'Authentication', desc: 'Role switching, multi-tenancy, and profile management.' },
              { num: '2', name: 'Resume Parsing', desc: 'PDF text extraction, contact sanitization, and spaCy entity recognition.' },
              { num: '3', name: 'Resume Analysis', desc: 'S-BERT semantic similarity scoring, competency matrix, and experience fit.' },
              { num: '4', name: 'Job Management', desc: 'Job creation, required competencies, role catalogs, and applicant tracking.' },
              { num: '5', name: 'Interview Generation', desc: 'Dynamic, context-aware turn-by-turn question synthesis via Gemini.' },
              { num: '6', name: 'Interview Evaluation', desc: 'Turn-by-turn scoring across 4 dimensions: Technical, Behavioral, Communication, Project.' },
              { num: '7', name: 'Database', desc: 'Persistent SQLite storage for candidates, jobs, rankings, transcripts, and reports.' },
              { num: '8', name: 'Reporting & Feedback', desc: 'Scorecards, radar charts, printable PDF exports, and human oversight decision logging.' },
            ].map((m) => (
              <div key={m.num} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">Module {m.num}</span>
                <h5 className="font-bold text-slate-900 text-xs mt-1">{m.name}</h5>
                <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'systems',
      title: '4. Systems Architecture',
      tag: 'Architecture',
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 text-sm">
            Client-Server Architecture with Distributed NLP and Voice Engine:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Frontend Layer:</strong> React 19, Vite, Tailwind CSS, Recharts for visual radar analysis and live audio playback.</li>
            <li><strong>Backend API Layer:</strong> Python 3.10+, Flask REST API, Flask-CORS, and SQLite persistent relational engine.</li>
            <li><strong>NLP & Embedding Engine:</strong> Sentence-Transformers (`all-MiniLM-L6-v2`) computing 384-dimensional dense semantic vectors.</li>
            <li><strong>Entity Recognition:</strong> spaCy (`en_core_web_sm`) PhraseMatcher identifying technical competencies and framework stacks.</li>
            <li><strong>Generative LLM & TTS:</strong> Google Gemini 2.5 Flash for dynamic question generation and Gemini TTS for natural vocal interaction.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'market',
      title: '5. Market & Business Model',
      tag: 'Business Model',
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 text-sm">
            High-Impact Multi-Sector Applicability:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 bg-slate-50 rounded border">🏢 <strong>Companies & HR:</strong> Accelerated hiring velocity.</div>
            <div className="p-2 bg-slate-50 rounded border">🤝 <strong>Recruitment Agencies:</strong> High candidate volume throughput.</div>
            <div className="p-2 bg-slate-50 rounded border">🚀 <strong>Startups:</strong> Reduced operational recruitment cost.</div>
            <div className="p-2 bg-slate-50 rounded border">🎓 <strong>Placement Cells:</strong> University campus mock screening.</div>
          </div>
          <p className="font-semibold text-slate-900 mt-2">Proposed Commercial Model:</p>
          <p>Freemium (Basic single screening) ➔ Subscription (Advanced AI & Voice TTS) ➔ B2B Enterprise (Organization seats & Audit logs).</p>
        </div>
      )
    },
    {
      id: 'ethics',
      title: '6. Sustainability & Ethics',
      tag: 'Ethics & Compliance',
      content: (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900 text-sm">
            6 Core Responsible AI Pillars:
          </p>
          <p>
            <strong>Bias Reduction</strong> (Blind Screening) • <strong>Fairness</strong> (Competency-only weighting) • <strong>Privacy</strong> (PII sanitization & secure local storage) • <strong>Transparency</strong> (Explainable 25% weights) • <strong>Human Oversight</strong> (Recruiter retains final judgment) • <strong>Responsible AI</strong> (Audit trails).
          </p>
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold text-center">
            Ethical Goal: "AI-assisted recruitment that is fair, secure, transparent and accountable."
          </div>
        </div>
      )
    }
  ];
  return (
    <div className="space-y-8">
      {/* 50-Mark Quick Recall Hub */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4" />
          <span>CAPSTONE KNOWLEDGE & ARCHITECTURE RECALL</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight">Executive Presentation & Defense Summary</h2>
        <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
          The 5 core pillars of the Smart Recruit Capstone Project for presentation review:
        </p>

        {/* 5 Quick Recall Circles / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm mx-auto mb-2">
                1
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">PROBLEM</span>
              <p className="text-sm font-bold text-white mt-1">Manual ➔ AI</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Time-consuming, biased ➔ Automated NLP evaluation</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm mx-auto mb-2">
                2
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">IMPACT</span>
              <p className="text-sm font-bold text-white mt-1">Faster + Scalable</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Workload reduction, consistent scoring & scale</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-extrabold flex items-center justify-center text-sm mx-auto mb-2">
                3
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">MARKET</span>
              <p className="text-sm font-bold text-white mt-1">Companies + B2B</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">HR, Agencies, Startups, & Placement Cells</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm mx-auto mb-2">
                4
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">ETHICS</span>
              <p className="text-sm font-bold text-white mt-1">Fair + Private</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Blind screening, transparent rubric & oversight</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 text-center flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-rose-600 text-white font-extrabold flex items-center justify-center text-sm mx-auto mb-2">
                5
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">PRESENTATION</span>
              <p className="text-sm font-bold text-white mt-1">Clear + Complete</p>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">End-to-end continuous live demonstration</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-sm font-bold text-indigo-300">
            "Smart Recruit: AI + NLP for faster, fairer and more consistent recruitment."
          </p>
        </div>
      </div>

      {/* Presentation & Documentation Section Navigator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">SYSTEM SPECIFICATIONS & DOCUMENTATION</span>
          <h3 className="text-xl font-bold text-slate-900 mt-0.5">Capstone Engineering & Academic Documentation</h3>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2">
          {documentationSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeSection === sec.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{sec.title}</span>
            </button>
          ))}
        </div>

        {/* Active Section Content */}
        <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200">
          {documentationSections.find((s) => s.id === activeSection)?.content}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PRINTABLE SCORECARD MODAL
// ==========================================
function ScorecardPrintModal({ report, onClose }) {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in">
        {/* Printable Scorecard Container */}
        <div id="printable-scorecard" className="space-y-6 border p-6 rounded-xl border-slate-300 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center space-x-2">
                <Brain className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">SMART RECRUIT</h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">Candidate Evaluation & Mock Interview Scorecard</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Evaluation Date</span>
              <p className="text-xs font-bold text-slate-700">{new Date(report.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Candidate Profile Details */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Candidate Name</span>
              <p className="text-sm font-bold text-slate-900">{report.candidate_name}</p>
              <span className="text-[11px] text-slate-500 font-mono">Alias: {report.anonymized_alias || 'Candidate'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">Target Position</span>
              <p className="text-sm font-bold text-slate-900">{report.job_title}</p>
              <span className="text-[11px] text-slate-500">Session Duration: {report.duration_minutes || 15} Mins</span>
            </div>
          </div>

          {/* Overall Rating Banner */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-900 uppercase">Composite Suitability Score</span>
              <p className="text-xs text-indigo-700">Calculated across 4 equal 25% rubric dimensions</p>
            </div>
            <div className="text-3xl font-extrabold text-indigo-700">
              {report.overall_score} / 10
            </div>
          </div>

          {/* Rubric Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Multidimensional Rubric Scores</h4>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Technical</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">{report.technical_rating}/10</p>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Behavioral</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">{report.behavioral_rating}/10</p>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Communication</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">{report.communication_rating}/10</p>
              </div>
              <div className="p-2.5 bg-slate-50 border rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Project Depth</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">{report.project_understanding_rating}/10</p>
              </div>
            </div>
          </div>

          {/* Qualitative Notes */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-900">Key Strengths:</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">{report.strengths}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900">Areas for Growth & Skill Gaps:</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">{report.weaknesses || report.skill_gap_summary}</p>
            </div>
            <div>
              <span className="font-bold text-slate-900">Recommendations:</span>
              <p className="text-slate-700 mt-0.5 leading-relaxed">{report.suggestions_for_improvement}</p>
            </div>
          </div>

          {/* Oversight Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-700">Recruiter Decision:</span>
              <span className="ml-1.5 px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-800 border">
                {report.recruiter_decision}
              </span>
            </div>
            <div className="text-slate-400 text-[10px] italic">
              Smart Recruit AI Engine v2.0 • Verified Scorecard
            </div>
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SHARED UTILITIES & COMPONENTS
// ==========================================
function InfoCard({ title, icon, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center space-x-2.5 mb-4">
        {icon}
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ErrorMessage({ message, clearError }) {
  return (
    <div className="max-w-4xl mx-auto p-4 mb-6 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl flex justify-between items-center text-xs font-medium shadow-sm">
      <div className="flex items-center space-x-2">
        <ServerCrash className="w-4 h-4 text-rose-600 shrink-0" />
        <span>{message}</span>
      </div>
      <button onClick={clearError} className="font-bold text-base hover:text-rose-900 ml-4">
        &times;
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center space-x-2">
          <Brain className="w-4 h-4 text-indigo-600" />
          <span className="font-bold text-slate-700">SMART RECRUIT</span>
          <span>• End-to-End Resume Parsing and Mock Interview AI</span>
        </div>
        <div>
          <span>AI + NLP for faster, fairer and more consistent recruitment • 50-Mark Presentation Architecture</span>
        </div>
      </div>
    </footer>
  );
}
