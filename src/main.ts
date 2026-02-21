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

const mapPack = exiledLandsData as MapPack;
const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root not found.");
}

let roundIndex = 0;
let selectedGuess: Coord | null = null;
let roundResults: RoundResult[] = [];

const locationsForSession = shuffle([...mapPack.locations]).slice(0, ROUNDS_PER_SESSION);

renderHome();

function renderHome(): void {
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
    renderRound();
  });
}

function renderRound(): void {
  const location = locationsForSession[roundIndex];
  const roundNumber = roundIndex + 1;
  const marker = selectedGuess ? guessMarker(selectedGuess) : "";

  app.innerHTML = `
    <main class="page">
      <header class="round-header">
        <h1>Round ${roundNumber} / ${ROUNDS_PER_SESSION}</h1>
        <p>${escapeHtml(location.label)}</p>
      </header>
      <section class="play-grid">
        <article class="card">
          <h2>Screenshot</h2>
          <img class="screenshot" src="${location.screenshot}" alt="Round screenshot ${roundNumber}" />
        </article>
        <article class="card">
          <h2>Pick location on map</h2>
          <div id="map-stage" class="map-stage">
            <img id="map-image" src="${mapPack.mapImage}" alt="Exiled Lands map" />
            ${marker}
          </div>
        </article>
      </section>
      <div class="actions">
        <button id="submit-guess-btn" class="btn btn-primary" ${selectedGuess ? "" : "disabled"}>
          Confirm guess
        </button>
        <button id="quit-btn" class="btn btn-secondary">Back to home</button>
      </div>
    </main>
  `;

  const mapStage = document.querySelector<HTMLDivElement>("#map-stage");
  const submitButton = document.querySelector<HTMLButtonElement>("#submit-guess-btn");

  mapStage?.addEventListener("click", (event) => {
    const rect = mapStage.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    selectedGuess = { x, y };
    renderRound();
  });

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

    if (roundIndex >= ROUNDS_PER_SESSION) {
      renderResults();
      return;
    }

    renderRound();
  });
}

function renderResults(): void {
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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}
