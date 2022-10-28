const videosContainer = document.getElementById("videos")

//add video cards to webpage
function displayVideos(videos) {
    // console.log(videos)
    videosContainer.replaceChildren()

    for (let video of videos) {
        const element = document.createElement("article");
        element.classList.add("vidCard")


        //adding the img to card. img's from snippet array 
        const img = document.createElement("img")
        img.src = video.snippet.thumbnails.maxres.url
        const text = document.createElement("h3")

        //text.classList.add("videoText")
        text.append(video.snippet.title)
        text.classList.add("videoText")

        // creating the like button, establishing an event listener
        const like = document.createElement('button')
        like.append('Like')
        element.append(img, text, like)
        div.append(element)

        //when the button is triggered it turns green and back to white (toggle function)
        like.addEventListener("click", () => {
            like.classList.toggle("greenButton")
        })
    
        //when img of video is clicked, it will create a link via const url, and add the video.id number
        img.addEventListener("click", () => {
            const url = "https://www.youtube.com/watch?v=" + video.id
            window.location.href = url;
        })
    }   //NEED TO FIND WAY TO ADD NEW WINDOW 
    // Styling search results (when searched)

} 
// Search function 
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
            //
            let tags = video.snippet.tags ?? []
            for (let tag of tags) {
                if (tag.toLowerCase().includes(input.toLowerCase())) {
                    flag = true
                }
            }
          //search function will function against the channel title array against all character cases.
            let channelTitle = video.snippet.channelTitle
            if (channelTitle.toLowerCase().includes(input.toLowerCase())) {
                flag = true
            }

            if (flag) result.push(video)
        } console.log(result)

        // if search is no true - result err 
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


// POTENTIAL FUNCTIONALITY IDEAS:
// Show total live likes (online + one local) on click 
// Show video in ordered flex grid
// display suggested videos when user logs in 
// show list of liked videos, drop down menu 
