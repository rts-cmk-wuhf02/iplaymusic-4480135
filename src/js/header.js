document.addEventListener("DOMContentLoaded", function() {
    const backButtonDom = document.getElementById("back-button");

    backButtonDom.addEventListener("click", function() {
        window.history.back();
    });
});