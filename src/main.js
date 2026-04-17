import './style.css'

const prevZone = document.querySelector("#prevZone");
const nextZone = document.querySelector("#nextZone");
const book = document.querySelector("#book");
const pages = document.querySelectorAll(".page");
const music = document.querySelector("#bg-music");

function startMusic() {
    if (music && music.paused) {
        music.play().catch(err => console.log("Autoplay blocked by browser. Music will start on interaction."));
    }
}

let currentLoc = 1;
let numOfPapers = pages.length;
let maxLoc = numOfPapers;

function goNextPage() {
    if(currentLoc < maxLoc) {
        const page = document.querySelector(`#page-${currentLoc - 1}`);
        
        page.classList.add("flipping");
        page.classList.add("flipped");
        
        // Al avanzar, quitamos active de la que se va
        page.classList.remove("active");

        setTimeout(() => {
            page.classList.remove("flipping");
            updateZIndex();
        }, 800); 

        currentLoc++;
        updateZIndex(); 
    }
}

function goPrevPage() {
    if(currentLoc > 1) {
        const page = document.querySelector(`#page-${currentLoc - 2}`);
        
        // Quitamos active de la actual antes de volver
        const currentPage = document.querySelector(`#page-${currentLoc - 1}`);
        if(currentPage) currentPage.classList.remove("active");

        page.classList.add("flipping");
        page.classList.add("flipping-back");
        page.classList.remove("flipped");
        
        setTimeout(() => {
            page.classList.remove("flipping");
            page.classList.remove("flipping-back");
            updateZIndex();
        }, 800);

        currentLoc--;
        updateZIndex();
    }
}

function updateZIndex() {
    pages.forEach((page, index) => {
        // Páginas ya pasadas (a la izquierda)
        if (index < currentLoc - 1) {
            page.style.zIndex = index;
            if (!page.classList.contains("flipping")) {
                page.style.opacity = "0"; 
                page.classList.remove("active");
                page.style.pointerEvents = "none";
            }
        } 
        // Página actual (en el centro)
        else if (index === currentLoc - 1) {
            page.style.zIndex = 10;
            page.style.pointerEvents = "all";
            page.style.opacity = "1";
            // Si no está rotando, activamos sus animaciones
            if (!page.classList.contains("flipping")) {
                page.classList.add("active");
            }
        }
        // Páginas futuras (debajo de la actual)
        else {
            page.style.zIndex = numOfPapers - index;
            if (!page.classList.contains("flipping")) {
                page.style.opacity = "1";
                page.style.pointerEvents = "none";
                page.classList.remove("active");
            }
        }
    });

    // Handle navigation zone visibility
    prevZone.style.display = currentLoc === 1 ? "none" : "flex";
    nextZone.style.display = currentLoc === maxLoc ? "none" : "flex";
}

// Eliminated updateButtons as they are gone

// Touch Support
let touchstartX = 0;
let touchendX = 0;

document.addEventListener('touchstart', e => {
  touchstartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchendX = e.changedTouches[0].screenX;
  if (touchendX < touchstartX - 70) goNextPage();
  if (touchendX > touchstartX + 70) goPrevPage();
});

// Event Listeners
nextZone.addEventListener("click", () => { goNextPage(); startMusic(); });
prevZone.addEventListener("click", () => { goPrevPage(); startMusic(); });
document.querySelector(".glass-btn").addEventListener("click", () => { goNextPage(); startMusic(); });

// Capture any first click to ensure audio starts
window.addEventListener("click", startMusic, { once: true });
window.addEventListener("touchstart", startMusic, { once: true });

// Try to play immediately (might be blocked by browser)
startMusic();

// Initial State
updateZIndex();
