import './style.css'

const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
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
        
        // Al avanzar, la página que se va pierde visibilidad gradualmente
        // para revelar la siguiente "completamente"
        setTimeout(() => {
            page.classList.remove("flipping");
            updateZIndex();
        }, 1200); 

        currentLoc++;
        updateButtons();
        updateZIndex(); // Update immediately for better overlap
    }
}

function goPrevPage() {
    if(currentLoc > 1) {
        const page = document.querySelector(`#page-${currentLoc - 2}`);
        
        page.classList.add("flipping");
        page.classList.remove("flipped");
        
        setTimeout(() => {
            page.classList.remove("flipping");
            updateZIndex();
        }, 1200);

        currentLoc--;
        updateButtons();
        updateZIndex();
    }
}

function updateZIndex() {
    pages.forEach((page, index) => {
        // Páginas ya pasadas (a la izquierda)
        if (index < currentLoc - 1) {
            page.style.zIndex = index;
            page.style.pointerEvents = "none";
            page.style.opacity = "0"; // Ocultar para no distraer en los bordes
        } 
        // Página actual (en el centro)
        else if (index === currentLoc - 1) {
            page.style.zIndex = 10;
            page.style.pointerEvents = "all";
            page.style.opacity = "1";
        }
        // Páginas futuras (debajo de la actual)
        else {
            page.style.zIndex = numOfPapers - index;
            page.style.pointerEvents = "none";
            page.style.opacity = "1";
        }
    });
}

function updateButtons() {
    prevBtn.disabled = currentLoc === 1;
    nextBtn.disabled = currentLoc === maxLoc;
}

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
nextBtn.addEventListener("click", () => { goNextPage(); startMusic(); });
prevBtn.addEventListener("click", () => { goPrevPage(); startMusic(); });
document.querySelector(".glass-btn").addEventListener("click", () => { goNextPage(); startMusic(); });

// Capture any first click to ensure audio starts
window.addEventListener("click", startMusic, { once: true });
window.addEventListener("touchstart", startMusic, { once: true });

// Try to play immediately (might be blocked by browser)
startMusic();

// Initial State
updateZIndex();
updateButtons();
