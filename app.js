// Elementos da Funçao
const standForm = document.querySelector("#stand-form");
const standInput = document.querySelector("#stand-input")
const standList = document.querySelector("#stand-virtual")

//Funçao
const saveBook = (text) => {
    const stand = document.createElement("div");
    stand.classList.add("stand");

    const  bookTitle = document.createElement("h3");
    bookTitle.innerText = text;
    stand.appendChild(bookTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-stand")
    doneBtn.innerHTML =  '<i class="fa-solid fa-check"></i>'
    stand.appendChild(doneBtn)

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-stand")
    editBtn.innerHTML =  '<i class="fa-solid fa-pen"></i>'
    stand.appendChild(editBtn)

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-stand")
    deleteBtn.innerHTML =  '<i class="fa-solid fa-xmark"></i>'
    stand.appendChild(deleteBtn)

    standList.appendChild(stand);

    standInput.value = ""
};


// Açoes
standForm.addEventListener("submit", (e) =>{

    e.preventDefault();

    const inputValue = standInput.value;

    if(inputValue) {
        saveBook(inputValue);
    }
});