const items = document.querySelectorAll(".load-item");

let time = 0.25;
items.forEach(function(el) {
    el.style.animationDelay = time + "s";
    time += 0.25;
});