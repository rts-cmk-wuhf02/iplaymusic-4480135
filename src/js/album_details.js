let authToken;

let params = new URLSearchParams(window.location.search);


// Data
let dataPlaylists;
let dataTracks = [];

let currentPlaylist = -1;

// DOM
const itemListDom = document.querySelector(".all-songs .item-list");
const bannerTagsListDom = document.getElementsByClassName("banner-tags")[0];

const templateItemDom = document.getElementById("template-item");
const templateGenreItemDom = document.getElementById("template-genre-item");

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
    // Get the new releases
    fetchData("albums/" + params.get("id")).then(function(album) {
        console.log(album);
        const albumItems = album.tracks.items;

        document.querySelector(".banner").style = `background-image: url('${album.images[0].url}');`;
        document.querySelector(".banner-title").textContent = album.name;
        document.querySelector(".banner-songs").textContent = album.total_tracks + " Songs";

        fetchData("artists/" + album.artists[0].id).then(function(artist) {
            for(let i = 0; i < artist.genres.length; i++) {
                const albumElement = templateGenreItemDom.content.cloneNode(true);
                albumElement.querySelector(".item").textContent = "#" + artist.genres[i];
    
                bannerTagsListDom.appendChild(albumElement);
            }
        });


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

            albumElement.querySelector(".item-link").href = "/player/?id=" + albumItems[i].id;
            albumElement.querySelector(".item-length").textContent =  msToMinutesAndSeconds(albumItems[i].duration_ms);


            itemListDom.appendChild(albumElement);
        }
    });
}

function msToMinutesAndSeconds(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + ((seconds < 10) ? '0' : '') + seconds;
}