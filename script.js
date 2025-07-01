let catPic = document.getElementById("cat");
let bookmarkWindow = document.getElementById("bookmarks-window");
const savedBookmarks = localStorage.getItem('bookmarks');
const bookmarkList = savedBookmarks ? JSON.parse(savedBookmarks) : [];
const savedFolders = localStorage.getItem('folders');
const folderList = savedFolders ? JSON.parse(savedFolders) : [];
let targetFolder;
let selectedFolder;

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

function displayBookmarks() {
    bookmarkWindow.innerHTML = "";
    for (const folder of folderList) {      
      const folderContainer = document.createElement("div");
      folderContainer.classList.add("folder");
      const folderName = document.createElement("h2");
      folderName.textContent = `${folder}`;
      folderContainer.appendChild(folderName);
      bookmarkList.forEach((bookmark) => {
        if(bookmark.folder === folder) {
          let link = document.createElement("a");
          link.textContent = `/${bookmark.name}`;
          link.href = bookmark.url;
          folderContainer.appendChild(link);
          }
      })
      bookmarkWindow.appendChild(folderContainer);        
    }

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

function bookmarkInput() {
  const bookmarkName = document.createElement("input");
  bookmarkName.type = "text";
  bookmarkName.placeholder = "Bookmark name";
  const bookmarkURL = document.createElement("input");
  bookmarkURL.type = "text";
  bookmarkURL.placeholder = "Bookmark URL";
  const bookmarkFolder = document.createElement("input");
  bookmarkFolder.placeholder = "Folder: "
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add bookmark";
  bookmarkWindow.appendChild(bookmarkName);
  bookmarkWindow.appendChild(bookmarkURL);
  bookmarkWindow.appendChild(bookmarkFolder);
  bookmarkWindow.appendChild(addBtn);
  addBtn.addEventListener ("click", ()=>{
    const nameInput = bookmarkName.value;
    const urlInput = bookmarkURL.value;
    const folderInput = bookmarkFolder.value;
  addBookmark(nameInput, urlInput, folderInput);
  })
}

function addBookmark(name, url, folder) {
    const length = bookmarkList.length;
    console.log(bookmarkList);
    const bookmark = {
      name: name,
      url: url,
      folder: folder,
      index: length
    }
    if (!folderList.includes(folder)) {
      folderList.push(folder);
    }
    bookmarkList.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkList));
    localStorage.setItem('folders', JSON.stringify(folderList));
    displayBookmarks();

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
/*
folderMenu.addEventListener('click', (e)=>{
    if(e.target.closest(".bookmark-folder")) { 
        if (targetFolder) {
            targetFolder.classList.toggle("selected");
        }
        targetFolder = e.target.closest(".bookmark-folder");
        targetFolder.classList.add("selected");
        selectedFolder = targetFolder.id;
        changeWindow(selectedFolder);
    }
})
*/

getCat();
