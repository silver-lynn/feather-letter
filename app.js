const MONTHS = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
const MONTH_META = [
  ["越冬深处","大多数候鸟停留在温暖的非繁殖地，保存体力。"],
  ["春意将近","部分种群开始在越冬地集结，为北迁做准备。"],
  ["春迁启动","北迁开始，水鸟与滨鸟陆续离开南方越冬地。"],
  ["春迁高峰","东部沿海、长江与黄河湿地成为繁忙的空中驿站。"],
  ["抵达北方","许多候鸟抵达东北亚、蒙古和北极圈附近的繁殖地。"],
  ["繁殖季","长日照的北方湿地、苔原与森林迎来繁殖高峰。"],
  ["育雏季","幼鸟成长，部分早迁物种已经开始离开繁殖地。"],
  ["秋迁启动","北方日照缩短，候鸟开始向南方移动。"],
  ["秋迁高峰","黄渤海沿岸、华北和西南通道迎来集中迁徙。"],
  ["向南推进","许多种群穿过中国，继续飞往东南亚或澳大利西亚。"],
  ["抵达南方","大批候鸟陆续到达长江流域、华南及更南的越冬地。"],
  ["越冬安顿","迁徙逐渐平息，候鸟在各自非繁殖地补充能量。"]
];

const state = { month: 3, group: "all", selected: null, playing: false, timer: null };
const els = {
  routeLayer: document.querySelector("#routeLayer"), birdLayer: document.querySelector("#birdLayer"),
  slider: document.querySelector("#monthSlider"), monthTitle: document.querySelector("#monthTitle"),
  monthSummary: document.querySelector("#monthSummary"), seasonLabel: document.querySelector("#seasonLabel"),
  play: document.querySelector("#playBtn"), card: document.querySelector("#speciesCard"), list: document.querySelector("#speciesList"),
  filters: document.querySelector("#groupFilters"), dialog: document.querySelector("#aboutDialog")
};

function project(lng, lat) { return [((lng + 180) / 360) * 1200, ((90 - lat) / 180) * 620]; }
function visibleBirds() { return BIRDS.filter(b => state.group === "all" || b.group === state.group); }

function positionAt(bird, month) {
  const pts = bird.points;
  let prev = pts[pts.length - 1], next = pts[0];
  for (let i = 0; i < pts.length; i++) {
    if (pts[i][0] <= month) prev = pts[i];
    if (pts[i][0] > month) { next = pts[i]; break; }
  }
  let start = prev[0], end = next[0], current = month;
  if (end <= start) end += 12;
  if (current < start) current += 12;
  const t = Math.max(0, Math.min(1, (current - start) / (end - start)));
  let lng1 = prev[1], lng2 = next[1];
  if (Math.abs(lng2 - lng1) > 180) {
    if (lng2 < lng1) lng2 += 360; else lng1 += 360;
  }
  let lng = lng1 + (lng2 - lng1) * t;
  if (lng > 180) lng -= 360;
  const lat = prev[2] + (next[2] - prev[2]) * t;
  const [x,y] = project(lng,lat);
  const [nx,ny] = project(next[1],next[2]);
  const angle = Math.atan2(ny-y,nx-x) * 180 / Math.PI;
  return { x,y,angle, location: t < .55 ? prev[3] : next[3], note: t < .55 ? prev[4] : next[4], next:next[3] };
}

function routePath(bird) {
  const coords = bird.points.map(p => project(p[1],p[2]));
  return coords.map((p,i) => {
    const crossesDateLine = i > 0 && Math.abs(p[0] - coords[i-1][0]) > 600;
    return `${i && !crossesDateLine ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  }).join(" ");
}

function markerLayout(birds) {
  const items = birds.map((bird, index) => ({ bird, index, ...positionAt(bird, state.month) }));
  for (let pass = 0; pass < 18; pass++) {
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        let dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy);
        if (dist < 48) {
          if (dist < .1) { const seed = (i * 37 + j * 19) % 360; dx = Math.cos(seed); dy = Math.sin(seed); dist = 1; }
          const push = (48 - dist) * .28;
          const ux = dx / dist, uy = dy / dist;
          a.x -= ux * push; a.y -= uy * push; b.x += ux * push; b.y += uy * push;
        }
      }
      items[i].x = Math.max(26, Math.min(1174, items[i].x));
      items[i].y = Math.max(28, Math.min(592, items[i].y));
    }
  }
  return items;
}

function renderMap() {
  const birds = visibleBirds(), layout = markerLayout(birds);
  els.routeLayer.innerHTML = birds.map(b => `<path class="route ${state.selected===b.id?'active':''}" d="${routePath(b)}" stroke="${BIRD_GROUPS[b.group].color}"/>`).join("");
  els.birdLayer.innerHTML = layout.map(p => {
    const b = p.bird, g = BIRD_GROUPS[b.group];
    return `<g class="bird-marker ${state.selected===b.id?'active':''}" data-id="${b.id}" tabindex="0" transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})">
      <title>${b.name} · ${p.location}</title>
      <circle class="halo" r="22" stroke="${g.color}"/><g transform="rotate(${p.angle.toFixed(1)})"><use href="#birdShape" fill="${g.color}"/></g>
      <text y="36" fill="${g.color}">${b.name}</text></g>`;
  }).join("");
  document.querySelectorAll(".bird-marker").forEach(marker => {
    marker.addEventListener("click", () => selectBird(marker.dataset.id));
    marker.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") selectBird(marker.dataset.id); });
  });
}

function renderHeader() {
  els.monthTitle.textContent = MONTHS[state.month-1];
  els.seasonLabel.textContent = MONTH_META[state.month-1][0];
  els.monthSummary.textContent = MONTH_META[state.month-1][1];
}

function renderFilters() {
  const items = [["all","全部 20 种"], ...Object.entries(BIRD_GROUPS).map(([k,v]) => [k,v.label])];
  els.filters.innerHTML = items.map(([key,label]) => `<button class="filter-chip ${state.group===key?'active':''}" data-group="${key}">${label}</button>`).join("");
  document.querySelectorAll(".filter-chip").forEach(btn => btn.addEventListener("click", () => {
    state.group = btn.dataset.group; state.selected = null; closeCard(); render();
  }));
}

function renderList() {
  els.list.innerHTML = visibleBirds().map(b => `<button class="species-row" data-id="${b.id}"><span style="background:${BIRD_GROUPS[b.group].color}"></span><span><b>${b.name}</b><small>${BIRD_GROUPS[b.group].label}</small></span></button>`).join("");
  document.querySelectorAll(".species-row").forEach(btn => btn.addEventListener("click", () => {
    selectBird(btn.dataset.id); document.querySelector(".map-stage").scrollIntoView({behavior:"smooth"});
  }));
}

function selectBird(id) {
  state.selected = id;
  const b = BIRDS.find(x => x.id === id), p = positionAt(b,state.month), g = BIRD_GROUPS[b.group];
  document.querySelector("#speciesName").textContent = b.name;
  document.querySelector("#speciesLatin").textContent = b.latin;
  document.querySelector("#speciesGroup").textContent = g.label.toUpperCase();
  document.querySelector("#speciesIcon").textContent = g.icon;
  document.querySelector("#speciesIcon").style.background = g.color;
  document.querySelector("#speciesLocation").textContent = p.location;
  document.querySelector("#speciesState").textContent = p.note;
  document.querySelector("#speciesDirection").textContent = `朝向 ${p.next}`;
  document.querySelector("#speciesFlyway").textContent = b.flyway;
  document.querySelector("#speciesStatus").textContent = b.status;
  els.card.classList.add("open");
  renderMap();
}

function closeCard() { els.card.classList.remove("open"); state.selected = null; renderMap(); }
function render() { renderHeader(); renderFilters(); renderList(); renderMap(); if (state.selected) selectBird(state.selected); }

els.slider.addEventListener("input", e => { state.month = Number(e.target.value); renderHeader(); renderMap(); if (state.selected) selectBird(state.selected); });
els.play.addEventListener("click", () => {
  state.playing = !state.playing;
  els.play.querySelector("span").textContent = state.playing ? "Ⅱ" : "▶";
  clearInterval(state.timer);
  if (state.playing) state.timer = setInterval(() => { state.month = state.month % 12 + 1; els.slider.value = state.month; renderHeader(); renderMap(); if (state.selected) selectBird(state.selected); }, 900);
});
document.querySelector("#closeCard").addEventListener("click", closeCard);
document.querySelector("#aboutBtn").addEventListener("click", () => els.dialog.showModal());
document.querySelector("#closeAbout").addEventListener("click", () => els.dialog.close());
els.dialog.addEventListener("click", e => { if (e.target === els.dialog) els.dialog.close(); });

render();
