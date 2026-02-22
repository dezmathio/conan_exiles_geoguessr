(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const p of o.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&r(p)}).observe(document,{childList:!0,subtree:!0});function a(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(t){if(t.ep)return;t.ep=!0;const o=a(t);fetch(t.href,o)}})();const we="assets/exiled-lands/map/exiled-lands-basemap.jpg",ve=JSON.parse('[{"id":"el-001","screenshot":"assets/exiled-lands/screenshots/001.jpg","answer":{"x":0.3123,"y":0.4362},"metadata":{"biome":"snow","tags":[],"poiType":"famous","notes":""}},{"id":"el-002","screenshot":"assets/exiled-lands/screenshots/002.jpg","answer":{"x":0.2291,"y":0.4819},"metadata":{"biome":"highlands","tags":[],"poiType":"camp","notes":""}},{"id":"el-003","screenshot":"assets/exiled-lands/screenshots/003.jpg","answer":{"x":0.7361,"y":0.6922},"metadata":{"biome":"jungle","tags":[],"poiType":"camp","notes":""}},{"id":"el-004","screenshot":"assets/exiled-lands/screenshots/004.jpg","answer":{"x":0.442,"y":0.2983},"metadata":{"biome":"volcano","tags":[],"poiType":"camp","notes":""}},{"id":"el-005","screenshot":"assets/exiled-lands/screenshots/005.jpg","answer":{"x":0.2639,"y":0.591},"metadata":{"biome":"desert","tags":[],"poiType":"camp","notes":""}},{"id":"el-006","screenshot":"assets/exiled-lands/screenshots/006.jpg","answer":{"x":0.2637,"y":0.5914},"metadata":{"biome":"desert","tags":[],"poiType":"dungeon","notes":""}},{"id":"el-007","screenshot":"assets/exiled-lands/screenshots/007.jpg","answer":{"x":0.4624,"y":0.5758},"metadata":{"biome":"highlands","tags":[],"poiType":"","notes":""}},{"id":"el-008","screenshot":"assets/exiled-lands/screenshots/008.jpg","answer":{"x":0.5219,"y":0.6647},"metadata":{"biome":"desert","tags":[],"poiType":"camp","notes":""}},{"id":"el-009","screenshot":"assets/exiled-lands/screenshots/009.jpg","answer":{"x":0.6237,"y":0.7815},"metadata":{"biome":"desert","tags":[],"poiType":"lore","notes":""}},{"id":"el-010","screenshot":"assets/exiled-lands/screenshots/010.jpg","answer":{"x":0.6595,"y":0.6606},"metadata":{"biome":"jungle","tags":[],"poiType":"base","notes":""}},{"id":"el-011","screenshot":"assets/exiled-lands/screenshots/011.jpg","answer":{"x":0.8232,"y":0.5841},"metadata":{"biome":"jungle","tags":[],"poiType":"camp","notes":""}},{"id":"el-012","screenshot":"assets/exiled-lands/screenshots/012.jpg","answer":{"x":0.8486,"y":0.7272},"metadata":{"biome":"jungle","tags":["medium"],"poiType":"","notes":""}},{"id":"el-013","screenshot":"assets/exiled-lands/screenshots/013.jpg","answer":{"x":0.7561,"y":0.7989},"metadata":{"biome":"jungle","tags":["easy"],"poiType":"","notes":""}},{"id":"el-014","screenshot":"assets/exiled-lands/screenshots/014.jpg","answer":{"x":0.7431,"y":0.7483},"metadata":{"biome":"jungle","tags":["easy"],"poiType":"rat","notes":""}},{"id":"el-015","screenshot":"assets/exiled-lands/screenshots/015.jpg","answer":{"x":0.5557,"y":0.6836},"metadata":{"biome":"desert","tags":["easy"],"poiType":"camp","notes":""}},{"id":"el-016","screenshot":"assets/exiled-lands/screenshots/016.jpg","answer":{"x":0.5268,"y":0.7258},"metadata":{"biome":"desert","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-017","screenshot":"assets/exiled-lands/screenshots/017.jpg","answer":{"x":0.4893,"y":0.7146},"metadata":{"biome":"desert","tags":["hard"],"poiType":"mesh","notes":""}},{"id":"el-018","screenshot":"assets/exiled-lands/screenshots/018.jpg","answer":{"x":0.4657,"y":0.7143},"metadata":{"biome":"desert","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-019","screenshot":"assets/exiled-lands/screenshots/019.jpg","answer":{"x":0.4552,"y":0.7116},"metadata":{"biome":"desert","tags":["easy"],"poiType":"boss","notes":""}},{"id":"el-020","screenshot":"assets/exiled-lands/screenshots/020.jpg","answer":{"x":0.4469,"y":0.7482},"metadata":{"biome":"desert","tags":["medium"],"poiType":"camp","notes":""}},{"id":"el-021","screenshot":"assets/exiled-lands/screenshots/021.jpg","answer":{"x":0.275,"y":0.7507},"metadata":{"biome":"desert","tags":["easy"],"poiType":"cave","notes":""}},{"id":"el-022","screenshot":"assets/exiled-lands/screenshots/022.jpg","answer":{"x":0.2329,"y":0.6322},"metadata":{"biome":"desert","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-023","screenshot":"assets/exiled-lands/screenshots/023.jpg","answer":{"x":0.232,"y":0.6192},"metadata":{"biome":"desert","tags":["easy"],"poiType":"lore","notes":""}},{"id":"el-024","screenshot":"assets/exiled-lands/screenshots/024.jpg","answer":{"x":0.2264,"y":0.5838},"metadata":{"biome":"desert","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-025","screenshot":"assets/exiled-lands/screenshots/025.jpg","answer":{"x":0.2269,"y":0.5804},"metadata":{"biome":"desert","tags":["medium"],"poiType":"rat","notes":""}},{"id":"el-026","screenshot":"assets/exiled-lands/screenshots/026.jpg","answer":{"x":0.182,"y":0.5749},"metadata":{"biome":"desert","tags":["easy"],"poiType":"farm","notes":""}},{"id":"el-027","screenshot":"assets/exiled-lands/screenshots/027.jpg","answer":{"x":0.1842,"y":0.647},"metadata":{"biome":"desert","tags":["easy"],"poiType":"boss","notes":""}},{"id":"el-028","screenshot":"assets/exiled-lands/screenshots/028.jpg","answer":{"x":0.1512,"y":0.6492},"metadata":{"biome":"desert","tags":["medium"],"poiType":"vague","notes":""}},{"id":"el-029","screenshot":"assets/exiled-lands/screenshots/029.jpg","answer":{"x":0.1025,"y":0.5575},"metadata":{"biome":"desert","tags":["easy"],"poiType":"camp","notes":""}},{"id":"el-030","screenshot":"assets/exiled-lands/screenshots/030.jpg","answer":{"x":0.1527,"y":0.5305},"metadata":{"biome":"redrock","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-031","screenshot":"assets/exiled-lands/screenshots/031.jpg","answer":{"x":0.1449,"y":0.5074},"metadata":{"biome":"redrock","tags":["easy"],"poiType":"","notes":""}},{"id":"el-032","screenshot":"assets/exiled-lands/screenshots/032.jpg","answer":{"x":0.1309,"y":0.4235},"metadata":{"biome":"highlands","tags":["easy"],"poiType":"obelisk","notes":""}},{"id":"el-033","screenshot":"assets/exiled-lands/screenshots/033.jpg","answer":{"x":0.0988,"y":0.4226},"metadata":{"biome":"highlands","tags":["hard"],"poiType":"camp","notes":""}},{"id":"el-034","screenshot":"assets/exiled-lands/screenshots/034.jpg","answer":{"x":0.0833,"y":0.4107},"metadata":{"biome":"highlands","tags":["medium"],"poiType":"vague","notes":""}},{"id":"el-035","screenshot":"assets/exiled-lands/screenshots/035.jpg","answer":{"x":0.1902,"y":0.3364},"metadata":{"biome":"snow","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-036","screenshot":"assets/exiled-lands/screenshots/036.jpg","answer":{"x":0.2043,"y":0.3361},"metadata":{"biome":"snow","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-037","screenshot":"assets/exiled-lands/screenshots/037.jpg","answer":{"x":0.2502,"y":0.3252},"metadata":{"biome":"snow","tags":["easy"],"poiType":"","notes":""}},{"id":"el-038","screenshot":"assets/exiled-lands/screenshots/038.jpg","answer":{"x":0.3177,"y":0.3465},"metadata":{"biome":"snow","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-039","screenshot":"assets/exiled-lands/screenshots/039.jpg","answer":{"x":0.3332,"y":0.265},"metadata":{"biome":"volcano","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-040","screenshot":"assets/exiled-lands/screenshots/040.jpg","answer":{"x":0.4359,"y":0.2573},"metadata":{"biome":"volcano","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-041","screenshot":"assets/exiled-lands/screenshots/041.jpg","answer":{"x":0.4074,"y":0.2341},"metadata":{"biome":"volcano","tags":["medium"],"poiType":"rat","notes":""}},{"id":"el-042","screenshot":"assets/exiled-lands/screenshots/042.jpg","answer":{"x":0.3935,"y":0.2897},"metadata":{"biome":"volcano","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-043","screenshot":"assets/exiled-lands/screenshots/043.jpg","answer":{"x":0.3938,"y":0.2939},"metadata":{"biome":"volcano","tags":["easy"],"poiType":"rat","notes":""}},{"id":"el-044","screenshot":"assets/exiled-lands/screenshots/044.jpg","answer":{"x":0.4046,"y":0.3311},"metadata":{"biome":"volcano","tags":["easy"],"poiType":"rat","notes":""}},{"id":"el-045","screenshot":"assets/exiled-lands/screenshots/045.jpg","answer":{"x":0.3639,"y":0.3505},"metadata":{"biome":"snow","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-046","screenshot":"assets/exiled-lands/screenshots/046.jpg","answer":{"x":0.3896,"y":0.4219},"metadata":{"biome":"snow","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-047","screenshot":"assets/exiled-lands/screenshots/047.jpg","answer":{"x":0.3348,"y":0.4912},"metadata":{"biome":"highlands","tags":["easy"],"poiType":"camp","notes":""}},{"id":"el-048","screenshot":"assets/exiled-lands/screenshots/048.jpg","answer":{"x":0.3534,"y":0.5255},"metadata":{"biome":"highlands","tags":["easy"],"poiType":"camp","notes":""}},{"id":"el-049","screenshot":"assets/exiled-lands/screenshots/049.jpg","answer":{"x":0.346,"y":0.5594},"metadata":{"biome":"highlands","tags":["easy"],"poiType":"rat","notes":""}},{"id":"el-050","screenshot":"assets/exiled-lands/screenshots/050.jpg","answer":{"x":0.3334,"y":0.5674},"metadata":{"biome":"desert","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-051","screenshot":"assets/exiled-lands/screenshots/051.jpg","answer":{"x":0.3454,"y":0.5841},"metadata":{"biome":"desert","tags":["easy"],"poiType":"vague","notes":""}},{"id":"el-052","screenshot":"assets/exiled-lands/screenshots/052.jpg","answer":{"x":0.2937,"y":0.6258},"metadata":{"biome":"desert","tags":["medium"],"poiType":"vague","notes":""}},{"id":"el-053","screenshot":"assets/exiled-lands/screenshots/053.jpg","answer":{"x":0.2683,"y":0.6838},"metadata":{"biome":"desert","tags":["easy"],"poiType":"obelisk","notes":""}},{"id":"el-054","screenshot":"assets/exiled-lands/screenshots/054.jpg","answer":{"x":0.2682,"y":0.6597},"metadata":{"biome":"desert","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-055","screenshot":"assets/exiled-lands/screenshots/055.jpg","answer":{"x":0.1913,"y":0.6781},"metadata":{"biome":"desert","tags":["medium"],"poiType":"vague","notes":""}},{"id":"el-056","screenshot":"assets/exiled-lands/screenshots/056.jpg","answer":{"x":0.112,"y":0.6603},"metadata":{"biome":"desert","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-057","screenshot":"assets/exiled-lands/screenshots/057.jpg","answer":{"x":0.1387,"y":0.6149},"metadata":{"biome":"desert","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-058","screenshot":"assets/exiled-lands/screenshots/058.jpg","answer":{"x":0.1865,"y":0.5328},"metadata":{"biome":"redrock","tags":["medium"],"poiType":"","notes":""}},{"id":"el-059","screenshot":"assets/exiled-lands/screenshots/059.jpg","answer":{"x":0.1921,"y":0.4967},"metadata":{"biome":"highlands","tags":["easy"],"poiType":"","notes":""}},{"id":"el-060","screenshot":"assets/exiled-lands/screenshots/060.jpg","answer":{"x":0.2374,"y":0.4256},"metadata":{"biome":"highlands","tags":["medium"],"poiType":"vague","notes":""}},{"id":"el-061","screenshot":"assets/exiled-lands/screenshots/061.jpg","answer":{"x":0.1739,"y":0.2911},"metadata":{"biome":"snow","tags":["medium"],"poiType":"camp","notes":""}},{"id":"el-062","screenshot":"assets/exiled-lands/screenshots/062.jpg","answer":{"x":0.2635,"y":0.2207},"metadata":{"biome":"snow","tags":["hard"],"poiType":"dungeon","notes":""}},{"id":"el-063","screenshot":"assets/exiled-lands/screenshots/063.jpg","answer":{"x":0.3275,"y":0.3381},"metadata":{"biome":"snow","tags":["easy"],"poiType":"vague","notes":""}},{"id":"el-064","screenshot":"assets/exiled-lands/screenshots/064.jpg","answer":{"x":0.3274,"y":0.3798},"metadata":{"biome":"snow","tags":["easy"],"poiType":"rat","notes":""}},{"id":"el-065","screenshot":"assets/exiled-lands/screenshots/065.jpg","answer":{"x":0.3191,"y":0.3886},"metadata":{"biome":"snow","tags":["hard"],"poiType":"dungeon","notes":""}},{"id":"el-066","screenshot":"assets/exiled-lands/screenshots/066.jpg","answer":{"x":0.273,"y":0.5214},"metadata":{"biome":"highlands","tags":["medium"],"poiType":"vague","notes":""}},{"id":"el-067","screenshot":"assets/exiled-lands/screenshots/067.jpg","answer":{"x":0.2708,"y":0.5425},"metadata":{"biome":"highlands","tags":["easy"],"poiType":"","notes":""}},{"id":"el-068","screenshot":"assets/exiled-lands/screenshots/068.jpg","answer":{"x":0.2774,"y":0.5835},"metadata":{"biome":"desert","tags":["hard"],"poiType":"camp","notes":""}},{"id":"el-069","screenshot":"assets/exiled-lands/screenshots/069.jpg","answer":{"x":0.3425,"y":0.6237},"metadata":{"biome":"desert","tags":["hard"],"poiType":"secret","notes":""}},{"id":"el-070","screenshot":"assets/exiled-lands/screenshots/070.jpg","answer":{"x":0.352,"y":0.6274},"metadata":{"biome":"desert","tags":["easy"],"poiType":"resources","notes":""}},{"id":"el-071","screenshot":"assets/exiled-lands/screenshots/071.jpg","answer":{"x":0.4163,"y":0.5926},"metadata":{"biome":"desert","tags":["hard"],"poiType":"rat","notes":""}},{"id":"el-072","screenshot":"assets/exiled-lands/screenshots/072.jpg","answer":{"x":0.4839,"y":0.6656},"metadata":{"biome":"desert","tags":["medium"],"poiType":"rat","notes":""}},{"id":"el-073","screenshot":"assets/exiled-lands/screenshots/073.jpg","answer":{"x":0.4881,"y":0.6718},"metadata":{"biome":"desert","tags":["medium"],"poiType":"vague","notes":""}},{"id":"el-074","screenshot":"assets/exiled-lands/screenshots/074.jpg","answer":{"x":0.5002,"y":0.7758},"metadata":{"biome":"desert","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-075","screenshot":"assets/exiled-lands/screenshots/075.jpg","answer":{"x":0.3729,"y":0.8372},"metadata":{"biome":"desert","tags":["hard"],"poiType":"vague","notes":""}},{"id":"el-076","screenshot":"assets/exiled-lands/screenshots/076.jpg","answer":{"x":0.33,"y":0.868},"metadata":{"biome":"desert","tags":["easy"],"poiType":"rat","notes":""}},{"id":"el-077","screenshot":"assets/exiled-lands/screenshots/077.jpg","answer":{"x":0.2966,"y":0.8698},"metadata":{"biome":"desert","tags":["easy"],"poiType":"rat","notes":""}},{"id":"el-078","screenshot":"assets/exiled-lands/screenshots/078.jpg","answer":{"x":0.2524,"y":0.8204},"metadata":{"biome":"desert","tags":["medium"],"poiType":"obelisk","notes":""}},{"id":"el-079","screenshot":"assets/exiled-lands/screenshots/079.jpg","answer":{"x":0.2395,"y":0.7795},"metadata":{"biome":"desert","tags":["easy"],"poiType":"vague","notes":""}},{"id":"el-080","screenshot":"assets/exiled-lands/screenshots/080.jpg","answer":{"x":0.1634,"y":0.7009},"metadata":{"biome":"desert","tags":["medium"],"poiType":"vague","notes":""}}]'),Te={mapImage:we,locations:ve},re=5e3,ge=5,Y=1,K=10,O=.5,he=14,D=Te,ye=document.querySelector("#app");if(!ye)throw new Error("App root not found.");const _=ye;let A=0,j=null,w=[],l=X(),z=!1,W=null,te=!1,J=!1,B="all",fe=[],q=ge;const je=[{id:"all",label:"All"},{id:"vague",label:"Vague"},{id:"rat",label:"Rat"},{id:"camp",label:"Camp"},{id:"easy",label:"Easy"},{id:"medium",label:"Medium"},{id:"hard",label:"Hard"}];Se();function Se(){if(new URL(window.location.href).searchParams.get("tool")==="coords"){$e();return}ie()}function ie(){G();const e=je.map(r=>`<option value="${r.id}" ${r.id===B?"selected":""}>${r.label}</option>`).join("");_.innerHTML=`
    <main class="page page-home">
      <div class="home-hero">
        <h1>Conan Exiles GeoGuessr</h1>
        <p class="subtitle">Exiled Lands edition</p>
        <label class="mode-select-wrap" for="mode-select">
          <span>Mode</span>
          <select id="mode-select" class="mode-select">
            ${e}
          </select>
        </label>
        <button id="start-game-btn" class="btn btn-hero">START GUESSING</button>
      </div>
      <p class="disclaimer">Conan Exiles is property of Funcom. This is an unofficial fan project.</p>
    </main>
  `;const s=document.querySelector("#start-game-btn"),a=document.querySelector("#mode-select");a?.addEventListener("change",()=>{B=a.value??"all"}),s?.addEventListener("click",()=>{const r=ke(B);if(r.length===0){window.alert(`No locations found for mode "${B}".`);return}q=Math.min(ge,r.length),fe=Xe([...r]).slice(0,q),A=0,j=null,w=[],l=X(),z=!1,Z()})}function Z(){G(),J=!z;const e=fe[A],s=A+1,a=j?ae(j):"",r=ne(l),t=z?" is-expanded":"";_.innerHTML=`
    <main class="page page-play">
      <header class="round-header">
        <h1>Round ${s} / ${q}</h1>
      </header>
      <section class="card screenshot-focus">
        <h2>Screenshot</h2>
        <img class="screenshot screenshot-main" src="${Q(e.screenshot)}" alt="Round screenshot ${s}" />
      </section>
      <aside id="mini-map-panel" class="card mini-map-panel${t}">
        <div class="mini-map-header">
          <h3>Pick location</h3>
          <div class="map-controls">
            <button id="zoom-out-btn" class="btn btn-secondary btn-map-control" aria-label="Zoom out">-</button>
            <button id="zoom-reset-btn" class="btn btn-secondary btn-map-control" aria-label="Reset zoom">Reset</button>
            <button id="zoom-in-btn" class="btn btn-secondary btn-map-control" aria-label="Zoom in">+</button>
          </div>
        </div>
        <div id="map-viewport" class="map-viewport">
          <div id="map-canvas" class="map-canvas" style="transform: ${r};">
            <img id="map-image" src="${Q(D.mapImage)}" alt="Exiled Lands map" draggable="false" />
            ${a}
          </div>
        </div>
        <div id="mini-map-guess-wrap" class="mini-map-guess-wrap ${j?"is-ready":""}">
          <button
            id="guess-bar-btn"
            class="guess-bar-btn"
            ${j?"":"disabled"}
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
  `;const o=document.querySelector("#map-viewport"),p=document.querySelector("#map-canvas"),g=document.querySelector("#mini-map-panel"),T=document.querySelector("#mini-map-guess-wrap"),v=document.querySelector("#zoom-in-btn"),b=document.querySelector("#zoom-out-btn"),M=document.querySelector("#zoom-reset-btn"),c=document.querySelector("#guess-bar-btn");if(g){g.addEventListener("mouseenter",()=>{J||z||(z=!0,Z())}),g.addEventListener("mouseleave",()=>{J=!1});const x=S=>{if(te){te=!1;return}z&&(g.contains(S.target)||(l=X(),z=!1,Z()))};document.addEventListener("pointerdown",x),W=()=>{document.removeEventListener("pointerdown",x),W=null}}if(o&&p&&v&&b&&M){let x=!1,S=!1,F=0,N=0,C=0,P=0,d=0,h=0;const E=()=>{const n=o.getBoundingClientRect();return{width:n.width,height:n.height}},$=(n,u)=>{if(n<=0||u<=0)return;if(d<=0||h<=0){d=n,h=u;return}const y=m((d/2-l.offsetX)/(l.zoom*d),0,1),k=m((h/2-l.offsetY)/(l.zoom*h),0,1);l={...l,offsetX:n/2-y*n*l.zoom,offsetY:u/2-k*u*l.zoom},d=n,h=u},L=()=>{const n=E();$(n.width,n.height),l=be(l,n.width,n.height),p.style.transform=ne(l),p.style.setProperty("--pin-inverse-zoom",(1/l.zoom).toString()),v.disabled=l.zoom>=K,b.disabled=l.zoom<=Y},V=(n,u)=>{const y=o.getBoundingClientRect(),k=m(n-y.left,0,y.width),I=m(u-y.top,0,y.height),U=(k-l.offsetX)/l.zoom,xe=(I-l.offsetY)/l.zoom,de=m(U/y.width,0,1),ce=m(xe/y.height,0,1);j={x:de,y:ce};const se=p.querySelector(".map-marker-guess");se?(se.style.left=`${de*100}%`,se.style.top=`${ce*100}%`):p.insertAdjacentHTML("beforeend",ae(j)),f&&(f.disabled=!1),c&&(c.disabled=!1),T&&T.classList.add("is-ready")},ee=(n,u,y)=>{const k=l.zoom,I=m(k+n,Y,K);if(I===k)return;const U=I/k;l={...l,zoom:I,offsetX:u-(u-l.offsetX)*U,offsetY:y-(y-l.offsetY)*U},L()};v.addEventListener("click",()=>{const n=o.getBoundingClientRect();ee(O,n.width/2,n.height/2)}),b.addEventListener("click",()=>{const n=o.getBoundingClientRect();ee(-O,n.width/2,n.height/2)}),M.addEventListener("click",()=>{l=X(),L()}),o.addEventListener("wheel",n=>{n.preventDefault();const u=o.getBoundingClientRect(),y=m(n.clientX-u.left,0,u.width),k=m(n.clientY-u.top,0,u.height);ee(n.deltaY<0?O:-O,y,k)},{passive:!1}),o.addEventListener("pointerdown",n=>{if(n.button===0){if(!z){te=!0,z=!0,Z();return}x=!0,S=!1,F=n.clientX,N=n.clientY,C=l.offsetX,P=l.offsetY,o.setPointerCapture(n.pointerId),o.classList.add("is-dragging")}}),o.addEventListener("pointermove",n=>{if(!x||l.zoom<=Y)return;const u=n.clientX-F,y=n.clientY-N;(Math.abs(u)>2||Math.abs(y)>2)&&(S=!0),l={...l,offsetX:C+u,offsetY:P+y},L()}),o.addEventListener("pointerup",n=>{x&&(x=!1,o.releasePointerCapture(n.pointerId),o.classList.remove("is-dragging"),S||V(n.clientX,n.clientY))}),o.addEventListener("pointercancel",()=>{x=!1,o.classList.remove("is-dragging")}),typeof ResizeObserver<"u"?new ResizeObserver(()=>{L()}).observe(o):window.addEventListener("resize",L),L()}const i=()=>{if(!j)return;const x=Ce(j,e.answer),S=Me(x);w.push({location:e,guess:j,distance:x,points:S}),Le(w[w.length-1],s)},f=document.querySelector("#submit-guess-btn");f?.addEventListener("click",i),c?.addEventListener("click",i),document.querySelector("#quit-btn")?.addEventListener("click",ie)}function $e(){G(),_.innerHTML=`
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
            <img src="${Q(D.mapImage)}" alt="Exiled Lands map coordinate helper" draggable="false" />
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
  `;const e=document.querySelector("#coord-map-stage"),s=document.querySelector("#coord-map-canvas"),a=document.querySelector("#coord-marker"),r=document.querySelector("#hover-coord"),t=document.querySelector("#selected-coord"),o=document.querySelector("#coord-zoom-readout"),p=document.querySelector("#coord-zoom-in-btn"),g=document.querySelector("#coord-zoom-out-btn"),T=document.querySelector("#coord-zoom-reset-btn"),v=document.querySelector("#copy-coord-btn"),b=document.querySelector("#copy-json-btn"),M=document.querySelector("#back-home-btn");let c=null,i=X();if(e&&s&&a&&r&&t&&o&&p&&g&&T&&v&&b){let f=!1,H=!1,x=0,S=0,F=0,N=0;const C=()=>{const d=e.getBoundingClientRect();i=be(i,d.width,d.height),s.style.transform=ne(i),s.style.setProperty("--pin-inverse-zoom",(1/i.zoom).toString()),o.textContent=`${Math.round(i.zoom*100)}%`,p.disabled=i.zoom>=K,g.disabled=i.zoom<=Y},P=(d,h,E)=>{const $=i.zoom,L=m($+d,Y,K);if(L===$)return;const V=L/$;i={...i,zoom:L,offsetX:h-(h-i.offsetX)*V,offsetY:E-(E-i.offsetY)*V},C()};e.addEventListener("wheel",d=>{d.preventDefault();const h=e.getBoundingClientRect(),E=m(d.clientX-h.left,0,h.width),$=m(d.clientY-h.top,0,h.height);P(d.deltaY<0?O:-O,E,$)},{passive:!1}),p.addEventListener("click",()=>{const d=e.getBoundingClientRect();P(O,d.width/2,d.height/2)}),g.addEventListener("click",()=>{const d=e.getBoundingClientRect();P(-O,d.width/2,d.height/2)}),T.addEventListener("click",()=>{i=X(),C()}),e.addEventListener("pointerdown",d=>{d.button===0&&(f=!0,H=!1,x=d.clientX,S=d.clientY,F=i.offsetX,N=i.offsetY,e.setPointerCapture(d.pointerId),e.classList.add("is-dragging"))}),e.addEventListener("pointermove",d=>{if(!f){const $=me(e,d.clientX,d.clientY,i);r.textContent=`x: ${R($.x)}, y: ${R($.y)}`;return}if(i.zoom<=Y)return;const h=d.clientX-x,E=d.clientY-S;(Math.abs(h)>2||Math.abs(E)>2)&&(H=!0),i={...i,offsetX:F+h,offsetY:N+E},C()}),e.addEventListener("pointerup",d=>{f&&(f=!1,e.releasePointerCapture(d.pointerId),e.classList.remove("is-dragging"),H||(c=me(e,d.clientX,d.clientY,i),a.hidden=!1,a.style.left=`${c.x*100}%`,a.style.top=`${c.y*100}%`,t.textContent=`x: ${R(c.x)}, y: ${R(c.y)}`,v.disabled=!1,b.disabled=!1))}),e.addEventListener("pointercancel",()=>{f=!1,e.classList.remove("is-dragging")}),e.addEventListener("pointerleave",()=>{f||(r.textContent="x: -, y: -")}),typeof ResizeObserver<"u"?new ResizeObserver(()=>{C()}).observe(e):window.addEventListener("resize",C),C(),v.addEventListener("click",async()=>{if(!c)return;const d=`${R(c.x)}, ${R(c.y)}`;await ue(d,v,"Copied")}),b.addEventListener("click",async()=>{if(!c)return;const d=`"answer": { "x": ${R(c.x)}, "y": ${R(c.y)} }`;await ue(d,b,"Copied")})}M?.addEventListener("click",()=>{const f=new URL(window.location.href);f.searchParams.delete("tool"),history.replaceState({},"",`${f.pathname}${f.search}${f.hash}`),ie()})}function Le(e,s){G();const a=Re(e.location.answer),r=ae(e.guess),t=(e.guess.x+e.location.answer.x)/2,o=(e.guess.y+e.location.answer.y)/2,p=Ye(e.guess,e.location.answer),g=m(p+1.6,2.2,he+1.2),T=le(e.guess.x,e.guess.y,g),v=le(t,o,p),b=Oe(e.guess,e.location.answer);_.innerHTML=`
    <main class="page round-result-page">
      <header class="round-header">
        <h1>Round ${s} result</h1>
        <p><strong>${e.points.toLocaleString()}</strong> points</p>
        <p>Distance: ${(e.distance*100).toFixed(2)} map units</p>
      </header>
      <section class="card">
        <h2>Guess vs answer</h2>
        <div class="result-map-stage">
          <div
            id="result-map-canvas"
            class="result-map-canvas"
            style="transform: ${T}; --pin-inverse-zoom: ${(1/g).toFixed(5)};"
          >
            <img src="${Q(D.mapImage)}" alt="Exiled Lands map result view" />
            ${b}
            ${a}
            ${r}
          </div>
        </div>
        <p class="legend">
          <span class="dot answer-dot"></span> Answer
          <span class="dot guess-dot"></span> Your guess
        </p>
        <div id="result-score-panel" class="result-score-panel">
          <p class="result-stats-inline">Distance ${(e.distance*100).toFixed(2)} · ${e.points.toLocaleString()} pts</p>
          <button id="next-btn" class="btn btn-primary result-next-btn">
            ${A+1>=q?"View final score":"Next round"}
          </button>
        </div>
      </section>
    </main>
  `;const M=document.querySelector("#result-map-canvas"),c=document.querySelector("#result-score-panel"),i=document.querySelector("#next-btn");i&&(i.disabled=!0),requestAnimationFrame(()=>{requestAnimationFrame(()=>{M&&(M.style.transform=v,M.style.setProperty("--pin-inverse-zoom",(1/p).toFixed(5))),window.setTimeout(()=>{c?.classList.add("is-visible"),i&&(i.disabled=!1)},700)})}),i?.addEventListener("click",()=>{if(A+=1,j=null,l=X(),z=!1,J=!0,A>=q){ze();return}Z()})}function ze(){G();const e=w.reduce((c,i)=>c+i.points,0),s=q*re,a=s>0?e/s:0,r=w.length>0?w.reduce((c,i)=>c+i.distance,0)/w.length:0,t=w.length>0?Math.round(e/w.length):0,o=w.reduce((c,i)=>!c||i.points>c.points?i:c,null),p=qe(a),g=Ee(e,w),T=w.map((c,i)=>`
        <tr>
          <td>${i+1}</td>
          <td>${oe(c.location.id)}</td>
          <td>${c.points.toLocaleString()}</td>
          <td>${(c.distance*100).toFixed(2)}</td>
        </tr>
      `).join(""),v=w.map((c,i)=>`<span class="round-badge">R${i+1}: ${c.points.toLocaleString()} pts</span>`).join("");_.innerHTML=`
    <main class="page page-results">
      <section class="card results-hero">
        <p class="results-mode">Mode: ${oe(B)}</p>
        <h1>${p.title}</h1>
        <p class="subtitle">${p.subtitle}</p>
        <p class="results-score">Final score: <strong>${e.toLocaleString()}</strong> / ${s.toLocaleString()}</p>
        <div class="results-progress">
          <div class="results-progress-fill" style="width:${Math.round(a*100)}%"></div>
        </div>
      </section>

      <section class="card">
        <h2>Session highlights</h2>
        <div class="results-highlights">
          <p><strong>Best round:</strong> ${o?`${oe(o.location.id)} (${o.points.toLocaleString()} pts)`:"-"}</p>
          <p><strong>Average points:</strong> ${t.toLocaleString()}</p>
          <p><strong>Average distance:</strong> ${(r*100).toFixed(2)} map units</p>
        </div>
        <div class="round-badges">${v}</div>
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
          <tbody>${T}</tbody>
        </table>
      </section>

      <section class="card">
        <h2>Share score</h2>
        <textarea id="share-output" readonly>${g}</textarea>
        <div class="actions">
          <button id="copy-score-btn" class="btn btn-primary">Copy score text</button>
          <button id="play-again-btn" class="btn btn-secondary">Play again</button>
        </div>
      </section>
    </main>
  `;const b=document.querySelector("#copy-score-btn");b?.addEventListener("click",async()=>{const c=document.querySelector("#share-output");if(c)try{await navigator.clipboard.writeText(c.value),b.textContent="Copied"}catch{c.select(),document.execCommand("copy"),b.textContent="Copied"}}),document.querySelector("#play-again-btn")?.addEventListener("click",()=>{location.reload()})}function Me(e){if(e<=.015)return Math.round(pe(re,4960,e/.015));if(e<=.06)return Math.round(pe(4960,3600,(e-.015)/.045));const s=3600*Math.exp(-8*(e-.06));return Math.max(0,Math.round(s))}function Ce(e,s){const a=e.x-s.x,r=e.y-s.y;return Math.sqrt(a*a+r*r)}function Ee(e,s){const a=s.map((r,t)=>`R${t+1}: ${r.points} pts (${(r.distance*100).toFixed(2)} dist)`);return["Conan Exiles GeoGuessr (Exiled Lands)",`Mode: ${B}`,`Score: ${e}/${q*re}`,...a].join(`
`)}function ke(e){return e==="all"?D.locations:D.locations.filter(s=>{const a=s.metadata??{},r=(a.poiType??"").toLowerCase().trim(),t=(a.tags??[]).map(o=>o.toLowerCase().trim());return e==="vague"||e==="rat"||e==="camp"?r===e:t.includes(e)})}function ae(e){return`<div class="map-marker map-marker-guess" style="left:${e.x*100}%; top:${e.y*100}%;" title="Your guess"></div>`}function Re(e){return`<div class="map-marker map-marker-answer" style="left:${e.x*100}%; top:${e.y*100}%;" title="Answer"></div>`}function Oe(e,s){return`
    <svg class="result-connector" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <line x1="${e.x*100}" y1="${e.y*100}" x2="${s.x*100}" y2="${s.y*100}" />
    </svg>
  `}function le(e,s,a){const r=50-e*100*a,t=50-s*100*a;return`translate(${r}%, ${t}%) scale(${a})`}function Ye(e,s){const t=Math.abs(e.x-s.x),o=Math.abs(e.y-s.y),g=.92/Math.max(t,o,1e-4);return m(g,1,he)}function qe(e){return e>=.9?{title:"Exile Cartographer",subtitle:"You know these lands like a true map sage."}:e>=.75?{title:"Relic Pathfinder",subtitle:"Strong instincts and sharp landmark reads."}:e>=.55?{title:"Dune Scout",subtitle:"Solid run. You are getting dangerous out there."}:{title:"Lost Wanderer",subtitle:"Crom watches. Another run will sharpen your eye."}}function X(){return{zoom:Y,offsetX:0,offsetY:0}}function ne(e){return`translate(${e.offsetX}px, ${e.offsetY}px) scale(${e.zoom})`}function be(e,s,a){const r=s*e.zoom,t=a*e.zoom,o=Math.min(0,s-r),p=Math.min(0,a-t);return{...e,offsetX:m(e.offsetX,o,0),offsetY:m(e.offsetY,p,0)}}function G(){W&&W()}function Xe(e){for(let s=e.length-1;s>0;s-=1){const a=Math.floor(Math.random()*(s+1));[e[s],e[a]]=[e[a],e[s]]}return e}function m(e,s,a){return Math.min(a,Math.max(s,e))}function pe(e,s,a){return e+(s-e)*m(a,0,1)}function Q(e){return e.startsWith("assets/")?e.slice(7):e}function me(e,s,a,r){const t=e.getBoundingClientRect(),o=m(s-t.left,0,t.width),p=m(a-t.top,0,t.height),g=(o-r.offsetX)/r.zoom,T=(p-r.offsetY)/r.zoom;return{x:m(g/t.width,0,1),y:m(T/t.height,0,1)}}function R(e){return e.toFixed(4)}async function ue(e,s,a){const r=s.textContent??"Copy";try{await navigator.clipboard.writeText(e),s.textContent=a}catch{const t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.opacity="0",document.body.appendChild(t),t.select(),document.execCommand("copy"),document.body.removeChild(t),s.textContent=a}window.setTimeout(()=>{s.textContent=r},1200)}function oe(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}
