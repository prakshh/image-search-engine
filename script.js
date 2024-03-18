const imagesWrapper = document.querySelector(".images");    
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
/* note:
        error: Uncaught (in promise) TypeError: Cannot read properties of null (reading 'innerHTML') at generateHTML
        reason: there was no dot (".images") in the line - const imagesWrapper = document.querySelector("images"); 
*/

// API key, paginations and searchTerm variables
const apiKey = "Vb9TB08blFdJy5A4K7xbdWGS1bBQCwAX8o6vayNwGrTO6KSFMu3F3Z9F";  // https://www.pexels.com/api/ 
const perPage = 15;
let currentPage = 1;    // Later, will increment the currentPage on 'Load More' button click  
let searchTerm = null;                                                            

const generateHTML = (images) => {
    // Making li of all fetched images and adding them to the existing image wrapper
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button><i class="uil uil-import"></i></button>
            </div>
        </li>`
    ).join("");
}
const getImages = (apiURL) => {
    // Fetching images by API call with authorization header
    loadMoreBtn.innerText = "Loading...";           // changing button state to Loading... while image is fetching
    loadMoreBtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        // console.log(data); 
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More";        // once data has been fetched, will change button state back to normal
        loadMoreBtn.classList.remove("disabled");
    })
}

const loadMoreImages = () => {
    currentPage++;  // increment currentPage by 1
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    // if pressed key is Enter, then update currentpage, searchTerm and call the getImages
    if(e.key === "Enter") {
        //console.log("Enter key pressed");
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);      //https://www.pexels.com/api/documentation/#photos-search
    }
}

//https://www.pexels.com/api/documentation/#photos-curated
//getImages(`https://api.pexels.com/v1/curated?per_page=1`);
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);