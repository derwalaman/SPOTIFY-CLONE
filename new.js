// LETS START JS
console.log("Let's Write JavaScript")

// GLOBAL VARIBALE
let currentSong = new Audio()
currentSong.volume = 1
let times = 1;
let runtime;

// GET INITIAL SONGS DETAIL
async function getSongs(url) {
    let song = await fetch(url)
    let response = await song.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i]
        if (element.href.endsWith('.mp3')) {
            songs.push(element.href)
        }
    }
    return songs
}

// GET PLAYLISTS
async function getPlaylists() {
    let playlist = await fetch('http://127.0.0.1:3000/assets/playlists')
    let response = await playlist.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    let playlists = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i]
        if (element.href.endsWith('.playlist/')) {
            playlists.push(element.href)
        }
    }
    return playlists
}

// GET PLAYLIST INFO / DETAILS
async function gettitleinfo(url) {
    let name = await fetch(url)
    let response = await name.text()
    response = response.split('\n')
    return response
}

// GET SONGS NAME AND ARTIST NAME
async function getnames(url) {
    let name = await fetch(url)
    let response = await name.text()
    response = response.split('\n')
    return response
}

// PLAY MUSIC
const playMusic = (runtime_check, url) => {
    currentSong.src = `${url}`
    if (runtime_check) {
        currentSong.currentTime = runtime
    }
    currentSong.play()
}

// PLAY - PAUSE BUTTON CONTROLS
function playbutton() {
    document.getElementById('playMusic').addEventListener("click", () => {
        if (currentSong.src != '') {
            if (currentSong.paused) {
                times = 1
                currentSong.play()
                document.getElementById('playMusic').src = `assets/images/pause.svg`
                if (currentSong.src != '') {
                    let id = currentSong.src.split('/audio/')[1].split('.')[0]
                    let element = document.querySelectorAll('.sbox')[id - 1]
                    element.querySelector('.playbutton img').src = 'assets/images/pause.svg';
                }
            } else {
                currentSong.pause()
                document.getElementById('playMusic').src = `assets/images/play.svg`
                if (currentSong.src != '') {
                    let id = currentSong.src.split('/audio/')[1].split('.')[0]
                    let element = document.querySelectorAll('.sbox')[id - 1]
                    element.querySelector('.playbutton img').src = 'assets/images/play.svg';
                }
                times++
                if (times % 2 == 0) {
                    runtime = currentSong.currentTime
                }
            }
        }
    })
}

// CHANGE GREEN COLOR EFFECT FROM CURRENT SONG
function getCurrentSongInfo() {
    if (currentSong.src != '') {
        let id = currentSong.src.split('/audio/')[1].split('.')[0]
        let element = document.querySelectorAll('.sbox')[id - 1]
        element.getElementsByClassName('songname')[0].style.color = 'white'
        element.querySelector('.playbutton img').src = 'assets/images/play.svg';
    }
}

// SONG BAR CONTROL - MUSIC SEEKBAR
function verify(sec) {
    if (sec < 10) {
        sec = String(`0${sec}`)
    }
    return sec
}

function barinfo() {
    if (currentSong.src !== '' && !isNaN(currentSong.duration)) {
        let ongoing_min = parseInt(currentSong.currentTime / 60);
        let ongoing_sec = parseInt(currentSong.currentTime % 60);

        let duration_min = parseInt(currentSong.duration / 60);
        let duration_sec = parseInt(currentSong.duration % 60);

        duration_sec = verify(duration_sec);
        ongoing_sec = verify(ongoing_sec);

        document.getElementById('currenttime').innerHTML = `${ongoing_min}:${ongoing_sec}`;
        document.getElementById('durationtime').innerHTML = `${duration_min}:${duration_sec}`;

        document.getElementById('progressed').style.width = Math.floor(currentSong.currentTime * 100 / currentSong.duration) + '%';
        document.getElementById('circlebar').style.left = (Math.floor(currentSong.currentTime * 100 / currentSong.duration) - 1) + '%';

        document.getElementById('progress_bar').onclick = (e) => {
            currentSong.currentTime = ((e.offsetX / progress_bar.offsetWidth) * currentSong.duration)
        }
    }
}

// SONG BAR CONTROL - SOUND SEEKBAR
function volumeinfo() {
    document.getElementById('volbar').addEventListener("click", (e) => {
        document.getElementById('volline').style.width = ((e.offsetX / volbar.offsetWidth) * 100) + '%';
        document.getElementById('volcircle').style.left = ((e.offsetX / volbar.offsetWidth) * 100) + '%';
        currentSong.volume = (e.offsetX / volbar.offsetWidth)
        if (currentSong.volume > 0) {
            document.getElementById('soundvol').src = 'assets/images/volume.svg'
        } else {
            document.getElementById('soundvol').src = 'assets/images/mute.svg'
        }
    })
}

function soundsymbol() {
    document.getElementById('soundvol').addEventListener("click", () => {
        if (document.getElementById('soundvol').src == 'http://127.0.0.1:3000/assets/images/volume.svg') {
            document.getElementById('volline').style.width = '0%'
            document.getElementById('volcircle').style.left = '-1%'
            currentSong.volume = 0
            document.getElementById('soundvol').src = 'http://127.0.0.1:3000/assets/images/mute.svg'
        } else if (document.getElementById('soundvol').src == 'http://127.0.0.1:3000/assets/images/mute.svg') {
            document.getElementById('volline').style.width = '100%'
            document.getElementById('volcircle').style.left = '99%'
            currentSong.volume = 1
            document.getElementById('soundvol').src = 'http://127.0.0.1:3000/assets/images/volume.svg'
        }
    })
}

// CREATE SONG CARD
function createSongCard(songnames, artistnames, url) {
    let element = document.querySelector('.lib-song')
    let html = `<div class="sbox">
                        <div class="s-info">
                            <img src="${url}" alt="">
                            <div class="s-title">
                                <p class="songname">${songnames}</p>
                                <p class="artistname">${artistnames}</p>
                            </div>
                        </div>
                        <div id="playMusic2" class="playbutton"><img width="14" class="invert" src="assets/images/play.svg" alt=""></div>
                    </div>`
    element.innerHTML = element.innerHTML + html
}

// MUSIC AUTOPLAY FUNCTION
function autoplay(songnames, artistnames, pid, sid) {
    if (currentSong.src != '') {
        if (currentSong.currentTime == currentSong.duration) {
            let pid2 = document.querySelector('.sbox').getElementsByTagName('img')[0].src.split('/playlists/')[1].split('.playlist')[0]

            if ((sid) == songnames.length) {
                sid = 1
            } else {
                sid++
            }
            document.getElementById('barsonginfo').innerHTML = ''
            if (pid == pid2) {
                getCurrentSongInfo()
                document.querySelectorAll('.sbox')[sid - 1].getElementsByClassName('songname')[0].style.color = '#1fdf64'
                document.querySelectorAll('.sbox')[sid - 1].querySelector('.playbutton img').src = 'assets/images/pause.svg';
            }
            playMusic(false, `assets/playlists/${pid}.playlist/audio/${sid}.mp3`)
            document.getElementById('playMusic').src = `assets/images/pause.svg`
            document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/${pid}.playlist/songimg/${sid}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames[sid - 1]}</p>
                        <p class="artistname2">${artistnames[sid - 1]}</p>
                    </div> `
            currentSong.ontimeupdate = function () {
                barinfo();
                autoplay(songnames, artistnames, pid, sid)
            };

        }
    }
}

// PLAYING MUSIC
async function playingMusic(pid, sid, status, e, songnames, artistnames) {
    document.getElementById('barsonginfo').innerHTML = ''
    getCurrentSongInfo()
    let pid2 = e.getElementsByTagName('img')[0].src.split('/playlists/')[1].split('.playlist')[0]
    playMusic(status, `assets/playlists/${pid}.playlist/audio/${sid}.mp3`)
    document.getElementById('playMusic').src = `assets/images/pause.svg`
    if (pid == pid2) {
        e.getElementsByClassName('songname')[0].style.color = '#1fdf64'
        e.querySelector('.playbutton img').src = 'assets/images/pause.svg';
        document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/${pid}.playlist/songimg/${sid}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames[sid - 1]}</p>
                        <p class="artistname2">${artistnames[sid - 1]}</p>
                    </div> `
        currentSong.ontimeupdate = function () {
            barinfo();
            autoplay(songnames, artistnames, pid, sid)
        };
    } else {
        let songnames_old = await getnames(`http://127.0.0.1:3000/assets/playlists/${pid}.playlist/songname.txt`)
        let artistnames_old = await getnames(`http://127.0.0.1:3000/assets/playlists/${pid}.playlist/artistname.txt`)
        document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/${pid}.playlist/songimg/${sid}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames_old[sid - 1]}</p>
                        <p class="artistname2">${artistnames_old[sid - 1]}</p>
                    </div> `
        currentSong.ontimeupdate = function () {
            barinfo();
            autoplay(songnames_old, artistnames_old, pid, sid)
        };
    }
}

// SONG BAR - PREV BUTTON
function prev_button() {
    document.getElementById('prevMusic').addEventListener("click", async function () {
        if (currentSong.src != '') {
            let playlistId = currentSong.src.split('/playlists/')[1].split('/audio/')[0].split('.')[0]
            let songId = currentSong.src.split('/playlists/')[1].split('/audio/')[1].split('.')[0]
            let pid2 = document.querySelector('.sbox').getElementsByTagName('img')[0].src.split('/playlists/')[1].split('.playlist')[0]
            let songnames = await getnames(`http://127.0.0.1:3000/assets/playlists/${pid2}.playlist/songname.txt`)
            let artistnames = await getnames(`http://127.0.0.1:3000/assets/playlists/${pid2}.playlist/artistname.txt`)
            if (playlistId == pid2) {
                console.log('inside')
                if ((songId - 1) == 0) {
                    songId = songnames.length
                } else {
                    songId--
                }
                e = document.querySelectorAll('.sbox')[songId - 1]
                playingMusic(playlistId, songId, false, e, songnames, artistnames)
            } else {
                let songnames_old = await getnames(`http://127.0.0.1:3000/assets/playlists/${playlistId}.playlist/songname.txt`)
                let artistnames_old = await getnames(`http://127.0.0.1:3000/assets/playlists/${playlistId}.playlist/artistname.txt`)
                if ((songId - 1) == 0) {
                    songId = songnames_old.length
                } else {
                    songId--
                }
                document.getElementById('barsonginfo').innerHTML = ''
                playMusic(false, `assets/playlists/${playlistId}.playlist/audio/${songId}.mp3`)
                document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/${playlistId}.playlist/songimg/${songId}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames_old[songId - 1]}</p>
                        <p class="artistname2">${artistnames_old[songId - 1]}</p>
                    </div> `
                currentSong.ontimeupdate = function () {
                    barinfo();
                    autoplay(songnames_old, artistnames_old, playlistId, songId)
                };
            }

        }

    })

}

// SONG BAR - NEXT BUTTON
function next_button() {
    document.getElementById('nextMusic').addEventListener("click", async function () {
        if (currentSong.src != '') {
            let playlistId = currentSong.src.split('/playlists/')[1].split('/audio/')[0].split('.')[0]
            let songId = currentSong.src.split('/playlists/')[1].split('/audio/')[1].split('.')[0]
            let pid2 = document.querySelector('.sbox').getElementsByTagName('img')[0].src.split('/playlists/')[1].split('.playlist')[0]
            let songnames = await getnames(`http://127.0.0.1:3000/assets/playlists/${pid2}.playlist/songname.txt`)
            let artistnames = await getnames(`http://127.0.0.1:3000/assets/playlists/${pid2}.playlist/artistname.txt`)
            if (playlistId == pid2) {
                if ((songId) == songnames.length) {
                    songId = 1
                } else {
                    songId++
                }
                e = document.querySelectorAll('.sbox')[songId - 1]
                playingMusic(playlistId, songId, false, e, songnames, artistnames)
            } else {
                let songnames_old = await getnames(`http://127.0.0.1:3000/assets/playlists/${playlistId}.playlist/songname.txt`)
                let artistnames_old = await getnames(`http://127.0.0.1:3000/assets/playlists/${playlistId}.playlist/artistname.txt`)
                if ((songId) == songnames_old.length) {
                    songId = 1
                } else {
                    songId++
                }
                document.getElementById('barsonginfo').innerHTML = ''
                playMusic(false, `assets/playlists/${playlistId}.playlist/audio/${songId}.mp3`)
                document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/${playlistId}.playlist/songimg/${songId}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames_old[songId - 1]}</p>
                        <p class="artistname2">${artistnames_old[songId - 1]}</p>
                    </div> `
                currentSong.ontimeupdate = function () {
                    barinfo();
                    autoplay(songnames_old, artistnames_old, playlistId, songId)
                };
            }
        }

    })

}

// SONG CARD CLICK FUNCTION
function songCardClick(songnames, artistnames) {
    document.querySelectorAll('.sbox').forEach(e => {
        e.addEventListener("click", () => {

            let playlistId = e.getElementsByTagName('img')[0].src.split('/playlists/')[1].split('/songimg/')[0].split('.')[0]
            let songId = e.getElementsByTagName('img')[0].src.split('/playlists/')[1].split('/songimg/')[1].split('.')[0]

            let playlistId2 = null
            let songId2 = null

            if (currentSong.src != '') {
                playlistId2 = currentSong.src.split('/playlists/')[1].split('/audio/')[0].split('.')[0]
                songId2 = currentSong.src.split('/playlists/')[1].split('/audio/')[1].split('.')[0]

            }
            if (songId == songId2 && playlistId == playlistId2) {
                times++
                if (times % 2 == 0) {
                    document.getElementById('playMusic').src = `assets/images/play.svg`
                    e.querySelector('.playbutton img').src = 'assets/images/play.svg';
                    runtime = currentSong.currentTime
                    currentSong.pause()
                } else {
                    times = 1
                    playingMusic(playlistId, songId, true, e, songnames, artistnames)
                }
            } else {
                times = 1
                playingMusic(playlistId, songId, false, e, songnames, artistnames)
            }

        })

    })

}

// CREATE PLAYLIST CARDS
function createPlaylistCard(i, title, subtitle) {
    document.querySelector('.card-container').innerHTML += ` <div class="card">

            
                        <img class="rounded" src="assets/playlists/${i + 1}.playlist/img.png"
                            alt="">

                        <div class="play-info">
                            <h4>${title}</h4>
                            <p>${subtitle}</p>
                        </div>

                    </div>`
}

// MAIN FUNCTION
async function main() {

    if (window.innerWidth < 800) {
        document.querySelector('.right-footer').innerHTML = ''
    }

    // GET INITIAL SONGS
    let songs = await getSongs('http://127.0.0.1:3000/assets/playlists/1.playlist/audio')
    songs.sort()

    // GET INITIAL SONG NAMES
    let songnames = await getnames('http://127.0.0.1:3000/assets/playlists/1.playlist/songname.txt')

    // GET INITIAL SONG ARTIST NAMES
    let artistnames = await getnames('http://127.0.0.1:3000/assets/playlists/1.playlist/artistname.txt')

    // CREATE INITIAL SONG CARD
    for (let i = 0; i < songnames.length; i++) {
        createSongCard(songnames[i], artistnames[i], `assets/playlists/1.playlist/songimg/${i + 1}.jpeg`)
    }

    // GET PLAYLISTS
    let playlists = await getPlaylists()

    // CREATE PLAYLIST CARDS
    for (let i = 0; i < playlists.length; i++) {
        let playlistinfo = await gettitleinfo(`assets/playlists/${i + 1}.playlist/info.txt`)
        createPlaylistCard(i, playlistinfo[0], playlistinfo[1])
    }

    // PLAYLIST CLICK
    document.querySelectorAll('.card').forEach(e => {
        e.addEventListener("click", async function () {
            if (window.innerWidth < 1000) {
                document.querySelector('.left').style.left = "-1%"
                document.querySelector('.left').style.backgroundColor = 'black'
            }
            let pid = e.querySelector('.rounded').src.split('/playlists/')[1].split('.')[0]
            songs = await getSongs(`http://127.0.0.1:3000/assets/playlists/${pid}.playlist/audio`)
            songnames = await getnames(`http://127.0.0.1:3000/assets/playlists/${pid}.playlist/songname.txt`)
            artistnames = await getnames(`http://127.0.0.1:3000/assets/playlists/${pid}.playlist/artistname.txt`)
            document.querySelector('.lib-song').innerHTML = ''
            for (let i = 0; i < songnames.length; i++) {
                createSongCard(songnames[i], artistnames[i], `assets/playlists/${pid}.playlist/songimg/${i + 1}.jpeg`)
            }
            songCardClick(songnames, artistnames)
            if (currentSong.src != '') {
                let id = currentSong.src.split('/audio/')[1].split('.')[0]
                let pid2 = currentSong.src.split('/playlists/')[1].split('.playlist/')[0]
                if (pid == pid2) {
                    document.querySelectorAll('.sbox')[id - 1].getElementsByClassName('songname')[0].style.color = '#1fdf64'
                    document.querySelectorAll('.sbox')[id - 1].querySelector('.playbutton img').src = document.getElementById('playMusic').src
                }
            }
        })
    })

    // SOME IMP FEATURES FUNCTION
    songCardClick(songnames, artistnames)
    playbutton()
    volumeinfo()
    soundsymbol()
    prev_button()
    next_button()

    // MOBILE DEVICES FEATURES
    document.querySelector('.hamburmenu').addEventListener("click", () => {
        document.querySelector('.left').style.left = "-1%"
        document.querySelector('.left').style.backgroundColor = 'black'
    })

    document.querySelector('.closes').addEventListener("click", () => {
        document.querySelector('.left').style.left = "-100%"
        document.querySelector('.left').style.backgroundColor = 'transparent'
    })

    document.getElementById('homepage').addEventListener("click", () => {
        document.querySelector('.left').style.left = "-100%"
        document.querySelector('.left').style.backgroundColor = 'transparent'
    })

}

main()
