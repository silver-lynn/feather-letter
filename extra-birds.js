const EXTRA_ICON_PATHS={
  crane:'<path d="M34 18C24 9 13 5 1 4c8 8 15 15 25 20L11 33c12-1 22-3 30-8 7 3 13 3 19 0l-5-4c-7-5-14-5-21-3Z" fill="currentColor"/><path d="M56 21c6-8 11-10 16-8l7 4-8 2c-4 0-8 2-11 6M43 25l8 12m-3-13 11 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  spoonbill:'<path d="M35 19C25 10 14 6 2 5c8 8 15 14 25 19l-15 8c12-1 22-3 29-8 7 3 13 3 19 0l-6-4c-6-4-13-4-19-1Z" fill="currentColor"/><path d="M57 20c6-5 11-7 16-5l7 4-5 4c-6 0-12 0-18 2M43 25l8 11m-3-12 10 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  swan:'<path d="M34 19C23 10 12 6 1 5c8 8 15 14 25 19l-15 8c12-1 22-3 30-8 8 4 16 4 22-1l-7-4c-7-4-15-3-22 0Z" fill="currentColor"/><path d="M59 22c5-13 10-17 16-13l4 5-7 1c-5 1-8 5-10 10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  goose:'<path d="M34 18C24 9 13 5 1 4c8 8 15 15 25 20L11 33c12-1 22-3 30-8 7 3 13 3 19 0l-5-4c-7-5-14-5-21-3Z" fill="currentColor"/><path d="M56 21c6-8 11-10 16-8l7 4-8 2c-4 0-8 2-11 6" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
  shorebird:'<path d="M35 19C26 10 16 6 4 4c7 8 13 15 23 20l-15 8c11 0 20-2 28-7 7 2 13 1 18-2l-5-4c-6-4-12-4-18 0Z" fill="currentColor"/><path d="M56 19 77 20M41 26l4 10m1-11 6 9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  godwit:'<path d="M35 19C26 10 16 6 4 4c7 8 13 15 23 20l-15 8c11 0 20-2 28-7 7 2 13 1 18-2l-5-4c-6-4-12-4-18 0Z" fill="currentColor"/><path d="M56 19 80 17M41 26l4 10m1-11 6 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  curlew:'<path d="M35 19C26 10 16 6 4 4c7 8 13 15 23 20l-15 8c11 0 20-2 28-7 7 2 13 1 18-2l-5-4c-6-4-12-4-18 0Z" fill="currentColor"/><path d="M56 19c10 0 18 3 23 10M41 26l4 10m1-11 6 9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  passerine:'<path d="M37 18C28 10 17 6 4 5c8 7 15 13 25 18l-14 8c11-1 20-3 27-8 6 3 12 3 18 0l-5-4c-6-4-12-4-18-1Z" fill="currentColor"/><path d="m58 20 12-2 8 3-8 2-12 1" fill="none" stroke="currentColor" stroke-width="2"/>',
  raptor:'<path d="M1 2c17 5 29 11 39 22C50 13 62 7 79 2 69 14 59 22 48 26l10 11-18-8-18 8 10-12C20 21 10 13 1 2Z" fill="currentColor"/><path d="m35 28 5 10 5-10" fill="none" stroke="currentColor" stroke-width="2"/>',
  falcon:'<path d="M2 3c17 5 29 11 38 21C51 13 64 7 79 4 68 13 59 20 49 25l7 11-16-7-15 7 7-11C20 21 10 14 2 3Z" fill="currentColor"/>'
};

const EXTRA_MAP_BIRDS={
  "red-crowned-crane":{name:"丹顶鹤",latin:"Grus japonensis",photo:"assets/references/red-crowned-crane.jpg",color:"#467982",iconType:"crane",intro:"大型鹤类，成鸟头顶裸露皮肤呈红色。中国东部迁徙种群主要在东北繁殖、黄海沿岸越冬。"},
  "hooded-crane":{name:"白头鹤",latin:"Grus monacha",photo:"assets/references/hooded-crane.jpg",color:"#657d8a",iconType:"crane",intro:"深灰色身体配白色头颈的小型鹤类，在东北亚繁殖，部分种群于长江中下游湿地越冬。"},
  "common-crane":{name:"灰鹤",latin:"Grus grus",photo:"assets/references/common-crane.jpg",color:"#587789",iconType:"crane",intro:"分布范围广的大型鹤类，中国境内可见迁徙和越冬种群，偏爱开阔湿地、农田与草原。"},
  "black-faced-spoonbill":{name:"黑脸琵鹭",latin:"Platalea minor",photo:"assets/references/black-faced-spoonbill.jpg",color:"#397782",iconType:"spoonbill",intro:"黑色脸部与长而扁平的琵琶形嘴十分醒目，繁殖于黄海北部，冬季南迁至华南及东南亚海岸。"},
  "eurasian-spoonbill":{name:"白琵鹭",latin:"Platalea leucorodia",photo:"assets/references/eurasian-spoonbill.jpg",color:"#5a8290",iconType:"spoonbill",intro:"通体白色的大型涉禽，以左右摆动的长嘴在浅水中觅食，中国多地可见迁徙或越冬个体。"},
  "tundra-swan":{name:"小天鹅",latin:"Cygnus columbianus",photo:"assets/references/tundra-swan.jpg",color:"#668694",iconType:"swan",intro:"体型略小于大天鹅，繁殖于北极苔原，秋冬成群抵达长江湖群及中国东部湿地。"},
  "swan-goose":{name:"鸿雁",latin:"Anser cygnoides",photo:"assets/references/swan-goose.jpg",color:"#4e7880",iconType:"goose",intro:"长颈、嘴基具有浅色边缘的雁类，在蒙古高原和东北繁殖，长江中下游是重要越冬区域。"},
  "bean-goose":{name:"豆雁",latin:"Anser fabalis",photo:"assets/references/bean-goose.jpg",color:"#6a7f8d",iconType:"goose",intro:"嘴上常见橙黄色斑带的深色雁类，从西伯利亚繁殖地南迁，在中国东部湿地越冬。"},
  "great-knot":{name:"大滨鹬",latin:"Calidris tenuirostris",photo:"assets/references/great-knot.jpg",color:"#4f7d91",iconType:"shorebird",intro:"中大型滨鸟，依赖黄海潮间带完成长距离迁徙，繁殖于西伯利亚，非繁殖期远至澳大利亚。"},
  "red-necked-stint":{name:"红颈滨鹬",latin:"Calidris ruficollis",photo:"assets/references/red-necked-stint.jpg",color:"#668899",iconType:"shorebird",intro:"体型很小的滨鸟，繁殖羽颈部呈红褐色；每年沿东亚海岸往返北极繁殖地和澳大利西亚。"},
  "bar-tailed-godwit":{name:"斑尾塍鹬",latin:"Limosa lapponica",photo:"assets/references/bar-tailed-godwit.jpg",color:"#527c8f",iconType:"godwit",intro:"拥有长而微翘的嘴，是远距离迁徙代表；黄海滩涂为北迁途中补充能量的关键区域。"},
  "far-eastern-curlew":{name:"大杓鹬",latin:"Numenius madagascariensis",photo:"assets/references/far-eastern-curlew.jpg",color:"#477483",iconType:"curlew",intro:"东亚体型最大的滨鸟之一，长而向下弯曲的嘴适合探取滩涂深处的无脊椎动物。"},
  "yellow-browed-warbler":{name:"黄眉柳莺",latin:"Phylloscopus inornatus",photo:"assets/references/yellow-browed-warbler.jpg",color:"#5d8390",iconType:"passerine",intro:"体型轻巧的林栖候鸟，具有醒目的浅色眉纹和翼斑，在中国大部分地区迁徙过境。"},
  "crested-honey-buzzard":{name:"凤头蜂鹰",latin:"Pernis ptilorhynchus",photo:"assets/references/crested-honey-buzzard.jpg",color:"#3f7482",iconType:"raptor",intro:"以蜂类幼虫和蜂巢为重要食物的迁徙猛禽，春夏在东亚繁殖，冬季南迁至东南亚。"},
  "chinese-sparrowhawk":{name:"赤腹鹰",latin:"Accipiter soloensis",photo:"assets/references/chinese-sparrowhawk.jpg",color:"#567b8a",iconType:"raptor",intro:"体型较小、翼形较尖的迁徙猛禽，在中国东部繁殖，秋季大量通过东南沿海前往东南亚。"},
  "amur-falcon":{name:"红脚隼",latin:"Falco amurensis",photo:"assets/references/amur-falcon.jpg",color:"#446f80",iconType:"falcon",intro:"在东北亚繁殖的小型隼类，秋季经印度迁往非洲南部，是跨越大陆与海洋的长距离迁徙者。"}
};
