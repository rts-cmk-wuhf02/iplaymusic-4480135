let authToken;

let swiper;

// Data
let dataPlaylists;
let dataTracks = [];

let currentPlaylist = -1;

// DOM
const swiperWrapperDom = document.querySelector(".swiper-wrapper");
const itemListDom = document.querySelector(".item-list");

const playlistTitleDom = document.querySelector(".playlist-title");

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
    // Get the featured playlists
    fetchData("browse/featured-playlists?country=SE&limit=10").then(function(playlists) {
        dataPlaylists = playlists;
        const playlistItems = playlists.playlists.items;

        swiperWrapperDom.innerHTML = "";
        dataTracks = [];
        
        for(let i = 0; i < playlistItems.length; i++) {
            const playlistElement = templateSlideDom.content.cloneNode(true);
            playlistElement.querySelector(".swiper-slide-image").style = `background-image: url("${playlistItems[i].images[0].url}");`;
            playlistElement.querySelector(".swiper-slide").setAttribute("playlist-id", i);

            swiperWrapperDom.appendChild(playlistElement);
            


            // Get tracks
            fetchData(`playlists/${playlistItems[i].id}/tracks`).then(function(tracks) {
                dataTracks.push(tracks);

                updateData();
            });
        }

        // Initialize swiper
        if(swiper == undefined) {
            swiper = new Swiper('.swiper-container', {
                slidesPerView: 2,
                spaceBetween: 0,
                loop: true,
                centeredSlides: true
            });

            setInterval(updateData, 50); // Temporary solution due to Swiper issue
        }

        document.querySelector("#loader").remove();
    });
}

function updateData() {
    if(currentPlaylist != swiper.realIndex) {
        let previousPlaylist = currentPlaylist;
        currentPlaylist = swiper.realIndex;
        const tracks = dataTracks[currentPlaylist];
        
        if(tracks) {
            itemListDom.innerHTML = "";
            
            playlistTitleDom.textContent = dataPlaylists.playlists.items[currentPlaylist].name;

            for(let i = 0; i < tracks.items.length; i++) {
                if(tracks.items[i].track !== null) {
                    const trackElement = templateItemDom.content.cloneNode(true);
                    trackElement.querySelector(".item-title").textContent = tracks.items[i].track.name;

                    let artistNames = "";
                    for(let n = 0; n < tracks.items[i].track.artists.length; n++) {
                        artistNames += tracks.items[i].track.artists[n].name;

                        if(n < tracks.items[i].track.artists.length - 1) {
                            artistNames += ", ";
                        }
                    }
                    trackElement.querySelector(".item-subtitle").textContent = artistNames;
                    trackElement.querySelector(".item-link").href = "/player/?id=" + tracks.items[i].track.id;

                    trackElement.querySelector(".item-length").textContent = msToMinutesAndSeconds(tracks.items[i].track.duration_ms);
                    itemListDom.appendChild(trackElement);
                }
            }
        } else {
            currentPlaylist = previousPlaylist;
        }
    }
}

function msToMinutesAndSeconds(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + ((seconds < 10) ? '0' : '') + seconds;
}