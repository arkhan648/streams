const apiURL = "https://topembed.pw/api.php?format=json";
const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get("id"); // format = timestamp_index
const frame = document.getElementById("stream-frame");

if (!matchId) {
  frame.outerHTML = "<p>⚠ No match ID provided.</p>";
} else {
  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      for (const date in data.events) {
        data.events[date].forEach((event, idx) => {
          const generatedId = `${event.unix_timestamp}_${idx}`;
          if (generatedId === matchId) {
            if (event.channels && event.channels.length > 0) {
              frame.src = event.channels[0]; // first channel embed
            } else {
              frame.outerHTML = "<p>⚠ No stream available.</p>";
            }
          }
        });
      }
    })
    .catch(err => {
      frame.outerHTML = "<p>⚠ Error loading stream.</p>";
      console.error(err);
    });
}
