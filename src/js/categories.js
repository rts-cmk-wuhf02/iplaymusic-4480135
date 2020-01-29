const coloursList = [
    "#D70060",
    "#E54028",
    "#F18D05",
    "#F2BC06",
    "#5EB11C",
    "#3A7634",
    "#0ABEBE",
    "#00A1CB",
    "#115793"
];


const categoryListDom = document.getElementsByClassName("category-list")[0];
const templateCategoryItemDom = document.getElementById("template-category-item");
const templateSubcategoryItemDom = document.getElementById("template-subcategory-item");

categoryListDom.addEventListener("click", function(e) {
    if(e.target.nextElementSibling !== null && e.target.classList.contains("category-item")) {
        if(e.target.nextElementSibling.style.display !== "none") {
            e.target.nextElementSibling.style.display = "none";
        } else {
            e.target.nextElementSibling.style = "";
        }
    }
});


let authToken;

let params = new URLSearchParams(window.location.search);

// Fetch shorthand function
async function fetchData(resource) {
    return await fetch("https://api.spotify.com/v1/" + resource, {
        headers: {
            Authorization: "Bearer " + authToken
        },
        method: "GET"
    }).then(data => data.json()).catch(err => console.log(err));
}

// Authentication
if((authToken = sessionStorage.getItem("spotify-token"))) {
    fetchData("browse/featured-playlists?country=SE&limit=1").then(function(data) {
        if(data.error) {
            console.log(data);
            authenticateClient();
        } else {
            showData();
        }
    });
} else {
    authenticateClient();
}

function authenticateClient() {
    const client_credentials = window.btoa(client_id + ":" + client_secret);

    fetch("https://accounts.spotify.com/api/token", {
    body: "grant_type=client_credentials",
    headers: {
        Authorization: "Basic " + client_credentials,
        "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST"
    }).then(data => data.json()).then(function(json) {
        authToken = json.access_token;
        sessionStorage.setItem("spotify-token", authToken);

        setTimeout(authenticateClient, json.expires_in * 100);
        
        showData();
    })
}

// Show data
function showData() {
    // Get the new releases
    fetchData("browse/categories").then(function(categories) {
        for(let i = 0; i < categories.categories.items.length; i++) {
            const categoryItemElement = templateCategoryItemDom.content.cloneNode(true);
            categoryItemElement.querySelector("li").setAttribute("data-id", i);
            categoryItemElement.querySelector(".category-item").style = "background-color: " + coloursList[Math.floor(Math.random() * coloursList.length)];
            categoryItemElement.querySelector(".category-item-name").innerText = categories.categories.items[i].name;

            categoryListDom.appendChild(categoryItemElement);
            const categoryId = i;

            fetchData("browse/categories/" + categories.categories.items[i].id + "/playlists").then(function(playlists) {
                console.log(playlists);
                if(playlists.error === undefined) {
                    const categoryItemDom = document.querySelector(".category-list > [data-id=\"" + categoryId + "\"] .subcategory-list");

                    for(let i = 0; i < playlists.playlists.items.length; i++) {
                        const subcategoryItemElement = templateSubcategoryItemDom.content.cloneNode(true);
                        subcategoryItemElement.querySelector(".subcategory-item-name").innerText = playlists.playlists.items[i].name;

                        categoryItemDom.appendChild(subcategoryItemElement);
                    }
                }
            });
        }

        document.querySelector("#loader").remove();
    });
}