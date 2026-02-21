import "./styles.css";
import exiledLandsData from "./data/exiled-lands.json";

type Coord = {
  x: number;
  y: number;
};

type Location = {
  id: string;
  label: string;
  screenshot: string;
  referencePin?: string;
  answer: Coord;
};

type MapPack = {
  mapId: string;
  name: string;
  mapImage: string;
  locations: Location[];
};

type RoundResult = {
  location: Location;
  guess: Coord;
  distance: number;
  points: number;
};

const MAX_POINTS_PER_ROUND = 5000;
const ROUNDS_PER_SESSION = 5;
const MAP_MIN_ZOOM = 1;
const MAP_MAX_ZOOM = 10;
const MAP_ZOOM_STEP = 0.5;

const mapPack = exiledLandsData as MapPack;
const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
  throw new Error("App root not found.");
}
const app: HTMLDivElement = appElement;

let roundIndex = 0;
let selectedGuess: Coord | null = null;
let roundResults: RoundResult[] = [];
let mapViewState: MapViewState = defaultMapViewState();
let isMapExpanded = false;
let disposeOutsideCollapseListener: (() => void) | null = null;
let ignoreNextOutsidePointerDown = false;

const locationsForSession = shuffle([...mapPack.locations]).slice(0, ROUNDS_PER_SESSION);

renderHome();

function renderHome(): void {
  clearOutsideCollapseListener();
  app.innerHTML = `
    <main class="page page-home">
      <div class="home-hero">
        <h1>Conan Exiles GeoGuessr</h1>
        <p class="subtitle">Exiled Lands edition</p>
        <button id="start-game-btn" class="btn btn-hero">START GUESSING</button>
      </div>
      <p class="disclaimer">Conan Exiles is property of Funcom. This is an unofficial fan project.</p>
    </main>
  `;

  const startButton = document.querySelector<HTMLButtonElement>("#start-game-btn");
  startButton?.addEventListener("click", () => {
    roundIndex = 0;
    selectedGuess = null;
    roundResults = [];
    mapViewState = defaultMapViewState();
    isMapExpanded = false;
    renderRound();
  });
}

function renderRound(): void {
  clearOutsideCollapseListener();
  const location = locationsForSession[roundIndex];
  const roundNumber = roundIndex + 1;
  const marker = selectedGuess ? guessMarker(selectedGuess) : "";
  const transform = mapTransform(mapViewState);
  const expandedClass = isMapExpanded ? " is-expanded" : "";

  app.innerHTML = `
    <main class="page page-play">
      <header class="round-header">
        <h1>Round ${roundNumber} / ${ROUNDS_PER_SESSION}</h1>
        <p>${escapeHtml(location.label)}</p>
      </header>
      <section class="card screenshot-focus">
        <h2>Screenshot</h2>
        <img class="screenshot screenshot-main" src="${location.screenshot}" alt="Round screenshot ${roundNumber}" />
      </section>
      <aside id="mini-map-panel" class="card mini-map-panel${expandedClass}">
        <div class="mini-map-header">
          <h3>Pick location</h3>
          <div class="map-controls">
            <button id="zoom-out-btn" class="btn btn-secondary btn-map-control" aria-label="Zoom out">-</button>
            <button id="zoom-reset-btn" class="btn btn-secondary btn-map-control" aria-label="Reset zoom">Reset</button>
            <button id="zoom-in-btn" class="btn btn-secondary btn-map-control" aria-label="Zoom in">+</button>
          </div>
        </div>
        <div id="map-viewport" class="map-viewport">
          <div id="map-canvas" class="map-canvas" style="transform: ${transform};">
            <img id="map-image" src="${mapPack.mapImage}" alt="Exiled Lands map" draggable="false" />
            ${marker}
          </div>
        </div>
        <p class="map-instructions">Scroll to zoom, click-drag to pan, click to place pin.</p>
      </aside>
      <div class="actions">
        <button id="submit-guess-btn" class="btn btn-primary" ${selectedGuess ? "" : "disabled"}>
          Confirm guess
        </button>
        <button id="quit-btn" class="btn btn-secondary">Back to home</button>
      </div>
    </main>
  `;

  const mapViewport = document.querySelector<HTMLDivElement>("#map-viewport");
  const mapCanvas = document.querySelector<HTMLDivElement>("#map-canvas");
  const miniMapPanel = document.querySelector<HTMLElement>("#mini-map-panel");
  const zoomInButton = document.querySelector<HTMLButtonElement>("#zoom-in-btn");
  const zoomOutButton = document.querySelector<HTMLButtonElement>("#zoom-out-btn");
  const zoomResetButton = document.querySelector<HTMLButtonElement>("#zoom-reset-btn");
  const submitButton = document.querySelector<HTMLButtonElement>("#submit-guess-btn");

  if (miniMapPanel) {
    const outsideCollapseHandler = (event: PointerEvent): void => {
      if (ignoreNextOutsidePointerDown) {
        ignoreNextOutsidePointerDown = false;
        return;
      }
      if (!isMapExpanded) {
        return;
      }
      if (miniMapPanel.contains(event.target as Node)) {
        return;
      }
      mapViewState = defaultMapViewState();
      isMapExpanded = false;
      renderRound();
    };
    document.addEventListener("pointerdown", outsideCollapseHandler);
    disposeOutsideCollapseListener = () => {
      document.removeEventListener("pointerdown", outsideCollapseHandler);
      disposeOutsideCollapseListener = null;
    };
  }

  if (mapViewport && mapCanvas && zoomInButton && zoomOutButton && zoomResetButton) {
    let dragging = false;
    let dragMoved = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartOffsetX = 0;
    let dragStartOffsetY = 0;
    let lastViewportWidth = 0;
    let lastViewportHeight = 0;

    const getViewportSize = (): { width: number; height: number } => {
      const rect = mapViewport.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    };

    const syncForViewportResize = (nextWidth: number, nextHeight: number): void => {
      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }

      if (lastViewportWidth <= 0 || lastViewportHeight <= 0) {
        lastViewportWidth = nextWidth;
        lastViewportHeight = nextHeight;
        return;
      }

      const centerNormX = clamp(
        (lastViewportWidth / 2 - mapViewState.offsetX) / (mapViewState.zoom * lastViewportWidth),
        0,
        1
      );
      const centerNormY = clamp(
        (lastViewportHeight / 2 - mapViewState.offsetY) / (mapViewState.zoom * lastViewportHeight),
        0,
        1
      );

      mapViewState = {
        ...mapViewState,
        offsetX: nextWidth / 2 - centerNormX * nextWidth * mapViewState.zoom,
        offsetY: nextHeight / 2 - centerNormY * nextHeight * mapViewState.zoom
      };

      lastViewportWidth = nextWidth;
      lastViewportHeight = nextHeight;
    };

    const applyMapState = (): void => {
      const size = getViewportSize();
      syncForViewportResize(size.width, size.height);
      mapViewState = clampMapView(mapViewState, size.width, size.height);
      mapCanvas.style.transform = mapTransform(mapViewState);
      mapCanvas.style.setProperty("--pin-inverse-zoom", (1 / mapViewState.zoom).toString());
      zoomInButton.disabled = mapViewState.zoom >= MAP_MAX_ZOOM;
      zoomOutButton.disabled = mapViewState.zoom <= MAP_MIN_ZOOM;
    };

    const placeGuessFromClient = (clientX: number, clientY: number): void => {
      const rect = mapViewport.getBoundingClientRect();
      const viewportX = clamp(clientX - rect.left, 0, rect.width);
      const viewportY = clamp(clientY - rect.top, 0, rect.height);
      const mapX = (viewportX - mapViewState.offsetX) / mapViewState.zoom;
      const mapY = (viewportY - mapViewState.offsetY) / mapViewState.zoom;
      const x = clamp(mapX / rect.width, 0, 1);
      const y = clamp(mapY / rect.height, 0, 1);
      selectedGuess = { x, y };

      const existingGuessMarker = mapCanvas.querySelector<HTMLDivElement>(".map-marker-guess");
      if (existingGuessMarker) {
        existingGuessMarker.style.left = `${x * 100}%`;
        existingGuessMarker.style.top = `${y * 100}%`;
      } else {
        mapCanvas.insertAdjacentHTML("beforeend", guessMarker(selectedGuess));
      }

      if (submitButton) {
        submitButton.disabled = false;
      }
    };

    const zoomAtPoint = (zoomDelta: number, anchorX: number, anchorY: number): void => {
      const oldZoom = mapViewState.zoom;
      const nextZoom = clamp(oldZoom + zoomDelta, MAP_MIN_ZOOM, MAP_MAX_ZOOM);
      if (nextZoom === oldZoom) {
        return;
      }

      const factor = nextZoom / oldZoom;
      mapViewState = {
        ...mapViewState,
        zoom: nextZoom,
        offsetX: anchorX - (anchorX - mapViewState.offsetX) * factor,
        offsetY: anchorY - (anchorY - mapViewState.offsetY) * factor
      };
      applyMapState();
    };

    zoomInButton.addEventListener("click", () => {
      const rect = mapViewport.getBoundingClientRect();
      zoomAtPoint(MAP_ZOOM_STEP, rect.width / 2, rect.height / 2);
    });

    zoomOutButton.addEventListener("click", () => {
      const rect = mapViewport.getBoundingClientRect();
      zoomAtPoint(-MAP_ZOOM_STEP, rect.width / 2, rect.height / 2);
    });

    zoomResetButton.addEventListener("click", () => {
      mapViewState = defaultMapViewState();
      applyMapState();
    });

    mapViewport.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const rect = mapViewport.getBoundingClientRect();
        const anchorX = clamp(event.clientX - rect.left, 0, rect.width);
        const anchorY = clamp(event.clientY - rect.top, 0, rect.height);
        zoomAtPoint(event.deltaY < 0 ? MAP_ZOOM_STEP : -MAP_ZOOM_STEP, anchorX, anchorY);
      },
      { passive: false }
    );

    mapViewport.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }
      if (!isMapExpanded) {
        // Ignore the same pointerdown when it bubbles to document after re-render.
        ignoreNextOutsidePointerDown = true;
        isMapExpanded = true;
        renderRound();
        return;
      }

      dragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartOffsetX = mapViewState.offsetX;
      dragStartOffsetY = mapViewState.offsetY;
      mapViewport.setPointerCapture(event.pointerId);
      mapViewport.classList.add("is-dragging");
    });

    mapViewport.addEventListener("pointermove", (event) => {
      if (!dragging) {
        return;
      }

      if (mapViewState.zoom <= MAP_MIN_ZOOM) {
        return;
      }

      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        dragMoved = true;
      }

      mapViewState = {
        ...mapViewState,
        offsetX: dragStartOffsetX + deltaX,
        offsetY: dragStartOffsetY + deltaY
      };
      applyMapState();
    });

    mapViewport.addEventListener("pointerup", (event) => {
      if (!dragging) {
        return;
      }

      dragging = false;
      mapViewport.releasePointerCapture(event.pointerId);
      mapViewport.classList.remove("is-dragging");
      if (!dragMoved) {
        placeGuessFromClient(event.clientX, event.clientY);
      }
    });

    mapViewport.addEventListener("pointercancel", () => {
      dragging = false;
      mapViewport.classList.remove("is-dragging");
    });

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        applyMapState();
      });
      resizeObserver.observe(mapViewport);
    } else {
      window.addEventListener("resize", applyMapState);
    }

    applyMapState();
  }

  submitButton?.addEventListener("click", () => {
    if (!selectedGuess) {
      return;
    }

    const distance = coordDistance(selectedGuess, location.answer);
    const points = scoreFromDistance(distance);
    roundResults.push({
      location,
      guess: selectedGuess,
      distance,
      points
    });

    renderRoundFeedback(roundResults[roundResults.length - 1], roundNumber);
  });

  const quitButton = document.querySelector<HTMLButtonElement>("#quit-btn");
  quitButton?.addEventListener("click", renderHome);
}

function renderRoundFeedback(result: RoundResult, roundNumber: number): void {
  clearOutsideCollapseListener();
  const answerMarkerHtml = answerMarker(result.location.answer);
  const guessMarkerHtml = guessMarker(result.guess);

  app.innerHTML = `
    <main class="page">
      <header class="round-header">
        <h1>Round ${roundNumber} result</h1>
        <p><strong>${result.points.toLocaleString()}</strong> points</p>
        <p>Distance: ${(result.distance * 100).toFixed(2)} map units</p>
      </header>
      <section class="play-grid">
        <article class="card">
          <h2>Screenshot</h2>
          <img class="screenshot" src="${result.location.screenshot}" alt="Round screenshot ${roundNumber}" />
        </article>
        <article class="card">
          <h2>Your guess vs answer</h2>
          <div class="map-stage">
            <img src="${mapPack.mapImage}" alt="Exiled Lands map answer view" />
            ${answerMarkerHtml}
            ${guessMarkerHtml}
          </div>
          <p class="legend">
            <span class="dot answer-dot"></span> Answer
            <span class="dot guess-dot"></span> Your guess
          </p>
        </article>
      </section>
      <div class="actions">
        <button id="next-btn" class="btn btn-primary">
          ${roundIndex + 1 >= ROUNDS_PER_SESSION ? "View final score" : "Next round"}
        </button>
      </div>
    </main>
  `;

  const nextButton = document.querySelector<HTMLButtonElement>("#next-btn");
  nextButton?.addEventListener("click", () => {
    roundIndex += 1;
    selectedGuess = null;
    mapViewState = defaultMapViewState();

    if (roundIndex >= ROUNDS_PER_SESSION) {
      renderResults();
      return;
    }

    renderRound();
  });
}

function renderResults(): void {
  clearOutsideCollapseListener();
  const total = roundResults.reduce((sum, r) => sum + r.points, 0);
  const shareText = buildShareText(total, roundResults);
  const rows = roundResults
    .map((result, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(result.location.id)}</td>
          <td>${result.points.toLocaleString()}</td>
          <td>${(result.distance * 100).toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  app.innerHTML = `
    <main class="page page-results">
      <h1>Session complete</h1>
      <p class="subtitle">Final score: <strong>${total.toLocaleString()}</strong> / ${(ROUNDS_PER_SESSION * MAX_POINTS_PER_ROUND).toLocaleString()}</p>

      <section class="card">
        <h2>Round breakdown</h2>
        <table>
          <thead>
            <tr>
              <th>Round</th>
              <th>Location</th>
              <th>Points</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>

      <section class="card">
        <h2>Share score</h2>
        <textarea id="share-output" readonly>${shareText}</textarea>
        <div class="actions">
          <button id="copy-score-btn" class="btn btn-primary">Copy score text</button>
          <button id="play-again-btn" class="btn btn-secondary">Play again</button>
        </div>
      </section>
    </main>
  `;

  const copyButton = document.querySelector<HTMLButtonElement>("#copy-score-btn");
  copyButton?.addEventListener("click", async () => {
    const textArea = document.querySelector<HTMLTextAreaElement>("#share-output");
    if (!textArea) {
      return;
    }

    try {
      await navigator.clipboard.writeText(textArea.value);
      copyButton.textContent = "Copied";
    } catch {
      textArea.select();
      document.execCommand("copy");
      copyButton.textContent = "Copied";
    }
  });

  const playAgainButton = document.querySelector<HTMLButtonElement>("#play-again-btn");
  playAgainButton?.addEventListener("click", () => {
    location.reload();
  });
}

function scoreFromDistance(distance: number): number {
  const score = MAX_POINTS_PER_ROUND * Math.exp(-7 * distance);
  return Math.max(0, Math.round(score));
}

function coordDistance(a: Coord, b: Coord): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function buildShareText(total: number, results: RoundResult[]): string {
  const lines = results.map((result, index) => {
    return `R${index + 1}: ${result.points} pts (${(result.distance * 100).toFixed(2)} dist)`;
  });

  return [
    `Conan Exiles GeoGuessr (Exiled Lands)`,
    `Score: ${total}/${ROUNDS_PER_SESSION * MAX_POINTS_PER_ROUND}`,
    ...lines
  ].join("\n");
}

function guessMarker(coord: Coord): string {
  return `<div class="map-marker map-marker-guess" style="left:${coord.x * 100}%; top:${coord.y * 100}%;" title="Your guess"></div>`;
}

function answerMarker(coord: Coord): string {
  return `<div class="map-marker map-marker-answer" style="left:${coord.x * 100}%; top:${coord.y * 100}%;" title="Answer"></div>`;
}

type MapViewState = {
  zoom: number;
  offsetX: number;
  offsetY: number;
};

function defaultMapViewState(): MapViewState {
  return {
    zoom: MAP_MIN_ZOOM,
    offsetX: 0,
    offsetY: 0
  };
}

function mapTransform(view: MapViewState): string {
  return `translate(${view.offsetX}px, ${view.offsetY}px) scale(${view.zoom})`;
}

function clampMapView(view: MapViewState, viewportWidth: number, viewportHeight: number): MapViewState {
  const scaledWidth = viewportWidth * view.zoom;
  const scaledHeight = viewportHeight * view.zoom;
  const minOffsetX = Math.min(0, viewportWidth - scaledWidth);
  const minOffsetY = Math.min(0, viewportHeight - scaledHeight);

  return {
    ...view,
    offsetX: clamp(view.offsetX, minOffsetX, 0),
    offsetY: clamp(view.offsetY, minOffsetY, 0)
  };
}

function clearOutsideCollapseListener(): void {
  if (disposeOutsideCollapseListener) {
    disposeOutsideCollapseListener();
  }
}

function shuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
