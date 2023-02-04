let historyButtons = localStorage.buttons
  ? JSON.parse(localStorage.buttons)
  : [];
historyButtons.forEach(btnName =>  addBtn(btnName));
console.log(historyButtons);
// let weatherAPI = prompt("Enter your API key");

$("#search-button").click(function (event) {
  event.preventDefault();
  let city = $("#search-input").val();
  renderWeather(city);
});

function renderWeather(city) {
  // let weatherAPI = localStorage.weatherAppAPI;
  weatherAPI = "d62535d37ff79bcee3c5b7385212c60d";
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
  addMoreButtons(city);
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
  let days = $("<div>").addClass("days-container");
  for (let i = 6; i < forecast.length; i += 8) {
    let day = $("<div>")
      .addClass("p-3 border border-3 border-dark mt-3 rounded");
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
  ).css("filter","drop-shadow(2px 4px 6px black)").addClass("m-2");
  return icon;
}

function addMoreButtons (name) {
  if (historyButtons.includes(name)) {
    return;
  } else {
    addBtn(name);
    historyButtons.push(name);
    localStorage.buttons = JSON.stringify(historyButtons);
  }
}

function addBtn(name) {
  container = $("#history");
  let newBtn = $("<button>")
    .attr("data-city", name)
    .addClass("historyBtn mt-1 btn btn-outline-primary")
    .text(name.charAt(0).toUpperCase() + name.slice(1));
  container.prepend(newBtn);
}

$("#history").on("click", ".historyBtn", getBtnForecast);

function getBtnForecast() {
  let city = $(this).attr("data-city");
  renderWeather(city);
}

$(window).on("load", () => {
  $(".historyBtn").first().click();
})