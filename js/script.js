const videosContainer = document.getElementById("videos")

//add video cards to webpage
function displayVideos(videos) {
    // console.log(videos)
    videosContainer.replaceChildren()

    for (let video of videos) {
        const element = document.createElement("article");
        element.classList.add("vidCard")

        const img = document.createElement("img")
        img.src = video.snippet.thumbnails.high.url
        const text = document.createElement("h3")
        //text.classList.add("videoText")
        text.append(video.snippet.title)
        text.classList.add("videoText")


        // creating the like button, establishing an event listener
        //when the button is triggered it turns green and back to white (toggle function)
        const like = document.createElement('button')
        //like.setAttribute("onclick",)
        like.append('Like')
        element.append(img, text, like)
        videosContainer.append(element)

        // when clicked (event listener) function, add the button to a class list and toggle the color
        like.addEventListener("click", () => {
            like.classList.toggle("greenButton")
        })

        img.addEventListener("click", () => {
            const url = "https://www.youtube.com/watch?v=" + video.id
            window.location.href = url;
        })
    }
}

// Cycles through array of top 50 trending videos.
function search(input) {
    getTrendingVideos().then(videos => {
        let result = []
        // console.log(input)
        // console.log(videos)
        // search function for relevance of title
        for (let video of videos) {
            let title = video.snippet.title
            let flag = false
            //search function should work when characters are in all cases
            if (title.toLowerCase().includes(input.toLowerCase())) {
                flag = true
            }
            //search function cycles through array of tags per video.
            //array can be 
            let tags = video.snippet.tags ?? []
            for (let tag of tags) {
                if (tag.toLowerCase().includes(input.toLowerCase())) {
                    flag = true
                }
            }

            let channelTitle = video.snippet.channelTitle
            if (channelTitle.toLowerCase().includes(input.toLowerCase())) {
                flag = true
            }

            if (flag) result.push(video)
        } console.log(result)

        displayVideos(result)
    }).catch(err => {
        console.log(err)
    })
}

search("")

// link search to searchbar
const searchBar = document.getElementById("search")
searchBar.addEventListener("input", () => {
    search(searchBar.value)
})


// do suggested videos
