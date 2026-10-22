// Offline Tutor module script.

// SAMPLE DATA (made-up tutors).
// The team lead's backend/API will replace this list later.
var TUTORS = [
    { id: 1, name: "Ananya Raghavan", title: "Mathematics and Physics tutor", experienceYears: 6, area: "Katpadi, Vellore", hourlyFee: 400, subjects: ["Mathematics", "Physics"], languages: ["English", "Tamil"] },
    { id: 2, name: "Karthik Subramani", title: "Computer Science tutor", experienceYears: 4, studentYear: "4th year", area: "Gandhi Nagar, Vellore", hourlyFee: 500, subjects: ["Computer Science", "Mathematics"], languages: ["English", "Tamil", "Telugu"] },
    { id: 3, name: "Meera Nair", title: "Chemistry and Biology tutor", experienceYears: 8, area: "Anna Nagar, Chennai", hourlyFee: 450, subjects: ["Chemistry", "Biology"], languages: ["English", "Hindi", "Malayalam"] },
    { id: 4, name: "Farhan Sheikh", title: "English and Communication tutor", experienceYears: 5, area: "Bagayam, Vellore", hourlyFee: 350, subjects: ["English"], languages: ["English", "Hindi"] },
    { id: 5, name: "Divya Menon", title: "Mathematics tutor", experienceYears: 0, studentYear: "2nd year", area: "Thorapadi, Vellore", hourlyFee: 250, subjects: ["Mathematics"], languages: ["Tamil", "English"] },
    { id: 6, name: "Sneha Iyer", title: "Economics and Accountancy tutor", experienceYears: 5, area: "Adyar, Chennai", hourlyFee: 380, subjects: ["Economics", "Accountancy"], languages: ["English", "Tamil"] },
    { id: 7, name: "Sanjay Raman", title: "DBMS and SQL tutor", experienceYears: 5, area: "Sathuvachari, Vellore", hourlyFee: 450, subjects: ["DBMS", "SQL"], languages: ["English", "Tamil"] },
    { id: 8, name: "Harshitha Rao", title: "DAA and Data Structures tutor", experienceYears: 4, studentYear: "4th year", area: "Velachery, Chennai", hourlyFee: 480, subjects: ["DAA", "Data Structures"], languages: ["English", "Telugu", "Hindi"] },
    { id: 9, name: "Mohammed Faizal", title: "Operating Systems and Networks tutor", experienceYears: 6, area: "Tambaram, Chennai", hourlyFee: 500, subjects: ["Operating Systems", "Computer Networks"], languages: ["English", "Tamil", "Hindi"] },
    { id: 10, name: "Janani Krishnan", title: "Python, Java and DBMS tutor", experienceYears: 3, studentYear: "3rd year", area: "Kaspa, Vellore", hourlyFee: 400, subjects: ["Python", "Java", "DBMS"], languages: ["Tamil", "English"] },
    { id: 11, name: "Ravi Shankar", title: "Mechanical Engineering tutor", experienceYears: 7, area: "Ranipet", hourlyFee: 480, subjects: ["Thermodynamics", "Engineering Mechanics"], languages: ["English", "Tamil"] },
    { id: 12, name: "Anitha Devi", title: "Electrical Engineering tutor", experienceYears: 6, area: "Porur, Chennai", hourlyFee: 460, subjects: ["Circuit Theory", "Electrical Machines"], languages: ["English", "Tamil", "Kannada"] },
    { id: 13, name: "Sudhir Menon", title: "Electronics and Communication tutor", experienceYears: 5, area: "T. Nagar, Chennai", hourlyFee: 470, subjects: ["Digital Electronics", "Signals and Systems"], languages: ["English", "Malayalam", "Hindi"] },
    { id: 14, name: "Gopal Reddy", title: "Civil Engineering tutor", experienceYears: 8, area: "Arcot", hourlyFee: 440, subjects: ["Structural Analysis", "Surveying"], languages: ["English", "Telugu"] },
    { id: 15, name: "Nandita Rao", title: "Machine Learning and Python tutor", experienceYears: 3, studentYear: "3rd year", area: "Guindy, Chennai", hourlyFee: 550, subjects: ["Machine Learning", "Python"], languages: ["English", "Telugu", "Hindi"] },
    { id: 16, name: "Rekha Pillai", title: "Business Studies and Management tutor", experienceYears: 9, area: "RS Puram, Coimbatore", hourlyFee: 390, subjects: ["Business Studies", "Management"], languages: ["English", "Malayalam", "Tamil"] },
    { id: 17, name: "Muthu Selvi", title: "Tamil tutor", experienceYears: 10, area: "Tiruvannamalai", hourlyFee: 300, subjects: ["Tamil"], languages: ["Tamil", "English"] },
    { id: 18, name: "Shabana Begum", title: "Anatomy and Physiology tutor", experienceYears: 6, area: "Ambur", hourlyFee: 460, subjects: ["Anatomy", "Physiology"], languages: ["English", "Tamil", "Hindi"] }
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

// SAMPLE AVAILABILITY (made-up), keyed by tutor id.
// days = weekdays (0 = Sunday ... 6 = Saturday), slots = start times of 1-hour sessions.
// The backend will replace this later.
var AVAILABILITY = {
    1: { days: [1, 2, 3, 4, 5], slots: ["16:00", "17:00", "18:00"] },
    2: { days: [1, 3, 5, 6], slots: ["10:00", "15:00", "17:00"] },
    3: { days: [2, 4, 6], slots: ["09:00", "11:00", "16:00"] },
    4: { days: [1, 2, 3, 4, 5, 6], slots: ["17:00", "18:00", "19:00"] },
    5: { days: [3, 6, 0], slots: ["14:00", "16:00"] },
    6: { days: [1, 3, 5], slots: ["16:00", "18:00"] },
    7: { days: [2, 4, 6], slots: ["15:00", "17:00", "19:00"] },
    8: { days: [1, 2, 4, 5], slots: ["16:00", "18:00"] },
    9: { days: [1, 3, 5, 6], slots: ["10:00", "14:00", "17:00"] },
    10: { days: [2, 3, 4], slots: ["17:00", "18:00", "19:00"] },
    11: { days: [1, 2, 3, 4, 5], slots: ["15:00", "17:00"] },
    12: { days: [2, 4, 6, 0], slots: ["10:00", "16:00"] },
    13: { days: [1, 3, 5], slots: ["17:00", "19:00"] },
    14: { days: [1, 2, 3, 4, 5, 6], slots: ["09:00", "11:00", "16:00"] },
    15: { days: [3, 4, 5, 6], slots: ["18:00", "19:00", "20:00"] },
    16: { days: [1, 2, 3, 4, 5], slots: ["10:00", "14:00", "16:00"] },
    17: { days: [1, 2, 3, 4, 5, 6, 0], slots: ["07:00", "17:00", "18:00"] },
    18: { days: [2, 3, 5, 6], slots: ["10:00", "15:00", "17:00"] }
};

var DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


// SAMPLE: subjects a tutor is also learning (made-up), keyed by tutor id.
// The same person can be a tutor in some subjects and a learner in others.
var ALSO_LEARNING = {
    2: ["Machine Learning"],
    5: ["DBMS", "DAA"],
    6: ["Python"],
    8: ["Operating Systems"],
    10: ["Computer Networks"],
    15: ["Data Structures"]
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

// "3 years experience . 3rd year student" or "New tutor . 2nd year student".
function experienceText(tutor) {
    var text = tutor.experienceYears >= 1 ? tutor.experienceYears + " years experience" : "New tutor";
    if (tutor.studentYear) {
        text += " \u00B7 " + tutor.studentYear + " student";
    }
    return text;
}

// Topics a tutor teaches under one subject.
function topicsFor(tutor, subject) {
    if (tutor.isLive) { return []; }
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
    var reviews = tutor.isLive ? [] : (REVIEWS[tutor.id] || []);
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

    var learning = tutor.isLive ? null : ALSO_LEARNING[tutor.id];
    if (learning && learning.length > 0) {
        card.appendChild(createEl("p", "tutor-label", "Also learning"));
        card.appendChild(createChips(learning, "learning-chip"));
    }

    if (reviews.length > 0) {
        card.appendChild(buildFeedback(reviews));
    }

    card.appendChild(createEl("p", "tutor-fee", "\u20B9" + tutor.hourlyFee + " per hour"));

    card.appendChild(createEl("p", "tutor-label", "Available days"));
    card.appendChild(createEl("p", "tutor-days", availableDaysText(tutor)));


    var bookButton = createEl("button", "primary-button tutor-book-button", "Book a session");
    bookButton.type = "button";
    bookButton.addEventListener("click", function () {
        selectTutor(tutor);
    });
    card.appendChild(bookButton);

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

// ---------- Availability and booking ----------

// ---------- Real availability and booking ----------

var availabilitySessions = {};

var booking = {
    tutor: null,
    dayIndex: -1,
    slot: "",
    session: null,
    loadingAvailability: false
};

function formatTime(time) {
    var date = new Date(time);
    if (isNaN(date.getTime())) return "Time unavailable";
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function sessionDate(session) {
    return new Date(session.session_start);
}

function sessionDateKey(session) {
    var date = sessionDate(session);
    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
}

function dayLabel(date) {
    return DAY_NAMES[date.getDay()] + " " +
        date.getDate() + " " + MONTH_NAMES[date.getMonth()];
}

function availableDatesForTutor(tutor) {
    var sessions = availabilitySessions[tutor.id] || [];
    var dates = {};

    sessions.forEach(function (session) {
        if (session.status !== "Available" || !session.session_start) return;

        var date = sessionDate(session);
        if (isNaN(date.getTime()) || date <= new Date()) return;

        dates[sessionDateKey(session)] = new Date(
            date.getFullYear(), date.getMonth(), date.getDate()
        );
    });

    return Object.keys(dates).sort().map(function (key) {
        return { key: key, date: dates[key] };
    });
}

function availableDaysText(tutor) {
    if (!tutor.isLive) {
        var oldInfo = AVAILABILITY[tutor.id];
        if (!oldInfo) return "Availability not set";

        return [1, 2, 3, 4, 5, 6, 0]
            .filter(function (day) {
                return oldInfo.days.indexOf(day) !== -1;
            })
            .map(function (day) {
                return DAY_NAMES[day];
            }).join(", ");
    }

    if (!Array.isArray(availabilitySessions[tutor.id])) {
        return "Select to check availability";
    }

    var dates = availableDatesForTutor(tutor);
    if (!dates.length) return "No upcoming sessions";

    return dates.map(function (item) {
        return DAY_NAMES[item.date.getDay()];
    }).filter(function (day, index, all) {
        return all.indexOf(day) === index;
    }).join(", ");
}

function renderBookingDays() {
    var wrap = document.getElementById("booking-days");
    wrap.innerHTML = "";

    if (booking.loadingAvailability) {
        wrap.appendChild(createEl("p", "booking-hint", "Loading available sessions..."));
        return;
    }

    var dates = availableDatesForTutor(booking.tutor);

    if (!dates.length) {
        wrap.appendChild(createEl(
            "p", "booking-hint",
            "No upcoming sessions are currently available for this tutor."
        ));
        return;
    }

    dates.forEach(function (item, index) {
        var button = createEl("button", "booking-choice", dayLabel(item.date));
        button.type = "button";

        if (index === booking.dayIndex) button.className += " selected";

        button.addEventListener("click", function () {
            booking.dayIndex = index;
            booking.slot = "";
            booking.session = null;
            renderBookingDays();
            renderBookingSlots();
            updateBookingSummary();
        });

        wrap.appendChild(button);
    });
}

function renderBookingSlots() {
    var wrap = document.getElementById("booking-slots");
    wrap.innerHTML = "";

    if (booking.loadingAvailability) {
        wrap.appendChild(createEl("p", "booking-hint", "Loading available times..."));
        return;
    }

    if (booking.dayIndex < 0) {
        wrap.appendChild(createEl("p", "booking-hint", "Pick an available day first."));
        return;
    }

    var dates = availableDatesForTutor(booking.tutor);
    var chosenDate = dates[booking.dayIndex];

    if (!chosenDate) {
        wrap.appendChild(createEl("p", "booking-hint", "Please choose an available day."));
        return;
    }

    var sessions = (availabilitySessions[booking.tutor.id] || [])
        .filter(function (session) {
            return session.status === "Available" &&
                session.session_start &&
                sessionDateKey(session) === chosenDate.key &&
                sessionDate(session) > new Date();
        });

    if (!sessions.length) {
        wrap.appendChild(createEl("p", "booking-hint", "No available times for this day."));
        return;
    }

    sessions.forEach(function (session) {
        var button = createEl("button", "booking-choice", formatTime(session.session_start));
        button.type = "button";

        if (booking.session &&
            Number(booking.session.availability_id) === Number(session.availability_id)) {
            button.className += " selected";
        }

        button.addEventListener("click", function () {
            booking.session = session;
            booking.slot = session.session_start;
            renderBookingSlots();
            updateBookingSummary();
        });

        wrap.appendChild(button);
    });
}

function updateBookingSummary() {
    var tutor = booking.tutor;
    if (!tutor) return;

    var summary = document.getElementById("booking-summary");
    var confirmButton = document.getElementById("booking-confirm");
    var message = document.getElementById("booking-message");
    var name = document.getElementById("booking-name").value.trim();
    var emailInput = document.getElementById("booking-email");
    var email = emailInput.value.trim();
    var fee = tutor.hourlyFee;

    summary.innerHTML = "";

    var when = "No time selected yet";

    if (booking.session) {
        var start = sessionDate(booking.session);
        var end = booking.session.session_end
            ? new Date(booking.session.session_end)
            : null;

        when = dayLabel(start) + ", " +
            formatTime(booking.session.session_start);

        if (end && !isNaN(end.getTime())) {
            when += " – " + formatTime(booking.session.session_end);
        }
    }

    summary.appendChild(createEl(
        "p", "booking-summary-line", "When: " + when
    ));
    summary.appendChild(createEl(
        "p", "booking-summary-line", "Session fee: ₹" + fee
    ));

    // Keep a completed booking from being submitted again.
    if (booking.completed) {
        confirmButton.disabled = true;
        return;
    }

    var hasSession = booking.session &&
        Number(booking.session.availability_id) > 0;

    var validEmail = email !== "" && emailInput.checkValidity();

    confirmButton.disabled = !(
        tutor.isLive &&
        hasSession &&
        name !== "" &&
        validEmail &&
        !booking.loadingAvailability &&
        !booking.submitting
    );

    if (booking.loadingAvailability) {
        message.textContent = "Loading available sessions...";
    } else if (!hasSession) {
        message.textContent = "Please select an available session.";
    } else if (!name) {
        message.textContent = "Please enter your name.";
    } else if (!email) {
        message.textContent = "Please enter your email.";
    } else if (!validEmail) {
        message.textContent = "Please enter a valid email address.";
    } else if (!tutor.isLive) {
        message.textContent = "Only live tutor bookings are supported.";
    } else {
        message.textContent =
            "Ready to book. No payment is processed by this form.";
    }
}

function selectTutor(tutor) {
    booking.tutor = tutor;
    booking.dayIndex = -1;
    booking.slot = "";
    booking.session = null;
    booking.loadingAvailability = true;
    booking.completed = false;
    booking.submitting = false;

    document.getElementById("booking-empty").hidden = true;
    document.getElementById("booking-body").hidden = false;

    var header = document.getElementById("booking-tutor");
    header.innerHTML = "";
    header.appendChild(createEl("strong", "", tutor.name));
    header.appendChild(createEl("p", "tutor-title",
        tutor.title + " · ₹" + tutor.hourlyFee + " per hour"));

    var subjectSelect = document.getElementById("booking-subject");
    subjectSelect.innerHTML = "";
    fillSelect(subjectSelect, tutor.subjects);

    document.getElementById("booking-message").textContent = "";
    renderBookingDays();
    renderBookingSlots();
    updateBookingSummary();

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    if (!tutor.isLive) {
        booking.loadingAvailability = false;
        renderBookingDays();
        renderBookingSlots();
        updateBookingSummary();
        return;
    }

    var tutorId = tutor.id;

    fetch("/api/tutors/" + encodeURIComponent(tutorId) + "/availability")
        .then(async function (response) {
            var data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Availability request failed.");
            }
            if (!Array.isArray(data)) {
                throw new Error("Unexpected availability response.");
            }
            return data;
        })
        .then(function (data) {
            availabilitySessions[tutorId] = data;
        })
        .catch(function (error) {
            console.error("Unable to load tutor availability:", error);
            availabilitySessions[tutorId] = [];
            if (booking.tutor && booking.tutor.id === tutorId) {
                document.getElementById("booking-message").textContent =
                    "Could not load availability. Please refresh and try again.";
            }
        })
        .finally(function () {
            if (!booking.tutor || booking.tutor.id !== tutorId) return;
            booking.loadingAvailability = false;
            renderTutors();
            renderBookingDays();
            renderBookingSlots();
            updateBookingSummary();
        });
}

function setUpBooking() {
    var nameInput = document.getElementById("booking-name");
    var emailInput = document.getElementById("booking-email");
    var confirmButton = document.getElementById("booking-confirm");
    var message = document.getElementById("booking-message");

    nameInput.addEventListener("input", function () {
        if (booking.tutor) updateBookingSummary();
    });

    emailInput.addEventListener("input", function () {
        if (booking.tutor) updateBookingSummary();
    });

    confirmButton.addEventListener("click", async function () {
        if (booking.submitting || booking.completed) return;

        var tutor = booking.tutor;
        var session = booking.session;
        var studentName = nameInput.value.trim();
        var email = emailInput.value.trim().toLowerCase();

        if (!tutor || !tutor.isLive) {
            message.textContent = "Please select a live tutor.";
            return;
        }

        if (!session || Number(session.availability_id) <= 0) {
            message.textContent = "Please select an available session.";
            return;
        }

        if (!studentName) {
            message.textContent = "Please enter your name.";
            nameInput.focus();
            return;
        }

        if (!email || !emailInput.checkValidity()) {
            message.textContent = "Please enter a valid email address.";
            emailInput.focus();
            return;
        }

        booking.submitting = true;
        confirmButton.disabled = true;
        message.textContent = "Submitting your booking...";

        try {
            // Find an existing student or register a new one.
            var studentResponse = await fetch("/api/students", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    student_name: studentName,
                    email: email,
                    preferred_language: "English",
                    lookup: true
                })
            });

            var studentData = await studentResponse.json();

            if (!studentResponse.ok) {
                throw new Error(
                    studentData.error || "Could not register or find the student."
                );
            }

            var studentId = Number(studentData.student_id);

            if (!Number.isInteger(studentId) || studentId <= 0) {
                throw new Error("The server returned an invalid student ID.");
            }

            // Submit the selected Oracle availability record.
            var bookingResponse = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    student_id: studentId,
                    availability_id: Number(session.availability_id)
                })
            });

            var bookingData = await bookingResponse.json();

            if (!bookingResponse.ok) {
                throw new Error(
                    bookingData.error || "The booking could not be completed."
                );
            }

            if (bookingData.booking_status !== "Confirmed") {
                throw new Error("The server did not confirm the booking.");
            }

            booking.completed = true;

            message.textContent =
                "Booking confirmed! Booking ID: " +
                bookingData.booking_id +
                ". Your session is reserved.";

            confirmButton.disabled = true;

        } catch (error) {
            console.error("Booking submission failed:", error);

            message.textContent =
                error.message || "Booking failed. Please try again.";

        } finally {
            booking.submitting = false;

            if (!booking.completed && booking.tutor) {
                updateBookingSummary();
            }
        }
    });
}
// Convert a real Flask API tutor into the format used by the existing cards.
function mapLiveTutorFromApi(item) {
    return {
        id: Number(item.tutor_id),
        name: item.tutor_name,
        title: item.subject_name + " tutor",
        experienceYears: Number(item.experience_years || 0),
        area: "Location not provided",
        hourlyFee: Number(item.hourly_rate || 0),
        subjects: item.subject_name ? [item.subject_name] : [],
        languages: item.language ? [item.language] : [],
        isLive: true,
        bio: item.bio || ""
    };
}
document.addEventListener("DOMContentLoaded", async function () {
    var status = document.getElementById("tutor-js-status");
    var count = document.getElementById("result-count");

    if (status) {
        status.textContent = "Loading tutors from LearnPath...";
    }

    try {
        var response = await fetch("/api/tutors");

        if (!response.ok) {
            throw new Error("Tutor API returned HTTP " + response.status);
        }

        var data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Unexpected tutor API response format.");
        }

        TUTORS = data.map(mapLiveTutorFromApi);

        // No fake availability is supplied for live API tutors.
        TUTORS.forEach(function (tutor) {
            AVAILABILITY[tutor.id] = { days: [], slots: [] };
        });

        if (status) {
            status.textContent = "Live tutor data loaded.";
        }

        setUpFilters();
        setUpBooking();
        renderTutors();
    } catch (error) {
        console.error("Unable to load live tutors:", error);

        if (status) {
            status.textContent = "Could not load tutors. Please refresh and try again.";
        }
        if (count) {
            count.textContent = "Tutor data is currently unavailable.";
        }
    }
});



