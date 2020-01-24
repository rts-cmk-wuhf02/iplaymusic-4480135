let authToken;

let params = new URLSearchParams(window.location.search);


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