const videosContainer = document.getElementById("videos")

//add video cards to webpage
function displayVideos(videos) {
    // Put stats here-FB
    // console.log(videos)
    let ratingsPromise = !isLocalhost() ? getRatings(getVideoIds(videos)) : Promise.resolve({})

    ratingsPromise.then(ratings => {
        videosContainer.replaceChildren()
        // console.log(ratings)
        for (let video of videos) {
            const element = document.createElement("article");
            element.classList.add("vidCard")

            const infoSection = document.createElement("section")

            const videoUrl = "https://www.youtube.com/watch?v=" + video.id

            //adding the img to card. img's from snippet array 
            const img = document.createElement("img")
            img.src = (video.snippet.thumbnails.maxres ?? video.snippet.thumbnails.high).url
            img.title = videoUrl
            const text = document.createElement("h3")

            //text.classList.add("videoText")
            text.append(video.snippet.title)
            text.classList.add("videoText")

            // creating the like button, establishing an event listener
            const like = document.createElement('button')
            if (ratings[video.id] && ratings[video.id] == "like") {
                like.classList.add("isLiked")
                like.append('Liked')
            } else {
                like.append('Like')
            }

            // Creating section to appens comments,views and likes to in each card
            if (video.statistics) {
                const statsSection = document.createElement('section')
                const stats1 = document.createElement('p')
                const stats2 = document.createElement('p')
                const stats3 = document.createElement('p')
                statsSection.classList.add('statCard')

                stats1.innerHTML = (`Comment Count 💬: ${video.statistics.commentCount}`)
                stats2.innerHTML = (`View Count 👀: ${video.statistics.viewCount}`)
                stats3.innerHTML = (`Like Count 👌: ${video.statistics.likeCount}`)

                // Appending each stat to video card
                statsSection.append(stats1, stats2, stats3)
                infoSection.append(like, statsSection)
            } else {
                infoSection.append(like)
            }

            element.append(img, text, infoSection)
            videosContainer.append(element)

            //when the button is triggered it turns green and back to white (toggle function)
            like.addEventListener("click", () => {
                if (isLocalhost()) {
                    if (like.classList.contains("isLiked")) {
                        like.classList.remove("isLiked")
                        like.innerHTML = "Like"
                    } else {
                        like.classList.add("isLiked")
                        like.innerHTML = "Liked"
                    }
                } else {
                    likeVideo(video.id).then(() => {
                        like.classList.add("isLiked")
                        like.innerHTML = "Liked"
                    })
                }
            })

            //when img of video is clicked, it will create a link via const url, and add the video.id number
            img.addEventListener("click", () => {
                window.location.href = videoUrl;
            })
        }   //NEED TO FIND WAY TO ADD NEW WINDOW 
        // Styling search results (when searched)
    })
}

// link search to searchbar
const searchBar = document.getElementById("search")
// Have to press 'enter' to search
searchBar.addEventListener("keyup", (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
        search(searchBar.value)
    }
})

// Trending, coding and multiverse buttons at top
let tabs = {
    "Trending": getTrendingVideos,
    "Coding": () => searchForVideos("javascript"),
    "Multiverse": () => getVideosForChannel("UCXMyxRJz6CyhugwOxTEWRqg")
}
let currentTab = Object.keys(tabs)[0]

let tabsSection = document.getElementById("tabs")
for (let tab of Object.keys(tabs)) {
    let button = document.createElement("button")
    button.append(tab)
    tabsSection.append(button)
    button.addEventListener("click", () => {
        currentTab = tab
        search(searchBar.value)
    })
}

// Search function 
function search(input) {
    let getFunc = tabs[currentTab]
    if (!getFunc) return;

    //Infinitely yields for user to sign in
    getFunc().then(videos => {
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
        }
        //console.log(result)
        // if search is no true - result err 
        if (result.length === 0) {
            alert('No video can be found. Soz.')
            return
        }
        displayVideos(result)
    }).catch(err => {
        console.log(err)
    })
}

// If didn't have search, no cards will show up
search("")

// tried to have videos update live but it flickers and looks weird
// setInterval(() => {
//     search(searchBar.value)
// }, 3000)

const toggle = document.getElementById('theme-toggle');
toggle.addEventListener('click', toggleTheme);
const body = document.querySelector("body")

function toggleTheme() {
    body.classList.toggle('darkMode');
}

// POTENTIAL FUNCTIONALITY IDEAS:
// show list of liked videos, drop down menu 
