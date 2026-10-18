// Offline Tutor module script.

// SAMPLE DATA (made-up tutors).
// The team lead's backend/API will replace this list later.
var TUTORS = [
    { id: 1, name: "Ananya Raghavan", title: "Mathematics and Physics tutor", experienceYears: 6, area: "Katpadi, Vellore", hourlyFee: 400, subjects: ["Mathematics", "Physics"], languages: ["English", "Tamil"] },
    { id: 2, name: "Karthik Subramani", title: "Computer Science tutor", experienceYears: 4, area: "Gandhi Nagar, Vellore", hourlyFee: 500, subjects: ["Computer Science", "Mathematics"], languages: ["English", "Tamil", "Telugu"] },
    { id: 3, name: "Meera Nair", title: "Chemistry and Biology tutor", experienceYears: 8, area: "Anna Nagar, Chennai", hourlyFee: 450, subjects: ["Chemistry", "Biology"], languages: ["English", "Hindi", "Malayalam"] },
    { id: 4, name: "Farhan Sheikh", title: "English and Communication tutor", experienceYears: 5, area: "Katpadi, Vellore", hourlyFee: 350, subjects: ["English"], languages: ["English", "Hindi"] },
    { id: 5, name: "Lakshmi Priya", title: "Physics and Chemistry tutor", experienceYears: 7, area: "Sathuvachari, Vellore", hourlyFee: 420, subjects: ["Physics", "Chemistry"], languages: ["Tamil", "English"] },
    { id: 6, name: "Rohit Verma", title: "Mathematics tutor", experienceYears: 3, area: "T. Nagar, Chennai", hourlyFee: 300, subjects: ["Mathematics"], languages: ["Hindi", "English"] },
        { id: 7, name: "Divya Menon", title: "Mathematics tutor", experienceYears: 0, studentYear: "2nd year", area: "Katpadi, Vellore", hourlyFee: 250, subjects: ["Mathematics"], languages: ["Tamil", "English"] }
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

function buildCard(tutor) {
    var card = createEl("article", "tutor-card");
    card.setAttribute("data-tutor-id", tutor.id);

    var top = createEl("div", "tutor-card-top");
    top.appendChild(createEl("div", "tutor-avatar", getInitials(tutor.name)));
    var who = createEl("div", "tutor-card-who");
    who.appendChild(createEl("h3", "tutor-name", tutor.name));
    who.appendChild(createEl("p", "tutor-title", tutor.title));
    top.appendChild(who);
    card.appendChild(top);

    card.appendChild(createEl("p", "tutor-meta", experienceText(tutor) + " \u00B7 " + tutor.area));

    card.appendChild(createEl("p", "tutor-label", "Subjects"));
    card.appendChild(createChips(tutor.subjects, "subject-chip"));

    card.appendChild(createEl("p", "tutor-label", "Spoken languages"));
    card.appendChild(createChips(tutor.languages, "language-chip"));

    card.appendChild(createEl("p", "tutor-fee", "\u20B9" + tutor.hourlyFee + " per hour"));
    return card;
}

function matchesFilters(tutor, subject, language) {
    var subjectOk = subject === "" || tutor.subjects.indexOf(subject) !== -1;
    var languageOk = language === "" || tutor.languages.indexOf(language) !== -1;
    return subjectOk && languageOk;
}

function renderTutors() {
    var subject = document.getElementById("subject-filter").value;
    var language = document.getElementById("language-filter").value;
    var grid = document.getElementById("tutor-grid");
    var empty = document.getElementById("tutor-empty");
    var count = document.getElementById("result-count");

    grid.innerHTML = "";

    var shown = TUTORS.filter(function (tutor) {
        return matchesFilters(tutor, subject, language);
    });

    shown.forEach(function (tutor) {
        grid.appendChild(buildCard(tutor));
    });

    empty.hidden = shown.length !== 0;
    count.textContent = "Showing " + shown.length + " of " + TUTORS.length + " tutors";
}

function setUpFilters() {
    var subjectSelect = document.getElementById("subject-filter");
    var languageSelect = document.getElementById("language-filter");
    var clearButton = document.getElementById("clear-filters");

    fillSelect(subjectSelect, uniqueSorted("subjects"));
    fillSelect(languageSelect, uniqueSorted("languages"));

    subjectSelect.addEventListener("change", renderTutors);
    languageSelect.addEventListener("change", renderTutors);
    clearButton.addEventListener("click", function () {
        subjectSelect.value = "";
        languageSelect.value = "";
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