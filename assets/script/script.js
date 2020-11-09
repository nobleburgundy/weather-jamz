const API_KEY = "174cadade97542fff7b88f7fc3b6a9ee";
const LASTFM_API_LIMIT = 20;
let weatherWord = "";

$(document).ready(function () {
  //get input from frontend
  let searchWord = "sunny";
  let apiUrl = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${searchWord}&api_key=${API_KEY}&limit=${LASTFM_API_LIMIT}&format=json`;
  $.ajax({
    url: apiUrl,
    method: "POST",
  }).then(function (response) {
    console.log(response);
    for (let index = 0; index < response.tracks.track.length; index++) {
      let artistName = response.tracks.track[index].artist.name;
      let trackName = response.tracks.track[index].name;
      console.log(`artistName: ${artistName}, trackName: ${trackName}`);
      let liEl = $("<li>");
      liEl.text(artistName + " - " + trackName);
      $("#weather-music-list").append(liEl);
    }
  });
  getWeatherWord();
});

function getWeatherWord() {
  const weatherApiKey = "5b1c716e64155c6f31f83fc752ff2b1f";
  let searchCity = "Minneapolis";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${weatherApiKey}`;

  $.ajax({
    url: weatherApiUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response.weather[0].main);
    weatherWord = response.weather[0].main;
  });
}
