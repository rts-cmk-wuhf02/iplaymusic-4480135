let authToken;

let observer;

// Data
let dataPlaylists;
let dataTracks = [];

let currentPlaylist = -1;

// DOM
const featuredContainerDom = document.getElementById("featured-container");

const templateFeaturedItemDom = document.getElementById("template-featured-item");

// Fetch shorthand function
async function fetchData(resource) {
    return await fetch("https://api.spotify.com/v1/" + resource, {
        headers: {
            Authorization: "Bearer " + authToken
        },
        method: "GET"
    }).then(data => data.json());
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
    // Get the featured albums
    fetchData("browse/new-releases?country=SE&limit=4").then(function(albums) {
        const albumItems = albums.albums.items;

        featuredContainerDom.innerHTML = "";

        observer = new IntersectionObserver(function (entries) {
            entries.forEach(entry => {
                if(entry.target.getAttribute("data-loaded") !== true && entry.isIntersecting) {
                    entry.target.setAttribute("data-loaded", "true");
                    entry.target.querySelector(".featured-item").style = `background-image: url("${entry.target.getAttribute("data-src")}");`;
                }
            });
        }, {
            root: null, // avoiding 'root' or setting it to 'null' sets it to default value: viewport
            rootMargin: '0px',
            threshold: 0
        });

        for(let i = 0; i < albumItems.length; i++) {
            const albumElement = templateFeaturedItemDom.content.cloneNode(true);
            
            albumElement.querySelector(".item-link").href = "/album_details/?id=" + albumItems[i].id;
            albumElement.querySelector(".item-title").textContent = albumItems[i].name;
            albumElement.querySelector(".item-subtitle").textContent = albumItems[i].artists[0].name;
            
            featuredContainerDom.appendChild(albumElement);
            

            const albumDom = featuredContainerDom.children[featuredContainerDom.children.length - 1];
            albumDom.setAttribute("data-src", albumItems[i].images[0].url);

            observer.observe(albumDom);
        }

        document.querySelector("#loader").remove();
    });
}