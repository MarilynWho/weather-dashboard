$("#search-button").click(function (event) {
  event.preventDefault();
  let city = $("#search-input").val();
  renderWeather(city);
});

function renderWeather(city) {
  let weatherAPI = localStorage.weatherAppAPI;
  // let weatherAPI = prompt("Enter your API key");
  let todayURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    weatherAPI;
  let fiveDaysURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    weatherAPI;
  getForcast(todayURL);
  getForcast(fiveDaysURL);
  addBtn(city);
}

// Send URL

function getForcast(myURL) {
  $.ajax({
    url: myURL,
    method: "GET",
  }).then(function (response) {
    if (response.name === undefined) {
      fiveDayForcast(response);
    } else {
      todayForcast(response);
    }
  });
}

function fiveDayForcast(response) {
  let container = $("#forecast");
  container.empty();
  forecast = response.list;
  let days = $("<div>").addClass("container");
  for (let i = 6; i < forecast.length; i += 8) {
    // create div with class forecastDay to apply background color and margins
    let day = $("<div>").addClass("forecastDay");
    let icon = getIcon(forecast[i]);
    // add date, icon and other data to the day
    let date = $("<p>")
      .text(
        moment(forecast[i].dt_txt, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY")
      )
      .append(icon)
      .append(getData(forecast[i]));
    // place all the data in div
    day.append(date);
    // place div to the container
    days.append(day);
    // place container div to the page
    container.append(days);
  }
}

function todayForcast(response) {
  container = $("#today");
  container.empty();
  // create div
  today = $("<div>")
    //  put name of the city and current date in it
    .text(response.name + " " + moment().format("(DD/MM/YYYY)"))
    // add icon
    .append(getIcon(response))
    // add forecast data
    .append(getData(response))
    .addClass("todayContainer");
  // put everything on the page
  container.append(today);
}

function getData(response) {
  let data = $("<div>");
  let temp = $("<p>").text(
    "Temp: " + (response.main.temp - 273.15).toFixed(1) + "°C"
  );
  let wind = $("<p>").text("Wind: " + response.wind.speed + " KPH");
  let humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
  return data.append(temp).append(wind).append(humidity);
}

function getIcon(response) {
  iconType = response.weather[0].icon;
  icon = $("<img>").attr(
    "src",
    "https://openweathermap.org/img/wn/" + iconType + ".png"
  );
  return icon;
}

function addBtn(name) {
  container = $("#history");
  let newBtn = $("<button>")
    .attr("data-city", name)
    .addClass("historyBtn")
    .text(name.charAt(0).toUpperCase() + name.slice(1));
  container.prepend(newBtn);
}

$("#history").on("click", ".historyBtn", getBtnForecast);

function getBtnForecast() {
  let city = $(this).attr("data-city");
  renderWeather(city);
}
