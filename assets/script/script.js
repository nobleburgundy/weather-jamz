const OPENWEATHER_API_KEY = "5b1c716e64155c6f31f83fc752ff2b1f";
const YOUTUBE_API_KEY = "AIzaSyAG57O2KP6IuKQnNvZsGtpDbmaz4Zad3o8";
const YOUTUBE_SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";
let weatherWord;
let city;
// switch to prevet calling the youtube api unless needed due to quota
let callYoutubeApi = false;

$(document).ready(function () {
  let history = JSON.parse(window.localStorage.getItem("history")) || [];
  // load last search if exists
  if (history) {
    apiCalls(history[history.length - 1]);
  }

  //iterate through local storage history
  $("#historyList").empty();

  for (let i = 0; i < history.length; i++) {
    displayHistory(history[i]);
  }

  //Listener for click of any of the previously searched cities
  $("#historyList").on("click", "li", function () {
    city = $(this).text();

    // Remove from the array, then add to the end
    history = history.filter((text) => text !== city);

    // add it to the end of the array
    history.push(city);

    // empty the history list and re-build it
    $("#historyList").empty();

    //iterate through local storage history
    for (let i = 0; i < history.length; i++) {
      displayHistory(history[i]);
    }

    // update local storage
    window.localStorage.setItem("history", JSON.stringify(history));

    // call apis
    apiCalls(city);
  });

  // listen for city input to use for api call and store that data to local storage
  $("#weatherSubmitForm").on("submit", function (event) {
    event.preventDefault();

    city = $("#citySearch").val();
    if (city) {
      apiCalls(city);
      if (history.indexOf(city) === -1) {
        history.push(city);
        window.localStorage.setItem("history", JSON.stringify(history));
        displayHistory(city);
      }
    }
  });

  //Listener on clear button clears the history list
  $("#clearLink").on("click", function () {
    window.localStorage.clear("history");
    $("#historyList").empty();
    history = [];
    window.localStorage.setItem("history", JSON.stringify(history));
  });
});

// Listener for youtube api checkbox
$("#youtubeCheckbox").on("change", function () {
  callYoutubeApi = this.checked;
});

function apiCalls(city) {
  //API call with user input data
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${OPENWEATHER_API_KEY}`;
  $.ajax({
    url: weatherApiUrl,
    method: "GET",
  }).then(function (response) {
    //Grabs a word that describes the current weather conditions
    weatherWord = response.weather[0].main;
    let weatherContent = displayWeather(response);
    $(".weatherDay").html(weatherContent);
    console.log(weatherContent);
    console.log(`weatherWord = ${weatherWord}, city = ${city}`);
    //Use word to pass as a value for YouTube API call
    let queryString = `?part=snippet&maxResults=25&q=${weatherWord}%20Music&type=playlist&key=${YOUTUBE_API_KEY}`;
    let youtubeAPIURL = YOUTUBE_SEARCH_ENDPOINT + queryString;
    // Switch for calling youtubeApi only when needed
    if (callYoutubeApi) {
      $.ajax({
        url: youtubeAPIURL,
        method: "GET",
      }).then(function (response) {
        console.log(response);
        // get a random playlist in the response
        let randomInt = Math.floor(Math.random() * response.items.length);
        let randomPlaylistId = response.items[randomInt].id.playlistId;
        createIframe(randomPlaylistId);
      });
    } else {
      // if not calling youtube api, load default playlist
      let defaultPlaylist = "PL0q2VleZJVEkJDlZN46PN-ORuq8YpZk-n";
      createIframe(defaultPlaylist);
    }
  });
}

//Display weather data, date, and time
function displayWeather(response) {
  let date = moment().format("dddd, MMMM Do");
  return `<h2 class="has-text-warning has-text-weight-bold">${date}</h2><h2><em>${
    response.name
  }</em></h2><img src='http://openweathermap.org/img/wn/${
    response.weather[0].icon
  }.png'><strong><em>${weatherWord}</em></strong><br><br>Temperature: ${response.main.temp.toFixed(1)} &deg; F</br> `;
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

//Creates a list of recently searched cities
function displayHistory(city) {
  let liEl = $("<li>");
  liEl.addClass("list-group-item");
  liEl.append(city);
  $("#historyList").prepend(liEl);
}
