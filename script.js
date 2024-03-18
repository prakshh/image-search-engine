const imagesWrapper = document.querySelector(".images");    
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box input");
const lightbox = document.querySelector(".lightbox");
const closeBtn = document.querySelector(".uil-times");


/* note:
        error: Uncaught (in promise) TypeError: Cannot read properties of null (reading 'innerHTML') at generateHTML
        reason: there was no dot (".images") in the line - const imagesWrapper = document.querySelector("images"); 
*/

// API key, paginations and searchTerm variables
const apiKey = "Vb9TB08blFdJy5A4K7xbdWGS1bBQCwAX8o6vayNwGrTO6KSFMu3F3Z9F";  // https://www.pexels.com/api/ 
const perPage = 15;
let currentPage = 1;    // Later, will increment the currentPage on 'Load More' button click  
let searchTerm = null;    

//converting received img to blob, creating its download link, & downloading it
const downloadImg = (imgURL) => {
    //console.log(imgURL);      //get the image URL of selected image to download
    fetch(imgURL).then(res => res.blob()).then(file => {
        //console.log(file);      //get the blob object of image
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);     //URL.createObjectURL creates URL of passed object
        a.download = new Date().getTime();      //passing current time in miliseconds as <a> download value   
        a.click();
    }).catch(() => alert("Failed to download image!"));
}

// zoom/show selected image and photographer's name
const showLightbox = (name, img) => {
    lightbox.querySelector("img").src = img;            //setting img source
    lightbox.querySelector("span").innerText = name;    //setting photographer's name source
    lightbox.classList.add("show"); // this will change the class name from lightbox to lightbox.show when clicked on an image
}

// hide the lightbox on close btn click
const hideLightbox = () => {
    lightbox.classList.remove("show");
}

const generateHTML = (images) => {
    // Making li of all fetched images and adding them to the existing image wrapper
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}')">
                    <i class="uil uil-import"></i>
                </button>
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
    }).catch(() => alert("Failed to load images!"));    // showing an alert if API failed with any reason
}

const loadMoreImages = () => {
    currentPage++;  // increment currentPage by 1
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;

    //issue: when I searched for something ("mountains") and clicked Load More..., it showed the curated images (a random person) instead of the searched images
    //fix: if searchTerm has some value, then call API with the search term, else call the default API
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    //issue: if the search input is empty, then error: Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'map') at generateHTML 
    //fix: if the search input is empty, set the search term to null and return from here
    if(e.target.value === "") return searchTerm = null;
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
closeBtn.addEventListener("click", hideLightbox);