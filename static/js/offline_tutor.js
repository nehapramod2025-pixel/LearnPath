// Offline Tutor module script.

// SAMPLE DATA (made-up tutors).
// The team lead's backend/API will replace this list later.
var TUTORS = [
    { id: 1, name: "Ananya Raghavan", title: "Mathematics and Physics tutor", experienceYears: 6, area: "Katpadi, Vellore", hourlyFee: 400, subjects: ["Mathematics", "Physics"], languages: ["English", "Tamil"] },
    { id: 2, name: "Karthik Subramani", title: "Computer Science tutor", experienceYears: 4, area: "Gandhi Nagar, Vellore", hourlyFee: 500, subjects: ["Computer Science", "Mathematics"], languages: ["English", "Tamil", "Telugu"] },
    { id: 3, name: "Meera Nair", title: "Chemistry and Biology tutor", experienceYears: 8, area: "Anna Nagar, Chennai", hourlyFee: 450, subjects: ["Chemistry", "Biology"], languages: ["English", "Hindi", "Malayalam"] },
    { id: 4, name: "Farhan Sheikh", title: "English and Communication tutor", experienceYears: 5, area: "Katpadi, Vellore", hourlyFee: 350, subjects: ["English"], languages: ["English", "Hindi"] },
    { id: 5, name: "Divya Menon", title: "Mathematics tutor", experienceYears: 0, studentYear: "2nd year", area: "Katpadi, Vellore", hourlyFee: 250, subjects: ["Mathematics"], languages: ["Tamil", "English"] },
    { id: 6, name: "Sneha Iyer", title: "Economics and Accountancy tutor", experienceYears: 5, area: "Gandhi Nagar, Vellore", hourlyFee: 380, subjects: ["Economics", "Accountancy"], languages: ["English", "Tamil"] },
    { id: 7, name: "Sanjay Raman", title: "DBMS and SQL tutor", experienceYears: 5, area: "Katpadi, Vellore", hourlyFee: 450, subjects: ["DBMS", "SQL"], languages: ["English", "Tamil"] },
    { id: 8, name: "Harshitha Rao", title: "DAA and Data Structures tutor", experienceYears: 4, area: "Gandhi Nagar, Vellore", hourlyFee: 480, subjects: ["DAA", "Data Structures"], languages: ["English", "Telugu", "Hindi"] },
    { id: 9, name: "Mohammed Faizal", title: "Operating Systems and Networks tutor", experienceYears: 6, area: "Anna Nagar, Chennai", hourlyFee: 500, subjects: ["Operating Systems", "Computer Networks"], languages: ["English", "Tamil", "Hindi"] },
    { id: 10, name: "Janani Krishnan", title: "Python, Java and DBMS tutor", experienceYears: 3, area: "Sathuvachari, Vellore", hourlyFee: 400, subjects: ["Python", "Java", "DBMS"], languages: ["Tamil", "English"] },
    { id: 11, name: "Ravi Shankar", title: "Mechanical Engineering tutor", experienceYears: 7, area: "Katpadi, Vellore", hourlyFee: 480, subjects: ["Thermodynamics", "Engineering Mechanics"], languages: ["English", "Tamil"] },
    { id: 12, name: "Anitha Devi", title: "Electrical Engineering tutor", experienceYears: 6, area: "Gandhi Nagar, Vellore", hourlyFee: 460, subjects: ["Circuit Theory", "Electrical Machines"], languages: ["English", "Tamil", "Kannada"] },
    { id: 13, name: "Sudhir Menon", title: "Electronics and Communication tutor", experienceYears: 5, area: "Anna Nagar, Chennai", hourlyFee: 470, subjects: ["Digital Electronics", "Signals and Systems"], languages: ["English", "Malayalam", "Hindi"] },
    { id: 14, name: "Gopal Reddy", title: "Civil Engineering tutor", experienceYears: 8, area: "Sathuvachari, Vellore", hourlyFee: 440, subjects: ["Structural Analysis", "Surveying"], languages: ["English", "Telugu"] },
    { id: 15, name: "Nandita Rao", title: "Machine Learning and Python tutor", experienceYears: 3, area: "T. Nagar, Chennai", hourlyFee: 550, subjects: ["Machine Learning", "Python"], languages: ["English", "Telugu", "Hindi"] },
    { id: 16, name: "Rekha Pillai", title: "Business Studies and Management tutor", experienceYears: 9, area: "Gandhi Nagar, Vellore", hourlyFee: 390, subjects: ["Business Studies", "Management"], languages: ["English", "Malayalam", "Tamil"] },
    { id: 17, name: "Muthu Selvi", title: "Tamil tutor", experienceYears: 10, area: "Sathuvachari, Vellore", hourlyFee: 300, subjects: ["Tamil"], languages: ["Tamil", "English"] },
    { id: 18, name: "Shabana Begum", title: "Anatomy and Physiology tutor", experienceYears: 6, area: "Katpadi, Vellore", hourlyFee: 460, subjects: ["Anatomy", "Physiology"], languages: ["English", "Tamil", "Hindi"] }
];

// SAMPLE REVIEWS (made-up), keyed by tutor id.
// r(student, rating, onTime, doubts, helpful, text), all scores are out of 5:
//   rating  = overall rating
//   onTime  = completes concepts on time
//   doubts  = clears doubts
//   helpful = tutor helpfulness
function r(student, rating, onTime, doubts, helpful, text) {
    return { student: student, rating: rating, onTime: onTime, doubts: doubts, helpful: helpful, text: text };
}

var REVIEWS = {
    1: [
        r("Priya S.", 5, 5, 5, 5, "Explains every step clearly. We finished the whole syllabus before exams."),
        r("Arjun K.", 5, 4, 5, 5, "Always patient with my doubts, even the silly ones."),
        r("Nisha R.", 4, 4, 4, 5, "Very helpful. Sessions sometimes ran a little over time."),
        r("Gokul M.", 5, 5, 5, 5, "My maths marks went up by 20 in one term."),
        r("Shreya B.", 4, 4, 5, 4, "Good practice sheets after every class."),
        r("Dinesh V.", 5, 5, 4, 5, "Very punctual and well prepared."),
        r("Fathima Z.", 5, 5, 5, 5, "Makes tough physics topics feel simple."),
        r("Rohan C.", 4, 4, 4, 4, "Good teacher. I would like a few more mock tests.")
    ],
    2: [
        r("Vikram T.", 5, 5, 4, 5, "Made programming easy to understand with real examples."),
        r("Sana M.", 4, 4, 4, 4, "Good teaching and good practice problems."),
        r("Aditya N.", 5, 5, 5, 5, "Explained loops and functions better than my college class."),
        r("Pooja H.", 4, 3, 4, 4, "Great content. We ran slightly behind on one topic."),
        r("Kiran D.", 5, 5, 5, 5, "Helped me finish my mini project on time."),
        r("Lavanya S.", 5, 4, 5, 5, "Always answers doubts quickly and clearly."),
        r("Manoj P.", 4, 4, 4, 5, "Friendly and very helpful."),
        r("Tanvi R.", 5, 5, 5, 5, "Best tutor for data structures."),
        r("Ashwin G.", 4, 4, 4, 4, "Good pace. Sessions are worth the fee.")
    ],
    3: [
        r("Divya L.", 5, 5, 5, 5, "Chemistry finally makes sense. Super organised."),
        r("Rahul P.", 5, 5, 4, 5, "Covered each chapter on schedule."),
        r("Aisha B.", 4, 4, 5, 4, "Clears doubts really well."),
        r("Harish K.", 5, 5, 5, 5, "Biology diagrams explained step by step."),
        r("Janani V.", 4, 4, 4, 5, "Very kind and supportive."),
        r("Sathish R.", 5, 5, 5, 5, "She revises old topics before starting new ones."),
        r("Nandhini A.", 4, 4, 4, 4, "Good tutor. Neat notes after every session.")
    ],
    4: [
        r("Kavya N.", 4, 4, 4, 4, "My spoken English improved a lot in two months."),
        r("Imran A.", 5, 5, 5, 5, "Friendly and encouraging."),
        r("Ritu M.", 5, 5, 4, 5, "Great practice for writing and speaking.")
    ],
    5: [
        r("Keerthi S.", 5, 4, 5, 5, "She is a student herself, so she knows what we struggle with."),
        r("Yusuf A.", 4, 4, 4, 5, "Very helpful and patient. Still new, but explains well."),
        r("Bhavana T.", 5, 5, 4, 5, "Covered the whole chapter in two sessions.")
    ],
    6: [
        r("Anand R.", 5, 5, 4, 5, "Accountancy entries explained with simple examples."),
        r("Meghna P.", 4, 4, 4, 4, "Economics graphs finally became clear."),
        r("Zoya K.", 5, 5, 5, 5, "Her notes were excellent.")
    ],
    7: [
        r("Karthikeyan S.", 5, 5, 5, 5, "Normalization finally makes sense."),
        r("Ishita D.", 5, 5, 4, 5, "Great SQL practice queries."),
        r("Ramesh T.", 4, 4, 4, 5, "Helped me prepare for my DBMS viva."),
        r("Nithya A.", 5, 5, 5, 5, "ER diagrams explained very well."),
        r("Alex P.", 4, 4, 5, 4, "Clears doubts fast."),
        r("Shalini G.", 5, 5, 5, 5, "Passed my DBMS exam thanks to these sessions.")
    ],
    8: [
        r("Vishal K.", 5, 5, 5, 5, "Greedy and dynamic programming became easy."),
        r("Bhuvana R.", 4, 4, 4, 5, "Very good with time complexity."),
        r("Adnan S.", 5, 4, 5, 5, "Solved many previous exam problems with us."),
        r("Reshma V.", 4, 4, 4, 4, "Clear and well structured."),
        r("Gautham M.", 5, 5, 5, 5, "Best tutor for algorithm design.")
    ],
    9: [
        r("Sowmya P.", 4, 4, 4, 4, "Explained scheduling and deadlocks clearly."),
        r("Nikhil H.", 5, 5, 5, 5, "Networking layers explained with real examples."),
        r("Fiona C.", 4, 4, 5, 4, "Good at solving doubts.")
    ],
    10: [
        r("Surya N.", 5, 5, 5, 5, "Learned Python basics in a few sessions."),
        r("Mythili K.", 4, 4, 4, 5, "Very patient with beginners."),
        r("Hari D.", 5, 5, 4, 5, "Java OOP concepts explained well."),
        r("Zara F.", 4, 4, 4, 4, "Good practice projects.")
    ],
    11: [
        r("Naresh B.", 5, 5, 5, 5, "Thermodynamics cycles explained with clear diagrams."),
        r("Smita K.", 4, 4, 4, 4, "Good with numerical problems in mechanics."),
        r("Yash T.", 5, 5, 4, 5, "Helped me clear my engineering mechanics arrear."),
        r("Lokesh P.", 4, 4, 5, 4, "Patient and clear.")
    ],
    12: [
        r("Bharath S.", 5, 5, 5, 5, "Network theorems finally made sense."),
        r("Divakar M.", 4, 4, 4, 5, "Transformers explained step by step."),
        r("Keerthana R.", 5, 5, 5, 5, "Great for exam preparation."),
        r("Faizan H.", 4, 3, 4, 4, "Good tutor, but we needed an extra session for AC circuits.")
    ],
    13: [
        r("Anjali V.", 5, 5, 5, 5, "Logic gates and flip-flops explained with simple circuits."),
        r("Ganesh L.", 4, 4, 4, 4, "Fourier transform became less scary."),
        r("Mehul D.", 5, 5, 4, 5, "Quick at clearing doubts.")
    ],
    14: [
        r("Arvind C.", 5, 5, 5, 5, "Beam diagrams explained very clearly."),
        r("Sridevi N.", 5, 4, 5, 5, "Surveying practicals explained with field examples."),
        r("Pranav J.", 4, 4, 4, 4, "Very experienced."),
        r("Isha W.", 5, 5, 5, 5, "Helped me finish the whole syllabus on time.")
    ],
    15: [
        r("Rishi G.", 5, 5, 5, 5, "Built my first regression model in the second session."),
        r("Madhavi S.", 4, 4, 4, 5, "Explains neural networks without heavy maths."),
        r("Tejas K.", 5, 4, 5, 5, "Great practical projects."),
        r("Sonal P.", 4, 4, 4, 4, "Good pace.")
    ],
    16: [
        r("Anusha B.", 5, 5, 5, 5, "Marketing concepts explained with real brands."),
        r("Dev M.", 4, 4, 4, 4, "Helpful notes and case studies."),
        r("Swathi R.", 5, 5, 5, 5, "Excellent for BBA exam preparation."),
        r("Kabir A.", 4, 4, 4, 5, "Very supportive.")
    ],
    17: [
        r("Selvam K.", 5, 5, 5, 5, "Tamil grammar became easy."),
        r("Yamini P.", 5, 5, 5, 5, "Great literature explanations."),
        r("Barath V.", 4, 4, 4, 5, "Very kind teacher."),
        r("Kalai R.", 5, 5, 4, 5, "Prepared me well for my board exam.")
    ],
    18: [
        r("Fathima R.", 5, 5, 5, 5, "Anatomy diagrams explained step by step."),
        r("Joel S.", 5, 5, 4, 5, "Cardiovascular physiology finally clear."),
        r("Aparna M.", 4, 4, 4, 4, "Good revision sessions."),
        r("Zubair K.", 5, 5, 5, 5, "Very well organised.")
    ]
};

// SAMPLE TOPICS (made-up): topics each tutor teaches, per subject, keyed by tutor id.
// The backend will replace this later.
var TUTOR_TOPICS = {
    1: { "Mathematics": ["Algebra", "Calculus", "Trigonometry"], "Physics": ["Mechanics", "Optics"] },
    2: { "Computer Science": ["Programming Basics", "Web Development"], "Mathematics": ["Discrete Mathematics", "Probability"] },
    3: { "Chemistry": ["Organic Chemistry", "Chemical Bonding"], "Biology": ["Genetics", "Cell Biology"] },
    4: { "English": ["Spoken English", "Grammar", "Essay Writing"] },
    5: { "Mathematics": ["Algebra", "Geometry"] },
    6: { "Economics": ["Microeconomics", "Macroeconomics"], "Accountancy": ["Journal Entries", "Final Accounts"] },
    7: { "DBMS": ["ER Diagrams", "Normalization", "Transactions"], "SQL": ["Joins", "Subqueries", "Aggregate Functions"] },
    8: { "DAA": ["Greedy Algorithms", "Dynamic Programming", "Time Complexity"], "Data Structures": ["Trees", "Graphs", "Sorting"] },
    9: { "Operating Systems": ["Process Scheduling", "Deadlocks", "Memory Management"], "Computer Networks": ["OSI Model", "TCP/IP"] },
    10: { "Python": ["Basics", "Functions", "File Handling"], "Java": ["OOP Concepts", "Collections"], "DBMS": ["SQL Basics", "Normalization"] },
    11: { "Thermodynamics": ["Laws of Thermodynamics", "Heat Engines"], "Engineering Mechanics": ["Statics", "Friction"] },
    12: { "Circuit Theory": ["Network Theorems", "AC Circuits"], "Electrical Machines": ["DC Machines", "Transformers"] },
    13: { "Digital Electronics": ["Logic Gates", "Flip-Flops"], "Signals and Systems": ["Fourier Transform", "Laplace Transform"] },
    14: { "Structural Analysis": ["Beams", "Trusses"], "Surveying": ["Levelling", "Theodolite"] },
    15: { "Machine Learning": ["Regression", "Classification", "Neural Networks"], "Python": ["Basics", "NumPy and Pandas"] },
    16: { "Business Studies": ["Marketing", "Entrepreneurship"], "Management": ["Organisational Behaviour", "HR Management"] },
    17: { "Tamil": ["Grammar", "Literature"] },
    18: { "Anatomy": ["Musculoskeletal System", "Nervous System"], "Physiology": ["Cardiovascular System", "Respiration"] }
};

// The three feedback categories shown on each card.
var FEEDBACK_ITEMS = [
    { key: "onTime", label: "Completes concepts on time" },
    { key: "doubts", label: "Clears doubts" },
    { key: "helpful", label: "Helpfulness" }
];

// Small helper: create an element with a class and text.
function createEl(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
        node.className = className;
    }
    if (text !== undefined) {
        node.textContent = text;
    }
    return node;
}

function getInitials(name) {
    var parts = name.split(" ");
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Collect every different subject (or language) from the tutor list, sorted.
function uniqueSorted(key) {
    var found = [];
    TUTORS.forEach(function (tutor) {
        tutor[key].forEach(function (value) {
            if (found.indexOf(value) === -1) {
                found.push(value);
            }
        });
    });
    return found.sort();
}

function fillSelect(select, values) {
    values.forEach(function (value) {
        var option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function createChips(values, chipClass) {
    var row = createEl("div", "tutor-chip-row");
    values.forEach(function (value) {
        row.appendChild(createEl("span", "tutor-chip " + chipClass, value));
    });
    return row;
}

function experienceText(tutor) {
    if (tutor.experienceYears >= 1) {
        return tutor.experienceYears + " years experience";
    }
    if (tutor.studentYear) {
        return "New tutor \u00B7 " + tutor.studentYear + " student";
    }
    return "New tutor";
}

// Topics a tutor teaches under one subject.
function topicsFor(tutor, subject) {
    var map = TUTOR_TOPICS[tutor.id] || {};
    return map[subject] || [];
}

// All different topics for one subject, sorted.
function topicsForSubject(subject) {
    var found = [];
    TUTORS.forEach(function (tutor) {
        topicsFor(tutor, subject).forEach(function (topic) {
            if (found.indexOf(topic) === -1) {
                found.push(topic);
            }
        });
    });
    return found.sort();
}

// ---------- Ratings and reviews ----------

// Average of one score (like "rating") across a list of reviews.
function average(list, key) {
    if (!list || list.length === 0) {
        return null;
    }
    var total = 0;
    list.forEach(function (review) {
        total += review[key];
    });
    return total / list.length;
}

// Turn 4.3 into a row of stars.
function starText(value) {
    var filled = Math.round(value);
    var text = "";
    for (var i = 0; i < 5; i++) {
        text += i < filled ? "\u2605" : "\u2606";
    }
    return text;
}

function reviewCountText(count) {
    return count === 1 ? "1 review" : count + " reviews";
}

function buildRatingRow(reviews) {
    var row = createEl("div", "tutor-rating-row");
    if (reviews.length === 0) {
        row.appendChild(createEl("span", "tutor-no-reviews", "No reviews yet"));
        return row;
    }
    var avg = average(reviews, "rating");
    var stars = createEl("span", "tutor-stars", starText(avg));
    stars.setAttribute("aria-hidden", "true");
    row.appendChild(stars);
    row.appendChild(createEl("span", "tutor-rating-value", avg.toFixed(1)));
    row.appendChild(createEl("span", "tutor-rating-count", "(" + reviewCountText(reviews.length) + ")"));
    row.setAttribute("aria-label", "Rated " + avg.toFixed(1) + " out of 5 from " + reviewCountText(reviews.length));
    return row;
}

function buildFeedback(reviews) {
    var wrap = createEl("div", "tutor-feedback");
    wrap.appendChild(createEl("p", "tutor-label", "Student feedback"));

    FEEDBACK_ITEMS.forEach(function (item) {
        var avg = average(reviews, item.key);
        var row = createEl("div", "tutor-feedback-row");
        row.appendChild(createEl("span", "tutor-feedback-label", item.label));

        var track = createEl("div", "tutor-bar-track");
        var fill = createEl("div", "tutor-bar-fill");
        fill.style.width = (avg / 5 * 100) + "%";
        track.appendChild(fill);
        row.appendChild(track);

        row.appendChild(createEl("span", "tutor-feedback-value", avg.toFixed(1)));
        wrap.appendChild(row);
    });
    return wrap;
}

function buildReviewsSection(reviews) {
    var wrap = createEl("div", "tutor-reviews");

    var button = createEl("button", "tutor-reviews-button", "Show reviews (" + reviews.length + ")");
    button.type = "button";
    button.setAttribute("aria-expanded", "false");

    var panel = createEl("div", "tutor-reviews-panel");
    panel.hidden = true;

    reviews.forEach(function (review) {
        var item = createEl("article", "tutor-review");
        var head = createEl("div", "tutor-review-head");
        head.appendChild(createEl("strong", "tutor-review-name", review.student));
        var reviewStars = createEl("span", "tutor-stars", starText(review.rating));
        reviewStars.setAttribute("aria-label", review.rating + " out of 5");
        head.appendChild(reviewStars);
        item.appendChild(head);
        item.appendChild(createEl("p", "tutor-review-text", review.text));
        panel.appendChild(item);
    });

    button.addEventListener("click", function () {
        var willOpen = panel.hidden;
        panel.hidden = !willOpen;
        button.setAttribute("aria-expanded", String(willOpen));
        button.textContent = (willOpen ? "Hide reviews (" : "Show reviews (") + reviews.length + ")";
    });

    wrap.appendChild(button);
    wrap.appendChild(panel);
    return wrap;
}

// ---------- Tutor card ----------

function buildCard(tutor) {
    var reviews = REVIEWS[tutor.id] || [];
    var card = createEl("article", "tutor-card");
    card.setAttribute("data-tutor-id", tutor.id);

    var top = createEl("div", "tutor-card-top");
    top.appendChild(createEl("div", "tutor-avatar", getInitials(tutor.name)));
    var who = createEl("div", "tutor-card-who");
    who.appendChild(createEl("h3", "tutor-name", tutor.name));
    who.appendChild(createEl("p", "tutor-title", tutor.title));
    top.appendChild(who);
    card.appendChild(top);

    card.appendChild(buildRatingRow(reviews));

    card.appendChild(createEl("p", "tutor-meta", experienceText(tutor) + " \u00B7 " + tutor.area));

    card.appendChild(createEl("p", "tutor-label", "Subjects"));
    card.appendChild(createChips(tutor.subjects, "subject-chip"));

    var topicList = [];
    tutor.subjects.forEach(function (subjectName) {
        topicsFor(tutor, subjectName).forEach(function (topicName) {
            if (topicList.indexOf(topicName) === -1) {
                topicList.push(topicName);
            }
        });
    });
    if (topicList.length > 0) {
        card.appendChild(createEl("p", "tutor-label", "Topics"));
        card.appendChild(createChips(topicList, "topic-chip"));
    }

    card.appendChild(createEl("p", "tutor-label", "Spoken languages"));
    card.appendChild(createChips(tutor.languages, "language-chip"));

    if (reviews.length > 0) {
        card.appendChild(buildFeedback(reviews));
    }

    card.appendChild(createEl("p", "tutor-fee", "\u20B9" + tutor.hourlyFee + " per hour"));

    if (reviews.length > 0) {
        card.appendChild(buildReviewsSection(reviews));
    }
    return card;
}

// ---------- Filters ----------

function matchesFilters(tutor, subject, language, topic) {
    var subjectOk = subject === "" || tutor.subjects.indexOf(subject) !== -1;
    var languageOk = language === "" || tutor.languages.indexOf(language) !== -1;
    var topicOk = topic === "" || topicsFor(tutor, subject).indexOf(topic) !== -1;
    return subjectOk && languageOk && topicOk;
}

function renderTutors() {
    var subject = document.getElementById("subject-filter").value;
    var language = document.getElementById("language-filter").value;
    var topic = document.getElementById("topic-filter").value;
    var grid = document.getElementById("tutor-grid");
    var empty = document.getElementById("tutor-empty");
    var count = document.getElementById("result-count");

    grid.innerHTML = "";

    var shown = TUTORS.filter(function (tutor) {
        return matchesFilters(tutor, subject, language, topic);
    });

    shown.forEach(function (tutor) {
        grid.appendChild(buildCard(tutor));
    });

    empty.hidden = shown.length !== 0;
    count.textContent = "Showing " + shown.length + " of " + TUTORS.length + " tutors";
}

// Rebuild the Topic dropdown whenever the subject changes.
function updateTopicOptions() {
    var subject = document.getElementById("subject-filter").value;
    var topicSelect = document.getElementById("topic-filter");

    topicSelect.innerHTML = "";
    var allOption = document.createElement("option");
    allOption.value = "";
    topicSelect.appendChild(allOption);

    if (subject === "") {
        allOption.textContent = "Choose a subject first";
        topicSelect.disabled = true;
        return;
    }
    allOption.textContent = "All topics";
    fillSelect(topicSelect, topicsForSubject(subject));
    topicSelect.disabled = false;
}

function setUpFilters() {
    var subjectSelect = document.getElementById("subject-filter");
    var languageSelect = document.getElementById("language-filter");
    var topicSelect = document.getElementById("topic-filter");
    var clearButton = document.getElementById("clear-filters");

    fillSelect(subjectSelect, uniqueSorted("subjects"));
    fillSelect(languageSelect, uniqueSorted("languages"));
    updateTopicOptions();

    subjectSelect.addEventListener("change", function () {
        updateTopicOptions();
        renderTutors();
    });
    languageSelect.addEventListener("change", renderTutors);
    topicSelect.addEventListener("change", renderTutors);
    clearButton.addEventListener("click", function () {
        subjectSelect.value = "";
        languageSelect.value = "";
        updateTopicOptions();
        renderTutors();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var status = document.getElementById("tutor-js-status");
    if (status) {
        status.textContent = "JavaScript is working \u2714";
    }
    setUpFilters();
    renderTutors();
});