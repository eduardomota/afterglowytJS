

var completesource = false; // Is souce complete
const videoidlen = 11; // video ID length
const videoid = document.getElementsByTagName("video")[0].getAttribute("video-id"); // Get video tag, video-id value

if (videoid.length == videoidlen) {
  const Http = new XMLHttpRequest(); // Create a new request
  const url = 'https://www.example.com/video.php?code=' + videoid;
  Http.open("GET", url);
  Http.send(); // send request
  Http.onreadystatechange = function(e) {
    if(Http.responseText && completesource === false) {
      sources = document.getElementById("player_html5_api").innerHTML; // Get video innerHTML source
      replsources = sources.replace("%sources", Http.responseText); // Replace %sources string with fresh sources
      document.getElementById("player_html5_api").innerHTML = replsources; // Set new sources
      completesource = true;
    }
  }
}
