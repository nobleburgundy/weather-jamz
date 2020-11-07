const apiKey = "174cadade97542fff7b88f7fc3b6a9ee";

$(document).ready(function() {
    //get input from frontend
    let searchWord = "sunny";
    let apiUrl = `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${searchWord}&api_key=${apiKey}&format=json`;
    $.ajax({
        url: apiUrl,
        method: "POST",
    }).then(function(response) {
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
});