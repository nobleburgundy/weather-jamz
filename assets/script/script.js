const LASTFM_API_KEY = "174cadade97542fff7b88f7fc3b6a9ee";
const LASTFM_API_LIMIT = 20;
const OPENWEATHER_API_KEY = "5b1c716e64155c6f31f83fc752ff2b1f";
let weatherWord;
let city;

$(document).ready(function () {
  // listen for city input
  // until front-end is search input is hooked up, short-circuit with Minneapolis
  $("#searchBtn").on("click", function() {
    $("#weather-music-list").empty();
    city = $("#citySearch").val();
    // get weather word for current weather in that city
    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`;
    $.ajax({
      url: weatherApiUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      weatherWord = response.weather[0].main;
      let weatherTemp ="";
      let weatherIcon = response.weather[0].icon;
      displayWeather(response);
      console.log(`weatherWord = ${weatherWord}, city = ${city}`);
      let lastFMapiUrl = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${weatherWord}&api_key=${LASTFM_API_KEY}&limit=${LASTFM_API_LIMIT}&format=json`;
      // get top tag tracks from LastFM
      $.ajax({
        url: lastFMapiUrl,
        method: "POST",
      }).then(function (responseFM) {
        parseLastFMTracksResponse(responseFM);
      });
    });
  });
});

function parseLastFMTracksResponse(responseFM) {
  for (let index = 0; index < responseFM.tracks.track.length; index++) {
    let artistName = responseFM.tracks.track[index].artist.name;
    let trackName = responseFM.tracks.track[index].name;
    console.log(`artistName: ${artistName}, trackName: ${trackName}`);
    let liEl = $("<li>");
    liEl.text(artistName + " - " + trackName);
    $("#weather-music-list").append(liEl);
  }
}
