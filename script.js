const imagesWrapper = document.querySelector(".images");

const apiKey = "Vb9TB08blFdJy5A4K7xbdWGS1bBQCwAX8o6vayNwGrTO6KSFMu3F3Z9F";  // https://www.pexels.com/api/ 
const perPage = 15;
let currentPage = 1;    // Later, will increment the currentPage on 'Load More' button click                                                              

const generateHTML = (images) => {
    // Making li of all fetched images and adding them to the existing image wrapper
    /* note:
            error: Uncaught (in promise) TypeError: Cannot read properties of null (reading 'innerHTML') at generateHTML
            reason: there was no dot (".images") in the line - const imagesWrapper = document.querySelector("images"); 
    */
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
    // Fetching images by API call with authrization header
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        // console.log(data); 
        generateHTML(data.photos);
    })
}

//https://www.pexels.com/api/documentation/#photos-curated
//getImages(`https://api.pexels.com/v1/curated?per_page=1`);
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);