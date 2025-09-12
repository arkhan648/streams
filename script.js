const apiURL = "https://topembed.pw/api.php?format=json";
const urlParams = new URLSearchParams(window.location.search);
const matchId = urlParams.get("id"); // format = timestamp_index
const frame = document.getElementById("stream-frame");
const matchInfo = document.getElementById("match-info");

if (!matchId) {
  frame.outerHTML = "<p>⚠ No match ID provided.</p>";
} else {
  fetch(apiURL)
    .then(res => res.json())
    .then(data => {
      let found = false;
      for (const date in data.events) {
        data.events[date].forEach((event, idx) => {
          const generatedId = `${event.unix_timestamp}_${idx}`;
          if (generatedId === matchId) {
            found = true;

            // Show match info
            matchInfo.innerHTML = `
              <p><strong>${event.sport}</strong> | ${event.tournament}</p>
              <p>${event.match}</p>
            `;

            if (event.channels && event.channels.length > 0) {
              frame.src = event.channels[0]; // first channel embed
            } else {
              frame.outerHTML = "<p>⚠ No stream available.</p>";
            }
          }
        });
      }

      if (!found) {
        frame.outerHTML = "<p>⚠ Match ID not found in API.</p>";
      }
    })
    .catch(err => {
      frame.outerHTML = "<p>⚠ Error loading stream.</p>";
      console.error(err);
    });
}
