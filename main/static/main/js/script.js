const startBtn = document.querySelector("#startButton");
const stopBtn = document.querySelector("#stopButton");
const tracingIcon = document.querySelector("#tracingIcon");
const heroTitle = document.querySelector(".hero-title");
const savedRoutesBtn = document.querySelector("#showSavedRoutes");
const routesList = document.querySelector("#routesList");
const turnOffMapBtn = document.querySelector("#turnOffMap");
const dotMarkerImg = document.querySelector("#dotMarkerImg");
const startMarkerImg = document.querySelector("#startMarkerImg");
const destinationMarkerImg = document.querySelector("#destinationMarkerImg");

let watchID;
let coordinatesArray = [];

// ==============================================================================================================
// start button to trace location
// ==============================================================================================================

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  tracingIcon.style.display = "block";
  heroTitle.style.display = "none";
  stopBtn.style.display = "block";

  askLocationAccess();
});

// ==============================================================================================================
// start button end
// ==============================================================================================================

// ==============================================================================================================
// stop button to stop tracing location
// ==============================================================================================================

stopBtn.addEventListener("click", () => {
  if (watchID) {
    navigator.geolocation.clearWatch(watchID);
    watchID = null;

    saveCoordinates();
    coordinatesArray = [];

    startBtn.style.display = "block";
    tracingIcon.style.display = "none";
    heroTitle.style.display = "block";
    stopBtn.style.display = "none";
  }
});

// ==============================================================================================================
// stop button end
// ==============================================================================================================

// ==============================================================================================================
// Ask for location permission and watch location
// ==============================================================================================================

function askLocationAccess() {
  if (navigator.geolocation) {
    watchID = navigator.geolocation.watchPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        coordinatesArray.push({ latitude, longitude });
        console.log(coordinatesArray);
      },
      function (error) {
        alert("Error occurred while retrieving location: " + error.message);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// ==============================================================================================================
// Ask for location permission and watch location
// ==============================================================================================================

// ==============================================================================================================
// Save coordinates to local storage
// ==============================================================================================================
function saveCoordinates() {
  const routeName = prompt("Name this route: ");

  let previousRoutes = getSavedRoutes();
  previousRoutes.push({ name: routeName, coordinates: coordinatesArray });
  localStorage.setItem("routes", JSON.stringify(previousRoutes));
}
// ==============================================================================================================
// Save coordinates to local storage
// ==============================================================================================================

// ==============================================================================================================
// get saved coordinates from local storage
// ==============================================================================================================

function getSavedRoutes() {
  const savedRoutes = localStorage.getItem("routes");
  if (savedRoutes) {
    return JSON.parse(savedRoutes);
  }
  return [];
}
// ==============================================================================================================
// get saved coordinates from local storage
// ==============================================================================================================

// ==============================================================================================================
// save coordinates button
//==============================================================================================================

savedRoutesBtn.addEventListener("click", () => {
  const routes = getSavedRoutes();

  routesList.innerHTML = "";

  routes.forEach((route) => {
    const routeItem = document.createElement("button");
    routeItem.id = route.name;
    routeItem.textContent = route.name;
    routesList.appendChild(routeItem);

    routeItem.addEventListener("click", (e) => {
      const routeName = e.currentTarget.id;

      let displayRoute = routes.find((route) => route.name === routeName);

      showInMap(displayRoute.coordinates);

      routesList.style.display = "none";

      turnOffMapBtn.style.display = "block";
    });
  });

  routesList.style.display = "block";
});

// ==============================================================================================================
// save coordinates button
//==============================================================================================================

// ==============================================================================================================
// show in map
//==============================================================================================================
let map = L.map("map");
function showInMap(coordinates) {
  const mapEl = document.getElementById("map");
  mapEl.style.display = "block";

  if (coordinates.length === 0) {
    alert("No coordinates available to display on the map.");
    return;
  }

  // Initialize the map using the first set of coordinates as the center
  map.setView([coordinates[0].latitude, coordinates[0].longitude], 13);

  // Add the tile layer (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ["a", "b", "c"],
  }).addTo(map);

  // Define a custom icon
  var customIcon = L.icon({
    iconUrl: dotMarkerImg.src, // URL to your custom icon image
    iconSize: [6, 6], // Size of the icon
    iconAnchor: [15, 5], // Center of the icon (half of iconSize)
    popupAnchor: [0, -10], // Position of the popup relative to the iconAnchor
  });

  let customStartIcon = L.icon({
    iconUrl: startMarkerImg.src,
    iconSize: [35, 35],
    iconAnchor: [29, 30],
    popupAnchor: [-10, -20],
  });

  let customDestinationIcon = L.icon({
    iconUrl: destinationMarkerImg.src,
    iconSize: [35, 35],
    iconAnchor: [29, 30],
    popupAnchor: [-10, -20],
  });

  // Adjust the map view to fit all markers
  var bounds = new L.LatLngBounds();

  coordinates.forEach(function (coordinate, index) {
    if (index == 0) {
      var marker = L.marker([coordinate.latitude, coordinate.longitude], {
        icon: customStartIcon,
      })
        .addTo(map)
        .bindPopup("Start")
        .openPopup();
      bounds.extend(marker.getLatLng());
    } else if (index == coordinates.length - 1) {
      var marker = L.marker([coordinate.latitude, coordinate.longitude], {
        icon: customDestinationIcon,
      })
        .addTo(map)
        .bindPopup("Destination")
        .openPopup();
      bounds.extend(marker.getLatLng());
    } else {
      var marker = L.marker([coordinate.latitude, coordinate.longitude], {
        icon: customIcon,
      }).addTo(map);
      bounds.extend(marker.getLatLng());
    }
  });

  // Fit the map view to the bounds of the markers, ensuring they all fit within the view
  map.fitBounds(bounds, { padding: [20, 20] });
}

// ==============================================================================================================
// show in map
//==============================================================================================================

// ==============================================================================================================
// hide map
//==============================================================================================================
turnOffMapBtn.addEventListener("click", () => {
  const mapEl = document.getElementById("map");
  mapEl.style.display = "none";

  turnOffMapBtn.style.display = "none";

  routesList.style.display = "block";
});

// ==============================================================================================================
// hide map
//==============================================================================================================
