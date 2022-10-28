let clientPromise = Promise.reject("Not ready");
let isSignedIn = false

// used to check if we can log in to google accounts or if the API_KEY has to be used
function isLocalhost() {
    return ["localhost", "127.0.0.1"].includes(window.location.hostname)
}

{
    // Some constants that google needs
    const CLIENT_ID = "475936740013-ff85n1pgbi3226foeeu8b0rudohgt4lb.apps.googleusercontent.com"
    let tokenClient, access_token, userData;
    let signInButton, messageEl;

    // loads the youtube api using either your google account id or the project api key
    function loadClient(token) {
        console.log("load client")

        if (isLocalhost()) {
            gapi.client.setApiKey("AIzaSyBqJritqPtAKwD4j3bnWgnjcccgaumjzAk") // DO NOT STEAL :)
        } else {
            gapi.client.setToken(token)
        }

        // load the youtube api so that we can send requests
        clientPromise = gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
            .then(() => {
                messageEl.classList.add("hide")
                console.log("GAPI client loaded for API")
            })
            .catch(err => {
                messageEl.innerHTML = "An error has occured! Try reloading the page."
                messageEl.
                    console.error("Error loading GAPI client for API", err)
            })
    }

    // when the webpage loads and the google authentication client has loaded we can start
    function googleLoaded() {
        // Load the google api client onto the webpage
        gapi.load("client", () => {
            // get the div where the google signin button should be placed
            let googleAccountBar = document.querySelector("#google-account")
            messageEl = document.querySelector("#search-message")

            if (isLocalhost()) {
                // if we can't login to google then show this message
                const message = document.createElement("h3")
                message.append("Functionality is limited on localhost")
                googleAccountBar.append(message)

                // load the youtube client using the api key
                loadClient()
            } else {
                messageEl.innerHTML = "Please sign in!"
                messageEl.classList.remove("hide")
                // setup the google client for logging a user in
                tokenClient = google.accounts.oauth2.initTokenClient({
                    client_id: CLIENT_ID,
                    prompt: "consent",
                    scope: "https://www.googleapis.com/auth/youtube.readonly \ https://www.googleapis.com/auth/youtube.force-ssl",
                    callback: (res) => {
                        console.log("Success:", res)
                        signInButton.classList.add("hide")
                        // signOutButton.classList.remove("hide")
                        access_token = res.access_token
                        console.log(res)
                        loadClient(res)
                    },
                    error_callback: (err) => {
                        console.error("Error:", err)
                    }
                });

                // tell google what the project is and how we want to handle user data when we login
                google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: (res) => {
                        let decoded = jwt_decode(res.credential)
                        userData = decoded
                        console.log(userData)

                        getConsent()
                    }
                })
                // add the google signin button to the webpage
                google.accounts.id.renderButton(googleAccountBar, {
                    type: "standard",
                    theme: "filled_blue",
                    size: "medium",
                    text: "signin",
                    logo_alignment: "left"
                })
                // prompt the user to sign in when the page loads
                google.accounts.id.prompt()

                signInButton = googleAccountBar.querySelector("div")
            }
        })
    }

    // used to ask the user for consent to access their youtube account
    function getConsent() {
        tokenClient.requestAccessToken({
            hint: userData.email
        })
    }

    // used if the user no longer want the app the have access to their youtube account
    function revokeConsent() {
        clientPromise.then(() => {
            if (!access_token) return;

            google.accounts.oauth2.revoke(access_token, () => {
                access_token = null
                clientPromise = Promise.reject("Not ready")
                clientPromise.catch(() => { })

                signInButton.classList.remove("hide")
                // signOutButton.classList.add("hide")
            })
        }).catch(() => { })
    }

    window.googleLoaded = googleLoaded
}

// a general function for making a request to the youtube api
function _makeRequest(callback) {
    return new Promise(async (resolve, reject) => {
        // loops until sign in
        while (true) {
            try {
                await clientPromise
                break
            } catch (e) {
                if (e !== "Not ready") {
                    reject(e)
                    break
                }
                await new Promise(resolve => setTimeout(resolve, 500))
            }
        }

        callback(resolve, reject)
    })
}

// get the top 50 trending youtube videos for england
function getTrendingVideos() {
    return _makeRequest((resolve, reject) => {
        gapi.client.youtube.videos.list({
            "part": [
                "snippet,contentDetails,statistics"
            ],
            "chart": "mostPopular",
            "maxResults": 50,
            "regionCode": "GB"
        })
            .then(response => {
                resolve(response.result.items)
            })
            .catch(reject)
    })
}

// get the top 50 results for the query
function searchForVideos(query) {
    return _makeRequest((resolve, reject) => {
        gapi.client.youtube.search.list({
            "part": [
                "snippet"
            ],
            "maxResults": 50,
            "regionCode": "GB",
            "q": query,
            "type": [
                "video",
                "playlist"
            ]
        })
            .then(response => {
                resolve(response.result.items)
            })
            .catch(reject)
    })
}

function getVideosForChannel(channelId) {
    return _makeRequest((resolve, reject) => {
        gapi.client.youtube.search.list({
            "part": [
                "snippet"
            ],
            "maxResults": 50,
            "regionCode": "GB",
            "channelId": channelId,
            "type": [
                "video",
                "playlist"
            ]
        })
            .then(response => {
                resolve(response.result.items)
            })
            .catch(reject)
    })
}

// gets a list of all the video ids from a list of video objects
function getVideoIds(videos) {
    let videoIds = []
    for (let video of videos) {
        videoIds.push(video.id)
    }
    return videoIds
}

// get a list of video ratings
function getRatings(videoIds) {
    console.log("video ids", videoIds)
    return _makeRequest((resolve, reject) => {
        if (isLocalhost()) reject("Not available on localhost");

        gapi.client.youtube.videos.getRating({
            "id": videoIds
        })
            .then(response => {
                let map = {}
                console.log(response.result.items)
                for (let rating of response.result.items) {
                    map[rating.videoId] = rating.rating
                }
                resolve(map)
            })
            .catch(reject)
    })
}

// used to like a video
function likeVideo(videoId) {
    return _makeRequest((resolve, reject) => {
        if (isLocalhost()) reject("Not available on localhost");

        gapi.client.youtube.videos.rate({
            "id": videoId,
            "rating": "like"
        })
            .then(response => {
                resolve(true)
            })
            .catch(reject)
    })
}

//display all trending videos
// getTrendingVideos()
//     .then(videos => {
//         console.log(videos)
//         getRatings(getVideoIds(videos))
//             .then(ratings => {
//                 console.log(ratings)
//                 likeVideo(ratings[0].videoId).catch(console.error)
//             })
//             .catch(console.error)
//     })
//     .catch(console.error)
// console.log("Getting videos")