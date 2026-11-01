import sys
import os
from pathlib import Path

# Add backend to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.core.database import SessionLocal
from app.models.models import ResumeFile, User, CandidateProfile
from app.services.resume_service import (
    generate_professional_pdf_resume,
    extract_text_from_pdf,
    extract_skills_from_text
)
from app.core.config import settings

def heal_all_resumes():
    db = SessionLocal()
    resumes = db.query(ResumeFile).all()
    print(f"Inspecting {len(resumes)} total ResumeFile records...")
    healed_count = 0

    # Ensure upload directory exists
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Ensure demo files exist
    demo_files = {
        "demo_alex_chen.pdf": ("Alex Chen", "Senior AI / Machine Learning Engineer", "alex.chen@example.com", ["Python", "PyTorch", "FastAPI", "Docker", "Machine Learning", "Transformers", "Kubernetes"]),
        "demo_elena_rostova.pdf": ("Elena Rostova", "Full Stack Cloud Software Engineer", "elena.rostova@example.com", ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL", "AWS", "Docker"]),
        "demo_marcus_vance.pdf": ("Marcus Vance", "Senior Backend Systems Engineer", "marcus.vance@example.com", ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "System Design"])
    }

    for fname, (d_name, d_title, d_email, d_skills) in demo_files.items():
        dpath = settings.UPLOAD_DIR / fname
        if not dpath.exists() or dpath.stat().st_size < 500:
            bytes_data = generate_professional_pdf_resume(
                candidate_name=d_name,
                title=d_title,
                email=d_email,
                skills=d_skills,
                experience_years=4.5
            )
            with open(dpath, "wb") as f:
                f.write(bytes_data)
            print(f"Created demo file: {dpath} ({len(bytes_data)} bytes)")

    # 2. Heal each resume file
    for r in resumes:
        raw_fp = r.file_path
        fp = Path(raw_fp) if raw_fp else None
        if fp and not fp.is_absolute():
            fp = settings.UPLOAD_DIR / fp
        if fp and not fp.exists():
            fp = settings.UPLOAD_DIR / Path(raw_fp).name

        needs_heal = False
        if not fp or not fp.exists():
            needs_heal = True
        elif fp.stat().st_size < 300:
            needs_heal = True
        else:
            try:
                with open(fp, "rb") as f:
                    head = f.read(50)
                    if b"sample resume" in head or b"sample content" in head or b"Bob Dylan CV" in head:
                        needs_heal = True
            except Exception:
                needs_heal = True

        if needs_heal:
            cand = db.query(User).filter(User.id == r.candidate_id).first()
            cand_name = cand.full_name if (cand and cand.full_name) else r.file_name.replace(".pdf", "").replace("_", " ")
            clean_email = cand.email if cand else f"{cand_name.lower().replace(' ', '.')}@example.com"
            skills = r.extracted_skills if r.extracted_skills else ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "AWS", "Git"]

            target_path = settings.UPLOAD_DIR / f"{r.id}_{r.file_name}"
            pdf_bytes = generate_professional_pdf_resume(
                candidate_name=cand_name,
                title="Software Engineer",
                email=clean_email,
                skills=skills,
                experience_years=4.0
            )
            with open(target_path, "wb") as f:
                f.write(pdf_bytes)

            r.file_path = str(target_path)
            r.file_size = len(pdf_bytes)
            r.mime_type = "application/pdf"
            r.parsed_text = extract_text_from_pdf(str(target_path))
            r.extracted_skills = extract_skills_from_text(r.parsed_text)
            healed_count += 1
            print(f"Healed: {r.id[:8]} - {r.file_name} ({len(pdf_bytes)} bytes)")
        else:
            # Normalize path if pointing to old directory
            if fp and fp.exists() and str(fp) != r.file_path:
                r.file_path = str(fp)
                r.file_size = fp.stat().st_size
                r.mime_type = "application/pdf"
                print(f"Normalized path for: {r.file_name} -> {fp}")

    db.commit()
    print(f"\nHealing complete! Total records healed/normalized: {healed_count}")

if __name__ == "__main__":
    heal_all_resumes()

