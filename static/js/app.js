
function showModeMessage(mode) {
    const message = document.getElementById("mode-message");

    if (mode === "Online Learning") {
        message.textContent =
            "Online Learning selected! The YouTube learning module will be connected next.";
    } else {
        message.textContent =
            "Offline Learning selected! The tutor discovery and booking module will be connected next.";
    }
}


// Topics available for each subject
const subjectTopics = {
    "Python Programming": [
        "Python Basics",
        "Variables and Data Types",
        "Conditional Statements",
        "Loops",
        "Functions",
        "Lists and Tuples",
        "Object-Oriented Programming"
    ],

    "Data Structures": [
        "Introduction to Data Structures",
        "Arrays",
        "Linked Lists",
        "Stacks",
        "Queues",
        "Trees",
        "Graphs"
    ],

    "Database Management Systems": [
        "DBMS Basics",
        "ER Model",
        "Relational Model",
        "SQL Queries",
        "Normalization",
        "Transactions"
    ],

    "Operating Systems": [
        "Introduction to Operating Systems",
        "Process Management",
        "CPU Scheduling",
        "Deadlocks",
        "Memory Management",
        "File Systems"
    ],

    "Mathematics": [
        "Algebra",
        "Matrices",
        "Differentiation",
        "Integration",
        "Probability",
        "Statistics"
    ]
};

// Get the subject and topic dropdowns
const subjectSelect = document.getElementById("subject");
const topicSelect = document.getElementById("topic");

// Update topics when the subject changes
subjectSelect.addEventListener("change", function () {
    const selectedSubject = subjectSelect.value;

    topicSelect.innerHTML = '<option value="">Choose a topic</option>';

    if (selectedSubject && subjectTopics[selectedSubject]) {
        subjectTopics[selectedSubject].forEach(function (topic) {
            const option = document.createElement("option");

            option.value = topic;
            option.textContent = topic;

            topicSelect.appendChild(option);
        });
    }
});


// Handle the Find Learning Resources button
const findResourcesButton = document.getElementById("find-resources-button");
const learningResults = document.getElementById("learning-results");

findResourcesButton.addEventListener("click", function () {
    const subject = document.getElementById("subject").value;
    const topic = document.getElementById("topic").value;
    const language = document.getElementById("language").value;
    const difficulty = document.getElementById("difficulty").value;

    if (subject === "") {
        learningResults.textContent = "Please select a subject.";
        return;
    }

    if (topic === "") {
        learningResults.textContent = "Please select a topic.";
        return;
    }

    learningResults.textContent =
        "Your learning preferences have been selected successfully! " +
        "Subject: " + subject +
        " | Topic: " + topic +
        " | Language: " + language +
        " | Difficulty: " + difficulty +
        ". Learning resources will appear here once the backend API is connected.";
});

// Handle learning progress and feedback
const saveProgressButton = document.getElementById("save-progress-button");
const progressMessage = document.getElementById("progress-message");

saveProgressButton.addEventListener("click", function () {
    const subject = document.getElementById("subject").value;
    const topic = document.getElementById("topic").value;
    const status = document.getElementById("progress-topic").value;
    const feedback = document.getElementById("learning-feedback").value.trim();

    if (!subject || !topic) {
        progressMessage.textContent =
            "Please select a subject and topic first.";
        return;
    }

    if (!status) {
        progressMessage.textContent =
            "Please select your topic status.";
        return;
    }

    progressMessage.textContent =
        "Progress details are ready! " +
        "Subject: " + subject +
        " | Topic: " + topic +
        " | Status: " + status +
        (feedback ? " | Feedback: " + feedback : "") +
        ". Connect the backend to save these details permanently.";
});

// Handle star ratings
const stars = document.querySelectorAll(".star-rating .star");
const ratingMessage = document.getElementById("rating-message");

let selectedRating = 0;

stars.forEach(function (star) {
    star.addEventListener("click", function () {
        selectedRating = Number(star.dataset.rating);

        stars.forEach(function (item) {
            const rating = Number(item.dataset.rating);

            if (rating <= selectedRating) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        ratingMessage.textContent =
            "You rated your learning experience " +
            selectedRating + " out of 5 stars.";
    });
});