const getCookie = function(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

const iconContrastDom = document.querySelector("#icon-contrast");

document.addEventListener('DOMContentLoaded', function() {
    if(getCookie("light-theme") == "true") {
        document.body.classList.add("light-theme");
    }

    iconContrastDom.addEventListener('click', function() {
        if(getCookie("light-theme") != "true") {
            document.cookie = "light-theme=true";
            document.body.classList.add("light-theme");
        } else {
            document.cookie = "light-theme=false";
            document.body.classList.remove("light-theme");
        }
    });
});