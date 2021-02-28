const searchBtn = $(".search-button");
const searchInput = $("#search-input");
const oneDayResult = $("#one-day-result");
const listGroup = $("#recent-cities");
const fiveDayResult = $("#five-day-result");

let recentCities = [];

const apiKey = "3eb9c4f39fdd105936858d16b944d3e1";
// api.openweathermap.org/data/2.5/forecast?zip=${zipCode},US&appid=${apiKey}
// https://api.openweathermap.org/data/2.5/uvi?lat={lat}&lon={lon}&appid={API key} uv index link


searchBtn.on("click", () => {
  let zipCode = searchInput.val();
  let link = `https://api.openweathermap.org/data/2.5/forecast?zip=${zipCode},us&appid=${apiKey}&units=imperial`;
  fetch(link)
    .then((response) => response.json())
    .then((data) => {
      populateOneDay(data);
      checkRecentCities(data);
      populateFiveDay(data);
      // console.log(data);
      // console.log(link);
      // console.log(recentCities);
    });
});

function writeRecentCities() {
    for (let i = 0; i < recentCities.length; i++) {
        listGroup.empty();
        let html = `<li class="list-group-item">${recentCities[i]}</li>`;
        listGroup.append(html);
        // console.log(recentCities[i]);
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

function populateOneDay(data) {
  oneDayResult.empty();
  let city = data.city;
  let cityName = data.city.name;
  let listItem = data.list[0];

  let html =
    `<h2>${cityName}</h2>` +
    `<p class="result-p">${listItem.main.temp}&deg F</p>` +
    `<p class="result-p">${listItem.main.humidity}%</p>` +
    `<p class="result-p">${listItem.wind.speed} MPH</p>`;

  oneDayResult.append(html);
}

function populateFiveDay(data) {
  let dataList = data.list;
  for (let i = 0; i < dataList.length; i++) {
    if (unixToHour(dataList[i].dt) > 4 && unixToHour(dataList[i].dt) < 8) {
      let listItem = dataList[i];
      let outputDiv = $("<div>");
      outputDiv.addClass("col-2 card");
      let html = 
        `<h5 class="card-title">2/24/2021</h5>` +
        `<div class="card-text">`+
        `<img src="https://openweathermap.org/img/wn/${listItem.weather[0].icon}@2x.png"` +
        `</div>` +
        `<p class="card-text result-p">Temp: ${listItem.main.temp}&degF</p>` +
        `<p class="card-text result-p">Humidity: ${listItem.main.humidity}%</p>`;

      outputDiv.append(html);

      fiveDayResult.append(outputDiv);
    }
  }
}

function unixToHour(timestamp) {
  let unixTimestamp = timestamp;
  let date = new Date(unixTimestamp * 1000);
  let hour = date.getHours();
  return hour;
}