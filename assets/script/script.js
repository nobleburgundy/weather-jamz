const LASTFM_API_KEY = "174cadade97542fff7b88f7fc3b6a9ee";
const LASTFM_API_LIMIT = 20;
const OPENWEATHER_API_KEY = "5b1c716e64155c6f31f83fc752ff2b1f";
let weatherWord;
let city;

$(document).ready(function () {
  // listen for city input
  // until front-end is search input is hooked up, short-circuit with Minneapolis
  city = "Minneapolis";
  // get weather word for current weather in that city
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`;
  $.ajax({
    url: weatherApiUrl,
    method: "GET",
  }).then(function (response) {
    weatherWord = response.weather[0].main;
    console.log(`weatherWord = ${weatherWord}, city = ${city}`);
    let apiUrl = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${weatherWord}&api_key=${LASTFM_API_KEY}&limit=${LASTFM_API_LIMIT}&format=json`;
    // get top tag tracks from LastFM
    $.ajax({
      url: apiUrl,
      method: "POST",
    }).then(function (response) {
      parseLastFMTracksResponse(response);
    });
  });
});

function parseLastFMTracksResponse(response) {
  for (let index = 0; index < response.tracks.track.length; index++) {
    let artistName = response.tracks.track[index].artist.name;
    let trackName = response.tracks.track[index].name;
    console.log(`artistName: ${artistName}, trackName: ${trackName}`);
    let liEl = $("<li>");
    liEl.text(artistName + " - " + trackName);
    $("#weather-music-list").append(liEl);
  }
}
