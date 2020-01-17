const getCookie = function(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

document.addEventListener('DOMContentLoaded', function() {
    if(getCookie("light-theme") == "true") {
        document.body.classList.add("light-theme");
    }
});