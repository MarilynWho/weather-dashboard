$("#search-button").click(function (event) {
  event.preventDefault();
  let weatherAPI = localStorage.weatherAppAPI;
  let city = $("#search-input").val();
  let queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&appid=" +
    weatherAPI;
  console.log(queryURL);
  $.ajax({
    URL: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
  });
});
