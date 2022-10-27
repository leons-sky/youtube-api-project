// link to live server: http://localhost:5500/index.html

// DOM header
header = document.querySelector("header");
const h2 = document.createElement("h2");
h2.innerHTML = "YouTube Database Query" + `<hr>`;
const input = document.createElement('input')
const searchBtn = document.createElement('button')
searchBtn.innerHTML = 'Search'
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
// function displayVideos(videos) {
//     for (let video of videos) {
//         const element = document.createElement("");

//     }
// }

// function search(input) {
//     getTrendingVideos().then(videos => {
//         let result = []

//         for (let video of videos) {
//             let title = video.snippet.title
//             let flag = false
//             if (title.includes(input)) {
//                 flag = true
//             }

//             let tags = video.snippet.tags
//             if (tag.includes(input)) {
//                 flag = true
//             }

//             let channelTitle = video.snippet.channelTitle
//             if (channelTitle.includes(input)) {
//                 flag = true
//             }

//             if (flag()) result.push(video)
//         }

//         displayVideos(result)
//     }).catch(err => {
//         console.error(err)
//     })
// }

// // link search to searchbar
// const searchBar = document.getElementById("search")
// searchBar.addEventListener("input", () => {
//     search(searchBar.value)
// })