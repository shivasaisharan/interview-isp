import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Briefcase, Award, Users, Trash2, Edit3, ArrowRight, X, Download, Check } from 'lucide-react';
import api from '../../services/api';

export default function HrJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDepartment, setEditDepartment] = useState('Engineering');
  const [editExpLevel, setEditExpLevel] = useState('Senior');
  const [editLocation, setEditLocation] = useState('Remote');
  const [editSalary, setEditSalary] = useState('$130k - $160k');
  const [editSkillsStr, setEditSkillsStr] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('published');
  const [savingEdit, setSavingEdit] = useState(false);
  const [fileNotice, setFileNotice] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/organization/all');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openEditModal = (job) => {
    setEditingJob(job);
    setEditTitle(job.title || '');
    setEditDepartment(job.department || 'Engineering');
    setEditExpLevel(job.experience_level || 'Senior');
    setEditLocation(job.location || 'Remote');
    setEditSalary(job.salary_range || '');
    setEditSkillsStr(Array.isArray(job.required_skills) ? job.required_skills.join(', ') : '');
    setEditDescription(job.description || '');
    setEditStatus(job.status || 'published');
    setFileNotice('');
  };

  const handleEditJDFileUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setEditDescription(e.target.result);
      setFileNotice(`Loaded description from ${file.name}`);
    };
    reader.readAsText(file);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDescription.trim()) {
      alert("Job title and description are required.");
      return;
    }
    setSavingEdit(true);
    try {
      const skillsArray = editSkillsStr.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
      await api.put(`/jobs/${editingJob.id}`, {
        title: editTitle,
        department: editDepartment,
        experience_level: editExpLevel,
        location: editLocation,
        salary_range: editSalary,
        required_skills: skillsArray,
        description: editDescription,
        status: editStatus
      });
      setEditingJob(null);
      await fetchJobs();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update job.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job opening?")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      await fetchJobs();
    } catch (err) {
      alert("Failed to delete job.");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Job Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage active openings, edit descriptions & competencies, and access candidate boards.</p>
        </div>
        <Link
          to="/hr/jobs/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Job Opening
        </Link>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {jobs.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No job openings listed under your organization tenant.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-white">{job.title}</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                      {job.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {job.department} • {job.experience_level} • {job.location} • {job.salary_range}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.required_skills?.map((sk, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Edit Job Button */}
                  <button
                    onClick={() => openEditModal(job)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Edit Job Description & Competencies"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Edit</span>
                  </button>

                  <Link
                    to={`/hr/jobs/${job.id}/applicants`}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.applicants_count || 0} Applicants</span>
                  </Link>

                  <Link
                    to={`/hr/jobs/${job.id}/top-candidates`}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Top-5 Board</span>
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                  EDIT JOB OPENING
                </span>
                <h3 className="text-lg font-bold text-white mt-1">Edit Job Description & Competencies</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Experience Level</label>
                  <select
                    value={editExpLevel}
                    onChange={(e) => setEditExpLevel(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Entry">Entry (0-2 yrs)</option>
                    <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                    <option value="Senior">Senior (5+ yrs)</option>
                    <option value="Lead">Lead / Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Salary Range</label>
                  <input
                    type="text"
                    value={editSalary}
                    onChange={(e) => setEditSalary(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Required Competencies (Comma separated)</label>
                <input
                  type="text"
                  value={editSkillsStr}
                  onChange={(e) => setEditSkillsStr(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500 font-mono"
                  placeholder="e.g. python, pytorch, docker, sql, rest api"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Job Description & Responsibilities</label>
                  <label className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 cursor-pointer flex items-center gap-1">
                    <Download className="w-3 h-3 rotate-180" />
                    <span>Upload JD File (.txt, .md)</span>
                    <input
                      type="file"
                      accept=".txt,.md"
                      className="hidden"
                      onChange={(e) => handleEditJDFileUpload(e.target.files[0])}
                    />
                  </label>
                </div>
                {fileNotice && (
                  <div className="text-[11px] text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-800 mb-2 font-medium">
                    {fileNotice}
                  </div>
                )}
                <textarea
                  rows="5"
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

