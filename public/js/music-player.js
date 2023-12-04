document.addEventListener("DOMContentLoaded", function() {
    const audioPlayer = document.getElementById("audioPlayer");
    const audioSource = document.getElementById("audioSource");
    const playIcons = document.querySelectorAll(".play-icon");
    const pauseIcons = document.querySelectorAll(".pause-icon");
  
    let currentlyPlayingIcon = null;
    let previousPlaybackTime = 0;
  
    playIcons.forEach((playIcon, index) => {
      playIcon.addEventListener("click", function() {
        if (currentlyPlayingIcon !== null) {
          // Pause the currently playing audio and change icons
          audioPlayer.pause();
          currentlyPlayingIcon.style.display = "inline";
        } else {
          // Store the previous playback time
          previousPlaybackTime = audioPlayer.currentTime;
        }
  
        // Set the source URL and play the new audio
        audioSource.src = "https://kdec-radio.s3.eu-central-1.amazonaws.com/public/" + this.dataset.songUrl;
        audioPlayer.load();
        audioPlayer.currentTime = previousPlaybackTime; // Set playback time
        audioPlayer.play();
  
        // Toggle icons
        this.style.display = "none";
        pauseIcons[index].style.display = "inline";
  
        currentlyPlayingIcon = pauseIcons[index];
      });
  
      // Pause icon click event
      pauseIcons[index].addEventListener("click", function() {
        audioPlayer.pause();
  
        // Store the current playback time
        previousPlaybackTime = audioPlayer.currentTime;
  
        // Toggle icons
        this.style.display = "none";
        playIcons[index].style.display = "inline";
  
        currentlyPlayingIcon = null;
      });
    });
  });