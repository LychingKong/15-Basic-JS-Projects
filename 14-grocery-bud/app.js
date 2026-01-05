// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert"); //  <p class="alert"></p>
const form = document.querySelector(".grocery-form"); //   <form class="grocery-form">
const submitBtn = document.querySelector(".submit-btn"); //  <button type="submit" class="submit-btn">Submit</button>
const container = document.querySelector(".grocery-container"); // <div class="grocery-container">
const list = document.querySelector(".grocery-list"); //    <div class="grocery-list"></div>
const clearBtn = document.querySelector(".clear-btn"); //   <button type="button" class="clear-btn">clear items</button>
const grocery = document.getElementById("grocery"); //  <input type="text" id="grocery" placeholder="e.g. eggs" />

// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********
// submit form
form.addEventListener("submit", addItem);

// clear item
clearBtn.addEventListener("click", clearItem);

// load items
window.addEventListener("DOMContentLoaded", setupItems);

// ****** FUNCTIONS **********

function addItem(e) {
  e.preventDefault();
  const value = grocery.value; // return the value of the input
  const id = new Date().getTime().toString(); // return a string of date time in ms

  // if have value & editFlag is false
  if (value && !editFlag) {
    createListItem(id, value);
    // display alert message
    displayAlert("item added to the list", "success");
    // show container ui
    container.classList.add("show-container");
    // add data to local storage
    addToLocalStorage(id, value);
    // set back to default state
    setBackToDefault();
    // if have value & editFlag is true
  } else if (value && editFlag) {
    editElement.innerHTML = value; // make the edited value, the value to be updated
    displayAlert("value changed", "success");
    // edit local storage
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

// display alert
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert after some time
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// set back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}

// clear items
function clearItem() {
  const items = document.querySelectorAll(".grocery-item"); // return all <article class="grocery-item"></article>
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item); // remove <article></article> from the list
    });
  }
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  localStorage.removeItem("list");
  setBackToDefault();
}

// delete function
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement; // return <article class="grocery-item" data-id="1231231"></article>
  const id = element.dataset.id; //  get the id from that <article> tag
  list.removeChild(element); // remove <article> from the list
  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  // remove from local storage
  removeFromLocalStorage(id);
}

// edit function
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement; // return <article class="grocery-item" data-id="1231231"></article>
  // set edit item
  editElement = e.currentTarget.parentElement.previousElementSibling; // return <p class="title">${value}</p>
  // set form value
  grocery.value = editElement.innerHTML; //  take the target edit value to display in the input form
  editFlag = true;
  editID = element.dataset.id; // get the id from <article class="grocery-item" data-id="1231231"></article>
  submitBtn.textContent = "edit"; // change from submit btn to edit btn
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value }; // object with id: id & value: value
  let items = getLocalStorage(); // check whether have previous item from local storage or not, and return an array of object
  items.push(grocery); // push grocery item to the array object
  localStorage.setItem("list", JSON.stringify(items)); // push the array object to local storage
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage(); // get array object from local storage
  items = items.filter(function (item) {
    // select only items that do not match the id of the delete item
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items)); // send the updated array object back to local storage
}

function editLocalStorage(id, value) {
  let items = getLocalStorage(); // get array object from local storage
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value; // set the previous value to the new value
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items)); // send the updated array object back to local storage
}

function getLocalStorage() {
  return localStorage.getItem("list") // return as string
    ? JSON.parse(localStorage.getItem("list")) // return as array object
    : [];
}
// ****** SETUP ITEMS **********
function setupItems() {
  let items = getLocalStorage(); // get array object from local storage
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}

function createListItem(id, value) {
  const element = document.createElement("article"); // create <article></article>
  // add class
  element.classList.add("grocery-item"); // return <article class="grocery-item"></article>
  // add id
  const attr = document.createAttribute("data-id"); // return <article class="grocery-item" data-id=""></article>
  attr.value = id;
  element.setAttributeNode(attr); // return <article class="grocery-item" data-id="1231231"></article>
  element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
  const deleteBtn = element.querySelector(".delete-btn"); // return <button type="button" class="delete-btn">
  const editBtn = element.querySelector(".edit-btn"); // return <button type="button" class="edit-btn">
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
  // append child
  list.appendChild(element); // add <article class="grocery-item" data-id="1231231"> ... </article>
}
