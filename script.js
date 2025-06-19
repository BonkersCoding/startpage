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

function changeWindow(mode) {
    const saved = localStorage.getItem('bookmarks');
    const bookmarkList = saved ? JSON.parse(saved) : [];
    bookmarkWindow.innerHTML = "";
    bookmarkList.forEach((bookmark) => {
      if(bookmark.folder === mode) {
      let link = document.createElement("a");
      link.textContent = `/${bookmark.name}`;
      link.href = bookmark.url;
      bookmarkWindow.appendChild(link);
      }
      })
}

function addBookmark(name, url, folder) {
    const saved = localStorage.getItem('bookmarks');
    const bookmarkList = saved ? JSON.parse(saved) : [];
    const i = bookmarkList.length;
    console.log(bookmarkList);
    const bookmark = {
      name: name,
      url: url,
      folder: folder,
      index: i
    }
    bookmarkList.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkList));
    changeWindow(folder);

}       

function updateArrayIndex(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr.length === 0) {
      break;
    }
    const element = arr[i];
    element.index = i;          
  }
}

function removeBookmark(i) {
    const saved = localStorage.getItem('bookmarks');
    const bookmarkList = saved ? JSON.parse(saved) : [];
    if (bookmarkList) {
      bookmarkList.forEach(bookmark => {
        if (Number(bookmark.index) === i) {
          bookmarkList.splice(bookmarkList.indexOf(bookmark), 1);
        }       
      })

    updateArrayIndex(bookmarkList);
    console.log(bookmarkList);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkList));
    changeWindow(targetFolder);
    }
    
}

folders.addEventListener('click', (e)=>{
    if(e.target.closest(".bookmark-folder")) { 
        if (targetFolder) {
            targetFolder.classList.toggle("selected");
        }
        targetFolder = e.target.closest(".bookmark-folder");
        targetFolder.classList.add("selected");
        let selectedFolder = targetFolder.id;
        changeWindow(selectedFolder);
    }
})


getCat();
