let authToken;

const audioObject = new Audio("/assets/audio/jingle_bells.mp3");
let isPlayingAudio = false;
const params = new URLSearchParams(window.location.search);


// DOM
const progressCoverDom = document.querySelector("#progress-cover");

// Data
let dataPlaylists;
let dataTracks = [];

let currentPlaylist = -1;

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
    // Get the tarck
    fetchData("tracks/" + params.get("id")).then(function(track) {
        console.log(track);

        document.getElementById("playing-icon").style = `background-image: url(${track.album.images[0].url});`;
        document.querySelector("main").style = `background-image: url(${track.album.images[0].url});`;
        document.getElementById("song-title").textContent = track.name;

        let artistName = "";
        for(let i = 0; i < track.artists.length; i++) {
            artistName += track.artists[i].name;

            if(i < track.artists.length - 1) {
                artistName += ", ";
            }
        }
        document.getElementById("artist-name").textContent = artistName;

        document.getElementById("song-length").textContent = msToMinutesAndSeconds(track.duration_ms);
    });
}

function msToMinutesAndSeconds(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + ((seconds < 10) ? '0' : '') + seconds;
}

function secondsToMinutes(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secondsTotal = Math.floor((seconds % 60)).toFixed(0);
    return minutes + ":" + ((secondsTotal < 10) ? '0' : '') + secondsTotal;
}

document.querySelector("#play-song-button").addEventListener("click", function() {
    if(!isPlayingAudio) {
        audioObject.play();
        isPlayingAudio = true;
        document.getElementById("song-length").textContent = secondsToMinutes(audioObject.duration);
    } else {
        audioObject.pause();
        isPlayingAudio = false;
    }
});

audioObject.addEventListener("timeupdate", function() {
    progressCoverDom.style.left = ((100 / audioObject.duration) * audioObject.currentTime) + "%";
});