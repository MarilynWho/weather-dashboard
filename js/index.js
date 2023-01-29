$("#search-button").click(function (event) {
  event.preventDefault();
  let weatherAPI = localStorage.weatherAppAPI;
  // let weatherAPI = prompt("Enter your API key");
  let city = $("#search-input").val();
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
});

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
  console.log(response);
  forecast = response.list;
  console.log(forecast);
  let days = $("<div>").addClass("container");
  for (let i = 6; i < forecast.length; i += 8) {
    let day = $("<div>").addClass("forecastDay");
    
    let date = $("<p>")
      .text(
        moment(forecast[1].dt_txt, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YYYY")
      )
      .append(getData(forecast[i]));
    day.append(date);
    console.log(getData(forecast[i]));
    days.append(day);
    container.append(days);
  }
}

function todayForcast(response) {
  container = $("#today");
  container.empty();
  getIcon(response);
  today = $("<div>")
    .text(response.name + " " + moment().format("(DD/MM/YYYY)"))
    .append(icon);
  container.append(today).append(getData(response));
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
