let catPic = document.getElementById("cat");
const newBookmark = document.getElementById("bookmark-input");
let bookmarkWindow = document.getElementById("bookmarks-window");
const addBookmarkBtn = document.getElementById("add-bookmark");
const removeBookmarkBtn = document.getElementById("remove-bookmark");
const savedBookmarks = localStorage.getItem('bookmarks');
const bookmarkList = savedBookmarks ? JSON.parse(savedBookmarks) : [];
const savedFolders = localStorage.getItem('folders');
const folderList = savedFolders ? JSON.parse(savedFolders) : [];
let targetFolder;
let selectedFolder;

function getCat() {
  fetch("https://www.reddit.com/r/pallascats/hot.json")
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
    folderName.classList.add("folder-name");
    folderName.textContent = `${folder}`;
    folderContainer.appendChild(folderName);
    bookmarkList.forEach((bookmark) => {
      if(bookmark.folder === folder) {
        let linkContainer = document.createElement("span");
        let link = document.createElement("a");
        link.textContent = `${bookmark.name}`;
        link.href = bookmark.url;
        linkContainer.classList.add("link");
        linkContainer.dataset.index = `${bookmark.index}`;
        linkContainer.appendChild(link);
        folderContainer.appendChild(linkContainer);
        }
    })
    bookmarkWindow.appendChild(folderContainer);        
  }

}

function addDeleteButton() {
  const links = document.getElementsByClassName("link");
  for (let i=0; i < links.length; i++) {
    let deleteBtn = document.createElement("p");
    deleteBtn.textContent= "✘";
    deleteBtn.dataset.index = links[i].dataset.index;
    deleteBtn.addEventListener('click', () => {
      removeBookmark(Number(deleteBtn.dataset.index));
      displayBookmarks();
    })
    links[i].appendChild(deleteBtn);
  }
}

function bookmarkInput() {
  bookmarkWindow.innerHTML="";
  newBookmark.classList.add("active");
  const bookmarkName = document.getElementById("bookmark-name");
  const bookmarkURL = document.getElementById("bookmark-url");
  const bookmarkFolder = document.getElementById("bookmark-folder");
  const addBtn = document.getElementById("add-button");
  const cancelBtn = document.getElementById("cancel-button");
  const folderSuggestions = document.createElement("datalist");
  folderSuggestions.id = "suggestions";
  for (let i = 0; i < folderList.length; i++) {
    const suggestion = document.createElement("option");
    suggestion.value = folderList[i];
    folderSuggestions.appendChild(suggestion);
  }
  newBookmark.append(folderSuggestions);
  addBtn.addEventListener ("click", ()=>{
    const nameInput = bookmarkName.value;
    const urlInput = bookmarkURL.value;
    const folderInput = bookmarkFolder.value;
  if(nameInput && urlInput && folderInput) {
    addBookmark(nameInput, urlInput, folderInput);
    bookmarkName.value = "";
    bookmarkURL.value = "";
    bookmarkFolder.value = "";
    newBookmark.classList.remove("active");
    displayBookmarks();
  }
  })
  cancelBtn.addEventListener ('click', ()=>{  
    bookmarkName.value = "";
    bookmarkURL.value = "";
    bookmarkFolder.value = "";  
    newBookmark.classList.remove("active");
    displayBookmarks()
  });
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
    if (bookmarkList) {
      bookmarkList.forEach(bookmark => {
        if (Number(bookmark.index) === i) {
          bookmarkList.splice(bookmarkList.indexOf(bookmark), 1);
        }       
      })

    updateArrayIndex(bookmarkList);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkList));
    }
    displayBookmarks();
    
}

addBookmarkBtn.addEventListener('click', ()=>{
  bookmarkWindow.textContent = "";
  bookmarkInput();
});

removeBookmarkBtn.addEventListener('click', () => {addDeleteButton();})

getCat();
displayBookmarks();
