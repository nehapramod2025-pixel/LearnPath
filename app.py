
import json
import urllib.parse
import urllib.request
import urllib.error
import os
import secrets
import hmac
import oracledb
from flask import Flask, render_template, jsonify, request, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY")
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax"
)

# Oracle database configuration
DB_CONFIG = {
    "user": "LEARNPATH",
    "password": os.environ.get("LEARNPATH_DB_PASSWORD"),
    "host": "127.0.0.1",
    "port": 1521,
    "service_name": "FREEPDB1"
}


def get_db_connection():
    if not DB_CONFIG["password"]:
        raise RuntimeError("Database password is not configured.")

    return oracledb.connect(**DB_CONFIG)


# Existing homepage Ã¢â‚¬â€ keep it working

# API: Fetch topics for a selected subject

# API: Fetch all subjects from Oracle
@app.route("/api/subjects", methods=["GET"])
def get_subjects():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT subject_id, subject_name, description
            FROM SUBJECT
            ORDER BY subject_name
        """)

        subjects = [
            {
                "subject_id": row[0],
                "subject_name": row[1],
                "description": row[2]
            }
            for row in cursor.fetchall()
        ]

        return jsonify(subjects), 200

    except Exception:
        app.logger.exception("Failed to fetch subjects from Oracle")
        return jsonify({"error": "Unable to fetch subjects."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route("/api/subjects/<int:subject_id>/topics", methods=["GET"])
def get_topics(subject_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT topic_id, subject_id, topic_name,
                   difficulty, sequence_no
            FROM TOPIC
            WHERE subject_id = :subject_id
            ORDER BY sequence_no
        """, {"subject_id": subject_id})

        topics = [
            {
                "topic_id": row[0],
                "subject_id": row[1],
                "topic_name": row[2],
                "difficulty": row[3],
                "sequence_no": row[4]
            }
            for row in cursor.fetchall()
        ]

        return jsonify(topics), 200

    except Exception:
        app.logger.exception("Failed to fetch topics from Oracle")
        return jsonify({"error": "Unable to fetch topics."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

@app.route("/api/videos", methods=["GET"])
def get_videos():
    api_key = os.environ.get("YOUTUBE_API_KEY")

    if not api_key:
        return jsonify({"error": "YouTube API key is not configured."}), 500

    topic_id = request.args.get("topic_id", type=int)
    language = request.args.get("language", "English").strip()
    difficulty = request.args.get("difficulty", "Intermediate").strip().lower()

    if not topic_id:
        return jsonify({"error": "Please provide a topic_id."}), 400

    connection = None
    cursor = None

    try:
        # Get the topic name from Oracle
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT topic_name FROM TOPIC WHERE topic_id = :topic_id",
            {"topic_id": topic_id}
        )
        row = cursor.fetchone()

        if row is None:
            return jsonify({"error": "Topic not found."}), 404

        topic_name = row[0]

        # Map common language names to YouTube language codes
        language_codes = {
            "english": "en",
            "tamil": "ta",
            "hindi": "hi",
            "telugu": "te",
            "malayalam": "ml",
            "kannada": "kn"
        }

        language_code = language_codes.get(language.lower(), "en")


        if difficulty == "beginner":
            level_query = "explained simply for beginners"
        elif difficulty == "advanced":
            level_query = "advanced tutorial"
        else:
            level_query = "tutorial"
        if language.lower() == "tamil":
            search_query = f"{topic_name} {level_query} Tamil explanation"
        elif language.lower() == "hindi":
            search_query = f"{topic_name} {level_query} Hindi explanation"
        elif language.lower() == "telugu":
            search_query = f"{topic_name} {level_query} Telugu explanation"
        elif language.lower() == "malayalam":
            search_query = f"{topic_name} {level_query} Malayalam explanation"
        elif language.lower() == "kannada":
            search_query = f"{topic_name} {level_query} Kannada explanation"
        else:
            search_query = f"{topic_name} {level_query} English explanation"
        params = {
            "part": "snippet",
            "type": "video",
            "q": search_query,
            "maxResults": 10,
            "videoEmbeddable": "true",
            "relevanceLanguage": language_code,
            "key": api_key
        }

        url = (
            "https://www.googleapis.com/youtube/v3/search?"
            + urllib.parse.urlencode(params)
        )

        req = urllib.request.Request(
            url,
            headers={"Accept": "application/json"}
        )

        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode("utf-8"))

        videos = []
        seen_video_ids = set()
        language_keywords = {
            "tamil": ["tamil", "தமிழ்"],
            "hindi": ["hindi", "हिंदी"],
            "telugu": ["telugu", "తెలుగు"],
            "malayalam": ["malayalam", "മലയാളം"],
            "kannada": ["kannada", "ಕನ್ನಡ"],
            "english": ["english"]
        }

        keywords = language_keywords.get(language.lower(), [])

        for item in data.get("items", []):
            video_id = item.get("id", {}).get("videoId")
            snippet = item.get("snippet", {})

            if not video_id or video_id in seen_video_ids:
                continue

            title = snippet.get("title", "")
            description = snippet.get("description", "")
            channel = snippet.get("channelTitle", "")

            searchable_text = (
                f"{title} {description} {channel}"
            ).lower()

            if language.lower() != "english" and keywords and not any(
                keyword in searchable_text for keyword in keywords
            ):
                continue

            thumbnail = (
                snippet.get("thumbnails", {})
                .get("medium", {})
                .get("url")
            )

            if not thumbnail:
                continue

            videos.append({
                "video_id": video_id,
                "title": title,
                "channel": channel,
                "thumbnail": thumbnail,
                "video_url": f"https://www.youtube.com/watch?v={video_id}",
                "embed_url": f"https://www.youtube.com/embed/{video_id}"
            })

            seen_video_ids.add(video_id)

            if len(videos) >= 6:
                break

        return jsonify({
            "topic": topic_name,
            "language": language,
            "videos": videos
        }), 200

    except urllib.error.HTTPError as error:
        error_body = error.read().decode("utf-8", errors="replace")
        app.logger.error("YouTube API HTTP %s: %s", error.code, error_body)

        return jsonify({
        "error": "YouTube search failed.",
        "status_code": error.code,
        "details": error_body
        }), error.code
    except Exception:
        app.logger.exception("Failed to search YouTube videos")
        return jsonify({"error": "Unable to fetch videos."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ---------------- STUDENT PROGRESS API ----------------

@app.route("/api/progress", methods=["POST"])
def save_student_progress():
    # Progress can only be saved by a logged-in student.
    if session.get("user_type") != "student" or not session.get("user_id"):
        return jsonify({
            "error": "Please log in as a student to save your progress."
        }), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Send progress details as JSON."}), 400

    try:
        topic_id = int(data.get("topic_id"))
    except (TypeError, ValueError):
        return jsonify({"error": "Select a valid topic."}), 400

    status = data.get("completion_status")
    feedback = data.get("feedback", "")

    allowed_statuses = {
        "Not Started", "In Progress", "Understood", "Confusing"
    }

    if status not in allowed_statuses:
        return jsonify({"error": "Select a valid progress status."}), 400

    if not isinstance(feedback, str):
        return jsonify({"error": "Feedback must be text."}), 400

    feedback = feedback.strip()
    if len(feedback) > 500:
        return jsonify({"error": "Feedback must be 500 characters or fewer."}), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Verify the topic exists before saving progress.
        cursor.execute(
            "SELECT topic_id FROM TOPIC WHERE topic_id = :topic_id",
            {"topic_id": topic_id}
        )
        if cursor.fetchone() is None:
            return jsonify({"error": "The selected topic was not found."}), 404

        cursor.execute("""
            MERGE INTO STUDENT_PROGRESS target
            USING (
                SELECT :student_id AS student_id,
                       :topic_id AS topic_id
                FROM dual
            ) source
            ON (
                target.student_id = source.student_id
                AND target.topic_id = source.topic_id
            )
            WHEN MATCHED THEN
                UPDATE SET
                    target.completion_status = :completion_status,
                    target.feedback = :feedback,
                    target.updated_at = CURRENT_TIMESTAMP
            WHEN NOT MATCHED THEN
                INSERT (
                    student_id, topic_id, completion_status,
                    feedback, updated_at
                )
                VALUES (
                    :student_id, :topic_id, :completion_status,
                    :feedback, CURRENT_TIMESTAMP
                )
        """, {
            "student_id": int(session["user_id"]),
            "topic_id": topic_id,
            "completion_status": status,
            "feedback": feedback or None
        })

        connection.commit()

        return jsonify({
            "message": "Progress saved successfully.",
            "topic_id": topic_id,
            "completion_status": status
        }), 200

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Failed to save student progress")
        return jsonify({"error": "Unable to save progress. Please try again."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# ---------------- END STUDENT PROGRESS API ----------------

@app.route("/online")
def online_learning():
    return render_template("online.html")


# ---------------- STUDENT REGISTRATION API ----------------

@app.route("/api/students", methods=["POST"])
def register_student():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Send student details as JSON."}), 400

    student_name = data.get("student_name")
    email = data.get("email")
    preferred_language = data.get("preferred_language", "English")

    if not isinstance(student_name, str) or not student_name.strip():
        return jsonify({"error": "Student name is required."}), 400

    if not isinstance(email, str) or not email.strip():
        return jsonify({"error": "Email is required."}), 400

    if not isinstance(preferred_language, str):
        return jsonify({"error": "Preferred language must be text."}), 400

    student_name = student_name.strip()
    email = email.strip().lower()
    preferred_language = preferred_language.strip() or "English"

    if len(student_name) > 200 or len(email) > 320:
        return jsonify({"error": "Name or email is too long."}), 400

    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        return jsonify({"error": "Please provide a valid email address."}), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT student_id
            FROM STUDENT
            WHERE LOWER(email) = :email
        """, {"email": email})

        existing_student = cursor.fetchone()

        if existing_student:
            if data.get("lookup") is True:
                return jsonify({
                    "message": "Existing student found.",
                    "student_id": int(existing_student[0]),
                    "email": email
                }), 200

            return jsonify({
                "error": "This email is already registered."
            }), 409
        student_id_var = cursor.var(oracledb.NUMBER)

        cursor.execute("""
            INSERT INTO STUDENT (
                student_name, email, preferred_language
            )
            VALUES (
                :student_name, :email, :preferred_language
            )
            RETURNING student_id INTO :student_id
        """, {
            "student_name": student_name,
            "email": email,
            "preferred_language": preferred_language,
            "student_id": student_id_var
        })

        student_id = int(student_id_var.getvalue()[0])
        connection.commit()

        return jsonify({
            "message": "Student registered successfully.",
            "student_id": student_id,
            "student_name": student_name,
            "email": email,
            "preferred_language": preferred_language
        }), 201

    except oracledb.IntegrityError:
        if connection:
            connection.rollback()
        return jsonify({
            "error": "A student with this email may already be registered."
        }), 409

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Failed to register student")
        return jsonify({"error": "Unable to register student."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ---------------- END STUDENT REGISTRATION API ----------------

# ---------------- TUTOR REGISTRATION API ----------------

@app.route("/api/tutors", methods=["POST"])
def register_tutor():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Send tutor details as JSON."}), 400

    tutor_name = data.get("tutor_name")
    email = data.get("email")
    subject_id = data.get("subject_id")
    language = data.get("language")
    experience_years = data.get("experience_years")
    hourly_rate = data.get("hourly_rate")
    bio = data.get("bio")

    if not isinstance(tutor_name, str) or not tutor_name.strip():
        return jsonify({"error": "Tutor name is required."}), 400

    if not isinstance(email, str) or not email.strip():
        return jsonify({"error": "Email is required."}), 400

    if not isinstance(language, str) or not language.strip():
        return jsonify({"error": "Language is required."}), 400

    try:
        if isinstance(subject_id, bool):
            raise ValueError()
        subject_id = int(subject_id)

        if isinstance(experience_years, bool):
            raise ValueError()
        if isinstance(experience_years, float) and not experience_years.is_integer():
            raise ValueError()
        experience_years = int(experience_years)

        if subject_id <= 0 or experience_years < 0:
            raise ValueError()

        if hourly_rate is not None:
            if isinstance(hourly_rate, bool):
                raise ValueError()
            hourly_rate = float(hourly_rate)
            if hourly_rate < 0:
                raise ValueError()

    except (ValueError, TypeError, OverflowError):
        return jsonify({
            "error": "Provide a valid subject ID, non-negative whole-number experience, and non-negative hourly rate."
        }), 400

    tutor_name = tutor_name.strip()
    email = email.strip().lower()
    language = language.strip()

    if len(tutor_name) > 200 or len(email) > 320 or len(language) > 100:
        return jsonify({"error": "A text field is too long."}), 400

    if "@" not in email or "." not in email.rsplit("@", 1)[-1]:
        return jsonify({"error": "Please provide a valid email address."}), 400

    if bio is not None and not isinstance(bio, str):
        return jsonify({"error": "Bio must be text."}), 400

    if bio is not None:
        bio = bio.strip() or None

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT subject_id FROM SUBJECT WHERE subject_id = :subject_id",
            {"subject_id": subject_id}
        )
        if cursor.fetchone() is None:
            return jsonify({"error": "The selected subject does not exist."}), 400

        cursor.execute(
            "SELECT tutor_id FROM TUTOR WHERE LOWER(email) = :email",
            {"email": email}
        )
        if cursor.fetchone():
            return jsonify({"error": "This email is already registered as a tutor."}), 409

        tutor_id_var = cursor.var(oracledb.NUMBER)

        cursor.execute("""
            INSERT INTO TUTOR (
                tutor_name, email, subject_id, language,
                experience_years, hourly_rate, bio
            )
            VALUES (
                :tutor_name, :email, :subject_id, :language,
                :experience_years, :hourly_rate, :bio
            )
            RETURNING tutor_id INTO :tutor_id
        """, {
            "tutor_name": tutor_name,
            "email": email,
            "subject_id": subject_id,
            "language": language,
            "experience_years": experience_years,
            "hourly_rate": hourly_rate,
            "bio": bio,
            "tutor_id": tutor_id_var
        })

        returned_id = tutor_id_var.getvalue()
        if isinstance(returned_id, list):
            returned_id = returned_id[0]
        tutor_id = int(returned_id)

        connection.commit()

        return jsonify({
            "message": "Tutor registered successfully.",
            "tutor_id": tutor_id,
            "tutor_name": tutor_name,
            "email": email,
            "subject_id": subject_id,
            "language": language,
            "experience_years": experience_years,
            "hourly_rate": hourly_rate,
            "bio": bio
        }), 201

    except oracledb.IntegrityError:
        if connection:
            connection.rollback()
        return jsonify({
            "error": "Registration failed because of a database constraint. Check the email and subject ID."
        }), 409

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Failed to register tutor")
        return jsonify({"error": "Unable to register tutor."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ---------------- END TUTOR REGISTRATION API ----------------


# ---------------- ACCOUNT AUTHENTICATION ----------------

def _auth_csrf_token():
    if "_auth_csrf_token" not in session:
        session["_auth_csrf_token"] = secrets.token_urlsafe(32)
    return session["_auth_csrf_token"]


def _auth_csrf_valid():
    supplied = request.form.get("csrf_token", "")
    expected = session.get("_auth_csrf_token", "")
    return bool(supplied and expected and hmac.compare_digest(supplied, expected))


def _render_tutor_registration(error=None):
    connection = None
    cursor = None
    subjects = []
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT subject_id, subject_name FROM SUBJECT ORDER BY subject_name")
        subjects = cursor.fetchall()
    except Exception:
        app.logger.exception("Unable to load subjects for tutor registration")
        error = error or "Unable to load subjects. Please try again."
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    return render_template(
        "tutor_register.html", subjects=subjects, error=error,
        csrf_token=_auth_csrf_token()
    )


@app.route("/student/register", methods=["GET", "POST"])
def student_register():
    if request.method == "GET":
        return render_template("student_register.html", error=None,
                               csrf_token=_auth_csrf_token())
    if not _auth_csrf_valid():
        return render_template("student_register.html",
                               error="Form expired. Please try again.",
                               csrf_token=_auth_csrf_token()), 400

    name = request.form.get("student_name", "").strip()
    email = request.form.get("email", "").strip().lower()
    language = request.form.get("preferred_language", "English").strip() or "English"
    password = request.form.get("password", "")

    if not name or len(name) > 100 or not email or len(email) > 150 or "@" not in email:
        return render_template("student_register.html", error="Enter a valid name and email.",
                               csrf_token=_auth_csrf_token()), 400
    if len(language) > 50 or len(password) < 8:
        return render_template("student_register.html",
                               error="Use a valid language and a password of at least 8 characters.",
                               csrf_token=_auth_csrf_token()), 400

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT student_id FROM STUDENT WHERE LOWER(email) = :email",
                       {"email": email})
        if cursor.fetchone():
            return render_template("student_register.html",
                                   error="This email is already registered. Please log in.",
                                   csrf_token=_auth_csrf_token()), 409

        student_id_var = cursor.var(oracledb.NUMBER)
        cursor.execute("""
            INSERT INTO STUDENT
                (student_name, email, preferred_language, password_hash)
            VALUES (:name, :email, :language, :password_hash)
            RETURNING student_id INTO :student_id
        """, {
            "name": name, "email": email, "language": language,
            "password_hash": generate_password_hash(password),
            "student_id": student_id_var
        })
        returned = student_id_var.getvalue()
        student_id = int(returned[0] if isinstance(returned, list) else returned)
        connection.commit()
        session.clear()
        session["user_type"] = "student"
        session["user_id"] = student_id
        return redirect(url_for("home"))
    except oracledb.IntegrityError:
        if connection:
            connection.rollback()
        return render_template("student_register.html",
                               error="This email may already be registered.",
                               csrf_token=_auth_csrf_token()), 409
    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Student account registration failed")
        return render_template("student_register.html",
                               error="Unable to register. Please try again.",
                               csrf_token=_auth_csrf_token()), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/student/login", methods=["GET", "POST"])
def student_login():
    if request.method == "GET":
        return render_template("student_login.html", error=None,
                               csrf_token=_auth_csrf_token())
    if not _auth_csrf_valid():
        return render_template("student_login.html", error="Form expired. Please try again.",
                               csrf_token=_auth_csrf_token()), 400

    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "")
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT student_id, password_hash FROM STUDENT
            WHERE LOWER(email) = :email
        """, {"email": email})
        row = cursor.fetchone()
        if not row or not row[1] or not check_password_hash(row[1], password):
            return render_template("student_login.html",
                                   error="Invalid email or password. Existing accounts without a password need a secure setup.",
                                   csrf_token=_auth_csrf_token()), 401
        session.clear()
        session["user_type"] = "student"
        session["user_id"] = int(row[0])
        return redirect(url_for("home"))
    except Exception:
        app.logger.exception("Student login failed")
        return render_template("student_login.html", error="Unable to log in. Please try again.",
                               csrf_token=_auth_csrf_token()), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/tutor/register", methods=["GET", "POST"])
def tutor_register():
    if request.method == "GET":
        return _render_tutor_registration()
    if not _auth_csrf_valid():
        return _render_tutor_registration("Form expired. Please try again."), 400

    name = request.form.get("tutor_name", "").strip()
    email = request.form.get("email", "").strip().lower()
    language = request.form.get("language", "").strip()
    bio = request.form.get("bio", "").strip() or None
    password = request.form.get("password", "")
    acknowledged = request.form.get("commission_acknowledged") == "yes"

    try:
        subject_id = int(request.form.get("subject_id", ""))
        experience = int(request.form.get("experience_years", ""))
        rate = float(request.form.get("hourly_rate", ""))
        if subject_id <= 0 or experience < 0 or rate < 0:
            raise ValueError()
    except (ValueError, TypeError, OverflowError):
        return _render_tutor_registration("Enter a valid subject, experience, and hourly charge."), 400

    if (not name or len(name) > 100 or not email or len(email) > 150 or
        "@" not in email or not language or len(language) > 50 or
        (bio and len(bio) > 500) or len(password) < 8):
        return _render_tutor_registration("Check your details and use a password of at least 8 characters."), 400
    if not acknowledged:
        return _render_tutor_registration("You must acknowledge the 10% commission policy to register."), 400

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("SELECT tutor_id FROM TUTOR WHERE LOWER(email) = :email",
                       {"email": email})
        if cursor.fetchone():
            return _render_tutor_registration("This email is already registered as a tutor."), 409

        tutor_id_var = cursor.var(oracledb.NUMBER)
        cursor.execute("""
            INSERT INTO TUTOR (
                tutor_name, email, subject_id, language, experience_years,
                hourly_rate, bio, password_hash,
                commission_acknowledged, commission_acknowledged_at
            )
            VALUES (
                :name, :email, :subject_id, :language, :experience,
                :rate, :bio, :password_hash, 'Y', CURRENT_TIMESTAMP
            )
            RETURNING tutor_id INTO :tutor_id
        """, {
            "name": name, "email": email, "subject_id": subject_id,
            "language": language, "experience": experience, "rate": rate,
            "bio": bio, "password_hash": generate_password_hash(password),
            "tutor_id": tutor_id_var
        })
        returned = tutor_id_var.getvalue()
        tutor_id = int(returned[0] if isinstance(returned, list) else returned)
        connection.commit()
        session.clear()
        session["user_type"] = "tutor"
        session["user_id"] = tutor_id
        return redirect(url_for("tutor_dashboard"))
    except oracledb.IntegrityError:
        if connection:
            connection.rollback()
        return _render_tutor_registration("Registration conflicted with an existing database record."), 409
    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Tutor account registration failed")
        return _render_tutor_registration("Unable to register. Please try again."), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/tutor/login", methods=["GET", "POST"])
def tutor_login():
    if request.method == "GET":
        return render_template("tutor_login.html", error=None,
                               csrf_token=_auth_csrf_token())
    if not _auth_csrf_valid():
        return render_template("tutor_login.html", error="Form expired. Please try again.",
                               csrf_token=_auth_csrf_token()), 400

    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "")
    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT tutor_id, password_hash FROM TUTOR
            WHERE LOWER(email) = :email
        """, {"email": email})
        row = cursor.fetchone()
        if not row or not row[1] or not check_password_hash(row[1], password):
            return render_template("tutor_login.html",
                                   error="Invalid email or password. Existing accounts without a password need a secure setup.",
                                   csrf_token=_auth_csrf_token()), 401
        session.clear()
        session["user_type"] = "tutor"
        session["user_id"] = int(row[0])
        return redirect(url_for("tutor_dashboard"))
    except Exception:
        app.logger.exception("Tutor login failed")
        return render_template("tutor_login.html", error="Unable to log in. Please try again.",
                               csrf_token=_auth_csrf_token()), 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/tutor/dashboard", methods=["GET", "POST"])
def tutor_dashboard():
    if session.get("user_type") != "tutor" or not session.get("user_id"):
        return redirect(url_for("tutor_login"))
    if request.method == "POST" and not _auth_csrf_valid():
        return "Invalid or expired form token. Reload the dashboard and try again.", 400

    connection = None
    cursor = None
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        if request.method == "POST":
            try:
                rate = float(request.form.get("hourly_rate", ""))
                if rate < 0 or rate > 1000000:
                    raise ValueError()
            except (ValueError, TypeError, OverflowError):
                cursor.execute("""
                    SELECT tutor_name, email, hourly_rate FROM TUTOR
                    WHERE tutor_id = :tutor_id
                """, {"tutor_id": session["user_id"]})
                row = cursor.fetchone()
                if not row:
                    session.clear()
                    return redirect(url_for("tutor_login"))
                return render_template("tutor_dashboard.html", tutor=row,
                                       error="Enter a valid non-negative hourly charge.",
                                       csrf_token=_auth_csrf_token())
            cursor.execute("""
                UPDATE TUTOR SET hourly_rate = :rate
                WHERE tutor_id = :tutor_id
            """, {"rate": rate, "tutor_id": session["user_id"]})
            connection.commit()
            success = "Hourly charge updated successfully."

        cursor.execute("""
            SELECT tutor_name, email, hourly_rate FROM TUTOR
            WHERE tutor_id = :tutor_id
        """, {"tutor_id": session["user_id"]})
        row = cursor.fetchone()
        if not row:
            session.clear()
            return redirect(url_for("tutor_login"))
        return render_template("tutor_dashboard.html", tutor=row, error=None,
                               success=success if request.method == "POST" else None,
                               csrf_token=_auth_csrf_token())
    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Tutor dashboard failed")
        return "Unable to load the tutor dashboard. Please try again.", 500
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/logout", methods=["POST"])
def logout():
    if not _auth_csrf_valid():
        return "Invalid or expired form token. Please reload the page.", 400
    session.clear()
    return redirect(url_for("home"))

# ---------------- END ACCOUNT AUTHENTICATION ----------------

# ---------------- OFFLINE TUTOR APIs ----------------

@app.route("/api/tutors", methods=["GET"])
def get_tutors():
    subject_id = request.args.get("subject_id", type=int)
    language = request.args.get("language", "").strip()

    if subject_id is not None and subject_id <= 0:
        return jsonify({"error": "subject_id must be positive."}), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            SELECT t.tutor_id, t.tutor_name, t.email,
                   t.subject_id, s.subject_name, t.language,
                   t.experience_years, t.hourly_rate, t.bio
            FROM TUTOR t
            JOIN SUBJECT s ON s.subject_id = t.subject_id
            WHERE (:subject_id IS NULL OR t.subject_id = :subject_id)
              AND (:language IS NULL OR
                   LOWER(t.language) = LOWER(:language))
            ORDER BY t.tutor_name
        """

        cursor.execute(query, {
            "subject_id": subject_id,
            "language": language or None
        })

        tutors = [
            {
                "tutor_id": row[0],
                "tutor_name": row[1],
                "email": row[2],
                "subject_id": row[3],
                "subject_name": row[4],
                "language": row[5],
                "experience_years": row[6],
                "hourly_rate": float(row[7]) if row[7] is not None else None,
                "bio": row[8]
            }
            for row in cursor.fetchall()
        ]

        return jsonify(tutors), 200

    except Exception:
        app.logger.exception("Failed to fetch tutors")
        return jsonify({"error": "Unable to fetch tutors."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/api/tutors/<int:tutor_id>/availability", methods=["GET"])
def get_tutor_availability(tutor_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT availability_id
            FROM TUTOR_AVAILABILITY
            WHERE tutor_id = :tutor_id
        """, {"tutor_id": tutor_id})

        if cursor.fetchone() is None:
            cursor.execute("""
                SELECT tutor_id FROM TUTOR WHERE tutor_id = :tutor_id
            """, {"tutor_id": tutor_id})

            if cursor.fetchone() is None:
                return jsonify({"error": "Tutor not found."}), 404

        cursor.execute("""
            SELECT availability_id, tutor_id, session_start,
                   session_end, status
            FROM TUTOR_AVAILABILITY
            WHERE tutor_id = :tutor_id
              AND status = 'Available'
              AND session_start > CURRENT_TIMESTAMP
            ORDER BY session_start
        """, {"tutor_id": tutor_id})

        sessions = [
            {
                "availability_id": row[0],
                "tutor_id": row[1],
                "session_start": row[2].isoformat() if row[2] else None,
                "session_end": row[3].isoformat() if row[3] else None,
                "status": row[4]
            }
            for row in cursor.fetchall()
        ]

        return jsonify(sessions), 200

    except Exception:
        app.logger.exception("Failed to fetch tutor availability")
        return jsonify({"error": "Unable to fetch tutor availability."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/api/bookings", methods=["POST"])
def create_tutor_booking():
    data = request.get_json(silent=True) or {}

    student_id = data.get("student_id")
    availability_id = data.get("availability_id")

    if (
        not isinstance(student_id, int) or isinstance(student_id, bool)
        or student_id <= 0
        or not isinstance(availability_id, int)
        or isinstance(availability_id, bool)
        or availability_id <= 0
    ):
        return jsonify({
            "error": "Provide valid integer student_id and availability_id."
        }), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Confirm the student exists.
        cursor.execute("""
            SELECT student_id
            FROM STUDENT
            WHERE student_id = :student_id
        """, {"student_id": student_id})

        if cursor.fetchone() is None:
            return jsonify({"error": "Student not found."}), 404

        # Atomically claim the slot only if it is still available.
        cursor.execute("""
            UPDATE TUTOR_AVAILABILITY
            SET status = 'Booked'
            WHERE availability_id = :availability_id
              AND status = 'Available'
              AND session_start > CURRENT_TIMESTAMP
        """, {"availability_id": availability_id})

        if cursor.rowcount != 1:
            connection.rollback()
            return jsonify({
                "error": "This session is unavailable or has already been booked."
            }), 409
        booking_id_var = cursor.var(oracledb.NUMBER)
        cursor.execute("""
            INSERT INTO TUTOR_BOOKING (
                student_id, availability_id, booking_status, booked_at
            )
            VALUES (
                :student_id, :availability_id, 'Confirmed', CURRENT_TIMESTAMP
            )
            RETURNING booking_id INTO :booking_id
        """, {
            "student_id": student_id,
            "availability_id": availability_id,
            "booking_id": booking_id_var
        })

        returned_id = booking_id_var.getvalue()

        if isinstance(returned_id, list):
            returned_id = returned_id[0]

        booking_id = int(returned_id)
        connection.commit()

        return jsonify({
            "message": "Session booked successfully.",
            "booking_id": booking_id,
            "student_id": student_id,
            "availability_id": availability_id,
            "booking_status": "Confirmed"
        }), 201

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Failed to create tutor booking")
        return jsonify({"error": "Unable to create booking."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


# ---------------- TUTOR REVIEWS API ----------------

@app.route("/api/tutors/<int:tutor_id>/reviews", methods=["GET"])
def get_tutor_reviews(tutor_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT s.student_name,
                   r.overall_rating,
                   r.on_time_rating,
                   r.doubt_clearing_rating,
                   r.helpfulness_rating,
                   r.feedback,
                   r.created_at
            FROM TUTOR_REVIEW r
            JOIN STUDENT s ON s.student_id = r.student_id
            WHERE r.tutor_id = :tutor_id
            ORDER BY r.created_at DESC
        """, {"tutor_id": tutor_id})

        reviews = []
        for row in cursor.fetchall():
            reviews.append({
                "student": row[0],
                "rating": int(row[1]),
                "onTime": int(row[2]),
                "doubts": int(row[3]),
                "helpful": int(row[4]),
                "text": row[5] or "",
                "createdAt": row[6].isoformat() if row[6] else None
            })

        cursor.execute("""
            SELECT COUNT(*), AVG(overall_rating),
                   AVG(on_time_rating), AVG(doubt_clearing_rating),
                   AVG(helpfulness_rating)
            FROM TUTOR_REVIEW
            WHERE tutor_id = :tutor_id
        """, {"tutor_id": tutor_id})

        summary = cursor.fetchone()

        return jsonify({
            "tutor_id": tutor_id,
            "review_count": int(summary[0]),
            "average_rating": round(float(summary[1]), 2) if summary[1] is not None else None,
            "average_on_time": round(float(summary[2]), 2) if summary[2] is not None else None,
            "average_doubt_clearing": round(float(summary[3]), 2) if summary[3] is not None else None,
            "average_helpfulness": round(float(summary[4]), 2) if summary[4] is not None else None,
            "reviews": reviews
        }), 200

    except Exception:
        app.logger.exception("Failed to fetch tutor reviews")
        return jsonify({"error": "Unable to fetch tutor reviews."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()


@app.route("/api/reviews", methods=["POST"])
def create_tutor_review():
    if session.get("user_type") != "student" or not session.get("user_id"):
        return jsonify({
            "error": "Please log in as a student to submit a review."
        }), 401

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"error": "Send review details as JSON."}), 400

    try:
        booking_id = data.get("booking_id")
        if isinstance(booking_id, bool):
            raise ValueError()
        booking_id = int(booking_id)
        if booking_id <= 0:
            raise ValueError()

        rating_keys = {
            "overall_rating": "overall_rating",
            "on_time_rating": "on_time_rating",
            "doubt_clearing_rating": "doubt_clearing_rating",
            "helpfulness_rating": "helpfulness_rating"
        }
        ratings = {}

        for key in rating_keys:
            value = data.get(key)
            if isinstance(value, bool):
                raise ValueError()
            value = int(value)
            if value < 1 or value > 5:
                raise ValueError()
            ratings[key] = value

    except (TypeError, ValueError, OverflowError):
        return jsonify({
            "error": "Provide a valid booking ID and ratings from 1 to 5."
        }), 400

    feedback = data.get("feedback", "")
    if not isinstance(feedback, str):
        return jsonify({"error": "Feedback must be text."}), 400

    feedback = feedback.strip()
    if len(feedback) > 500:
        return jsonify({
            "error": "Feedback must be 500 characters or fewer."
        }), 400

    student_id = session["user_id"]
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        # Derive the tutor from the booking and verify ownership.
        cursor.execute("""
            SELECT ta.tutor_id
            FROM TUTOR_BOOKING b
            JOIN TUTOR_AVAILABILITY ta
              ON ta.availability_id = b.availability_id
            WHERE b.booking_id = :booking_id
              AND b.student_id = :student_id
              AND b.booking_status = 'Confirmed'
        """, {
            "booking_id": booking_id,
            "student_id": student_id
        })

        booking = cursor.fetchone()
        if booking is None:
            return jsonify({
                "error": "A confirmed booking belonging to your account is required."
            }), 403

        tutor_id = int(booking[0])

        cursor.execute("""
            INSERT INTO TUTOR_REVIEW (
                student_id, tutor_id, booking_id,
                overall_rating, on_time_rating,
                doubt_clearing_rating, helpfulness_rating,
                feedback, created_at
            )
            VALUES (
                :student_id, :tutor_id, :booking_id,
                :overall_rating, :on_time_rating,
                :doubt_clearing_rating, :helpfulness_rating,
                :feedback, CURRENT_TIMESTAMP
            )
        """, {
            "student_id": student_id,
            "tutor_id": tutor_id,
            "booking_id": booking_id,
            **ratings,
            "feedback": feedback or None
        })

        connection.commit()

        return jsonify({
            "message": "Review submitted successfully.",
            "booking_id": booking_id,
            "tutor_id": tutor_id
        }), 201

    except oracledb.IntegrityError:
        if connection:
            connection.rollback()
        return jsonify({
            "error": "This booking may already have a review, or the review violates a database constraint."
        }), 409

    except Exception:
        if connection:
            connection.rollback()
        app.logger.exception("Failed to submit tutor review")
        return jsonify({"error": "Unable to submit review."}), 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

# ---------------- END TUTOR REVIEWS API ----------------

# ---------------- END OFFLINE TUTOR APIs ----------------
@app.route("/offline")
def offline_learning():
    return render_template("offline_tutor.html")
@app.route("/")
def home():
    return render_template("index.html", csrf_token=_auth_csrf_token())



if __name__ == "__main__":
    app.run(debug=True, port=5001)
