/* declare variables */
const form = document.querySelector("#album-search-form");
const tbody = document.querySelector("#album-rows");
const averageRating = document.querySelector("#average-rating");
const numberRatings = document.querySelector("#reviews");
let albumStore = null;
let filteredObjects = null;

/* fetch data on initialization */
async function fetchData() {
  try {
    const response = await fetch("public/data/albums.json");
    const data = await response.json();
    albumStore = [...data];
  } catch {
    console.log("Error fetching data");
  }
}
fetchData();

/* add event listeners */
form.addEventListener("submit", onSubmit);
averageRating.addEventListener("click", sortAverageRating);
numberRatings.addEventListener("click", sortNumberOfRatings);

/* on submit */
function onSubmit(event) {
  event.preventDefault();

  // reset the form
  tbody.innerHTML = "";

  // render data on different conditions
  let dataToRender = null;
  const albumInput = document
    .querySelector("#search-input")
    .value.trim()
    .toLowerCase();
  const ratingInput = document
    .querySelector("#min-album-rating-input")
    .value.trim()
    .toLowerCase();

  if (albumInput !== "" && ratingInput !== "") {
    dataToRender = filteralbum(albumInput).filter(
      (obj) => obj.averageRating >= parseFloat(ratingInput)
    );
  } else if (albumInput === "" && ratingInput === "") {
    alert("Search boxes cannot be empty");
  } else {
    dataToRender =
      albumInput !== ""
        ? filteralbum(albumInput)
        : filterMinRating(ratingInput);
  }

  // alert when no data found. Otherwise, render data
  dataToRender.length === 0
    ? alert("Data not found")
    : renderData(dataToRender);

  form.reset();
}

/* helper functions */
// search data
function filteralbum(searchString) {
  filteredObjects = albumStore.filter((obj) => {
    return (
      obj.album.toString().toLowerCase().includes(searchString) ||
      obj.releaseDate.toString().toLowerCase().includes(searchString) ||
      obj.artistName.toString().toLowerCase().includes(searchString) ||
      obj.genres.toString().toLowerCase().includes(searchString)
    );
  });

  return filteredObjects;
}

function filterMinRating(searchString) {
  filteredObjects = albumStore.filter(
    (obj) => obj.averageRating >= parseFloat(searchString)
  );
  return filteredObjects;
}

// render data
function renderData(objects) {
  objects.forEach((obj) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${obj.album}</td>
      <td>${obj.releaseDate}</td>
      <td>${obj.artistName}</td>
      <td>${obj.genres}</td>
      <td>${obj.averageRating}</td>
      <td>${obj.numberRatings}</td>
      `;
    tbody.appendChild(tr);
  });
}

/* Bonus task - sort data */
// sort data
function sortAverageRating() {
  const sortedObjects = filteredObjects.sort(
    (a, b) => a.averageRating < b.averageRating
  );
  tbody.innerHTML = "";
  renderData(sortedObjects);
}

function sortNumberOfRatings() {
  const sortedObjects = filteredObjects.sort(
    (a, b) => a.numberRatings < b.numberRatings
  );
  tbody.innerHTML = "";
  renderData(sortedObjects);
}
