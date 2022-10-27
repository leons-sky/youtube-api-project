// link to live server: http://localhost:5500/index.html

// DOM header
header = document.querySelector("header");
const h2 = document.createElement("h2");
h2.innerHTML = "YouTube Database Query" + `<hr>`;
const input = document.createElement('input')
const searchBtn = document.createElement('button')
searchBtn.innerHTML = 'Search'
// input.s
input.setAttribute('type', 'text')
input.setAttribute('placeholder', 'search')
h2.classList.add('header-styling')
input.classList.add('header-styling')
searchBtn.classList.add('header-styling')

header.append(input, searchBtn, h2);

// DOM main
main = document.querySelector("main");

// Appending

// Div containers
const div = document.createElement("div");
div.classList.add("parentCard");

const div2 = document.createElement("div");
div2.innerHTML = "div2";
div2.classList.add("childCard");

const div3 = document.createElement("div");
div3.innerHTML = "div3";
div3.classList.add("childCard2");

const div4 = document.createElement("div");
div4.innerHTML = "div4";
div4.classList.add("childCard3");

// Appending divs
div.append(div2, div3, div4);
main.append(div);

//add video cards to webpage
function displayVideos(videos) {
    console.log(videos)
    div.replaceChildren()
    for (let video of videos) {
        const element = document.createElement("article");
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
        div.append(element)


        like.addEventListener("click", () => {
            like.classList.toggle("greenButton")
        })
        // when clicked (event listener) function, add the button to a class list and toggle the color

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
        console.log(input)
        console.log(videos)
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
// link search to searchbar
input.addEventListener("input", () => {
    search(input.value)
})


// do suggested vide
