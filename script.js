let catPic = document.getElementById("cat");
let bookmarkWindow = document.getElementById("bookmarks-window");
let folders = document.getElementById("folders");
let targetFolder;

function getCat() {
  fetch("https://www.reddit.com/r/illegallysmolcats/hot.json")
    .then(response => response.json())
    .then(data => {
      const posts = data.data.children;
      const images = posts
        .map(post => post.data.url)
        .filter(url => url.endsWith(".jpg") || url.endsWith(".jpeg") || url.endsWith(".png"));

      if (images.length > 0) {
        const randomImage = images[Math.floor(Math.random() * images.length)];
        catPic.src = randomImage;
      } else {
        console.log("No cat images found");
      }
    })
    .catch(error => {
      console.error("Failed to fetch cats:", error);
    });
}
/*
function changeWindow(mode) {

    switch (mode) {
        if (bookmarkWindow.hasChildNodes) {
            bookmarkWindow.removeChild(bookmarkWindow.firstChild);
        }
        case folder:
            
            break;
        
        case addBookmark:

            break;

        default:
            break;
    }
}

function addBookmark() {

}
*/
folders.addEventListener('click', (e)=>{
    console.log("activity happening...")
    console.log(e.target);
    if(e.target.closest("#bookmark-folder")) { 
        if (targetFolder) {
            targetFolder.classList.toggle("selected");
        }
        targetFolder = e.target;
        targetFolder.classList.add("selected");
        console.log("folder picked!");
    }
})


getCat();
