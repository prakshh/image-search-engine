const apiKey = "Vb9TB08blFdJy5A4K7xbdWGS1bBQCwAX8o6vayNwGrTO6KSFMu3F3Z9F";  // https://www.pexels.com/api/ 
const perPage = 15;
let currentPage = 1;    // Later, will increment the currentPage on 'Load More' button click                                                              

const getImages = (apiURL) => {
    // Fetching images by API call with authrization header
    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        console.log(data); 
    })
}

//https://www.pexels.com/api/documentation/#photos-curated
//getImages(`https://api.pexels.com/v1/curated?per_page=1`);
getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);