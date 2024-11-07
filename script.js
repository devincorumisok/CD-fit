function checkIfFits() {
  const files = document.getElementById('fileUpload').files;
  const maxCdSizeMb = 700; // Max CD size in MB
  const maxCdDurationMin = 80; // Max CD duration in minutes

  let totalSize = 0;
  let totalDuration = 0;
  let validAudioFiles = 0;

  // Loop through each file and process it
  Array.from(files).forEach(file => {
    totalSize += file.size / 1024 / 1024; // Convert size to MB

    // If it's an audio file, try to estimate its duration
    if (file.type.includes('audio')) {
      validAudioFiles++;

      // Create an object URL and use an audio element to estimate duration
      const audio = new Audio(URL.createObjectURL(file));
      audio.onloadedmetadata = () => {
        totalDuration += audio.duration / 60; // Duration in minutes
        checkAndDisplayResults(totalSize, totalDuration, maxCdSizeMb, maxCdDurationMin);
      };
    }
  });

  // If there are no audio files, display an error
  if (validAudioFiles === 0) {
    displayError("Please upload audio files (e.g., MP3, WAV).");
  }
}

function checkAndDisplayResults(totalSize, totalDuration, maxCdSizeMb, maxCdDurationMin) {
  const resultsDiv = document.getElementById('results');
  const messageBox = document.createElement('div');

  if (totalSize <= maxCdSizeMb && totalDuration <= maxCdDurationMin) {
    messageBox.innerHTML = `
      <h2 style="color: #ff00cc;">Your music fits on a 700MB/80-minute CD-R!</h2>
      <p>Total Size: ${totalSize.toFixed(2)} MB</p>
      <p>Total Duration: ${totalDuration.toFixed(2)} minutes</p>
    `;
  } else {
    messageBox.innerHTML = `
      <h2 style="color: #ff1aff;">Your music does NOT fit on a 700MB/80-minute CD-R!</h2>
      <p>Total Size: ${totalSize.toFixed(2)} MB</p>
      <p>Total Duration: ${totalDuration.toFixed(2)} minutes</p>
    `;
  }

  resultsDiv.innerHTML = ''; // Clear previous results
  resultsDiv.style.display = 'block'; // Show results
  resultsDiv.appendChild(messageBox);
}

function displayError(message) {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = `<p style="color: #ff1aff;">${message}</p>`;
  resultsDiv.style.display = 'block';
}