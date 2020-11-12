const OPENWEATHER_API_KEY = "5b1c716e64155c6f31f83fc752ff2b1f";
const YOUTUBE_API_KEY = "AIzaSyD4dywNr8AmMsQsbUQP_YXNAsTwGQEHvzQ";
const YOUTUBE_SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
let weatherWord;
let city;

$(document).ready(function () {
  let history = JSON.parse(window.localStorage.getItem("history")) || [];
  //iterate through local storage history
  for (let i = 0; i < history.length; i++) {
    //passing the history data of local storage to a function named display History
    displayHist(history[i]);
  }

  $("#historyList").on("click", "li", function () {
    city = $(this).text();
    apiCalls(city);
  });
  // listen for city input
  $("#searchBtn").on("click", function () {
    //$("#weather-music-list").empty();
    city = $("#citySearch").val();
    if (city) {
      apiCalls(city);
      if (history.indexOf(city) === -1) {
        history.push(city);
        window.localStorage.setItem("history", JSON.stringify(history));
        displayHist(city);
      }
    }
  });
});

function apiCalls(city) {
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
}

function displayWeather(response) {
  $(".nameTemp").html(response.name + " " + response.main.temp + " °F");
  $(".weatherDay").html(`It's a ${weatherWord} day`);
  let weatherIcon = response.weather[0].icon;
  let iconUrl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
  weatherWord = response.weather[0].main;
  let divEl = $("<div>");
  let imgEl = $("<img>");

  imgEl.attr("src", iconUrl);
  divEl.append(imgEl);
  imgEl.attr("src", iconUrl);
  $("#currentWeather").append(divEl);
}

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

function displayHist(city) {
  let liEl = $("<li>");
  liEl.addClass("list-group-item");
  liEl.append(city);
  $("#historyList").prepend(liEl);
}
