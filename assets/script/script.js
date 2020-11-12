const LASTFM_API_KEY = "174cadade97542fff7b88f7fc3b6a9ee";
const LASTFM_API_LIMIT = 20;
const OPENWEATHER_API_KEY = "5b1c716e64155c6f31f83fc752ff2b1f";
let weatherWord;
let city;

$(document).ready(function () {
  let srchHist = JSON.parse(window.localStorage.getItem("history")) || [];
  for (let i = 0; i < srchHist.length; i++) {
    displayHist(srchHist[i]);
  }

  $("#historyList").on("click", "li", function () {
    city = $(this).text();
    currentWeather(city);
  });

  $("#searchBtn").on("click", function () {
    $("#display").empty();
    city = $("#citySearch").val();
    if (city) {
      currentWeather(city);
      if (srchHist.indexOf(city) === -1) {
        srchHist.push(city);
        window.localStorage.setItem("history", JSON.stringify(srchHist));
      }
    }
  });

  function currentWeather(city) {
    let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
    $.ajax({
      url: weatherApiUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      weatherWord = response.weather[0].main;
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
  }

  function parseLastFMTracksResponse(responseFM) {
    for (let index = 0; index < responseFM.tracks.track.length; index++) {
      let artistName = responseFM.tracks.track[index].artist.name;
      let trackName = responseFM.tracks.track[index].name;
      console.log(`artistName: ${artistName}, trackName: ${trackName}`);
      let liEl = $("<li>");
      liEl.text(artistName + " - " + trackName);
      $("#layer").append(liEl);
    }
  }

  function displayWeather(response) {
    let weatherTemp = response.main.temp;
    let weatherIcon = response.weather[0].icon;
    let iconUrl = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
    weatherWord = response.weather[0].main;
    let divEl = $("<div>");
    let imgEl = $("<img>");
    imgEl.attr("src", iconUrl);
    divEl.append(imgEl);
    divEl.append(`Temperature: ${weatherTemp}`);
    divEl.append(`It's a ${weatherWord} day`);
    $("#display").append(divEl);
  }

  function displayHist(city) {
    let liEl = $("<li>");
    liEl.addClass("list-group-item");
    liEl.append(city);
    $("#historyList").prepend(liEl);
  }
});
