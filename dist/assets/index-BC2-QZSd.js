(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(n){if(n.ep)return;n.ep=!0;const s=o(n);fetch(n.href,s)}})();const w="assets/exiled-lands/map/exiled-lands-basemap.jpg",v=[{id:"el-001",label:"Bridge in the frozen north",screenshot:"assets/exiled-lands/screenshots/001.jpeg",referencePin:"assets/exiled-lands/screenshots/references/001_pin.jpeg",answer:{x:.547,y:.445}},{id:"el-002",label:"Sinkhole region",screenshot:"assets/exiled-lands/screenshots/002.jpeg",referencePin:"assets/exiled-lands/screenshots/references/002_pin.jpeg",answer:{x:.785,y:.564}},{id:"el-003",label:"Eastern river islands",screenshot:"assets/exiled-lands/screenshots/003.jpeg",referencePin:"assets/exiled-lands/screenshots/references/003_pin.jpeg",answer:{x:.684,y:.571}},{id:"el-004",label:"Volcano edge",screenshot:"assets/exiled-lands/screenshots/004.jpeg",referencePin:"assets/exiled-lands/screenshots/references/004_pin.jpeg",answer:{x:.515,y:.267}},{id:"el-005",label:"Southern desert ruins",screenshot:"assets/exiled-lands/screenshots/005.jpeg",referencePin:"assets/exiled-lands/screenshots/references/005_pin.jpeg",answer:{x:.508,y:.682}}],L={mapImage:w,locations:v},h=5e3,i=5,m=L,p=document.querySelector("#app");if(!p)throw new Error("App root not found.");let u=0,c=null,l=[];const E=A([...m.locations]).slice(0,i);b();function b(){p.innerHTML=`
    <main class="page page-home">
      <h1>Conan Exiles GeoGuessr</h1>
      <p class="subtitle">Fan-made, open-source map guessing game for Exiled Lands.</p>
      <section class="card">
        <h2>How it works</h2>
        <ol>
          <li>You get a screenshot from Conan Exiles.</li>
          <li>Click the Exiled Lands map where you think it was taken.</li>
          <li>Score points based on how close your guess is.</li>
        </ol>
        <p><strong>Session length:</strong> ${i} rounds</p>
        <p><strong>Max score:</strong> ${i*h}</p>
      </section>
      <div class="actions">
        <button id="start-game-btn" class="btn btn-primary">Start game</button>
      </div>
      <p class="disclaimer">Conan Exiles is property of Funcom. This is an unofficial fan project.</p>
    </main>
  `,document.querySelector("#start-game-btn")?.addEventListener("click",()=>{u=0,c=null,l=[],g()})}function g(){const e=E[u],t=u+1,o=c?y(c):"";p.innerHTML=`
    <main class="page">
      <header class="round-header">
        <h1>Round ${t} / ${i}</h1>
        <p>${x(e.label)}</p>
      </header>
      <section class="play-grid">
        <article class="card">
          <h2>Screenshot</h2>
          <img class="screenshot" src="${e.screenshot}" alt="Round screenshot ${t}" />
        </article>
        <article class="card">
          <h2>Pick location on map</h2>
          <div id="map-stage" class="map-stage">
            <img id="map-image" src="${m.mapImage}" alt="Exiled Lands map" />
            ${o}
          </div>
        </article>
      </section>
      <div class="actions">
        <button id="submit-guess-btn" class="btn btn-primary" ${c?"":"disabled"}>
          Confirm guess
        </button>
        <button id="quit-btn" class="btn btn-secondary">Back to home</button>
      </div>
    </main>
  `;const r=document.querySelector("#map-stage"),n=document.querySelector("#submit-guess-btn");r?.addEventListener("click",a=>{const d=r.getBoundingClientRect(),$=f((a.clientX-d.left)/d.width,0,1),S=f((a.clientY-d.top)/d.height,0,1);c={x:$,y:S},g()}),n?.addEventListener("click",()=>{if(!c)return;const a=P(c,e.answer),d=q(a);l.push({location:e,guess:c,distance:a,points:d}),k(l[l.length-1],t)}),document.querySelector("#quit-btn")?.addEventListener("click",b)}function k(e,t){const o=j(e.location.answer),r=y(e.guess);p.innerHTML=`
    <main class="page">
      <header class="round-header">
        <h1>Round ${t} result</h1>
        <p><strong>${e.points.toLocaleString()}</strong> points</p>
        <p>Distance: ${(e.distance*100).toFixed(2)} map units</p>
      </header>
      <section class="play-grid">
        <article class="card">
          <h2>Screenshot</h2>
          <img class="screenshot" src="${e.location.screenshot}" alt="Round screenshot ${t}" />
        </article>
        <article class="card">
          <h2>Your guess vs answer</h2>
          <div class="map-stage">
            <img src="${m.mapImage}" alt="Exiled Lands map answer view" />
            ${o}
            ${r}
          </div>
          <p class="legend">
            <span class="dot answer-dot"></span> Answer
            <span class="dot guess-dot"></span> Your guess
          </p>
        </article>
      </section>
      <div class="actions">
        <button id="next-btn" class="btn btn-primary">
          ${u+1>=i?"View final score":"Next round"}
        </button>
      </div>
    </main>
  `,document.querySelector("#next-btn")?.addEventListener("click",()=>{if(u+=1,c=null,u>=i){M();return}g()})}function M(){const e=l.reduce((s,a)=>s+a.points,0),t=R(e,l),o=l.map((s,a)=>`
        <tr>
          <td>${a+1}</td>
          <td>${x(s.location.id)}</td>
          <td>${s.points.toLocaleString()}</td>
          <td>${(s.distance*100).toFixed(2)}</td>
        </tr>
      `).join("");p.innerHTML=`
    <main class="page page-results">
      <h1>Session complete</h1>
      <p class="subtitle">Final score: <strong>${e.toLocaleString()}</strong> / ${(i*h).toLocaleString()}</p>

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
          <tbody>${o}</tbody>
        </table>
      </section>

      <section class="card">
        <h2>Share score</h2>
        <textarea id="share-output" readonly>${t}</textarea>
        <div class="actions">
          <button id="copy-score-btn" class="btn btn-primary">Copy score text</button>
          <button id="play-again-btn" class="btn btn-secondary">Play again</button>
        </div>
      </section>
    </main>
  `;const r=document.querySelector("#copy-score-btn");r?.addEventListener("click",async()=>{const s=document.querySelector("#share-output");if(s)try{await navigator.clipboard.writeText(s.value),r.textContent="Copied"}catch{s.select(),document.execCommand("copy"),r.textContent="Copied"}}),document.querySelector("#play-again-btn")?.addEventListener("click",()=>{location.reload()})}function q(e){const t=h*Math.exp(-7*e);return Math.max(0,Math.round(t))}function P(e,t){const o=e.x-t.x,r=e.y-t.y;return Math.sqrt(o*o+r*r)}function R(e,t){const o=t.map((r,n)=>`R${n+1}: ${r.points} pts (${(r.distance*100).toFixed(2)} dist)`);return["Conan Exiles GeoGuessr (Exiled Lands)",`Score: ${e}/${i*h}`,...o].join(`
`)}function y(e){return`<div class="map-marker map-marker-guess" style="left:${e.x*100}%; top:${e.y*100}%;" title="Your guess"></div>`}function j(e){return`<div class="map-marker map-marker-answer" style="left:${e.x*100}%; top:${e.y*100}%;" title="Answer"></div>`}function A(e){for(let t=e.length-1;t>0;t-=1){const o=Math.floor(Math.random()*(t+1));[e[t],e[o]]=[e[o],e[t]]}return e}function f(e,t,o){return Math.min(o,Math.max(t,e))}function x(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}
