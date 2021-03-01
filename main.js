const searchBtn = $(".search-button");
const searchInput = $("#search-input");
const oneDayResult = $("#one-day-result");
const listGroup = $("#recent-cities");
const fiveDayResult = $("#five-day-result");
const fiveDayTitle = $("#five-day-title");

let recentCities = [];

const apiKey = "3eb9c4f39fdd105936858d16b944d3e1";

// Runs this code on click of the search button to populate fields.
searchBtn.on("click", () => {
  // Gets the zip from the user input
  let zipCode = searchInput.val();
  let link = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${apiKey}&units=imperial`;
  fetch(link)
    .then((response) => response.json())
    .then((data) => {
      populateOneDay(data);
      checkRecentCities(data, zipCode);
      populateFiveDay(data);
      writeRecentCities();
    });
});

// Same thing as above, but handles click on the populated recent city list items.
$(document).on("click", function (e) {
  if (e.target.id == "recent-city") {
    let zipCode = e.target.getAttribute("zip");
    let link = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${apiKey}&units=imperial`;
    fetch(link)
      .then((response) => response.json())
      .then((data) => {
        populateFiveDay(data);
        populateOneDay(data);
      });
  }
});

function writeRecentCities() {
  listGroup.empty();
  for (let i = 0; i < recentCities.length; i++) {
    let html = `<li class="list-group-item recent-city" id="recent-city" zip="${recentCities[i].zip}">${recentCities[i].name}</li>`;
    listGroup.append(html);
  }
}

function checkRecentCities(data, zip) {
  let city = {
    name: data.city.name,
    zip: zip,
  };

  if (recentCities.length < 5) {
    recentCities.unshift(city);
  }
   else {
    recentCities.pop();
    recentCities.unshift(city);
  }

  localStorage.setItem("recent", JSON.stringify(recentCities));
}

// Runs at load of page, fetches local storage and populates the recent cities.
function init() {
  if (localStorage.getItem("recent") !== null) {
    let retrievedData = localStorage.getItem("recent");
    recentCities = JSON.parse(retrievedData);
    writeRecentCities();
  }
}

// Takes the data returned from the fetch, and populates the current day forecast
function populateOneDay(data) {
  oneDayResult.removeClass("hide");
  // Empties the container for each fetch
  oneDayResult.empty();
  // variables to help simplify other inputs
  let cityName = data.city.name;
  let listItem = data.list[0];
  // Gets the ID code and turns it too a string
  let id = data.list[0].weather[0].id;
  id = id.toString();

  // If statement to check the id code and set the background image of the container appropriately
  if (id[0] == 2) {
    oneDayResult.css(
      "background-image",
      "linear-gradient(to right, #ffffff, #ffffff94, #ffffff27,#3a252500)" +
        ", url('assets/lightning.jpg')"
    );
  } else if (id[0] == 3 || id[0] == 5) {
    oneDayResult.css(
      "background-image",
      "linear-gradient(to right, #ffffff, #ffffff94, #ffffff27,#3a252500)" +
        ", url('assets/rain.jpg')"
    );
  } else if (id[0] == 6) {
    oneDayResult.css(
      "background-image",
      "linear-gradient(to right, #ffffff, #ffffff94, #ffffff27,#3a252500)" +
        ", url('assets/snow.jpg')"
    );
  } else if (id == 800) {
    oneDayResult.css(
      "background-image",
      "linear-gradient(to right, #ffffff, #ffffff94, #ffffff27,#3a252500)" +
        ", url('assets/clear.jpg')"
    );
  } else if (id > 800) {
    oneDayResult.css(
      "background-image",
      "linear-gradient(to right, #ffffff, #ffffff94, #ffffff27,#3a252500)" +
        ", url('assets/clouds.jpg')"
    );
  }

  // Populate an html template to append to the result container
  let html =
    `<h2>${cityName} ${unixToDate(listItem.dt)}</h2>` +
    `<p class="result-p">Temp: ${listItem.main.temp.toFixed(0)}&degF</p>` +
    `<p class="result-p">Humidity: ${listItem.main.humidity}%</p>` +
    `<p class="result-p">Wind: ${listItem.wind.speed} MPH</p>`;

  oneDayResult.append(html);
}

// Takes the data returned from the fetch, and populates the five day forecast
function populateFiveDay(data) {
  fiveDayTitle.removeClass("hide");
  // Clear the container for each fetch
  fiveDayResult.empty();
  // Simplifies my future statements
  let dataList = data.list;
  for (let i = 0; i < dataList.length; i++) {
    // Checks each time stamp and returns the ones for in between 11AM and 1PM, depending on search time.
    if (unixToHour(dataList[i].dt) > 4 && unixToHour(dataList[i].dt) < 8) {
      let listItem = dataList[i];
      // Populate an html template to append to the result container
      let html =
        `<div class="col-2 card">` +
        `<h5 class="card-title">${unixToDate(dataList[i].dt)}</h5>` +
        `<div class="card-text">` +
        `<img src="https://openweathermap.org/img/wn/${listItem.weather[0].icon}@2x.png" alt="Weather Icon"/>` +
        `</div>` +
        `<p class="card-text result-p">Temp: ${listItem.main.temp.toFixed(
          0
        )}&degF</p>` +
        `<p class="card-text result-p">Humidity: ${listItem.main.humidity}%</p>` +
        `</div>`;

      fiveDayResult.append(html);
    }
  }
}

// Two functions to convert the unix timestamp for each day into hours, and the formatted date
function unixToHour(timestamp) {
  let unixTimestamp = timestamp;
  let date = new Date(unixTimestamp * 1000);
  let hour = date.getHours();
  return hour;
}

function unixToDate(timestamp) {
  let unixTimestamp = timestamp;
  let date = new Date(unixTimestamp * 1000);
  let formatDate = date.toLocaleDateString("en-us");
  return formatDate;
}

init();

// Links used
// api.openweathermap.org/data/2.5/forecast?zip=${zipCode},US&appid=${apiKey}
// https://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key} uv index link
