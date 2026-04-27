const audio = new Audio();
const songs = [
    { 
        url: 'jabtak.mp3.mp3', // Folder ka naam / file ka naam
        title: 'Jab Tak', 
        artist: 'Armaan Malik' 
    }
];
let currentSongIndex = 0;

const songListElement = document.getElementById('songList');
const progressBar = document.getElementById('progressBar');
const masterPlayButton = document.getElementById('masterPlay');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

function renderSongList() {
    songListElement.innerHTML = songs
        .map(
            (song, index) => `
        <div class="song-item">
            <div class="song-info">
                <span class="song-number">${index + 1}</span>
                <div class="song-title">
                    <strong>${song.title}</strong>
                    <span>${song.artist}</span>
                </div>
            </div>
            <button type="button" class="play-btn" data-index="${index}">Play</button>
        </div>`
        )
        .join('');

    document.querySelectorAll('.play-btn').forEach(button => {
        button.addEventListener('click', event => {
            const index = Number(event.currentTarget.dataset.index);
            playSong(index);
        });
    });
}

function updatePlayButtons() {
    document.querySelectorAll('.play-btn').forEach((button, index) => {
        button.textContent = index === currentSongIndex && !audio.paused ? 'Pause' : 'Play';
    });
}

function playSong(index) {
    const song = songs[index];
    if (!song) return;

    const songUrl = new URL(song.url, window.location.href).href;
    const shouldToggle = audio.src === songUrl && !audio.paused;

    if (shouldToggle) {
        pauseSong();
        return;
    }

    if (audio.src !== songUrl) {
        audio.src = songUrl;
        audio.currentTime = 0;
    }

    currentSongIndex = index;
    audio.play()
        .then(() => {
            masterPlayButton.textContent = 'Pause';
            updatePlayButtons();
        })
        .catch(error => {
            console.error('Unable to play audio:', error);
        });
}

function pauseSong() {
    audio.pause();
    masterPlayButton.textContent = 'Play';
    updatePlayButtons();
}

function togglePlayPause() {
    if (!audio.src) {
        playSong(currentSongIndex);
        return;
    }

    if (audio.paused) {
        audio.play();
        masterPlayButton.textContent = 'Pause';
    } else {
        pauseSong();
    }

    updatePlayButtons();
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
}

function playPrevSong() {
    currentSongIndex = (currentSongIndex + songs.length - 1) % songs.length;
    playSong(currentSongIndex);
}

function updateProgress() {
    if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
}

function setProgress() {
    if (audio.duration) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
}

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
    masterPlayButton.textContent = 'Play';
    updatePlayButtons();
});

progressBar.addEventListener('input', setProgress);
masterPlayButton.addEventListener('click', togglePlayPause);
prevButton.addEventListener('click', playPrevSong);
nextButton.addEventListener('click', playNextSong);

renderSongList();
