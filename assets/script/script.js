const OPENWEATHER_API_KEY = "5b1c716e64155c6f31f83fc752ff2b1f";
const YOUTUBE_API_KEY = "AIzaSyD4dywNr8AmMsQsbUQP_YXNAsTwGQEHvzQ";
const YOUTUBE_SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
let weatherWord;
let city;

$(document).ready(function () {
  // listen for city input
<<<<<<< HEAD
  // until front-end is search input is hooked up, short-circuit with Minneapolis
=======
>>>>>>> dd4f63f334d0c40ffd512b278472effe4b30e408
  $("#searchBtn").on("click", function () {
    $("#weather-music-list").empty();
    city = $("#citySearch").val();
    // get weather word for current weather in that city
    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
    $.ajax({
      url: weatherApiUrl,
      method: "GET",
    }).then(function (response) {
      weatherWord = response.weather[0].main;
      displayWeather(response);
      console.log(`weatherWord = ${weatherWord}, city = ${city}`);
      let queryString = `?part=snippet&maxResults=25&q=${weatherWord}%20Music&type=playlist&key=${YOUTUBE_API_KEY}`;
      let youtubeAPIURL = YOUTUBE_SEARCH_ENDPOINT + queryString;
      $.ajax({
        url: youtubeAPIURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        // get a random playlist in the response
        let randomInt = Math.floor(Math.random() * response.items.length);
        let randomPlaylistId = response.items[randomInt].id.playlistId;
        playlistId = randomPlaylistId;
        createIframe(playlistId);
      });
    });
  });
});

function displayWeather(response) {
<<<<<<< HEAD
  let cityName = $(".nameTemp").html(response.name + " " + response.main.temp);
=======
  let cityName = $(".nameTemp").html(response.name + " " + response.main.temp + " °F");
>>>>>>> dd4f63f334d0c40ffd512b278472effe4b30e408
  let weatherDay = $(".weatherDay").html(`It's a ${weatherWord} day`);
  let weatherIcon = response.weather[0].icon;
  let iconUrl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
  weatherWord = response.weather[0].main;
  let divEl = $("<div>");
  let imgEl = $("<img>");

<<<<<<< HEAD
=======
  imgEl.attr("src", iconUrl);
>>>>>>> dd4f63f334d0c40ffd512b278472effe4b30e408
  divEl.append(imgEl);
  imgEl.attr("src", iconUrl);
  $("#currentWeather").append(divEl);
}
<<<<<<< HEAD
=======

// Youtube Code - Create the embedable iframe
function createIframe(playlistId) {
  let youtubeEmbedURL = `https://www.youtube.com/embed?listType=playlist&list=${playlistId}`;
  let iframe = $("<iframe>");
  iframe.attr("src", youtubeEmbedURL);
  iframe.attr("height", 390);
  iframe.attr("width", 640);
  iframe.attr("frameborder", "0");
  iframe.attr("allowfullscreen");
  $("#player").empty().append(iframe);
}
>>>>>>> dd4f63f334d0c40ffd512b278472effe4b30e408
