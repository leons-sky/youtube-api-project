const CLIENT_ID = "475936740013-ff85n1pgbi3226foeeu8b0rudohgt4lb.apps.googleusercontent.com"
const SECRET = "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"

const API_KEY = "AIzaSyBqJritqPtAKwD4j3bnWgnjcccgaumjzAk"
let clientPromise = Promise.reject("Not ready");
let isSignedIn = false

function signIn() {
    return gapi.auth2.getAuthInstance()
        .signIn({
            scope: "https://www.googleapis.com/auth/youtube.readonly"
        })
        .then(() => {
            isSignedIn = true
        })
}

function loadClient() {
    gapi.client.setApiKey(API_KEY)
    clientPromise = gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(() => console.log("GAPI client loaded for API"))
        .catch(err => console.error("Error loading GAPI client for API", err))
}

gapi.load("client:auth2", () => {
    gapi.auth2.init({ client_id: CLIENT_ID })
    loadClient()
});

function getTrendingVideos() {
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

//display all trending videos
getTrendingVideos()
    .then(console.log)
    .catch(console.error)