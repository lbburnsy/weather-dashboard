const searchBtn = $(".search-button");
const searchInput = $("#search-input");
const oneDayResult = $("#one-day-result");
const listGroup = $("#recent-cities");

let recentCities = [];

const apiKey = "3eb9c4f39fdd105936858d16b944d3e1";
// api.openweathermap.org/data/2.5/forecast?zip=${zipCode},US&appid=${apiKey}

searchBtn.on("click", () => {
  let zipCode = searchInput.val();
  let link = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${apiKey}&units=imperial`;
  fetch(link)
    .then((response) => response.json())
    .then((data) => {
      populateOneDay(data);
      checkRecentCities(data);
      console.log(data);
      console.log(link);
      console.log(recentCities);
    });
});

function writeRecentCities() {
    for (let i = 0; i < recentCities.length; i++) {
        listGroup.empty();
        let html = `<li class="list-group-item">${recentCities[i]}</li>`;
        listGroup.append(html);
        console.log(recentCities[i]);
    }
} 

function checkRecentCities(data) {
    if (recentCities.length < 5) {
        recentCities.unshift(data.city.name);
        writeRecentCities();
    } else {
        let deleteCity = recentCities.pop();
        recentCities.unshift(data.city.name);
        writeRecentCities();
    }
}

function convertToF(temp) {
  let f = 9 / 5(temp - 273) + 32;
  return f;
}

function populateOneDay(data) {
    oneDayResult.empty();
  let cityName = data.city.name;
  let listItem = data.list[0];

  let html =
    `<h2>${cityName}</h2>` +
    `<p class="result-p">${listItem.main.temp}&deg F</p>` +
    `<p class="result-p">${listItem.main.humidity}%</p>` +
    `<p class="result-p">${listItem.wind.speed} MPH</p>`;

  oneDayResult.append(html);
}
