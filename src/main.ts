import "./styles.css";
import exiledLandsData from "./data/exiled-lands.json";

type Coord = {
  x: number;
  y: number;
};

type Location = {
  id: string;
  screenshot: string;
  metadata?: LocationMetadata;
  answer: Coord;
};

type LocationMetadata = {
  biome?: string;
  tags?: string[];
  poiType?: string;
  notes?: string;
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
const RESULT_MAX_ZOOM = 14;

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
let ignoreMapHoverUntilMs = 0;
let selectedMode: GameMode = "all";
let locationsForSession: Location[] = [];
let activeSessionRoundCount = ROUNDS_PER_SESSION;

type GameMode = "all" | "vague" | "rat" | "camp" | "easy" | "medium" | "hard";
type ModeOption = { id: GameMode; label: string };
const MODE_OPTIONS: ModeOption[] = [
  { id: "all", label: "All" },
  { id: "vague", label: "Vague" },
  { id: "rat", label: "Rat" },
  { id: "camp", label: "Camp" },
  { id: "easy", label: "Easy" },
  { id: "medium", label: "Medium" },
  { id: "hard", label: "Hard" }
];

initApp();

function initApp(): void {
  const url = new URL(window.location.href);
  const tool = url.searchParams.get("tool");

  if (tool === "coords") {
    renderCoordinateTool();
    return;
  }

  renderHome();
}

function renderHome(): void {
  clearOutsideCollapseListener();
  const modeOptionsMarkup = MODE_OPTIONS.map((mode) => {
    return `<option value="${mode.id}" ${mode.id === selectedMode ? "selected" : ""}>${mode.label}</option>`;
  }).join("");

  app.innerHTML = `
    <main class="page page-home">
      <div class="home-hero">
        <h1>Conan Exiles GeoGuessr</h1>
        <p class="subtitle">Exiled Lands edition</p>
        <label class="mode-select-wrap" for="mode-select">
          <span>Mode</span>
          <select id="mode-select" class="mode-select">
            ${modeOptionsMarkup}
          </select>
        </label>
        <button id="start-game-btn" class="btn btn-hero">START GUESSING</button>
      </div>
      <p class="disclaimer">Conan Exiles is property of Funcom. This is an unofficial fan project.</p>
    </main>
  `;

  const startButton = document.querySelector<HTMLButtonElement>("#start-game-btn");
  const modeSelect = document.querySelector<HTMLSelectElement>("#mode-select");
  modeSelect?.addEventListener("change", () => {
    selectedMode = (modeSelect.value as GameMode) ?? "all";
  });

  startButton?.addEventListener("click", () => {
    const modePool = getLocationsForMode(selectedMode);
    if (modePool.length === 0) {
      window.alert(`No locations found for mode "${selectedMode}".`);
      return;
    }

    activeSessionRoundCount = Math.min(ROUNDS_PER_SESSION, modePool.length);
    locationsForSession = shuffle([...modePool]).slice(0, activeSessionRoundCount);
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
        <h1>Round ${roundNumber} / ${activeSessionRoundCount}</h1>
      </header>
      <section class="card screenshot-focus">
        <h2>Screenshot</h2>
        <img class="screenshot screenshot-main" src="${assetPath(location.screenshot)}" alt="Round screenshot ${roundNumber}" />
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
            <img id="map-image" src="${assetPath(mapPack.mapImage)}" alt="Exiled Lands map" draggable="false" />
            ${marker}
          </div>
        </div>
        <div id="mini-map-guess-wrap" class="mini-map-guess-wrap ${selectedGuess ? "is-ready" : ""}">
          <button
            id="guess-bar-btn"
            class="guess-bar-btn"
            ${selectedGuess ? "" : "disabled"}
          >
            GUESS
          </button>
        </div>
        <p class="map-instructions">Scroll to zoom, click-drag to pan, click to place pin.</p>
      </aside>
      <div class="actions">
        <button id="quit-btn" class="btn btn-secondary">Back to home</button>
      </div>
    </main>
  `;

  const mapViewport = document.querySelector<HTMLDivElement>("#map-viewport");
  const mapCanvas = document.querySelector<HTMLDivElement>("#map-canvas");
  const miniMapPanel = document.querySelector<HTMLElement>("#mini-map-panel");
  const guessWrap = document.querySelector<HTMLDivElement>("#mini-map-guess-wrap");
  const zoomInButton = document.querySelector<HTMLButtonElement>("#zoom-in-btn");
  const zoomOutButton = document.querySelector<HTMLButtonElement>("#zoom-out-btn");
  const zoomResetButton = document.querySelector<HTMLButtonElement>("#zoom-reset-btn");
  const guessBarButton = document.querySelector<HTMLButtonElement>("#guess-bar-btn");

  if (miniMapPanel) {
    miniMapPanel.addEventListener("mouseenter", () => {
      if (Date.now() < ignoreMapHoverUntilMs) {
        return;
      }
      if (isMapExpanded) {
        return;
      }
      isMapExpanded = true;
      renderRound();
    });

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
      if (guessBarButton) {
        guessBarButton.disabled = false;
      }
      if (guessWrap) {
        guessWrap.classList.add("is-ready");
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

  const submitGuess = (): void => {
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
  };

  // Keep this as a no-op fallback if legacy button is reintroduced.
  const submitButton = document.querySelector<HTMLButtonElement>("#submit-guess-btn");
  submitButton?.addEventListener("click", submitGuess);
  guessBarButton?.addEventListener("click", submitGuess);

  const quitButton = document.querySelector<HTMLButtonElement>("#quit-btn");
  quitButton?.addEventListener("click", renderHome);
}

function renderCoordinateTool(): void {
  clearOutsideCollapseListener();
  app.innerHTML = `
    <main class="page coord-tool-page">
      <header>
        <h1>Coordinate Helper</h1>
        <p class="subtitle">Scroll to zoom, click-drag to pan, click to lock coordinates.</p>
      </header>
      <section class="card coord-tool-card">
        <div class="coord-tool-controls">
          <button id="coord-zoom-out-btn" class="btn btn-secondary btn-map-control" aria-label="Zoom out">-</button>
          <button id="coord-zoom-reset-btn" class="btn btn-secondary btn-map-control" aria-label="Reset zoom">Reset</button>
          <button id="coord-zoom-in-btn" class="btn btn-secondary btn-map-control" aria-label="Zoom in">+</button>
          <span id="coord-zoom-readout" class="coord-zoom-readout">100%</span>
        </div>
        <div id="coord-map-stage" class="coord-map-stage">
          <div id="coord-map-canvas" class="coord-map-canvas">
            <img src="${assetPath(mapPack.mapImage)}" alt="Exiled Lands map coordinate helper" draggable="false" />
            <div id="coord-marker" class="coord-marker" hidden></div>
          </div>
        </div>
      </section>
      <section class="card coord-readout">
        <p>Hover: <code id="hover-coord">x: -, y: -</code></p>
        <p>Selected: <code id="selected-coord">x: -, y: -</code></p>
        <div class="actions">
          <button id="copy-coord-btn" class="btn btn-primary" disabled>Copy coordinates</button>
          <button id="copy-json-btn" class="btn btn-secondary" disabled>Copy JSON answer block</button>
          <button id="back-home-btn" class="btn btn-secondary">Back to game</button>
        </div>
      </section>
    </main>
  `;

  const stage = document.querySelector<HTMLDivElement>("#coord-map-stage");
  const canvas = document.querySelector<HTMLDivElement>("#coord-map-canvas");
  const marker = document.querySelector<HTMLDivElement>("#coord-marker");
  const hoverOutput = document.querySelector<HTMLElement>("#hover-coord");
  const selectedOutput = document.querySelector<HTMLElement>("#selected-coord");
  const zoomReadout = document.querySelector<HTMLElement>("#coord-zoom-readout");
  const zoomInButton = document.querySelector<HTMLButtonElement>("#coord-zoom-in-btn");
  const zoomOutButton = document.querySelector<HTMLButtonElement>("#coord-zoom-out-btn");
  const zoomResetButton = document.querySelector<HTMLButtonElement>("#coord-zoom-reset-btn");
  const copyCoordButton = document.querySelector<HTMLButtonElement>("#copy-coord-btn");
  const copyJsonButton = document.querySelector<HTMLButtonElement>("#copy-json-btn");
  const backButton = document.querySelector<HTMLButtonElement>("#back-home-btn");

  let selected: Coord | null = null;
  let view: MapViewState = defaultMapViewState();

  if (
    stage &&
    canvas &&
    marker &&
    hoverOutput &&
    selectedOutput &&
    zoomReadout &&
    zoomInButton &&
    zoomOutButton &&
    zoomResetButton &&
    copyCoordButton &&
    copyJsonButton
  ) {
    let dragging = false;
    let dragMoved = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartOffsetX = 0;
    let dragStartOffsetY = 0;

    const applyView = (): void => {
      const rect = stage.getBoundingClientRect();
      view = clampMapView(view, rect.width, rect.height);
      canvas.style.transform = mapTransform(view);
      canvas.style.setProperty("--pin-inverse-zoom", (1 / view.zoom).toString());
      zoomReadout.textContent = `${Math.round(view.zoom * 100)}%`;
      zoomInButton.disabled = view.zoom >= MAP_MAX_ZOOM;
      zoomOutButton.disabled = view.zoom <= MAP_MIN_ZOOM;
    };

    const zoomAtPoint = (zoomDelta: number, anchorX: number, anchorY: number): void => {
      const oldZoom = view.zoom;
      const nextZoom = clamp(oldZoom + zoomDelta, MAP_MIN_ZOOM, MAP_MAX_ZOOM);
      if (nextZoom === oldZoom) {
        return;
      }

      const factor = nextZoom / oldZoom;
      view = {
        ...view,
        zoom: nextZoom,
        offsetX: anchorX - (anchorX - view.offsetX) * factor,
        offsetY: anchorY - (anchorY - view.offsetY) * factor
      };
      applyView();
    };

    stage.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        const rect = stage.getBoundingClientRect();
        const anchorX = clamp(event.clientX - rect.left, 0, rect.width);
        const anchorY = clamp(event.clientY - rect.top, 0, rect.height);
        zoomAtPoint(event.deltaY < 0 ? MAP_ZOOM_STEP : -MAP_ZOOM_STEP, anchorX, anchorY);
      },
      { passive: false }
    );

    zoomInButton.addEventListener("click", () => {
      const rect = stage.getBoundingClientRect();
      zoomAtPoint(MAP_ZOOM_STEP, rect.width / 2, rect.height / 2);
    });

    zoomOutButton.addEventListener("click", () => {
      const rect = stage.getBoundingClientRect();
      zoomAtPoint(-MAP_ZOOM_STEP, rect.width / 2, rect.height / 2);
    });

    zoomResetButton.addEventListener("click", () => {
      view = defaultMapViewState();
      applyView();
    });

    stage.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) {
        return;
      }
      dragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartOffsetX = view.offsetX;
      dragStartOffsetY = view.offsetY;
      stage.setPointerCapture(event.pointerId);
      stage.classList.add("is-dragging");
    });

    stage.addEventListener("pointermove", (event) => {
      if (!dragging) {
        const coord = coordFromClientWithView(stage, event.clientX, event.clientY, view);
        hoverOutput.textContent = `x: ${formatCoord(coord.x)}, y: ${formatCoord(coord.y)}`;
        return;
      }

      if (view.zoom <= MAP_MIN_ZOOM) {
        return;
      }

      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;
      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        dragMoved = true;
      }

      view = {
        ...view,
        offsetX: dragStartOffsetX + deltaX,
        offsetY: dragStartOffsetY + deltaY
      };
      applyView();
    });

    stage.addEventListener("pointerup", (event) => {
      if (!dragging) {
        return;
      }

      dragging = false;
      stage.releasePointerCapture(event.pointerId);
      stage.classList.remove("is-dragging");
      if (!dragMoved) {
        selected = coordFromClientWithView(stage, event.clientX, event.clientY, view);
        marker.hidden = false;
        marker.style.left = `${selected.x * 100}%`;
        marker.style.top = `${selected.y * 100}%`;
        selectedOutput.textContent = `x: ${formatCoord(selected.x)}, y: ${formatCoord(selected.y)}`;
        copyCoordButton.disabled = false;
        copyJsonButton.disabled = false;
      }
    });

    stage.addEventListener("pointercancel", () => {
      dragging = false;
      stage.classList.remove("is-dragging");
    });

    stage.addEventListener("pointerleave", () => {
      if (!dragging) {
        hoverOutput.textContent = "x: -, y: -";
      }
    });

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(() => {
        applyView();
      });
      resizeObserver.observe(stage);
    } else {
      window.addEventListener("resize", applyView);
    }

    applyView();

    copyCoordButton.addEventListener("click", async () => {
      if (!selected) {
        return;
      }
      const payload = `${formatCoord(selected.x)}, ${formatCoord(selected.y)}`;
      await copyText(payload, copyCoordButton, "Copied");
    });

    copyJsonButton.addEventListener("click", async () => {
      if (!selected) {
        return;
      }
      const payload = `"answer": { "x": ${formatCoord(selected.x)}, "y": ${formatCoord(selected.y)} }`;
      await copyText(payload, copyJsonButton, "Copied");
    });
  }

  backButton?.addEventListener("click", () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("tool");
    history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    renderHome();
  });
}

function renderRoundFeedback(result: RoundResult, roundNumber: number): void {
  clearOutsideCollapseListener();
  const answerMarkerHtml = answerMarker(result.location.answer);
  const guessMarkerHtml = guessMarker(result.guess);
  const focusX = (result.guess.x + result.location.answer.x) / 2;
  const focusY = (result.guess.y + result.location.answer.y) / 2;
  const finalZoom = computeResultZoomForPins(result.guess, result.location.answer);
  const startZoom = clamp(finalZoom + 1.6, 2.2, RESULT_MAX_ZOOM + 1.2);
  const startTransform = resultMapTransform(result.guess.x, result.guess.y, startZoom);
  const finalTransform = resultMapTransform(focusX, focusY, finalZoom);
  const connector = connectorLine(result.guess, result.location.answer);

  app.innerHTML = `
    <main class="page round-result-page">
      <header class="round-header">
        <h1>Round ${roundNumber} result</h1>
        <p><strong>${result.points.toLocaleString()}</strong> points</p>
        <p>Distance: ${(result.distance * 100).toFixed(2)} map units</p>
      </header>
      <section class="card">
        <h2>Guess vs answer</h2>
        <div class="result-map-stage">
          <div
            id="result-map-canvas"
            class="result-map-canvas"
            style="transform: ${startTransform}; --pin-inverse-zoom: ${(1 / startZoom).toFixed(5)};"
          >
            <img src="${assetPath(mapPack.mapImage)}" alt="Exiled Lands map result view" />
            ${connector}
            ${answerMarkerHtml}
            ${guessMarkerHtml}
          </div>
        </div>
        <p class="legend">
          <span class="dot answer-dot"></span> Answer
          <span class="dot guess-dot"></span> Your guess
        </p>
        <div id="result-score-panel" class="result-score-panel">
          <p class="result-stats-inline">Distance ${(result.distance * 100).toFixed(2)} · ${result.points.toLocaleString()} pts</p>
          <button id="next-btn" class="btn btn-primary result-next-btn">
            ${roundIndex + 1 >= activeSessionRoundCount ? "View final score" : "Next round"}
          </button>
        </div>
      </section>
    </main>
  `;

  const resultMapCanvas = document.querySelector<HTMLDivElement>("#result-map-canvas");
  const resultScorePanel = document.querySelector<HTMLDivElement>("#result-score-panel");
  const nextButton = document.querySelector<HTMLButtonElement>("#next-btn");
  if (nextButton) {
    nextButton.disabled = true;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (resultMapCanvas) {
        resultMapCanvas.style.transform = finalTransform;
        resultMapCanvas.style.setProperty("--pin-inverse-zoom", (1 / finalZoom).toFixed(5));
      }
      window.setTimeout(() => {
        resultScorePanel?.classList.add("is-visible");
        if (nextButton) {
          nextButton.disabled = false;
        }
      }, 700);
    });
  });

  nextButton?.addEventListener("click", () => {
    roundIndex += 1;
    selectedGuess = null;
    mapViewState = defaultMapViewState();
    isMapExpanded = false;
    ignoreMapHoverUntilMs = Date.now() + 250;

    if (roundIndex >= activeSessionRoundCount) {
      renderResults();
      return;
    }

    renderRound();
  });
}

function renderResults(): void {
  clearOutsideCollapseListener();
  const total = roundResults.reduce((sum, r) => sum + r.points, 0);
  const maxTotal = activeSessionRoundCount * MAX_POINTS_PER_ROUND;
  const completionRatio = maxTotal > 0 ? total / maxTotal : 0;
  const avgDistance = roundResults.length > 0 ? roundResults.reduce((sum, r) => sum + r.distance, 0) / roundResults.length : 0;
  const avgPoints = roundResults.length > 0 ? Math.round(total / roundResults.length) : 0;
  const bestRound = roundResults.reduce<RoundResult | null>((best, current) => {
    if (!best || current.points > best.points) {
      return current;
    }
    return best;
  }, null);
  const tier = getScoreTier(completionRatio);
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
  const roundBadges = roundResults
    .map((result, index) => {
      return `<span class="round-badge">R${index + 1}: ${result.points.toLocaleString()} pts</span>`;
    })
    .join("");

  app.innerHTML = `
    <main class="page page-results">
      <section class="card results-hero">
        <p class="results-mode">Mode: ${escapeHtml(selectedMode)}</p>
        <h1>${tier.title}</h1>
        <p class="subtitle">${tier.subtitle}</p>
        <p class="results-score">Final score: <strong>${total.toLocaleString()}</strong> / ${maxTotal.toLocaleString()}</p>
        <div class="results-progress">
          <div class="results-progress-fill" style="width:${Math.round(completionRatio * 100)}%"></div>
        </div>
      </section>

      <section class="card">
        <h2>Session highlights</h2>
        <div class="results-highlights">
          <p><strong>Best round:</strong> ${bestRound ? `${escapeHtml(bestRound.location.id)} (${bestRound.points.toLocaleString()} pts)` : "-"}</p>
          <p><strong>Average points:</strong> ${avgPoints.toLocaleString()}</p>
          <p><strong>Average distance:</strong> ${(avgDistance * 100).toFixed(2)} map units</p>
        </div>
        <div class="round-badges">${roundBadges}</div>
      </section>

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
  if (distance <= 0.015) {
    // Very close guesses should stay near max points.
    return Math.round(lerp(MAX_POINTS_PER_ROUND, 4960, distance / 0.015));
  }

  if (distance <= 0.06) {
    // Keep early decay gentle for close-but-not-perfect pins.
    return Math.round(lerp(4960, 3600, (distance - 0.015) / 0.045));
  }

  const tailScore = 3600 * Math.exp(-8 * (distance - 0.06));
  return Math.max(0, Math.round(tailScore));
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
    `Mode: ${selectedMode}`,
    `Score: ${total}/${activeSessionRoundCount * MAX_POINTS_PER_ROUND}`,
    ...lines
  ].join("\n");
}

function getLocationsForMode(mode: GameMode): Location[] {
  if (mode === "all") {
    return mapPack.locations;
  }

  return mapPack.locations.filter((location) => {
    const metadata = location.metadata ?? {};
    const poiType = (metadata.poiType ?? "").toLowerCase().trim();
    const tags = (metadata.tags ?? []).map((tag) => tag.toLowerCase().trim());

    if (mode === "vague" || mode === "rat" || mode === "camp") {
      return poiType === mode;
    }

    return tags.includes(mode);
  });
}

function guessMarker(coord: Coord): string {
  return `<div class="map-marker map-marker-guess" style="left:${coord.x * 100}%; top:${coord.y * 100}%;" title="Your guess"></div>`;
}

function answerMarker(coord: Coord): string {
  return `<div class="map-marker map-marker-answer" style="left:${coord.x * 100}%; top:${coord.y * 100}%;" title="Answer"></div>`;
}

function connectorLine(a: Coord, b: Coord): string {
  return `
    <svg class="result-connector" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line x1="${a.x * 100}" y1="${a.y * 100}" x2="${b.x * 100}" y2="${b.y * 100}" />
    </svg>
  `;
}

function resultMapTransform(focusX: number, focusY: number, zoom: number): string {
  const offsetXPercent = 50 - focusX * 100 * zoom;
  const offsetYPercent = 50 - focusY * 100 * zoom;
  return `translate(${offsetXPercent}%, ${offsetYPercent}%) scale(${zoom})`;
}

function computeResultZoomForPins(guess: Coord, answer: Coord): number {
  // Keep a safety margin so both pins are visibly inside the frame.
  const edgePadding = 0.04;
  const visibleSpan = 1 - edgePadding * 2;
  const dx = Math.abs(guess.x - answer.x);
  const dy = Math.abs(guess.y - answer.y);
  const dominantSpan = Math.max(dx, dy, 0.0001);

  // Ensure both pins fit: dominantSpan * zoom <= visibleSpan.
  const fitZoom = visibleSpan / dominantSpan;
  return clamp(fitZoom, 1, RESULT_MAX_ZOOM);
}

function getScoreTier(ratio: number): { title: string; subtitle: string } {
  if (ratio >= 0.9) {
    return { title: "Exile Cartographer", subtitle: "You know these lands like a true map sage." };
  }
  if (ratio >= 0.75) {
    return { title: "Relic Pathfinder", subtitle: "Strong instincts and sharp landmark reads." };
  }
  if (ratio >= 0.55) {
    return { title: "Dune Scout", subtitle: "Solid run. You are getting dangerous out there." };
  }
  return { title: "Lost Wanderer", subtitle: "Crom watches. Another run will sharpen your eye." };
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

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

function assetPath(path: string): string {
  // Assets are served from Vite publicDir ("assets"), so strip leading "assets/".
  if (path.startsWith("assets/")) {
    return path.slice("assets/".length);
  }
  return path;
}

function coordFromClientWithView(container: HTMLElement, clientX: number, clientY: number, view: MapViewState): Coord {
  const rect = container.getBoundingClientRect();
  const viewportX = clamp(clientX - rect.left, 0, rect.width);
  const viewportY = clamp(clientY - rect.top, 0, rect.height);
  const mapX = (viewportX - view.offsetX) / view.zoom;
  const mapY = (viewportY - view.offsetY) / view.zoom;
  return {
    x: clamp(mapX / rect.width, 0, 1),
    y: clamp(mapY / rect.height, 0, 1)
  };
}

function formatCoord(value: number): string {
  return value.toFixed(4);
}

async function copyText(text: string, button: HTMLButtonElement, successLabel: string): Promise<void> {
  const originalLabel = button.textContent ?? "Copy";
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = successLabel;
  } catch {
    const tempArea = document.createElement("textarea");
    tempArea.value = text;
    tempArea.style.position = "fixed";
    tempArea.style.opacity = "0";
    document.body.appendChild(tempArea);
    tempArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempArea);
    button.textContent = successLabel;
  }

  window.setTimeout(() => {
    button.textContent = originalLabel;
  }, 1200);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
