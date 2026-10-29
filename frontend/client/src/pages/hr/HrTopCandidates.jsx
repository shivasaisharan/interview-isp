import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award, ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, Eye,
  CheckSquare, XCircle, Clock, ShieldAlert, Sparkles, MessageSquare,
  Star, Check, X, Calendar, FileText
} from 'lucide-react';
import api from '../../services/api';

export default function HrTopCandidates() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decision Modal State
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [decisionType, setDecisionType] = useState('selected');
  const [rationale, setRationale] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Interact Modal State (Direct 1-on-1 Human Recruiter Interview)
  const [interactModalOpen, setInteractModalOpen] = useState(false);
  const [selectedForInteract, setSelectedForInteract] = useState(null);
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [interactMessage, setInteractMessage] = useState('');
  const [submittingInteract, setSubmittingInteract] = useState(false);
  const [interactSuccess, setInteractSuccess] = useState('');

  const fetchTopCandidates = async () => {
    try {
      const [jobRes, topRes] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get(`/rankings/job/${jobId}/top-candidates`)
      ]);
      setJob(jobRes.data);
      setCandidates(topRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopCandidates();
  }, [jobId]);

  const openDecisionModal = (candidate) => {
    setActiveCandidate(candidate);
    setDecisionType('selected');
    setRationale(`Candidate demonstrated strong competency in ${candidate.matched_skills.slice(0, 3).join(', ')}.`);
    setDecisionModalOpen(true);
    setSuccessMsg('');
  };

  const handleConfirmDecision = async (e) => {
    e.preventDefault();
    if (!rationale.trim()) {
      alert("Please enter a job-related rationale for the decision record.");
      return;
    }
    setSubmittingDecision(true);

    try {
      await api.post('/decisions', {
        application_id: activeCandidate.application_id,
        decision: decisionType,
        rationale: rationale
      });
      setSuccessMsg(`Decision confirmed: Candidate marked as ${decisionType.toUpperCase()}!`);
      setTimeout(() => {
        setDecisionModalOpen(false);
        fetchTopCandidates();
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit hiring decision.");
    } finally {
      setSubmittingDecision(false);
    }
  };

  const openInteractModal = (candidate) => {
    setSelectedForInteract(candidate);
    setScheduledAt(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
    setMeetingLink('https://meet.google.com/abc-defg-hij');
    setInteractMessage(
      `Hello ${candidate.candidate_name}, congratulations on ranking #` +
      `${candidate.rank} in our evaluation! We invite you to an exclusive 1-on-1 direct recruiter interview.`
    );
    setInteractSuccess('');
    setInteractModalOpen(true);
  };

  const handleSendInteraction = async (e) => {
    e.preventDefault();
    if (!interactMessage.trim()) {
      alert('Please enter a message or invitation notes.');
      return;
    }
    setSubmittingInteract(true);
    try {
      await api.post(`/applications/${selectedForInteract.application_id}/interact`, {
        interaction_type: 'schedule_1on1_interview',
        scheduled_at: scheduledAt,
        meeting_link: meetingLink,
        message: interactMessage,
        proposed_fit: getFitBadge(selectedForInteract.overall_score).label
      });
      setInteractSuccess('Direct 1-on-1 interview invitation dispatched successfully!');
      setTimeout(() => {
        setInteractModalOpen(false);
        fetchTopCandidates();
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to dispatch interaction.');
    } finally {
      setSubmittingInteract(false);
    }
  };

  // 3-Way Fit Status Helper
  const getFitBadge = (score) => {
    const s = Number(score) || 0;
    if (s >= 82) {
      return {
        label: 'Perfect for the job',
        style: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60 font-bold',
        icon: Star,
        color: 'text-amber-400'
      };
    } else if (s >= 65) {
      return {
        label: 'Fit',
        style: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60 font-semibold',
        icon: Check,
        color: 'text-indigo-400'
      };
    } else {
      return {
        label: 'Unfit',
        style: 'bg-rose-950/80 text-rose-300 border-rose-700/60 font-semibold',
        icon: X,
        color: 'text-rose-400'
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/hr/jobs" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Catalog
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AI Recommendation Board
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              Top 5 Qualified Candidates
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{job?.title}</h1>
          <p className="mt-1 text-xs text-slate-400 max-w-xl">
            Ranked based on composite evaluation model: 30% Resume Alignment + 50% Verified Interview Q&A + 20% Required Skills Coverage.
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-xs">
          <p className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Human Authority Rule
          </p>
          <span>AI evaluates responses. HR conducts direct 1-on-1 interviews and holds sole legal authority for final hiring decisions.</span>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      {candidates.length === 0 ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-sm">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-bold text-white text-base mb-1">No Evaluated Candidates Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Candidates must submit applications and complete interview assessments before appearing on this board.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {candidates.map((cand) => {
            const fit = getFitBadge(cand.overall_score);
            const FitIcon = fit.icon;
            return (
              <div
                key={cand.application_id}
                className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                  cand.rank === 1
                    ? 'bg-gradient-to-b from-indigo-950/60 to-slate-950 border-indigo-500/50 shadow-lg shadow-indigo-950/30'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 ${
                      cand.rank === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-900 text-slate-300 border border-slate-800'
                    }`}>
                      #{cand.rank}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-bold text-white">{cand.candidate_name}</h2>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {cand.anonymized_alias}
                        </span>
                        {/* 3-Way Fit Status Badge */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs border ${fit.style}`}>
                          <FitIcon className={`w-3.5 h-3.5 ${fit.color}`} />
                          <span>{fit.label}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Status: <span className="font-semibold text-slate-200 uppercase">{cand.status.replace('_', ' ')}</span></p>
                    </div>
                  </div>

                  {/* Score Breakdown Gauges */}
                  <div className="flex items-center gap-6 sm:gap-8 text-center bg-slate-900/80 px-6 py-3 rounded-2xl border border-slate-800">
                    <div>
                      <span className="text-lg font-bold text-slate-200">{cand.resume_match_score}%</span>
                      <span className="text-[10px] text-slate-500 block font-medium">Resume (30%)</span>
                    </div>
                    <div className="h-8 w-px bg-slate-800"></div>
                    <div>
                      <span className="text-lg font-bold text-slate-200">{cand.interview_score}%</span>
                      <span className="text-[10px] text-slate-500 block font-medium">Interview (50%)</span>
                    </div>
                    <div className="h-8 w-px bg-slate-800"></div>
                    <div>
                      <span className="text-lg font-bold text-slate-200">{cand.required_skills_score}%</span>
                      <span className="text-[10px] text-slate-500 block font-medium">Skills (20%)</span>
                    </div>
                    <div className="h-8 w-px bg-slate-800"></div>
                    <div>
                      <span className="text-2xl font-black text-indigo-400">{cand.overall_score}%</span>
                      <span className="text-[10px] text-indigo-300 block font-bold uppercase tracking-wider">Composite Rank</span>
                    </div>
                  </div>
                </div>

                {/* Strengths & Observations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-slate-800 text-xs">
                  <div>
                    <h4 className="font-bold text-emerald-400 mb-2 uppercase tracking-wider">Demonstrated Strengths</h4>
                    <ul className="space-y-1.5 text-slate-300">
                      {cand.strengths.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-amber-400 mb-2 uppercase tracking-wider">Areas for Review</h4>
                    <ul className="space-y-1.5 text-slate-300">
                      {cand.areas_for_review.map((a, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Actions: View Q&A Dossier, Interact with Candidate, & Human Hiring Decision */}
                <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-[11px] text-slate-500 max-w-md">
                    {cand.assessment_limitations}
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* View Full Q&A & Dossier */}
                    <Link
                      to={`/hr/jobs/${jobId}/applicants`}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Inspect Q&A Document & Resume"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      Q&A & Resume
                    </Link>

                    {/* Detailed Scorecard */}
                    {cand.report_id && (
                      <Link
                        to={`/hr/reports/${cand.report_id}`}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        Scorecard
                      </Link>
                    )}

                    {/* Interact with Candidate (Direct Recruiter 1-on-1 Interview) */}
                    <button
                      onClick={() => openInteractModal(cand)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-indigo-500/50 text-indigo-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Schedule direct 1-on-1 recruiter interview"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                      Interact with Candidate
                    </button>

                    {/* Recruiter Decision Authority */}
                    <button
                      onClick={() => openDecisionModal(cand)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      Confirm Decision
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Human Hiring Decision Modal */}
      {decisionModalOpen && activeCandidate && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-slate-800 shadow-2xl text-slate-100 animate-fadeIn">
            <h3 className="text-lg font-bold text-white mb-1">Human Recruiter Hiring Decision</h3>
            <p className="text-xs text-slate-400 mb-6">
              Candidate: <span className="text-white font-semibold">{activeCandidate.candidate_name}</span> ({activeCandidate.anonymized_alias})
            </p>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleConfirmDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">Select Decision Outcome</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDecisionType('selected')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      decisionType === 'selected' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Select for Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionType('on_hold')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      decisionType === 'on_hold' ? 'bg-amber-600 text-white border-amber-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Put On Hold
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisionType('rejected')}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      decisionType === 'rejected' ? 'bg-rose-600 text-white border-rose-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Reject Candidate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Mandatory Recruiter Rationale (Immutable Audit Log)
                </label>
                <textarea
                  rows={4}
                  required
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Record your objective justification for this decision (e.g. exceptional distributed system experience, cultural fit)..."
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 text-xs font-bold text-slate-300 rounded-xl hover:bg-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDecision}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submittingDecision ? 'Recording Immutable Audit...' : 'Confirm Final Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interact With Candidate Modal (Direct 1-on-1 Interview) */}
      {interactModalOpen && selectedForInteract && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                  RECRUITER 1-ON-1 INTERACTION
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Interact with {selectedForInteract.candidate_name}
                </h3>
              </div>
              <button
                onClick={() => setInteractModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {interactSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{interactSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSendInteraction} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Meeting Link (Google Meet / Zoom)</label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Recruiter Message / Invitation Notes</label>
                <textarea
                  rows={4}
                  required
                  value={interactMessage}
                  onChange={(e) => setInteractMessage(e.target.value)}
                  placeholder="Type instructions or details for the candidate..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setInteractModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingInteract}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submittingInteract ? 'Dispatching Invitation...' : 'Dispatch Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
