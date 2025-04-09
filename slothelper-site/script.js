const games = [
    "Sweet Bonanza", "The Dog House", "Gates of Olympus", "Wanted Dead or a Wild",
    "Chaos Crew", "Stack 'Em", "Big Bass Bonanza", "Sugar Rush",
    "Fruit Party", "Madame Destiny", "Release the Kraken", "Money Train 2",
    "Tombstone", "Book of Shadows", "Fire in the Hole", "Razor Shark",
    "The Rave", "Dork Unit", "San Quentin", "Wild West Gold",
    "Rocket Reels", "Beast Mode", "Wanted 2: Duel", "Katmandu Gold", "Tropicool",
    "Nitropolis", "Pirots", "Cygnus", "Coba", "Voodoo Gold",
    "Tropicool 2", "Zulu Gold", "Book of Time", "Cash Crew", "Gladiator Legends"
  ];
  
  const reel = document.getElementById("reel");
  const resultBox = document.getElementById("result");
  const spinButton = document.getElementById("spinButton");
  
  const tileWidth = 110;
  let tiles = [];
  let isSpinning = false;
  let animationFrame = null;
  
  function getRandomGame() {
    return games[Math.floor(Math.random() * games.length)];
  }
  
  function createTile(gameName) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.textContent = gameName;
    return tile;
  }
  
  function renderReel(centerGame = null) {
    reel.innerHTML = "";
    tiles = [];
  
    for (let i = 0; i < 100; i++) {
      const game = getRandomGame();
      const tile = createTile(game);
      tiles.push(tile);
      reel.appendChild(tile);
    }
  
    if (centerGame) {
      const centerIndex = 50;
      tiles[centerIndex].textContent = centerGame;
      reel.scrollLeft = centerIndex * tileWidth - reel.offsetWidth / 2 + tileWidth / 2;
    } else {
      reel.scrollLeft = 0;
    }
  }
  
  function startSpin() {
    if (isSpinning) return;
  
    isSpinning = true;
    resultBox.textContent = "Spinning...";  // Näytetään spinning-viesti
  
    const startTime = performance.now();
    const duration = 2000 + Math.random() * 2000; // 2–4 seconds
    const startScroll = reel.scrollLeft;
    const targetScroll = startScroll + 1000 + Math.random() * 1000;
    const distance = targetScroll - startScroll;
  
    // Modifioimme animaatiota niin, että rulla ei jää "jumissa"
    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeOutCubic(progress);
      reel.scrollLeft = startScroll + distance * ease;
  
      // Tarkistetaan jos scrollaus ei etene normaalisti ja palautetaan se alkuun
      if (reel.scrollLeft > 10000) {
        renderReel();
      }
  
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateScroll);
      } else {
        cancelAnimationFrame(animationFrame);  // Stop the animation once completed
        isSpinning = false;
        selectResult();
      }
    }
  
    animationFrame = requestAnimationFrame(animateScroll);
  }
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  
  function selectResult() {
    const wrapperCenter = reel.getBoundingClientRect().left + reel.offsetWidth / 2;
  
    let closestTile = null;
    let closestDistance = Infinity;
  
    tiles.forEach(tile => {
      const rect = tile.getBoundingClientRect();
      const tileCenter = rect.left + rect.width / 2;
      const distance = Math.abs(wrapperCenter - tileCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestTile = tile;
      }
    });
  
    if (closestTile) {
      // Korvataan keltainen teksti
      resultBox.textContent = "Good luck! Spin again for your next game!";  // Uusi teksti
    }
  }
  
  spinButton.addEventListener("click", startSpin);
  renderReel();
  