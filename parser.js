const searchInput = document.getElementById("search");
let links = document.getElementsByClassName("link");
searchInput.addEventListener("input", ()=>{
    const search = searchInput.value;
    if(search) {
        highlightBookmarks(search);
    } else {
        for(let i = 0; i < links.length; i++) {
            links[i].classList.remove("highlighted");
        }
    }
})

function highlightBookmarks(string) {
    if(links) {
        for(let i = 0; i < links.length; i++) {
            const linkText = links[i].textContent;
            if (linkText.includes(string)) {
                links[i].classList.add("highlighted");
            } else { 
                if(links[i].classList.contains("highlighted")) {
                    links[i].classList.remove("highlighted");
                }}
        }
    }
}

function parseInput(string) {
    const firstSpaceIndex = string.indexOf(" ");
    const command = string.slice(0, firstSpaceIndex);
    const argument = string.slice(firstSpaceIndex);
    console.log(command + " weehee " + argument);
}
