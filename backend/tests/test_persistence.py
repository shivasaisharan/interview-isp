def test_candidate_data_persistence(client):
    # Candidate logs in
    login = client.post("/api/v1/auth/candidate/login", json={
        "email": "alex.chen@example.com",
        "password": "candidate123"
    })
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Verify profile data persisted
    prof_res = client.get("/api/v1/candidate/profile", headers=headers)
    assert prof_res.status_code == 200
    profile = prof_res.json()
    assert "PyTorch" in profile["skills"]

    # Verify applications persisted
    apps_res = client.get("/api/v1/applications/candidate/all", headers=headers)
    assert apps_res.status_code == 200
    apps = apps_res.json()
    assert len(apps) >= 1

    # Verify activity timeline persisted
    act_res = client.get("/api/v1/activity", headers=headers)
    assert act_res.status_code == 200
    activities = act_res.json()
    assert len(activities) >= 1

    # Verify notifications persisted
    notifs_res = client.get("/api/v1/notifications", headers=headers)
    assert notifs_res.status_code == 200
    notifs = notifs_res.json()
    assert len(notifs) >= 1


def test_candidate_resume_deletion(client):
    # Candidate logs in
    login = client.post("/api/v1/auth/candidate/login", json={
        "email": "alex.chen@example.com",
        "password": "candidate123"
    })
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch initial resumes
    res = client.get("/api/v1/candidate/resumes", headers=headers)
    assert res.status_code == 200
    initial_resumes = res.json()
    assert len(initial_resumes) >= 1

    # Upload a temporary test resume to delete
    files = {"file": ("test_unwanted_resume.pdf", b"%PDF-1.4 test dummy pdf content", "application/pdf")}
    upload_res = client.post("/api/v1/candidate/resumes/upload", files=files, headers=headers)
    assert upload_res.status_code == 201
    new_resume_id = upload_res.json()["id"]

    # Verify it appears in candidate's resumes list
    res_after_upload = client.get("/api/v1/candidate/resumes", headers=headers)
    assert any(r["id"] == new_resume_id for r in res_after_upload.json())

    # Delete the unwanted resume
    del_res = client.delete(f"/api/v1/candidate/resumes/{new_resume_id}", headers=headers)
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "success"

    # Verify it is removed from candidate's resumes list
    res_after_delete = client.get("/api/v1/candidate/resumes", headers=headers)
    assert not any(r["id"] == new_resume_id for r in res_after_delete.json())

