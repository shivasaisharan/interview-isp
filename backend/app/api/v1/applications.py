from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, require_candidate, require_hr, get_current_hr_membership
from app.models.models import (
    Application, ApplicationStatusHistory, Job, ResumeFile, User,
    OrganizationMembership, InterviewSession, InterviewQuestion,
    InterviewAnswer, InterviewReport, CandidateProfile, HiringDecision
)
from app.schemas.schemas import ApplicationCreate, ApplicationOut, ApplicationStatusUpdate, JobSummary
from app.services.resume_service import analyze_resume_against_job
from app.services.notification_service import create_notification, record_user_activity, record_audit_log

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def apply_to_job(
    app_in: ApplicationCreate,
    candidate: User = Depends(require_candidate),
    db: Session = Depends(get_db)
):
    """Candidate submits application for an active job opening."""
    job = db.query(Job).filter(Job.id == app_in.job_id).first()
    if not job or job.status != "published":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job is not open for applications")

    # Prevent duplicate applications
    existing_app = db.query(Application).filter(
        Application.job_id == job.id,
        Application.candidate_id == candidate.id
    ).first()
    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted an active application for this role"
        )

    # Resume handling
    resume = None
    if app_in.resume_file_id:
        resume = db.query(ResumeFile).filter(
            ResumeFile.id == app_in.resume_file_id,
            ResumeFile.candidate_id == candidate.id
        ).first()
    else:
        # Default to candidate's latest uploaded resume
        resume = db.query(ResumeFile).filter(
            ResumeFile.candidate_id == candidate.id
        ).order_by(ResumeFile.uploaded_at.desc()).first()

    resume_match = 75.0
    sbert_sim = 0.70
    skills_score = 70.0

    if resume:
        analysis = analyze_resume_against_job(
            resume_text=resume.parsed_text or "",
            job_description=job.description,
            required_skills=job.required_skills
        )
        resume_match = analysis["match_score"]
        sbert_sim = analysis["sbert_similarity"]
        skills_score = analysis["skills_score"]

    app = Application(
        job_id=job.id,
        candidate_id=candidate.id,
        resume_file_id=resume.id if resume else None,
        status="submitted",
        resume_match_score=resume_match,
        sbert_similarity=sbert_sim,
        skills_match_score=skills_score,
        overall_ranking_score=round((resume_match * 0.4) + (skills_score * 0.6), 1)
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    # Record initial status in history
    history = ApplicationStatusHistory(
        application_id=app.id,
        previous_status=None,
        new_status="submitted",
        changed_by_id=candidate.id,
        note="Application submitted by candidate."
    )
    db.add(history)
    db.commit()

    # User activity & notification
    record_user_activity(
        db=db,
        user_id=candidate.id,
        event_type="application_submitted",
        resource_type="application",
        resource_id=app.id,
        description=f"Submitted application for {job.title} at {job.organization.name if job.organization else 'Company'}.",
        metadata_json={"job_id": job.id, "match_score": resume_match}
    )

    create_notification(
        db=db,
        user_id=candidate.id,
        title="Application Received",
        message=f"Your application for {job.title} has been submitted successfully.",
        notification_type="status_change",
        link=f"/candidate/applications/{app.id}"
    )

    out = ApplicationOut.model_validate(app)
    out.job = JobSummary(id=job.id, title=job.title, department=job.department, location=job.location)
    out.candidate_name = candidate.full_name
    out.candidate_email = candidate.email
    return out

@router.get("/candidate/all", response_model=List[ApplicationOut])
def list_candidate_applications(
    candidate: User = Depends(require_candidate),
    db: Session = Depends(get_db)
):
    """Candidate views all past applications and status tracking."""
    apps = (
        db.query(Application)
        .filter(Application.candidate_id == candidate.id)
        .order_by(Application.applied_at.desc())
        .all()
    )
    results = []
    for a in apps:
        out = ApplicationOut.model_validate(a)
        out.job = JobSummary(id=a.job.id, title=a.job.title, department=a.job.department, location=a.job.location)
        out.candidate_name = candidate.full_name
        out.candidate_email = candidate.email
        results.append(out)
    return results

@router.get("/{application_id}", response_model=ApplicationOut)
def get_application_details(
    application_id: str,
    candidate: User = Depends(require_candidate),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(
        Application.id == application_id,
        Application.candidate_id == candidate.id
    ).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    out = ApplicationOut.model_validate(app)
    out.job = JobSummary(id=app.job.id, title=app.job.title, department=app.job.department, location=app.job.location)
    out.candidate_name = candidate.full_name
    out.candidate_email = candidate.email
    return out

@router.get("/organization/all", response_model=List[ApplicationOut])
def list_all_organization_applicants(
    hr_user: User = Depends(require_hr),
    membership: OrganizationMembership = Depends(get_current_hr_membership),
    db: Session = Depends(get_db)
):
    """HR views all candidate resumes and applications across all jobs under their organization."""
    org_jobs = db.query(Job).filter(Job.organization_id == membership.organization_id).all()
    job_ids = [j.id for j in org_jobs]
    apps = db.query(Application).filter(Application.job_id.in_(job_ids)).order_by(Application.applied_at.desc()).all()
    results = []
    for a in apps:
        cand: User = a.candidate
        profile = cand.candidate_profile if cand else None
        alias = profile.anonymized_alias if profile and profile.anonymized_alias else f"Candidate #{cand.id[:4].upper()}"
        out = ApplicationOut.model_validate(a)
        out.candidate_name = cand.full_name if cand else "Candidate"
        out.candidate_email = cand.email if cand else ""
        out.anonymized_alias = alias
        out.job = JobSummary(id=a.job.id, title=a.job.title, department=a.job.department, location=a.job.location)
        results.append(out)
    return results

@router.get("/job/{job_id}/applicants", response_model=List[ApplicationOut])
def list_job_applicants(
    job_id: str,
    hr_user: User = Depends(require_hr),
    membership: OrganizationMembership = Depends(get_current_hr_membership),
    db: Session = Depends(get_db)
):
    """HR views all applicants for a job under their organization."""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.organization_id == membership.organization_id
    ).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found or access denied")

    apps = db.query(Application).filter(Application.job_id == job.id).order_by(Application.applied_at.desc()).all()
    results = []
    for a in apps:
        cand: User = a.candidate
        profile = cand.candidate_profile if cand else None
        alias = profile.anonymized_alias if profile and profile.anonymized_alias else f"Candidate #{cand.id[:4].upper()}"
        
        out = ApplicationOut.model_validate(a)
        out.candidate_name = cand.full_name if cand else "Candidate"
        out.candidate_email = cand.email if cand else ""
        out.anonymized_alias = alias
        out.job = JobSummary(id=job.id, title=job.title, department=job.department, location=job.location)
        results.append(out)
    return results

@router.patch("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: str,
    status_update: ApplicationStatusUpdate,
    hr_user: User = Depends(require_hr),
    membership: OrganizationMembership = Depends(get_current_hr_membership),
    db: Session = Depends(get_db)
):
    """HR advances application stage with an audit note."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if app.job.organization_id != membership.organization_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied to this application")

    prev_status = app.status
    app.status = status_update.status
    db.commit()

    # Record in history
    hist = ApplicationStatusHistory(
        application_id=app.id,
        previous_status=prev_status,
        new_status=status_update.status,
        changed_by_id=hr_user.id,
        note=status_update.note or f"Status advanced by HR to {status_update.status}"
    )
    db.add(hist)
    db.commit()

    # Notify candidate
    create_notification(
        db=db,
        user_id=app.candidate_id,
        title="Application Status Updated",
        message=f"Your application for {app.job.title} status changed to: {status_update.status.replace('_', ' ').title()}.",
        notification_type="status_change",
        link=f"/candidate/applications/{app.id}"
    )

    record_audit_log(
        db=db,
        organization_id=membership.organization_id,
        actor_id=hr_user.id,
        actor_role="hr",
        action="APPLICATION_STATUS_UPDATED",
        resource_type="application",
        resource_id=app.id,
        details_json={"prev_status": prev_status, "new_status": status_update.status}
    )

    out = ApplicationOut.model_validate(app)
    out.job = JobSummary(id=app.job.id, title=app.job.title, department=app.job.department, location=app.job.location)
    return out


class CandidateInteractionCreate(BaseModel):
    interaction_type: str = "schedule_1on1_interview"  # schedule_1on1_interview or direct_message
    scheduled_at: Optional[str] = None
    meeting_link: Optional[str] = None
    message: str
    proposed_fit: Optional[str] = None  # "Perfect for the job", "Fit", "Unfit"


@router.get("/{application_id}/dossier")
def get_candidate_dossier(
    application_id: str,
    hr_user: User = Depends(require_hr),
    membership: OrganizationMembership = Depends(get_current_hr_membership),
    db: Session = Depends(get_db)
):
    """
    HR retrieves complete candidate dossier:
    1. Personal details and full profile of the candidate
    2. Full candidate resume document & parsed competencies
    3. Document on how the candidate answered the different interview questions with AI evaluation
    4. 3-way fit classification: Perfect for the job / Fit / Unfit
    5. Final judgment and decision history
    """
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if app.job.organization_id != membership.organization_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    cand: User = app.candidate
    profile: Optional[CandidateProfile] = cand.candidate_profile if cand else None
    resume: Optional[ResumeFile] = app.resume_file or (cand.resumes[-1] if cand and cand.resumes else None)

    # 3-Way Fit classification based on performance and composite match
    score = app.overall_ranking_score or 0.0
    if score >= 82.0:
        fit_verdict = "Perfect for the job"
    elif score >= 65.0:
        fit_verdict = "Fit"
    else:
        fit_verdict = "Unfit"

    # Fetch Q&A transcript if candidate took the AI interview
    qa_list = []
    interview_session = app.interview_session
    interview_report = None
    if interview_session:
        for q in interview_session.questions:
            ans = q.answer
            qa_list.append({
                "question_index": q.question_index,
                "question_text": q.question_text,
                "category": q.category,
                "candidate_answer": ans.candidate_answer if ans else "No answer recorded",
                "technical_score": ans.technical_score if ans else 0.0,
                "problem_solving_score": ans.problem_solving_score if ans else 0.0,
                "communication_score": ans.communication_score if ans else 0.0,
                "composite_score": ans.composite_score if ans else 0.0,
                "ai_feedback": ans.feedback if ans else "Evaluation pending",
            })
        if interview_session.report:
            rep = interview_session.report
            interview_report = {
                "id": rep.id,
                "overall_score": rep.overall_score,
                "technical_rating": rep.technical_rating,
                "problem_solving_rating": rep.problem_solving_rating,
                "communication_rating": rep.communication_rating,
                "skills_rating": rep.skills_rating,
                "strengths": rep.strengths,
                "weaknesses": rep.weaknesses,
                "skill_gap_summary": rep.skill_gap_summary,
                "candidate_feedback": rep.candidate_visible_feedback,
                "recruiter_notes": rep.recruiter_confidential_notes,
            }

    decision_info = None
    if app.hiring_decision:
        dec = app.hiring_decision
        decision_info = {
            "id": dec.id,
            "decision": dec.decision,
            "rationale": dec.rationale,
            "decided_at": dec.decided_at.isoformat() if dec.decided_at else None
        }

    return {
        "application_id": app.id,
        "job": {
            "id": app.job.id,
            "title": app.job.title,
            "department": app.job.department,
            "location": app.job.location,
            "required_skills": app.job.required_skills
        },
        "candidate": {
            "id": cand.id if cand else "",
            "full_name": cand.full_name if cand else "Candidate",
            "email": cand.email if cand else "",
            "anonymized_alias": profile.anonymized_alias if profile else f"Candidate #{cand.id[:4].upper() if cand else '0000'}",
            "headline": profile.headline if profile else "Software Professional",
            "education": profile.education if profile else "B.S. in Computer Science or Equivalent",
            "experience_years": profile.experience_years if profile else 3.5,
            "location": profile.location if profile else "Remote / Hybrid",
            "skills": profile.skills if profile else (app.job.required_skills or []),
            "summary": profile.summary if profile else ""
        },
        "resume": {
            "id": resume.id if resume else None,
            "file_name": resume.file_name if resume else "Candidate_Resume.pdf",
            "parsed_text": resume.parsed_text if resume else "Resume text available upon request.",
            "extracted_skills": resume.extracted_skills if resume else (profile.skills if profile else []),
            "extracted_experience": resume.extracted_experience if resume else {},
            "uploaded_at": resume.uploaded_at.isoformat() if resume and resume.uploaded_at else None
        },
        "scores": {
            "resume_match_score": app.resume_match_score,
            "sbert_similarity": app.sbert_similarity,
            "skills_match_score": app.skills_match_score,
            "overall_ranking_score": app.overall_ranking_score,
            "fit_verdict": fit_verdict
        },
        "qa_examination_document": qa_list,
        "interview_report": interview_report,
        "hiring_decision": decision_info,
        "status": app.status
    }


@router.post("/{application_id}/interact")
def interact_with_candidate(
    application_id: str,
    payload: CandidateInteractionCreate,
    hr_user: User = Depends(require_hr),
    membership: OrganizationMembership = Depends(get_current_hr_membership),
    db: Session = Depends(get_db)
):
    """
    HR initiates human interaction / 1-on-1 interview with shortlisted candidate:
    - HR interviews shortlisted candidates, NOT by AI
    - Records meeting link, date/time, and recruiter invitation instructions
    - Dispatches instant in-app notification to the candidate
    - Logs immutable recruiter audit trail
    """
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    if app.job.organization_id != membership.organization_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    app.status = "hr_review"
    db.commit()

    meeting_str = f" Meeting link: {payload.meeting_link}" if payload.meeting_link else ""
    sched_str = f" Scheduled for: {payload.scheduled_at}." if payload.scheduled_at else ""

    note_text = f"HR Recruiter scheduled 1-on-1 human interview.{sched_str}{meeting_str} Message: {payload.message}"
    hist = ApplicationStatusHistory(
        application_id=app.id,
        previous_status=app.status,
        new_status="hr_review",
        changed_by_id=hr_user.id,
        note=note_text
    )
    db.add(hist)
    db.commit()

    create_notification(
        db=db,
        user_id=app.candidate_id,
        title="Direct HR 1-on-1 Interview Invitation",
        message=f"The hiring team for {app.job.title} has invited you to a direct recruiter interview!{sched_str} {payload.message}",
        notification_type="interview_invite",
        link=f"/candidate/applications/{app.id}"
    )

    record_audit_log(
        db=db,
        organization_id=membership.organization_id,
        actor_id=hr_user.id,
        actor_role="hr",
        action="HR_1ON1_INTERVIEW_SCHEDULED",
        resource_type="application",
        resource_id=app.id,
        details_json={
            "scheduled_at": payload.scheduled_at,
            "meeting_link": payload.meeting_link,
            "interaction_type": payload.interaction_type,
            "proposed_fit": payload.proposed_fit
        }
    )

    return {
        "status": "success",
        "message": "Human 1-on-1 recruiter interview invitation dispatched successfully.",
        "application_id": app.id,
        "new_status": "hr_review"
    }
