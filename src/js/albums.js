let authToken;

let swiper;
let foundOne = false;

// Data
let dataPlaylists;
let dataTracks = [];

let currentPlaylist = -1;

// DOM
const swiperWrapperDom = document.querySelector(".swiper-wrapper");
const itemListDom = document.querySelector(".new-releases .item-list");

const templateItemDom = document.getElementById("template-item");
const templateSlideDom = document.getElementById("template-slide");

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
    fetchData("browse/new-releases?country=SE&limit=7").then(function(albums) {
        const albumItems = albums.albums.items;
        
        swiperWrapperDom.innerHTML = "";

        for(let i = 0; i < albumItems.length; i++) {
            const albumElement = templateSlideDom.content.cloneNode(true);

            albumElement.querySelector(".item-link").href = "/album_details/?id=" + albumItems[i].id;
            albumElement.querySelector(".item").style = `background-image: url("${albumItems[i].images[0].url}");`;


            swiperWrapperDom.appendChild(albumElement);
        }

        if(swiper == undefined) {
            swiper = new Swiper('.swiper-container', {
                slidesPerView: 3,
                spaceBetween: 15,
                freeMode: true
            });
        }

        if(foundOne) {
            document.querySelector("#loader").remove();
        } else {
            foundOne = true;
        }
    });

    // Get the new releases
    fetchData("browse/new-releases?country=SE").then(function(albums) {
        const albumItems = albums.albums.items;

        itemListDom.innerHTML = "";

        for(let i = 0; i < albumItems.length; i++) {
            const albumElement = templateItemDom.content.cloneNode(true);
            albumElement.querySelector(".item-title").textContent = albumItems[i].name;

            let artistsThis = "";
            for(let n = 0; n < albumItems[i].artists.length; n++) {
                artistsThis += albumItems[i].artists[n].name;

                if(n < albumItems[i].artists.length - 1) {
                    artistsThis += ", ";
                }
            }

            albumElement.querySelector(".item-subtitle").textContent = artistsThis;

            albumElement.querySelector(".item-link").href = "/album_details/?id=" + albumItems[i].id;
            albumElement.querySelector(".item-song-amount").textContent = albumItems[i].total_tracks + " Songs";
            albumElement.querySelector(".item-icon").style = `background-image: url("${albumItems[i].images[0].url}");`;


            itemListDom.appendChild(albumElement);
        }

        if(foundOne) {
            document.querySelector("#loader").remove();
        } else {
            foundOne = true;
        }
    });
}

function updateData() {
    
}