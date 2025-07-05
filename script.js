let catPic = document.getElementById("cat");
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
  bookmarkWindow.classList.toggle("list");
  const form = document.createElement("div");
  form.classList.add("form");
  const formInput = document.createElement("div");
  formInput.classList.add("form-input");
  const formButtons = document.createElement("div");
  formButtons.classList.add("form-buttons");
  const bookmarkName = document.createElement("input");
  bookmarkName.classList.add("input-field");
  bookmarkName.type = "text";
  bookmarkName.placeholder = "name";
  const bookmarkURL = document.createElement("input");
  bookmarkURL.classList.add("input-field");
  bookmarkURL.type = "text";
  bookmarkURL.placeholder = "URL";
  const folderSuggestions = document.createElement("datalist");
  folderSuggestions.id = "suggestions";
  for (let i = 0; i < folderList.length; i++) {
    const suggestion = document.createElement("option");
    suggestion.value = folderList[i];
    folderSuggestions.appendChild(suggestion);
    console.log(suggestion);
  }
  console.log(folderSuggestions);
  const bookmarkFolder = document.createElement("input");
  bookmarkFolder.classList.add("input-field");
  bookmarkFolder.placeholder = "folder";
  bookmarkFolder.setAttribute("list", "suggestions");
  const addBtn = document.createElement("button");
  addBtn.classList.add("add-button");
  addBtn.textContent = "save";
  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("cancel-button");
  cancelBtn.textContent = "cancel";
  formInput.appendChild(bookmarkName);
  formInput.appendChild(bookmarkURL);
  formInput.appendChild(bookmarkFolder);
  formButtons.appendChild(addBtn);
  formButtons.appendChild(cancelBtn);
  form.appendChild(formInput);
  form.appendChild(formButtons);
  form.appendChild(folderSuggestions);
  bookmarkWindow.appendChild(form);
  addBtn.addEventListener ("click", ()=>{
    const nameInput = bookmarkName.value;
    const urlInput = bookmarkURL.value;
    const folderInput = bookmarkFolder.value;
  if(nameInput && urlInput && folderInput) {
    addBookmark(nameInput, urlInput, folderInput);
    displayBookmarks();
  }
  })
  cancelBtn.addEventListener ('click', ()=>{displayBookmarks()});
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
