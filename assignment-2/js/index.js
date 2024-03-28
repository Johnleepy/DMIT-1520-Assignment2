/* declare variables */
const form = document.querySelector("#album-search-form");
const tableContent = document.querySelector("#album-rows");
const albumInfo = document.querySelector("#search-input");
const albumRating = document.querySelector("#min-album-rating-input");
let albumStore = null;

/* fetch data */
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

/* add event listener */
form.addEventListener("submit", onSubmit);

/* on submit */
function onSubmit(event) {
  event.preventDefault();

  // reset the form
  tableContent.innerHTML = "";

  // render data on different conditions
  let dataToRender = null;

  if (albumInfo.value.trim() !== "" || albumRating.value.trim() !== "") {
    if (albumInfo.value.trim() !== "" && albumRating.value.trim() !== "") {
      dataToRender = filterAlbumInfo(albumInfo).filter(
        (obj) => obj.averageRating >= parseFloat(albumRating.value.trim())
      );
    } else {
      dataToRender =
        albumInfo.value.trim() !== ""
          ? filterAlbumInfo(albumInfo)
          : filterMinRating(albumRating);
    }
  }

  // alert when no data found. Otherwise, render data
  dataToRender.length === 0
    ? alert("Data not found")
    : renderData(dataToRender);
}

/* helper functions */
// search data
function filterAlbumInfo(input) {
  const filteredObjects = albumStore.filter((obj) =>
    Object.values(obj).toString().includes(input.value.trim())
  );
  return filteredObjects;
}

function filterMinRating(input) {
  const filteredObjects = albumStore.filter(
    (obj) => obj.averageRating >= parseFloat(input.value.trim())
  );
  return filteredObjects;
}

// render data
function renderData(filteredObjects) {
  filteredObjects.forEach((obj) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${obj.album}</td>
      <td>${obj.releaseDate}</td>
      <td>${obj.artistName}</td>
      <td>${obj.genres}</td>
      <td>${obj.averageRating}</td>
      <td>${obj.numberRatings}</td>
      `;
    tableContent.appendChild(tr);
  });
}
