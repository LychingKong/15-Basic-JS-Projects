// classList - shows/gets all classes
// contains - checks classList for specific class
// add - add class
// remove - remove class
// toggle - toggles class

const navToggle = document.querySelector(".nav-toggle");
const linksContainer = document.querySelector(".links");

navToggle.addEventListener("click", function () {
  //   if (linksContainer.classList.contains("show-links")) {
  //     linksContainer.classList.remove("show-links");
  //   } else {
  //     linksContainer.classList.add("show-links");
  //   }

  linksContainer.classList.toggle("show-links");
});
