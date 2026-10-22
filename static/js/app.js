// This file is loaded on the Online Learning page only.
document.addEventListener("DOMContentLoaded", function () {
    const subjectSelect = document.getElementById("subject");
    const topicSelect = document.getElementById("topic");
    const findResourcesButton = document.getElementById("find-resources-button");
    const learningResults = document.getElementById("learning-results");
    const saveProgressButton = document.getElementById("save-progress-button");
    const progressMessage = document.getElementById("progress-message");
    const ratingMessage = document.getElementById("rating-message");
    const stars = document.querySelectorAll(".star-rating .star");

    // Temporary topic lists for the current prototype.
    // The video API accepts topic_id, so the selected topic text is sent as a query fallback
    // only if the Flask endpoint supports it. The backend should ideally return database topic IDs.
    const subjectTopics = {
         "DSA": [
        { id: 1, name: "Arrays and Linked Lists" },
        { id: 2, name: "Stacks and Queues" },
        { id: 3, name: "Trees and Binary Search Trees" },
        { id: 4, name: "Graph Algorithms" }
    ],
    "DBMS": [
        { id: 5, name: "ER Model and Relational Model" },
        { id: 6, name: "SQL and Joins" },
        { id: 7, name: "Normalization" },
        { id: 8, name: "Transactions and Concurrency Control" }
    ],
    "OS": [
        { id: 9, name: "Introduction to Operating Systems" },
        { id: 10, name: "Process Management and Scheduling" },
        { id: 11, name: "Memory Management" },
        { id: 12, name: "Deadlocks and Synchronization" }
    ],
    "COA": [
        { id: 13, name: "Number Systems and Data Representation" },
        { id: 14, name: "Boolean Algebra and Logic Gates" },
        { id: 15, name: "CPU Pipelining" },
        { id: 16, name: "Cache and Memory Hierarchy" }
    ],
    };
        
    if (!subjectSelect || !topicSelect || !findResourcesButton || !learningResults) {
        console.error("LearnPath: One or more required HTML elements were not found.");
        return;
    }

    subjectSelect.addEventListener("change", function () {
    const selectedSubject = subjectSelect.value;
    const topics = subjectTopics[selectedSubject] || [];

    topicSelect.innerHTML = '<option value="">Choose a topic</option>';
    
    topics.forEach(function (topic) {
        const option = document.createElement("option");
        option.value = topic.id;
        option.textContent = topic.name;
        topicSelect.appendChild(option);
    });

    topicSelect.disabled = topics.length === 0;
    console.log("Selected subject:", selectedSubject);
    console.log("Topics loaded:",topics.length);
    });
    // Populate topics if a subject is already selected when the page loads.
    const initialSubject = subjectSelect.value;
    if (initialSubject) {
        subjectSelect.dispatchEvent(new Event("change"));
    }

    findResourcesButton.addEventListener("click", async function () {
        const subject = subjectSelect.value;
        const topicId = topicSelect.value;
        const topic = topicSelect.options[topicSelect.selectedIndex]?.textContent || "";
        const language = document.getElementById("language").value;
        const difficulty = document.getElementById("difficulty").value;

        if (!subject) {
            learningResults.textContent = "Please select a subject.";
            return;
        }
        if (!topicId) {
            learningResults.textContent = "Please select a topic.";
            return;
        }

        learningResults.textContent = "Searching for learning resources…";
        findResourcesButton.disabled = true;

        try {
            // Existing backend may require topic_id. We pass topic_name as well so the
            // Flask route can support name lookup without hardcoding a potentially wrong ID.
            const params = new URLSearchParams({
                topic_id: topicId,
                language: language,
                difficulty: difficulty
            });
            const response = await fetch("/api/videos?" + params.toString());
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Unable to load learning resources.");
            }

            const videos = data.videos || [];
            learningResults.replaceChildren();
            if (videos.length === 0) {
                
                learningResults.textContent = "No videos were found. Try another language or topic.";
                
                return;
            }
            const heading = document.createElement("h2");
            heading.textContent = "Learning Resources: " + data.topic;
            learningResults.appendChild(heading);

            videos.forEach(function (video) {
                const card = document.createElement("div");
                card.className = "feature-card video-card";
                const title = document.createElement("h3");
                title.textContent = video.title ;
                card.appendChild(title);
                const channel = document.createElement("p");
                channel.textContent = "Channel: " + video.channel;
                card.appendChild(channel);
                
                const watchLink = document.createElement("a");
                watchLink.href = video.video_url ;
                watchLink.target = "_blank";
                watchLink.rel = "noopener noreferrer";
                watchLink.textContent = "Watch on YouTube";
                watchLink.style.display = "block";
                watchLink.style.margin = "10px 0";
                card.appendChild(watchLink);
                const player = document.createElement("iframe");
                player.src = video.embed_url;
                player.title = video.title;
                player.width = "100%";
                player.height = "315";
                player.style.border = "0";
                player.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                player.allowFullscreen = true;
                player.loading = "lazy";

                card.appendChild(player);
                learningResults.appendChild(card);
            });
        } catch (error) {
            console.error("Error fetching videos:", error);
            learningResults.textContent =
                "Unable to load learning resources. Please try again later.";
        } finally {
            findResourcesButton.disabled = false;
        }
    });

    if (saveProgressButton && progressMessage) {
    let confusingAttempts = {};

    saveProgressButton.addEventListener("click", async function () {
        const subject = subjectSelect.value;
        const topicId = topicSelect.value;
        const topic = topicSelect.options[topicSelect.selectedIndex]?.textContent || "";
        const status = document.getElementById("progress-topic").value;
        const feedback = document.getElementById("learning-feedback").value.trim();

        if (!subject || !topicId) {
            progressMessage.textContent = "Please select a subject and topic first.";
            return;
        }

        if (!status) {
            progressMessage.textContent = "Please select your topic status.";
            return;
        }

        const key = subject + "-" + topicId;

        if (status === "Confusing") {
            confusingAttempts[key] = (confusingAttempts[key] || 0) + 1;
        } else if (status === "Understood") {
            confusingAttempts[key] = 0;
        }

        
        saveProgressButton.disabled = true;
        saveProgressButton.textContent = "Saving Progress...";
        progressMessage.textContent = "";

        try {
            const response = await fetch("/api/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    topic_id: Number(topicId),
                    completion_status: status,
                    feedback: feedback
                })
            });

            const result = await response.json();

            if (!response.ok) {
                progressMessage.textContent =
                    result.error || "Unable to save progress.";
                return;
            }

            progressMessage.replaceChildren();
        } catch (error) {
            console.error("Error saving progress:", error);
            progressMessage.textContent =
                "Unable to save progress. Please try again.";
            return;
        } finally {
            saveProgressButton.disabled = false;
            saveProgressButton.textContent = "Save Progress";
        }


        const message = document.createElement("p");
        message.textContent = "Progress recorded for " + topic + ": " + status + ".";
        progressMessage.appendChild(message);

        if (feedback) {
            const feedbackMessage = document.createElement("p");
            feedbackMessage.textContent = "Your feedback: " + feedback;
            progressMessage.appendChild(feedbackMessage);
        }

        if (status === "Confusing") {
            const simplified = document.createElement("p");
            simplified.textContent =
                "Need an easier explanation? Try a simplified video for " + topic + ".";
            progressMessage.appendChild(simplified);

            const searchButton = document.createElement("button");
            searchButton.type = "button";
            searchButton.className = "mode-button online-button";
            searchButton.textContent = "Find Simplified Video";
            searchButton.addEventListener("click", async function () {
                const language = document.getElementById("language").value;
                searchButton.disabled = true;
                searchButton.textContent = "Finding a simpler video...";
                try{
                    const params = new URLSearchParams({
                    topic_id: topicId,
                    language: language,
                    difficulty: "Beginner"
                });

                    const response = await fetch("/api/videos?" + params.toString());
                    const data = await response.json();

                    if (!response.ok) {
                         throw new Error(data.error || "Could not find a video.");
                     }

                    const videos = data.videos || [];

                    if (videos.length === 0) {
                        const message = document.createElement("p");
                        message.textContent = "No simplified videos were found. Please try again later.";
                        progressMessage.appendChild(message);
                        return;
                    } 

                     const video = videos[0];

                     const videoSection = document.createElement("div");
                     videoSection.className = "feature-card simplified-video";

                     const heading = document.createElement("h3");
                     heading.textContent = "Simplified explanation: " + video.title;
                     videoSection.appendChild(heading);

                     const player = document.createElement("iframe");
                     player.src = video.embed_url;
                     player.title = video.title;
                     player.width = "100%";
                     player.height = "315";
                     player.style.border = "0";
                     player.allow =
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                     player.allowFullscreen = true;
                     player.loading = "lazy";
                     videoSection.appendChild(player);

                     const channel = document.createElement("p");
                     channel.textContent = "Video by: " + video.channel;
                     videoSection.appendChild(channel);

                     progressMessage.appendChild(videoSection);
                     searchButton.textContent = "Simplified video loaded";

                 } catch (error) {
                    searchButton.textContent = "Try Simplified Video";
                    const message = document.createElement("p");
                    message.textContent = "Unable to load the video. Please try again.";
                    progressMessage.appendChild(message);
                } finally {
                    searchButton.disabled = false;
                }
         });
                progressMessage.appendChild(searchButton);

            if (confusingAttempts[key] >= 2) {
                const tutorMessage = document.createElement("p");
                tutorMessage.textContent =
                    "You're still finding this topic difficult. Consider getting help from an offline tutor.";
                progressMessage.appendChild(tutorMessage);

                const tutorLink = document.createElement("a");
                tutorLink.href = "/offline";
                tutorLink.className = "mode-button offline-button";
                tutorLink.textContent = "Explore Offline Tutors";
                progressMessage.appendChild(tutorLink);
                }
            }
        });
    }
    let selectedRating = 0;
    stars.forEach(function (star) {
        star.addEventListener("click", function () {
            selectedRating = Number(star.dataset.rating);
            stars.forEach(function (item) {
                item.classList.toggle("active", Number(item.dataset.rating) <= selectedRating);
            });
            if (ratingMessage) {
                ratingMessage.textContent = "You rated your learning experience " + selectedRating + " out of 5 stars.";
            }
        });
    });
});
