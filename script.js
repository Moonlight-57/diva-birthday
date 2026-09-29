/* =========================================================
   EMAN BIRTHDAY EXPERIENCE
   FINAL FIXED SCRIPT
   Navigation + Music + Voice Wall + Filters + Secret Level
========================================================= */


/* ================= ELEMENTS ================= */

const screens = document.querySelectorAll(".screen");

const progressBar =
    document.getElementById("progressBar");

const currentCount =
    document.getElementById("currentCount");

const totalCount =
    document.getElementById("totalCount");

const backBtn =
    document.getElementById("backBtn");

const nextGlobal =
    document.getElementById("nextGlobal");

const replayBtn =
    document.getElementById("replayBtn");

const bgMusic =
    document.getElementById("bgMusic");

const musicToggle =
    document.getElementById("musicToggle");


/* ================= VOICE WALL ================= */

const voiceCards =
    document.querySelectorAll(".voice-card");

const voiceNotes =
    document.querySelectorAll(".voice-note-item");

const voicePlayer =
    document.getElementById("voicePlayer");

const voiceAudio =
    document.getElementById("voiceAudio");

const voiceMainPlay =
    document.getElementById("voiceMainPlay");

const voiceClose =
    document.getElementById("voiceClose");

const voiceProgress =
    document.getElementById("voiceProgress");

const voiceCurrentTime =
    document.getElementById("voiceCurrentTime");

const voiceDuration =
    document.getElementById("voiceDuration");

const voicePlayerTitle =
    document.getElementById("voicePlayerTitle");

const voiceStatus =
    document.getElementById("voiceStatus");

const speedButtons =
    document.querySelectorAll(".speed-btn");


/* ================= FILTERS ================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");

const filterImage =
    document.getElementById("filterImage");

const filterResult =
    document.getElementById("filterResult");


/* ================= JOKES ================= */

const jokeButton =
    document.getElementById("jokeButton");

const jokeResult =
    document.getElementById("jokeResult");


/* ================= ALL VIDEOS ================= */

const allVideos =
    document.querySelectorAll("video");


/* ================= SECRET LEVEL ================= */

const secretBtn =
    document.getElementById("secretBtn");

const secretScreen =
    document.getElementById("secretScreen");

const secretClose =
    document.getElementById("secretClose");


/* ================= MODAL ================= */

const memoryModal =
    document.getElementById("memoryModal");

const modalBody =
    document.getElementById("modalBody");

const modalClose =
    document.getElementById("modalClose");


/* ================= STATE ================= */

let currentScreen = 0;

const totalScreens =
    screens.length;

let musicStarted = false;

let musicEnabled = true;

let changingScreen = false;

let activeVideo = null;

let musicWasPlayingBeforeVideo = false;

let musicWasPlayingBeforeVoice = false;


/* ================= VOICE STATE ================= */

let currentWitness = null;

let currentNote = -1;

let currentSpeed = 1;


/* =========================================================
   MUSIC
========================================================= */

function startMusic() {

    if (!bgMusic || !musicEnabled) {
        return;
    }

    if (!bgMusic.paused) {
        return;
    }

    if (
        voiceAudio &&
        !voiceAudio.paused
    ) {
        return;
    }

    if (
        activeVideo &&
        !activeVideo.paused
    ) {
        return;
    }

    bgMusic.volume = 0.35;

    bgMusic.play()
        .then(() => {

            musicStarted = true;

            if (musicToggle) {
                musicToggle.classList.add("active");
            }

        })
        .catch(() => {

            /*
              Mobile browsers may block autoplay.
              First user interaction will start it.
            */

        });
}


function resumeMusic() {

    if (
        !bgMusic ||
        !musicEnabled ||
        !musicStarted
    ) {
        return;
    }

    if (
        voiceAudio &&
        !voiceAudio.paused
    ) {
        return;
    }

    if (
        activeVideo &&
        !activeVideo.paused
    ) {
        return;
    }

    bgMusic.play()
        .catch(() => {});
}


/* =========================================================
   VIDEO CONTROL
========================================================= */

function stopAllVideos(reset = false) {

    allVideos.forEach(video => {

        video.pause();

        if (reset) {

            try {
                video.currentTime = 0;
            } catch (error) {}

        }

    });

    activeVideo = null;

    musicWasPlayingBeforeVideo = false;
}


function handleVideoPlay(video) {

    /*
      Voice note always has priority.
    */

    if (
        voiceAudio &&
        !voiceAudio.paused
    ) {

        video.pause();

        return;
    }


    /*
      Stop any other video.
    */

    allVideos.forEach(otherVideo => {

        if (otherVideo !== video) {
            otherVideo.pause();
        }

    });


    activeVideo = video;


    /*
      Remember music state.
    */

    musicWasPlayingBeforeVideo =
        !!(
            bgMusic &&
            !bgMusic.paused &&
            musicEnabled
        );


    /*
      Video gets priority.
    */

    if (bgMusic) {
        bgMusic.pause();
    }

}


function handleVideoPause(video) {

    if (activeVideo !== video) {
        return;
    }

    activeVideo = null;


    if (changingScreen) {
        return;
    }


    if (
        voiceAudio &&
        !voiceAudio.paused
    ) {
        return;
    }


    if (musicWasPlayingBeforeVideo) {
        resumeMusic();
    }

}


function handleVideoEnded(video) {

    if (activeVideo === video) {
        activeVideo = null;
    }


    /*
      IMPORTANT:
      If this is the SECRET / ONE MORE THING video,
      open the final Happy Birthday popup after it ends.
    */

    if (
        secretScreen &&
        (
            secretScreen.classList.contains("show") ||
            secretScreen.classList.contains("active")
        )
    ) {

        setTimeout(() => {

            openBirthdayModal();

        }, 300);

    }


    if (changingScreen) {
        return;
    }


    if (
        voiceAudio &&
        !voiceAudio.paused
    ) {
        return;
    }


    if (musicWasPlayingBeforeVideo) {
        resumeMusic();
    }

}


/*
  Apply video behaviour to EVERY video:
  - incident video
  - secret/outtake video
  - any future video
*/

allVideos.forEach(video => {

    video.addEventListener(
        "play",
        () => handleVideoPlay(video)
    );

    video.addEventListener(
        "pause",
        () => handleVideoPause(video)
    );

    video.addEventListener(
        "ended",
        () => handleVideoEnded(video)
    );

});


/* =========================================================
   NAVIGATION
========================================================= */

function showScreen(index) {

    if (!screens.length) {
        return;
    }


    if (index < 0) {
        index = 0;
    }


    if (index >= totalScreens) {
        index = totalScreens - 1;
    }


    changingScreen = true;


    /*
      Leaving a screen:
      stop voice + video.
    */

    stopAllVoices(false);

    stopAllVideos(false);


    /*
      Close secret screen if normal navigation is used.
    */

    if (secretScreen) {

        secretScreen.classList.remove("show");
        secretScreen.classList.remove("active");
        secretScreen.setAttribute("hidden", "");

    }


    currentScreen = index;


    screens.forEach((screen, i) => {

        screen.classList.toggle(
            "active",
            i === currentScreen
        );

    });


    updateNavigationUI();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    setTimeout(() => {

        changingScreen = false;

        resumeMusic();

    }, 150);

}


/* =========================================================
   NAVIGATION UI
========================================================= */

function updateNavigationUI() {

    if (currentCount) {

        currentCount.textContent =
            String(currentScreen + 1)
                .padStart(2, "0");

    }


    if (totalCount) {

        totalCount.textContent =
            String(totalScreens)
                .padStart(2, "0");

    }


    if (progressBar) {

        const progress =
            ((currentScreen + 1) /
                totalScreens) * 100;

        progressBar.style.width =
            `${progress}%`;

    }


    if (backBtn) {

        backBtn.disabled =
            currentScreen === 0;

    }


    if (nextGlobal) {

        nextGlobal.disabled =
            currentScreen ===
            totalScreens - 1;

    }

}


function nextScreen() {

    if (
        currentScreen <
        totalScreens - 1
    ) {

        showScreen(
            currentScreen + 1
        );

    }

}


function previousScreen() {

    if (currentScreen > 0) {

        showScreen(
            currentScreen - 1
        );

    }

}


/* =========================================================
   NEXT BUTTONS
========================================================= */

document.querySelectorAll(
    ".next-btn, [data-next]"
).forEach(button => {

    button.addEventListener(
        "click",
        nextScreen
    );

});


/* =========================================================
   BACK BUTTON
========================================================= */

if (backBtn) {

    backBtn.addEventListener(
        "click",
        previousScreen
    );

}


if (nextGlobal) {

    nextGlobal.addEventListener(
        "click",
        nextScreen
    );

}


/* =========================================================
   KEYBOARD
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "ArrowRight" ||
            event.key === "Enter"
        ) {

            nextScreen();

        }


        if (
            event.key === "ArrowLeft"
        ) {

            previousScreen();

        }

    }
);


/* =========================================================
   MUSIC TOGGLE
========================================================= */

if (musicToggle) {

    musicToggle.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (!bgMusic) {
                return;
            }


            if (bgMusic.paused) {

                musicEnabled = true;

                startMusic();

            } else {

                bgMusic.pause();

                musicEnabled = false;

                musicToggle.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   FIRST USER INTERACTION
========================================================= */

document.addEventListener(
    "click",
    () => {

        startMusic();

    },
    {
        once: true
    }
);


/* =========================================================
   VOICE HELPERS
========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(seconds / 60);

    const remaining =
        Math.floor(seconds % 60);


    return `${minutes}:${String(
        remaining
    ).padStart(2, "0")}`;

}


/* =========================================================
   SHOW WITNESS NOTES
========================================================= */

function showWitnessNotes(witnessNumber) {

    document.querySelectorAll(
        ".voice-notes-list"
    ).forEach(list => {

        list.hidden = true;

    });


    const notes =
        document.getElementById(
            `witnessNotes${witnessNumber}`
        );


    if (!notes) {
        return;
    }


    notes.hidden = false;

    currentWitness =
        witnessNumber;

}


/* =========================================================
   HIDE VOICE PLAYER
========================================================= */

function hideVoicePlayer() {

    if (voicePlayer) {

        voicePlayer.style.display =
            "none";

    }

}


/* =========================================================
   SHOW VOICE PLAYER
========================================================= */

function showVoicePlayer() {

    if (voicePlayer) {

        voicePlayer.style.display =
            "block";

    }

}


/* =========================================================
   CLEAR ACTIVE NOTE
========================================================= */

function clearActiveVoiceNotes() {

    voiceNotes.forEach(note => {

        note.classList.remove(
            "active"
        );

    });

}


/* =========================================================
   STOP VOICE
========================================================= */

function stopAllVoices(
    resumeMusic = true
) {

    if (voiceAudio) {

        voiceAudio.pause();

        try {
            voiceAudio.currentTime = 0;
        } catch (error) {}

    }


    clearActiveVoiceNotes();


    currentWitness = null;

    currentNote = -1;


    if (voiceStatus) {

        voiceStatus.textContent =
            "SELECT A MESSAGE";

    }


    if (voicePlayerTitle) {

        voicePlayerTitle.textContent =
            "VOICE MESSAGE";

    }


    if (voiceCurrentTime) {

        voiceCurrentTime.textContent =
            "0:00";

    }


    if (voiceDuration) {

        voiceDuration.textContent =
            "0:00";

    }


    hideVoicePlayer();


    musicWasPlayingBeforeVoice = false;


    if (
        resumeMusic &&
        musicEnabled &&
        musicStarted
    ) {

        resumeMusic();

    }

}


/* =========================================================
   LOAD VOICE
========================================================= */

function loadVoice(note) {

    if (
        !voiceAudio ||
        !note
    ) {
        return;
    }


    const source =
        note.dataset.audio;


    if (!source) {

        if (voiceStatus) {
            voiceStatus.textContent =
                "AUDIO NOT FOUND";
        }

        return;
    }


    /*
      Remember music state.
    */

    musicWasPlayingBeforeVoice =
        !!(
            bgMusic &&
            !bgMusic.paused &&
            musicEnabled
        );


    /*
      Voice gets priority over video.
    */

    stopAllVideos(false);


    /*
      Pause background music.
    */

    if (bgMusic) {
        bgMusic.pause();
    }


    voiceAudio.pause();


    currentNote =
        Number(note.dataset.note) || 1;


    clearActiveVoiceNotes();

    note.classList.add("active");


    voiceAudio.src =
        source;

    voiceAudio.playbackRate =
        currentSpeed;

    voiceAudio.currentTime =
        0;

    voiceAudio.load();


    const title =
        note.querySelector(
            "strong"
        )?.textContent ||
        "VOICE MESSAGE";


    if (voicePlayerTitle) {

        voicePlayerTitle.textContent =
            title;

    }


    if (voiceStatus) {

        voiceStatus.textContent =
            "LOADING...";

    }


    showVoicePlayer();


    voiceAudio.play()
        .then(() => {

            if (voiceStatus) {

                voiceStatus.textContent =
                    "PLAYING";

            }

        })
        .catch(() => {

            if (voiceStatus) {

                voiceStatus.textContent =
                    "TAP PLAY";

            }

        });

}


/* =========================================================
   WITNESS CARD CLICK
========================================================= */

voiceCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            const witnessNumber =
                card.dataset.witness;


            showWitnessNotes(
                witnessNumber
            );

        }
    );

});


/* =========================================================
   VOICE NOTE CLICK
========================================================= */

voiceNotes.forEach(note => {

    note.addEventListener(
        "click",
        event => {

            event.stopPropagation();


            if (
                currentNote ===
                    Number(note.dataset.note) &&
                voiceAudio &&
                !voiceAudio.paused
            ) {

                voiceAudio.pause();

                return;

            }


            loadVoice(note);

        }
    );

});


/* =========================================================
   MAIN VOICE PLAY BUTTON
========================================================= */

if (voiceMainPlay) {

    voiceMainPlay.addEventListener(
        "click",
        () => {

            if (!voiceAudio) {
                return;
            }


            if (voiceAudio.paused) {

                stopAllVideos(false);

                if (bgMusic) {
                    bgMusic.pause();
                }


                voiceAudio.play()
                    .catch(() => {});

            } else {

                voiceAudio.pause();

            }

        }
    );

}


/* =========================================================
   VOICE CLOSE
========================================================= */

if (voiceClose) {

    voiceClose.addEventListener(
        "click",
        () => {

            const shouldResume =
                musicWasPlayingBeforeVoice;


            stopAllVoices(false);


            if (shouldResume) {

                resumeMusic();

            }

        }
    );

}


/* =========================================================
   VOICE AUDIO EVENTS
========================================================= */

if (voiceAudio) {

    voiceAudio.addEventListener(
        "loadedmetadata",
        () => {

            if (voiceDuration) {

                voiceDuration.textContent =
                    formatTime(
                        voiceAudio.duration
                    );

            }

        }
    );


    voiceAudio.addEventListener(
        "timeupdate",
        () => {

            if (voiceCurrentTime) {

                voiceCurrentTime.textContent =
                    formatTime(
                        voiceAudio.currentTime
                    );

            }


            if (
                voiceProgress &&
                Number.isFinite(
                    voiceAudio.duration
                )
            ) {

                voiceProgress.value =
                    (
                        voiceAudio.currentTime /
                        voiceAudio.duration
                    ) * 100;

            }

        }
    );


    voiceAudio.addEventListener(
        "play",
        () => {

            stopAllVideos(false);


            if (bgMusic) {
                bgMusic.pause();
            }


            if (voiceStatus) {

                voiceStatus.textContent =
                    "PLAYING";

            }

        }
    );


    voiceAudio.addEventListener(
        "pause",
        () => {

            if (voiceStatus) {

                voiceStatus.textContent =
                    "PAUSED";

            }

        }
    );


    voiceAudio.addEventListener(
        "ended",
        () => {

            clearActiveVoiceNotes();


            if (voiceStatus) {

                voiceStatus.textContent =
                    "COMPLETE";

            }


            if (
                musicWasPlayingBeforeVoice
            ) {

                resumeMusic();

            }

        }
    );


    voiceAudio.addEventListener(
        "error",
        () => {

            if (voiceStatus) {

                voiceStatus.textContent =
                    "AUDIO ERROR";

            }

        }
    );

}


/* =========================================================
   VOICE PROGRESS
========================================================= */

if (voiceProgress) {

    voiceProgress.addEventListener(
        "input",
        () => {

            if (
                voiceAudio &&
                Number.isFinite(
                    voiceAudio.duration
                )
            ) {

                voiceAudio.currentTime =
                    (
                        voiceProgress.value /
                        100
                    ) *
                    voiceAudio.duration;

            }

        }
    );

}


/* =========================================================
   VOICE SPEED
========================================================= */

speedButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const speed =
                parseFloat(
                    button.dataset.speed
                );


            if (Number.isNaN(speed)) {
                return;
            }


            currentSpeed =
                speed;


            if (voiceAudio) {

                voiceAudio.playbackRate =
                    speed;

            }


            speedButtons.forEach(
                speedButton => {

                    speedButton.classList.toggle(
                        "active",
                        speedButton === button
                    );

                }
            );

        }
    );

});


/* =========================================================
   FILTERS
========================================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                item => {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            const filter =
                button.dataset.filter;


            if (!filterImage) {
                return;
            }


            filterImage.classList.remove(
                "filter-pink",
                "filter-purple",
                "filter-glow",
                "filter-chaos"
            );


            if (
                filter === "glow"
            ) {

                filterImage.classList.add(
                    "filter-glow"
                );

                if (filterResult) {

                    filterResult.textContent =
                        "GLOW MODE ACTIVATED.";

                }

            } else if (
                filter === "chaos"
            ) {

                filterImage.classList.add(
                    "filter-chaos"
                );

                if (filterResult) {

                    filterResult.textContent =
                        "EVERYTHING MODE DETECTED.";

                }

            } else {

                if (filterResult) {

                    filterResult.textContent =
                        "NORMAL MODE DETECTED.";

                }

            }

        }
    );

});


/* =========================================================
   JOKES
========================================================= */

const jokes = [

    "Eman ka filter folder probably NASA se zyada organized hai.",

    "Argument start karne mein 2 seconds. Help karne mein 0 seconds.",

    "Bakwas moun p maar dungi — officially friendship contract ka part.",

    "Ek normal picture lene gaye thay. 48 filters baad wapas aaye.",

    "Food ka plan ho to attendance automatically lag jati hai.",

    "Eman: Bas ek picture. Also Eman: 37 pictures later.",

    "University ne degree di. Humne trauma aur memories collect ki.",

    "Fashion check ke baghair koi event officially start nahi hota."

];


if (jokeButton) {

    jokeButton.addEventListener(
        "click",
        () => {

            const random =
                Math.floor(
                    Math.random() *
                    jokes.length
                );


            if (jokeResult) {

                jokeResult.textContent =
                    jokes[random];

            }

        }
    );

}


/* =========================================================
   OPEN BIRTHDAY MODAL
========================================================= */

function openBirthdayModal() {

    if (!memoryModal) {
        return;
    }


    /*
      Make sure the popup is not hidden.
    */

    memoryModal.removeAttribute("hidden");


    /*
      Support both versions of the CSS:
      .show and .active
    */

    memoryModal.classList.add("show");
    memoryModal.classList.add("active");


    /*
      Keep the existing popup content if HTML
      already provides it.
      
      If modalBody exists and is empty, use the
      existing birthday message.
    */

    if (
        modalBody &&
        !modalBody.innerHTML.trim()
    ) {

        modalBody.innerHTML = `
            <div class="birthday-popup-content">

                <div class="birthday-popup-icon">
                    🎂
                </div>

                <div class="eyebrow">
                    ONE LAST THING
                </div>

                <h2>
                    HAPPY BIRTHDAY,
                    <em>EMAN.</em>
                </h2>

                <p>
                    From university chaos to random plans,
                    filters, food, arguments, injuries,
                    and somehow making ordinary days memorable...
                </p>

                <p>
                    We're really glad you're one of us.
                </p>

                <div class="birthday-popup-signature">
                    4 JISM. 1 JAAN.<br>
                    ALWAYS.
                </div>

            </div>
        `;

    }

}


/* =========================================================
   CLOSE BIRTHDAY MODAL
========================================================= */

function closeBirthdayModal() {

    if (!memoryModal) {
        return;
    }


    memoryModal.classList.remove("show");
    memoryModal.classList.remove("active");

    memoryModal.setAttribute("hidden", "");

}


/* =========================================================
   SECRET LEVEL
========================================================= */

if (secretBtn) {

    secretBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();


            /*
              Stop normal page media.
            */

            stopAllVoices(false);

            stopAllVideos(false);


            /*
              Hide all normal screens.
            */

            screens.forEach(screen => {

                screen.classList.remove(
                    "active"
                );

            });


            /*
              Open SECRET LEVEL.
              
              IMPORTANT:
              Earlier version used .show.
              Current version used .active.
              We support both.
            */

            if (secretScreen) {

                secretScreen.classList.add(
                    "show"
                );

                secretScreen.classList.add(
                    "active"
                );

                secretScreen.removeAttribute(
                    "hidden"
                );

            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


            /*
              Background music can continue only
              until the secret video actually starts.
            */

            resumeMusic();

        }
    );

}


/* =========================================================
   SECRET CLOSE / OKAY FINE
========================================================= */

if (secretClose) {

    secretClose.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();


            /*
              Stop outtake video.
            */

            stopAllVideos(false);


            /*
              Close SECRET LEVEL.
            */

            if (secretScreen) {

                secretScreen.classList.remove(
                    "show"
                );

                secretScreen.classList.remove(
                    "active"
                );

                secretScreen.setAttribute(
                    "hidden",
                    ""
                );

            }


            /*
              Return to final normal screen.
            */

            screens.forEach(
                (screen, index) => {

                    screen.classList.toggle(
                        "active",
                        index ===
                        totalScreens - 1
                    );

                }
            );


            currentScreen =
                totalScreens - 1;


            updateNavigationUI();


            resumeMusic();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* =========================================================
   MODAL CLOSE / BACK ARROW
========================================================= */

if (modalClose) {

    modalClose.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            closeBirthdayModal();

        }
    );

}


/* =========================================================
   MODAL BACKGROUND CLICK
========================================================= */

if (memoryModal) {

    memoryModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                memoryModal
            ) {

                closeBirthdayModal();

            }

        }
    );

}


/* =========================================================
   REPLAY
========================================================= */

if (replayBtn) {

    replayBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();


            stopAllVoices(false);

            stopAllVideos(true);


            if (secretScreen) {

                secretScreen.classList.remove(
                    "show"
                );

                secretScreen.classList.remove(
                    "active"
                );

                secretScreen.setAttribute(
                    "hidden",
                    ""
                );

            }


            closeBirthdayModal();


            if (bgMusic) {

                bgMusic.pause();

                bgMusic.currentTime =
                    0;

            }


            musicStarted = false;


            showScreen(0);


            if (musicEnabled) {

                startMusic();

            }

        }
    );

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

document.querySelectorAll(
    "img"
).forEach(image => {

    image.addEventListener(
        "error",
        () => {

            image.style.opacity =
                "0.25";

        }
    );

});


/* =========================================================
   INITIALIZE
========================================================= */

screens.forEach(
    (screen, index) => {

        screen.classList.toggle(
            "active",
            index === 0
        );

    }
);


updateNavigationUI();


/*
  Make sure all voice note lists
  start closed.
*/

document.querySelectorAll(
    ".voice-notes-list"
).forEach(list => {

    list.hidden = true;

});


hideVoicePlayer();


if (secretScreen) {

    secretScreen.classList.remove(
        "show"
    );

    secretScreen.classList.remove(
        "active"
    );

    secretScreen.setAttribute(
        "hidden",
        ""
    );

}


if (memoryModal) {

    memoryModal.classList.remove(
        "show"
    );

    memoryModal.classList.remove(
        "active"
    );

    memoryModal.setAttribute(
        "hidden",
        ""
    );

}


speedButtons.forEach(
    (button, index) => {

        button.classList.toggle(
            "active",
            index === 0
        );

    }
);

