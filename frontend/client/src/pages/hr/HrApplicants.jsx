import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users, Award, ArrowLeft, Search, CheckCircle2, Bot, Eye, FileText,
  Calendar, MessageSquare, Star, X, Check, Clock, UserCheck, ShieldCheck,
  Mail, MapPin, GraduationCap, Briefcase, ExternalLink, Sparkles, AlertCircle
} from 'lucide-react';
import api from '../../services/api';

export default function HrApplicants() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState('');
  const [fitFilter, setFitFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Candidate Dossier & Resume Modal State
  const [dossierModalOpen, setDossierModalOpen] = useState(false);
  const [dossierLoading, setDossierLoading] = useState(false);
  const [dossierData, setDossierData] = useState(null);
  const [activeDossierTab, setActiveDossierTab] = useState('resume'); // resume | qa | personal | performance

  // Interact With Candidate Modal State
  const [interactModalOpen, setInteractModalOpen] = useState(false);
  const [selectedAppForInteract, setSelectedAppForInteract] = useState(null);
  const [interactionType, setInteractionType] = useState('schedule_1on1_interview');
  const [scheduledAt, setScheduledAt] = useState('');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/abc-defg-hij');
  const [interactMessage, setInteractMessage] = useState(
    'Congratulations! Following your evaluation, our team would like to invite you for a 1-on-1 interview with our Lead Recruiter.'
  );
  const [submittingInteract, setSubmittingInteract] = useState(false);
  const [interactSuccess, setInteractSuccess] = useState('');

  const fetchApplicants = async () => {
    try {
      if (jobId) {
        const [jobRes, appsRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get(`/applications/job/${jobId}/applicants`)
        ]);
        setJob(jobRes.data);
        setApplicants(appsRes.data);
      } else {
        // Viewing all candidate resumes across all jobs
        const appsRes = await api.get('/applications/organization/all');
        setApplicants(appsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const handleStageChange = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        note: `HR updated status to ${newStatus}`
      });
      await fetchApplicants();
    } catch (err) {
      alert('Failed to update applicant status.');
    }
  };

  // Open Dossier Modal
  const openDossierModal = async (appId) => {
    setDossierModalOpen(true);
    setDossierLoading(true);
    try {
      const res = await api.get(`/applications/${appId}/dossier`);
      setDossierData(res.data);
    } catch (err) {
      alert('Failed to load candidate dossier and resume.');
      setDossierModalOpen(false);
    } finally {
      setDossierLoading(false);
    }
  };

  // Open Interact Modal
  const openInteractModal = (app) => {
    setSelectedAppForInteract(app);
    setScheduledAt(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
    setMeetingLink('https://meet.google.com/abc-defg-hij');
    setInteractMessage(
      `Hello ${app.candidate_name || 'Candidate'}, following your verified assessment, we invite you to a direct 1-on-1 interview with our Talent Acquisition team.`
    );
    setInteractSuccess('');
    setInteractModalOpen(true);
  };

  const handleSendInteraction = async (e) => {
    e.preventDefault();
    if (!interactMessage.trim()) {
      alert('Please enter a message or invitation note.');
      return;
    }
    setSubmittingInteract(true);
    try {
      await api.post(`/applications/${selectedAppForInteract.id}/interact`, {
        interaction_type: interactionType,
        scheduled_at: scheduledAt,
        meeting_link: meetingLink,
        message: interactMessage,
        proposed_fit: getFitBadge(selectedAppForInteract.overall_ranking_score).label
      });
      setInteractSuccess('Direct 1-on-1 interview invitation sent to candidate successfully!');
      setTimeout(() => {
        setInteractModalOpen(false);
        fetchApplicants();
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to dispatch interaction invitation.');
    } finally {
      setSubmittingInteract(false);
    }
  };

  // Helper for 3-way fit classification
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

  const filteredApplicants = applicants.filter((a) => {
    const matchesSearch =
      a.candidate_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.anonymized_alias?.toLowerCase().includes(search.toLowerCase()) ||
      a.job?.title?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (fitFilter === 'all') return true;
    const score = a.overall_ranking_score || 0;
    if (fitFilter === 'perfect') return score >= 82;
    if (fitFilter === 'fit') return score >= 65 && score < 82;
    if (fitFilter === 'unfit') return score < 65;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/hr/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Job Catalog
        </Link>
        {jobId && (
          <Link
            to={`/hr/jobs/${jobId}/top-candidates`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Award className="w-3.5 h-3.5" /> Top-5 Recommendation Board
          </Link>
        )}
      </div>

      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              {jobId ? 'Job Applicant Pool' : 'Verified Candidate Resumes'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {filteredApplicants.length} Candidates Available
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {jobId ? job?.title : 'Candidate Resumes & Assessment Repository'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Inspect verified resumes, review candidate interview answer documents, assess job fit classifications, and conduct direct 1-on-1 human recruiter interviews.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-950 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5 w-full sm:w-80 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, alias, or role..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* 3-Way Fit Filter */}
        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium shrink-0">Fit Verdict:</span>
          <button
            onClick={() => setFitFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              fitFilter === 'all'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({applicants.length})
          </button>
          <button
            onClick={() => setFitFilter('perfect')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              fitFilter === 'perfect'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'text-emerald-400/70 hover:text-emerald-300'
            }`}
          >
            🌟 Perfect for the job
          </button>
          <button
            onClick={() => setFitFilter('fit')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              fitFilter === 'fit'
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                : 'text-indigo-400/70 hover:text-indigo-300'
            }`}
          >
            ✅ Fit
          </button>
          <button
            onClick={() => setFitFilter('unfit')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
              fitFilter === 'unfit'
                ? 'bg-rose-950 text-rose-300 border border-rose-700'
                : 'text-rose-400/70 hover:text-rose-300'
            }`}
          >
            ❌ Unfit
          </button>
        </div>
      </div>

      {/* Candidate Resumes Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {filteredApplicants.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No candidate applications or resumes match your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/60">
                  <th className="p-4">Candidate & Blind Alias</th>
                  <th className="p-4">Target Role</th>
                  <th className="p-4 text-center">Assessment Result %</th>
                  <th className="p-4">Job Fit Assessment</th>
                  <th className="p-4">Workflow Status</th>
                  <th className="p-4 text-right">Recruiter Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApplicants.map((app) => {
                  const fit = getFitBadge(app.overall_ranking_score);
                  const FitIcon = fit.icon;
                  return (
                    <tr key={app.id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Candidate Name & Alias */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center font-bold text-xs shrink-0">
                            {app.candidate_name ? app.candidate_name[0] : 'C'}
                          </div>
                          <div>
                            <span className="font-bold text-white block text-sm">
                              {app.candidate_name || 'Candidate'}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                              {app.anonymized_alias || 'Candidate'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Job Title */}
                      <td className="p-4">
                        <span className="font-semibold text-slate-200 block">
                          {app.job?.title || 'Open Role'}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {app.job?.department || 'Engineering'}
                        </span>
                      </td>

                      {/* Result Percentage Gauge */}
                      <td className="p-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-base font-extrabold text-indigo-400">
                            {app.overall_ranking_score || 0}%
                          </span>
                          <div className="w-16 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-full rounded-full"
                              style={{ width: `${Math.min(app.overall_ranking_score || 0, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            R: {app.resume_match_score}% | S: {app.skills_match_score}%
                          </span>
                        </div>
                      </td>

                      {/* 3-Way Fit Status */}
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border ${fit.style}`}
                        >
                          <FitIcon className={`w-3.5 h-3.5 ${fit.color}`} />
                          <span>{fit.label}</span>
                        </span>
                      </td>

                      {/* Workflow Status Dropdown */}
                      <td className="p-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleStageChange(app.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="submitted">Submitted</option>
                          <option value="under_review">Under Review</option>
                          <option value="interview_pending">Interview Pending</option>
                          <option value="interview_completed">Interview Completed</option>
                          <option value="hr_review">HR Review (Shortlisted)</option>
                          <option value="selected">Selected for Offer</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>

                      {/* Recruiter Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Inspect Full Dossier & Resume */}
                          <button
                            onClick={() => openDossierModal(app.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            title="Inspect Candidate Dossier & Resume Document"
                          >
                            <FileText className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Inspect Dossier</span>
                          </button>

                          {/* Interact With Candidate */}
                          <button
                            onClick={() => openInteractModal(app)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                            title="Schedule 1-on-1 Recruiter Interview"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Interact</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Dossier & Resume Inspection Modal */}
      {dossierModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {dossierData ? dossierData.candidate.full_name : 'Candidate Dossier'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Application Dossier & Evaluation Record • Role: {dossierData?.job?.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDossierModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-800 mt-3 gap-2">
              <button
                onClick={() => setActiveDossierTab('resume')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeDossierTab === 'resume'
                    ? 'border-indigo-400 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Verified Candidate Resume
              </button>
              <button
                onClick={() => setActiveDossierTab('qa')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeDossierTab === 'qa'
                    ? 'border-indigo-400 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Interview Q&A Document
              </button>
              <button
                onClick={() => setActiveDossierTab('personal')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeDossierTab === 'personal'
                    ? 'border-indigo-400 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Personal & Profile Details
              </button>
              <button
                onClick={() => setActiveDossierTab('performance')}
                className={`px-4 py-2 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                  activeDossierTab === 'performance'
                    ? 'border-indigo-400 text-indigo-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Assessment Scorecard
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
              {dossierLoading || !dossierData ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                </div>
              ) : (
                <>
                  {/* TAB 1: RESUME DOCUMENT */}
                  {activeDossierTab === 'resume' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div>
                          <p className="font-bold text-white text-sm">{dossierData.resume.file_name}</p>
                          <p className="text-[11px] text-slate-400">
                            Uploaded on: {new Date(dossierData.resume.uploaded_at || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-xs font-bold">
                          Resume Alignment: {dossierData.scores.resume_match_score}%
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                          Extracted Competencies & Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {dossierData.resume.extracted_skills?.map((sk, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700 text-xs font-medium"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                          Parsed Resume Document Contents
                        </h4>
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto text-[11px]">
                          {dossierData.resume.parsed_text}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: INTERVIEW Q&A DOCUMENT */}
                  {activeDossierTab === 'qa' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-indigo-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span>
                          Verified Interview Q&A Document: Review the exact questions delivered to the candidate and their comprehensive spoken/written responses.
                        </span>
                      </div>

                      {dossierData.qa_examination_document?.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                          Candidate has not yet completed the interactive assessment interview session.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {dossierData.qa_examination_document.map((qa, idx) => (
                            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-indigo-300 text-xs">
                                  Question {qa.question_index + 1} ({qa.category})
                                </span>
                                <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold text-[10px] border border-slate-700">
                                  Score: {qa.composite_score}%
                                </span>
                              </div>
                              <p className="font-semibold text-white text-xs">{qa.question_text}</p>
                              
                              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">
                                  Candidate's Response:
                                </span>
                                <p className="text-slate-200 text-xs whitespace-pre-wrap italic">
                                  "{qa.candidate_answer}"
                                </p>
                              </div>

                              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                                <span className="font-bold text-indigo-400">AI Evaluation Feedback: </span>
                                {qa.ai_feedback}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: PERSONAL DETAILS */}
                  {activeDossierTab === 'personal' && (
                    <div className="space-y-4 bg-slate-950 p-5 rounded-xl border border-slate-800">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Full Name</span>
                            <span className="font-bold text-white text-xs">{dossierData.candidate.full_name}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Email Address</span>
                            <span className="text-white text-xs">{dossierData.candidate.email}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Blind Alias</span>
                            <span className="text-emerald-300 font-bold text-xs">{dossierData.candidate.anonymized_alias}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Location</span>
                            <span className="text-white text-xs">{dossierData.candidate.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Education</span>
                            <span className="text-white text-xs">{dossierData.candidate.education}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Experience</span>
                            <span className="text-white text-xs">{dossierData.candidate.experience_years} Years Professional</span>
                          </div>
                        </div>
                      </div>

                      {dossierData.candidate.summary && (
                        <div className="pt-3 border-t border-slate-800">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1">Professional Bio / Summary</span>
                          <p className="text-slate-300 leading-relaxed text-xs">{dossierData.candidate.summary}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: ASSESSMENT SCORECARD */}
                  {activeDossierTab === 'performance' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-400 block">Overall Rank</span>
                          <span className="text-lg font-extrabold text-indigo-400">{dossierData.scores.overall_ranking_score}%</span>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-400 block">Resume Match</span>
                          <span className="text-lg font-bold text-white">{dossierData.scores.resume_match_score}%</span>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-400 block">Skills Coverage</span>
                          <span className="text-lg font-bold text-white">{dossierData.scores.skills_match_score}%</span>
                        </div>
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-400 block">Fit Verdict</span>
                          <span className="text-xs font-bold text-emerald-400">{dossierData.scores.fit_verdict}</span>
                        </div>
                      </div>

                      {dossierData.interview_report && (
                        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                          <h4 className="font-bold text-white text-xs">Interview Evaluation Metrics</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">Demonstrated Strengths</span>
                              <ul className="list-disc list-inside space-y-1 text-slate-300">
                                {dossierData.interview_report.strengths?.map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-amber-400 uppercase block mb-1">Growth Opportunities</span>
                              <ul className="list-disc list-inside space-y-1 text-slate-300">
                                {dossierData.interview_report.weaknesses?.map((w, i) => (
                                  <li key={i}>{w}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-500">
                Evaluation data verified and legally protected under HR compliance auditing.
              </span>
              <button
                onClick={() => setDossierModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interact With Candidate Modal */}
      {interactModalOpen && selectedAppForInteract && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                  RECRUITER 1-ON-1 INTERACTION
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Interact with {selectedAppForInteract.candidate_name}
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
                <label className="block text-slate-300 font-bold mb-1">Interaction Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInteractionType('schedule_1on1_interview')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      interactionType === 'schedule_1on1_interview'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Schedule 1-on-1 Interview
                  </button>
                  <button
                    type="button"
                    onClick={() => setInteractionType('direct_message')}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                      interactionType === 'direct_message'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Direct Message / Inquiry
                  </button>
                </div>
              </div>

              {interactionType === 'schedule_1on1_interview' && (
                <>
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
                </>
              )}

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
