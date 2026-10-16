
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
