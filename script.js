console.log("Let's Write JavaScript")
let currentSong = new Audio()
currentSong.volume = 1
let times = 1;
let runtime;

// get initial songs - done
async function getSongs() {
    let song = await fetch('http://127.0.0.1:3000/assets/playlists/1.playlist/audio')
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

// get playlists - done
async function getPlaylists() {
    let playlist = await fetch('http://127.0.0.1:3000/assets/playlists')
    let response = await playlist.text()
    console.log(response)
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

// get playlist info - done
async function gettitleinfo(url) {
    let name = await fetch(url)
    let response = await name.text()
    response = response.split('\n')
    return response
}

async function getnames(url) {
    let name = await fetch(url)
    let response = await name.text()
    response = response.split('\n')
    return response
}

const playMusic = (id, runtime_check) => {
    console.log(runtime_check)
    currentSong.src = `assets/playlists/1.playlist/audio/${id}.mp3`
    if (runtime_check) {
        currentSong.currentTime = runtime
    }
    currentSong.play()
}

// function playbutton2(){
//     document.getElementById('playMusic2').addEventListener("click" , (e)=> {
//         e.stopPropagation()
//         if(currentSong.paused){
//             currentSong.play()
//             document.getElementById('playMusic2').src = `assets/images/pause.svg`
//             document.getElementById('playMusic').src = `assets/images/pause.svg`
//         } else {
//             currentSong.pause()
//             document.getElementById('playMusic2').src = `assets/images/play.svg`
//             document.getElementById('playMusic').src = `assets/images/play.svg`
//         }
//     })
// }

function playbutton() {
    document.getElementById('playMusic').addEventListener("click", () => {
        if (currentSong.src != '') {
            if (currentSong.paused) {
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
            }
        }
    })
}

function getCurrentSongInfo() {
    if (currentSong.src != '') {
        let id = currentSong.src.split('/audio/')[1].split('.')[0]
        let element = document.querySelectorAll('.sbox')[id - 1]
        element.getElementsByClassName('songname')[0].style.color = 'white'
        element.querySelector('.playbutton img').src = 'assets/images/play.svg';
    }
}

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

function volumeinfo() {
    document.getElementById('volbar').addEventListener("click", (e) => {
        document.getElementById('volline').style.width = ((e.offsetX / volbar.offsetWidth) * 100) + '%';
        document.getElementById('volcircle').style.left = ((e.offsetX / volbar.offsetWidth) * 100) + '%';
        currentSong.volume = (e.offsetX / volbar.offsetWidth)
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

function prev_button(songnames, artistnames) {
    document.getElementById('prevMusic').addEventListener("click", () => {
        if (currentSong.src != '') {
            document.getElementById('barsonginfo').innerHTML = ''
            let id = currentSong.src.split('/audio/')[1].split('.')[0]
            if ((id - 1) == 0) {
                id = songnames.length
            } else {
                id--
            }

            getCurrentSongInfo()
            playMusic(id, false)
            document.getElementById('playMusic').src = `assets/images/pause.svg`
            document.querySelectorAll('.sbox')[id - 1].getElementsByClassName('songname')[0].style.color = '#1fdf64'
            document.querySelectorAll('.sbox')[id - 1].querySelector('.playbutton img').src = 'assets/images/pause.svg';
            document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/1.playlist/songimg/${id}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames[id - 1]}</p>
                        <p class="artistname2">${artistnames[id - 1]}</p>
                    </div> `
            currentSong.ontimeupdate = function () {
                barinfo();
                autoplay(songnames, artistnames)
            };
        }

    })

}

function next_button(songnames, artistnames) {
    document.getElementById('nextMusic').addEventListener("click", () => {
        if (currentSong.src != '') {
            document.getElementById('barsonginfo').innerHTML = ''
            let id = currentSong.src.split('/audio/')[1].split('.')[0]
            if ((id) == songnames.length) {
                id = 1
            } else {
                id++
            }

            getCurrentSongInfo()
            playMusic(id, false)
            document.getElementById('playMusic').src = `assets/images/pause.svg`
            document.querySelectorAll('.sbox')[id - 1].getElementsByClassName('songname')[0].style.color = '#1fdf64'
            document.querySelectorAll('.sbox')[id - 1].querySelector('.playbutton img').src = 'assets/images/pause.svg';
            document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/1.playlist/songimg/${id}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames[id - 1]}</p>
                        <p class="artistname2">${artistnames[id - 1]}</p>
                    </div> `
            currentSong.ontimeupdate = function () {
                barinfo();
                autoplay(songnames, artistnames)
            };
        }

    })

}

function autoplay(songnames, artistnames) {
    if (currentSong.src != '') {
        if (currentSong.currentTime == currentSong.duration) {
            document.getElementById('barsonginfo').innerHTML = ''
            let id = currentSong.src.split('/audio/')[1].split('.')[0]
            if ((id) == songnames.length) {
                id = 1
            } else {
                id++
            }

            getCurrentSongInfo()
            playMusic(id, false)
            document.getElementById('playMusic').src = `assets/images/pause.svg`
            document.querySelectorAll('.sbox')[id - 1].getElementsByClassName('songname')[0].style.color = '#1fdf64'
            document.querySelectorAll('.sbox')[id - 1].querySelector('.playbutton img').src = 'assets/images/pause.svg';
            document.getElementById('barsonginfo').innerHTML = `
                <img src="assets/playlists/1.playlist/songimg/${id}.jpeg" alt="">
                <div class="songcontent">
                    <p class="songname2">${songnames[id - 1]}</p>
                    <p class="artistname2">${artistnames[id - 1]}</p>
                </div> `
            currentSong.ontimeupdate = function () {
                barinfo();
                autoplay(songnames, artistnames)
            };
        }
    }
}

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

async function main() {

    // get initial songs
    let songs = await getSongs()
    songs.sort()
    console.log(songs)

    // get song name list
    let songnames = await getnames('http://127.0.0.1:3000/assets/playlists/1.playlist/songname.txt')
    console.log(songnames)

    // get artist name list
    let artistnames = await getnames('http://127.0.0.1:3000/assets/playlists/1.playlist/artistname.txt')
    console.log(artistnames)

    for (let i = 0; i < songnames.length; i++) {
        createSongCard(songnames[i], artistnames[i], `assets/playlists/1.playlist/songimg/${i + 1}.jpeg`)
    }

    // play song onclick
    document.querySelectorAll('.sbox').forEach(e => {
        e.addEventListener("click", () => {
            let id = e.getElementsByTagName('img')[0].src.split('/songimg/')[1].split('.')[0]
            let id2 = null
            if (currentSong.src != '') {
                id2 = currentSong.src.split('/audio/')[1].split('.')[0]
            }
            if (id == id2) {
                times++
                if (times % 2 == 0) {
                    getCurrentSongInfo()
                    document.getElementById('playMusic').src = `assets/images/play.svg`
                    runtime = currentSong.currentTime
                    console.log(runtime)
                    currentSong.pause()
                } else {
                    times = 1
                    document.getElementById('barsonginfo').innerHTML = ''
                    getCurrentSongInfo()
                    playMusic(id, true)
                    document.getElementById('playMusic').src = `assets/images/pause.svg`
                    e.getElementsByClassName('songname')[0].style.color = '#1fdf64'
                    e.querySelector('.playbutton img').src = 'assets/images/pause.svg';
                    document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/1.playlist/songimg/${id}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames[id - 1]}</p>
                        <p class="artistname2">${artistnames[id - 1]}</p>
                    </div> `
                    currentSong.ontimeupdate = function () {
                        barinfo();
                        autoplay(songnames, artistnames)
                    };
                }
            } else {
                times = 1
                document.getElementById('barsonginfo').innerHTML = ''
                getCurrentSongInfo()
                playMusic(id, false)
                document.getElementById('playMusic').src = `assets/images/pause.svg`
                e.getElementsByClassName('songname')[0].style.color = '#1fdf64'
                e.querySelector('.playbutton img').src = 'assets/images/pause.svg';
                document.getElementById('barsonginfo').innerHTML = `
            <img src="assets/playlists/1.playlist/songimg/${id}.jpeg" alt="">
                    <div class="songcontent">
                        <p class="songname2">${songnames[id - 1]}</p>
                        <p class="artistname2">${artistnames[id - 1]}</p>
                    </div> `
                currentSong.ontimeupdate = function () {
                    barinfo();
                    autoplay(songnames, artistnames)
                };
            }
        })
    })

    playbutton()
    prev_button(songnames, artistnames)
    next_button(songnames, artistnames)
    volumeinfo()
    soundsymbol()

    document.querySelector('.hamburmenu').addEventListener("click", () => {
        document.querySelector('.left').style.left = "0"
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

    playlists = await getPlaylists()
    console.log(playlists)

    for (let i = 0; i < playlists.length; i++) {
        let playlistinfo = await gettitleinfo(`assets/playlists/${i + 1}.playlist/info.txt`)
        document.querySelector('.card-container').innerHTML += ` <div class="card">

                        <div class="play">
                            <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>

                        <img class="rounded" src="assets/playlists/${i + 1}.playlist/img.png"
                            alt="">

                        <div class="play-info">
                            <h4>${playlistinfo[0]}</h4>
                            <p>${playlistinfo[1]}</p>
                        </div>

                    </div>`
    }

    document.querySelectorAll('.card').forEach(e => {
        e.addEventListener("click" , ()=>{
            
        })
    })

}

main()