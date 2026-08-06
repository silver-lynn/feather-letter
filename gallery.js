const galleryState = { group: "all", query: "" };
const galleryEls = {
  grid: document.querySelector("#galleryGrid"),
  filters: document.querySelector("#groupFilters"),
  search: document.querySelector("#speciesSearch"),
  dialog: document.querySelector("#photoDialog"),
  dialogImage: document.querySelector("#dialogImage"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogCredit: document.querySelector("#dialogCredit"),
  dialogSource: document.querySelector("#dialogSource")
};

const fallbackCredits = {
  "oriental-stork": { source: "https://commons.wikimedia.org/wiki/File:Oriental_Stork_3_marugame_kagawa.jpg", creator: "Spaceaero2", license: "CC BY-SA 3.0" },
  "spoon-billed-sandpiper": { source: "https://commons.wikimedia.org/wiki/File:Spoon-billed_sandpiper.jpg", creator: "tareq's Photography", license: "CC BY-SA 4.0" },
  "beijing-swift": { source: "https://commons.wikimedia.org/wiki/File:Common_Swift_(Apus_apus)_(49771152216).jpg", creator: "Imran Shah", license: "CC BY-SA 2.0" },
  "bar-headed-goose": { source: "https://commons.wikimedia.org/wiki/File:Bar-headed_geese_(Anser_indicus).jpg", creator: "Charles J. Sharp", license: "CC BY-SA 4.0" }
};

let photoCredits = {};
const commonsCache = new Map();
const galleryObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    galleryObserver.unobserve(card);
    loadCommonsPhotos(card, BIRDS.find(bird => bird.id === card.dataset.species));
  });
}, { rootMargin: "360px 0px" });

function textNode(tag, text, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text || "";
  return node;
}

function cleanCredit(value) {
  const box = document.createElement("div");
  box.innerHTML = value || "";
  return box.textContent.replace(/\s+/g, " ").trim();
}

function searchUrl(bird) {
  return `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(bird.latin)}&title=Special:MediaSearch&type=image`;
}

function getCredit(bird) {
  return photoCredits[bird.id] || fallbackCredits[bird.id] || {};
}

function creditLine(item) {
  const creator = cleanCredit(item.creator || item.artist || "Wikimedia Commons 摄影者");
  const license = item.license || item.licenseShortName || "许可见原始页面";
  return `${creator} · ${license}`;
}

function openPhoto(item, bird) {
  galleryEls.dialogImage.src = item.url;
  galleryEls.dialogImage.alt = `${bird.name} · ${item.title || "摄影作品"}`;
  galleryEls.dialogTitle.textContent = item.title || `${bird.name}摄影作品`;
  galleryEls.dialogCredit.textContent = creditLine(item);
  galleryEls.dialogSource.href = item.source || searchUrl(bird);
  galleryEls.dialog.showModal();
}

function photoButton(item, bird, featured = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `photo-tile${featured ? " featured" : ""}`;
  button.addEventListener("click", () => openPhoto(item, bird));
  const image = document.createElement("img");
  image.src = item.url;
  image.alt = `${bird.name} · ${item.title || "摄影作品"}`;
  image.loading = "lazy";
  button.append(image, textNode("span", item.title || "打开图片信息", "photo-tile-label"));
  return button;
}

function createCard(bird) {
  const card = document.createElement("article");
  card.className = "species-gallery-card";
  card.dataset.species = bird.id;

  const credit = getCredit(bird);
  const cover = {
    url: `assets/references/${bird.id}.jpg`,
    title: credit.file || `${bird.name} · 项目参考照片`,
    creator: credit.creator,
    license: credit.license,
    source: credit.source || searchUrl(bird)
  };

  const head = document.createElement("div");
  head.className = "species-gallery-head";
  head.append(
    textNode("span", BIRD_GROUPS[bird.group].label, "species-group"),
    textNode("span", bird.status, "species-status")
  );

  const figure = document.createElement("figure");
  figure.className = "cover-figure";
  figure.append(photoButton(cover, bird, true));
  const caption = document.createElement("figcaption");
  caption.append(
    textNode("h2", bird.name),
    textNode("em", bird.latin),
    textNode("small", `首图：${creditLine(cover)}`)
  );
  figure.append(caption);

  const content = document.createElement("div");
  content.className = "species-gallery-content";
  content.append(
    textNode("p", bird.flyway, "flyway"),
    textNode("p", bird.points[2]?.[4] || bird.points[0]?.[4] || "迁徙路线参考", "species-note")
  );

  const strip = document.createElement("div");
  strip.className = "photo-strip";
  strip.append(textNode("p", "正在寻找更多授权摄影图…", "photo-loading"));
  content.append(strip);

  const sourceLink = document.createElement("a");
  sourceLink.className = "commons-link";
  sourceLink.href = searchUrl(bird);
  sourceLink.target = "_blank";
  sourceLink.rel = "noreferrer";
  sourceLink.textContent = "打开完整摄影集 ↗";
  content.append(sourceLink);

  card.append(head, figure, content);
  card._photoStrip = strip;
  return card;
}

async function loadCommonsPhotos(card, bird) {
  if (commonsCache.has(bird.id)) {
    renderCommonsStrip(card._photoStrip, bird, commonsCache.get(bird.id));
    return;
  }
  const query = encodeURIComponent(`filetype:bitmap "${bird.latin}"`);
  const endpoint = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=900&format=json&origin=*`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error("Commons request failed");
    const payload = await response.json();
    const pages = Object.values(payload.query?.pages || {});
    const photos = pages.map(page => {
      const info = page.imageinfo?.[0] || {};
      const meta = info.extmetadata || {};
      return {
        url: info.thumburl || info.url,
        source: info.descriptionurl,
        title: page.title?.replace(/^File:/, "") || "Wikimedia Commons摄影作品",
        creator: meta.Artist?.value,
        license: meta.LicenseShortName?.value,
        mime: info.mime
      };
    }).filter(photo => photo.url?.startsWith("https://") && photo.mime?.startsWith("image/"));
    commonsCache.set(bird.id, photos);
    renderCommonsStrip(card._photoStrip, bird, photos);
  } catch (error) {
    card._photoStrip.replaceChildren(textNode("p", "更多图片暂时无法加载，请打开完整摄影集浏览。", "photo-empty"));
  }
}

function renderCommonsStrip(strip, bird, photos) {
  strip.replaceChildren();
  photos.slice(0, 3).forEach(photo => strip.append(photoButton(photo, bird)));
  if (!photos.length) strip.append(textNode("p", "暂未找到可直接展示的授权图片，请打开完整摄影集浏览。", "photo-empty"));
}

function visibleBirds() {
  const query = galleryState.query.trim().toLowerCase();
  return BIRDS.filter(bird => {
    const matchesGroup = galleryState.group === "all" || bird.group === galleryState.group;
    const matchesQuery = !query || `${bird.name} ${bird.latin}`.toLowerCase().includes(query);
    return matchesGroup && matchesQuery;
  });
}

function renderFilters() {
  const items = [["all", "全部 20 种"], ...Object.entries(BIRD_GROUPS).map(([key, value]) => [key, value.label])];
  galleryEls.filters.replaceChildren();
  items.forEach(([key, label]) => {
    const button = textNode("button", label, `group-filter${galleryState.group === key ? " active" : ""}`);
    button.type = "button";
    button.addEventListener("click", () => { galleryState.group = key; render(); });
    galleryEls.filters.append(button);
  });
}

function render() {
  galleryObserver.disconnect();
  renderFilters();
  galleryEls.grid.replaceChildren();
  const birds = visibleBirds();
  if (!birds.length) {
    galleryEls.grid.append(textNode("p", "没有找到对应的物种。", "no-results"));
    return;
  }
  const cards = birds.map(createCard);
  cards.forEach(card => galleryEls.grid.append(card));
  cards.forEach(card => galleryObserver.observe(card));
}

galleryEls.search.addEventListener("input", event => { galleryState.query = event.target.value; render(); });
galleryEls.dialog.addEventListener("click", event => { if (event.target === galleryEls.dialog) galleryEls.dialog.close(); });
document.querySelector("#closePhotoDialog").addEventListener("click", () => galleryEls.dialog.close());

fetch("assets/data/photo-credits.json")
  .then(response => response.json())
  .then(data => { photoCredits = data; render(); })
  .catch(() => render());
