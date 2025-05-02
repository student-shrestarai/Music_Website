let currentAudio = null; 
let currentButton = null; 
let myProgressBar = document.getElementById("myProgressBar");
let masterPlay = document.getElementById("masterPlay");
let backward = document.getElementById("backward");
let forward = document.getElementById("forward");

let currentIndex = 0; 
let songs = []; 

console.log("Current Index at the start:", currentIndex);

// Fetching the song
async function fetchSongs() {
    try {
        let response = await fetch("http://localhost/Spotify/fetch_songs.php"); 
        let data = await response.json(); 
        console.log(" Fetched Songs Data:", data); 
        songs = data; 
        currentIndex = 0; 

        let songItems = document.getElementsByClassName("songItem");

        let songContainer = document.querySelector(".songItemContainer");
        songContainer.innerHTML = ""; 
        data.forEach((song,index) => {
            let songDiv = document.createElement("div");
            songDiv.classList.add("songItem");

            songDiv.innerHTML = `
                <img src="${song.cover_path}" alt="${song.song_name}">
                <span class="songname">${song.song_name}</span>
                <span class="songlistplay">
                    <span class="timestamp">${song.timestamp}</span>
                    <button class="songItemPlay"    data-index="${index}"       data-file="${song.file_path}"
                    data-song="${song.song_name}" >
                        <i class="fa-solid fa-circle-play"></i>
                    </button>
                </span>  
            `;

            songContainer.appendChild(songDiv);
        });
        document.querySelectorAll(".songItemPlay").forEach((button,index) => {
            button.setAttribute("data-index", index); 
            button.addEventListener("click", (e) => {
                // let filePath = e.currentTarget.getAttribute("data-file");
                // let songName = e.currentTarget.getAttribute("data-song");
                // let currentIndex = parseInt(e.currentTarget.getAttribute("data-index"));
                // /playSong(filePath);
                currentIndex = index;

                let filePath = songs[currentIndex].file_path;
        let songName = songs[currentIndex].song_name;
    
        console.log("Updated Current Index:", currentIndex); 
                  
                console.log("The current index is ",currentIndex);
                togglePlayPause(e.currentTarget, filePath);
                updateBottomSection(songName)

            });
        });

        window.songs = data;
    } catch (error) {
        console.error("Error fetching songs:", error);
    }
}
/// Maintains the start and stop of song 

function togglePlayPause(button, filePath) {
    if (currentAudio && currentAudio.src.includes(filePath)) {
        console.log("Same song clicked:", filePath);

        // If the same song is playing, toggle pause/play
        if (currentAudio.paused) {
            currentAudio.play();
            button.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`; // Change to pause icon
        } else {
            currentAudio.pause();
            button.innerHTML = `<i class="fa-solid fa-circle-play"></i>`; // Change to play icon
            

        }
    } else {
        console.log("Different song clicked:", filePath);

        // Stop the previous song
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; 
            if (currentButton) {
                currentButton.innerHTML = `<i class="fa-solid fa-circle-play"></i>`; // Reset previous button
            }
        }

        // Play new song
        currentAudio = new Audio(filePath);

        
    currentAudio.addEventListener("loadedmetadata", () => {
        console.log("Metadata Loaded ");
        
    });

        currentAudio.play();
        button.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`; 

        // Store the new active button
        currentButton = button;
        //updating seek bar
        currentAudio.addEventListener("timeupdate", () => {
            if (currentAudio.duration) {
                let progress = (currentAudio.currentTime / currentAudio.duration) * 100;
                myProgressBar.value = progress; 
            }

// updating using input
            myProgressBar.addEventListener("input", () => {
                let seekTime = (myProgressBar.value / 100) * currentAudio.duration;
                currentAudio.currentTime = seekTime;
                console.log(currentAudio.currentTime);
            });

        });

        // When the song ends, reset the button
        currentAudio.addEventListener("ended", () => {
            button.innerHTML = `<i class="fa-solid fa-circle-play"></i>`;
        });
    }
}

// Updating Bottom Section -------------------------------------------

function updateBottomSection(songName) {
    let songInfo = document.querySelector(".songInfo span");
    let masterPlay = document.getElementById("masterPlay"); 
    let gif = document.getElementById("gif"); 

    if (!songInfo || !masterPlay || !gif) {
        console.error("One or more elements are missing!");
        return;
    }

    if (currentAudio && !currentAudio.paused) {
        songInfo.innerText = songName ? songName : "Unknown Song"; 
        console.log("Now Playing:", songName);
        masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
        gif.style.opacity = 1; 
    } else {
        songInfo.innerText = songName ? songName : "Unknown Song";
        console.log("Paused:", songName);
        masterPlay.classList.replace("fa-circle-pause", "fa-circle-play");
        gif.style.opacity = 0; 
    }
}


// Managing Master Play Button 


masterPlay.addEventListener("click", async () => {

    if (!currentAudio) { 
        
        currentIndex = 0; 
        let filePath = songs[currentIndex].file_path; 
        let songButton = document.querySelector(`[data-index="${currentIndex}"]`);

        currentAudio = new Audio(filePath); 
        currentButton = songButton; 

        updateBottomSection(songs[currentIndex].song_name); 
    }



    if (currentAudio.paused || currentAudio.currentTime <= 0) {
        try {
             
            await currentAudio.play(); 
            console.log("Audio started playing");

            masterPlay.classList.replace("fa-circle-play", "fa-circle-pause");
            gif.style.opacity = 1;

            if (currentButton) {
                currentButton.innerHTML = `<i class="fa-solid fa-circle-pause"></i>`; 
            }


        } catch (error) {
            console.error("Error playing audio:", error);
        }
    } else {
        currentAudio.pause(); 
        console.log("Audio paused");

        masterPlay.classList.replace("fa-circle-pause", "fa-circle-play");
        gif.style.opacity = 0;


        if (currentButton) {
            currentButton.innerHTML = `<i class="fa-solid fa-circle-play"></i>`; 
        }
    }
});


// Managing Backward and Forward Buttons 

backward.addEventListener("click", () => {
    if (currentIndex !== null && currentIndex > 0) { 
        currentIndex--; 

    
    } else {
        currentIndex=0; 
    }

    let filePath = songs[currentIndex].file_path;

    console.log("Playing previous song:", songs[currentIndex].song_name);
    
    let songButton = document.querySelector(`[data-index="${currentIndex}"]`);
    togglePlayPause(songButton, filePath);
    updateBottomSection(songs[currentIndex].song_name);


});


forward.addEventListener("click", () => {
    if (currentIndex !== null && currentIndex <=songs.length-1) { 
        currentIndex++;

        
    } else {
        currentIndex=0;    
       
    }
    let filePath = songs[currentIndex].file_path; 

        console.log("Playing previous song:", songs[currentIndex].song_name);
        
        let songButton = document.querySelector(`[data-index="${currentIndex}"]`);
        togglePlayPause(songButton, filePath);
        updateBottomSection(songs[currentIndex].song_name);
});

fetchSongs();


