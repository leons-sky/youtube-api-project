let clientPromise = Promise.reject("Not ready");
let isSignedIn = false

{
    const CLIENT_ID = "475936740013-ff85n1pgbi3226foeeu8b0rudohgt4lb.apps.googleusercontent.com"
    const API_KEY = "AIzaSyBqJritqPtAKwD4j3bnWgnjcccgaumjzAk"
    let tokenClient, access_token, userData;
    let signInButton, signOutButton;

    gapi.load("client")

    function isLocalhost() {
        return ["localhost", "127.0.0.1"].includes(window.location.hostname)
    }

    function loadClient(token) {
        console.log("load client")

        if (isLocalhost()) {
            gapi.client.setApiKey(API_KEY)
        } else {
            gapi.client.setToken(token)
        }

        clientPromise = gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
            .then(() => console.log("GAPI client loaded for API"))
            .catch(err => console.error("Error loading GAPI client for API", err))
    }

    function googleLoaded() {
        let googleAccountBar = document.querySelector("#google-account")

        if (isLocalhost()) {
            const message = document.createElement("h3")
            message.append("Functionality is limited on localhost")
            googleAccountBar.append(message)

            loadClient()
        } else {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                prompt: "consent",
                scope: "https://www.googleapis.com/auth/youtube.readonly \ https://www.googleapis.com/auth/youtube.force-ssl",
                callback: (res) => {
                    console.log("Success:", res)
                    signInButton.classList.add("hide")
                    signOutButton.classList.remove("hide")
                    access_token = res.access_token
                    console.log(res)
                    loadClient(res)
                },
                error_callback: (err) => {
                    console.error("Error:", err)
                }
            });

            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: (res) => {
                    let decoded = jwt_decode(res.credential)
                    userData = decoded
                    console.log(userData)

                    getConsent()
                }
            })
            google.accounts.id.renderButton(googleAccountBar, {
                type: "standard",
                theme: "filled_blue",
                size: "medium",
                text: "signin",
                logo_alignment: "left"
            })
            google.accounts.id.prompt()

            signInButton = googleAccountBar.querySelector("div")
            signOutButton = document.createElement("button")
            signOutButton.classList.add("hide")
            signOutButton.append("Revoke Consent")
            googleAccountBar.append(signOutButton)

            signOutButton.addEventListener("click", revokeConsent)
        }
    }

    function getConsent() {
        tokenClient.requestAccessToken({
            hint: userData.email
        })
    }

    function revokeConsent() {
        clientPromise.then(() => {
            if (!access_token) return;

            google.accounts.oauth2.revoke(access_token, () => {
                access_token = null
                clientPromise = Promise.reject("Not ready")
                clientPromise.catch(() => { })

                signInButton.classList.remove("hide")
                signOutButton.classList.add("hide")
            })
        }).catch(() => { })
    }

    window.googleLoaded = googleLoaded
}

function _makeRequest(callback) {
    return new Promise(async (resolve, reject) => {
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

function getVideoIds(videos) {
    let videoIds = []
    for (let video of videos) {
        videoIds.push(video.id)
    }
    return videoIds
}

function getRatings(videoIds) {
    return _makeRequest((resolve, reject) => {
        if (isLocalhost()) reject("Not available on localhost");

        gapi.client.youtube.videos.getRating({
            "id": videoIds
        })
            .then(response => {
                resolve(response.result.items)
            })
            .catch(reject)
    })
}

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