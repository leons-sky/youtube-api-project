const API_KEY = "AIzaSyBqJritqPtAKwD4j3bnWgnjcccgaumjzAk"
let login = Promise.reject("Not ready");

gapi.load("client:auth2", () => {
    gapi.client.setApiKey(API_KEY)
    login = gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(() => console.log("GAPI client loaded for API"))
        .catch(err => console.error("Error loading GAPI client for API", err))
});

function getTrendingVideos() {
    return new Promise(async (resolve, reject) => {
        while (true) {
            try {
                await login
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

getTrendingVideos()
    .then(console.log)
    .catch(console.error)