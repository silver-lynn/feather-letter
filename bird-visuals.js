const PLUMAGE_COLORS={
  "oriental-stork":"#354248",
  "spoon-billed-sandpiper":"#8a735f",
  "beijing-swift":"#4b4946",
  "bar-headed-goose":"#77766f",
  "red-crowned-crane":"#646f72",
  "hooded-crane":"#555d60",
  "common-crane":"#737b7c",
  "black-faced-spoonbill":"#3f4a4c",
  "eurasian-spoonbill":"#7d8988",
  "tundra-swan":"#7c898b",
  "swan-goose":"#766957",
  "bean-goose":"#6a5d50",
  "great-knot":"#806e60",
  "red-necked-stint":"#8a6a58",
  "bar-tailed-godwit":"#8a634f",
  "far-eastern-curlew":"#69584a",
  "yellow-browed-warbler":"#6d7747",
  "crested-honey-buzzard":"#705c48",
  "chinese-sparrowhawk":"#59666a",
  "amur-falcon":"#45535b"
};

for(const [id,color] of Object.entries(PLUMAGE_COLORS)){
  if(MAP_BIRDS[id]) MAP_BIRDS[id].color=color;
}

renderSpecies=function(){
  $("#mapSpecies").innerHTML=Object.entries(MAP_BIRDS).map(([id,b])=>
    `<button class="${id===state.bird?"active":""}" data-bird="${id}" style="--bird-color:${b.color}">${icon(id)}<span><b>${b.name}</b><small>${b.latin}</small></span></button>`
  ).join("");
  $$('[data-bird]').forEach(x=>x.onclick=()=>{
    state.bird=x.dataset.bird;
    renderSpecies();
    render();
  });
};

flockMarkup=function(cluster,index,birdId){
  const p=project(cluster.lng,cluster.lat);
  const count=Math.max(3,Math.round(3+cluster.strength*6));
  let birds="";
  for(let i=0;i<count;i++){
    const [dx,dy]=seededOffsets(count,i);
    const opacity=(.62+i/count*.38).toFixed(2);
    birds+=`<use href="#flock-${birdId}" x="${dx-7}" y="${dy-3.5}" width="14" height="7" opacity="${opacity}"/>`;
  }
  return `<g class="flock-cluster" transform="translate(${p[0]} ${p[1]})" style="color:${MAP_BIRDS[birdId].color}">${birds}<title>${cluster.records} records in this aggregate cell</title></g>`;
};
