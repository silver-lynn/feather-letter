const USER_LOCATIONS=[
  {id:"shanghai",name:"上海",lng:121.4737,lat:31.2304},
  {id:"beijing",name:"北京",lng:116.4074,lat:39.9042},
  {id:"harbin",name:"哈尔滨",lng:126.6424,lat:45.7567},
  {id:"qingdao",name:"青岛",lng:120.3826,lat:36.0671},
  {id:"xiamen",name:"厦门",lng:118.0894,lat:24.4798},
  {id:"guangzhou",name:"广州",lng:113.2644,lat:23.1291},
  {id:"wuhan",name:"武汉",lng:114.3054,lat:30.5931},
  {id:"chengdu",name:"成都",lng:104.0665,lat:30.5728},
  {id:"kunming",name:"昆明",lng:102.8329,lat:24.8801},
  {id:"xian",name:"西安",lng:108.9398,lat:34.3416},
  {id:"urumqi",name:"乌鲁木齐",lng:87.6168,lat:43.8256},
  {id:"lhasa",name:"拉萨",lng:91.1172,lat:29.6469}
];

const locationSelect=document.querySelector("#locationSelect");
const storedLocation=localStorage.getItem("feather-letter-location")||"shanghai";

function drawUserLocation(location){
  USER_LOCATION.name=location.name;
  USER_LOCATION.lng=location.lng;
  USER_LOCATION.lat=location.lat;
  const [x,y]=project(location.lng,location.lat);
  const layer=document.querySelector("#userLocationHighlight");
  if(layer){
    layer.innerHTML=`<circle class="user-location-wash" cx="${x}" cy="${y}" r="28"/><circle class="user-location-core" cx="${x}" cy="${y}" r="2.8"/><text class="user-location-label" x="${x+7}" y="${y+2.5}">${location.name}</text>`;
  }
}

locationSelect.innerHTML=USER_LOCATIONS.map(location=>
  `<option value="${location.id}">${location.name}</option>`
).join("");

const initialLocation=USER_LOCATIONS.find(location=>location.id===storedLocation)||USER_LOCATIONS[0];
locationSelect.value=initialLocation.id;
drawUserLocation(initialLocation);

locationSelect.addEventListener("change",event=>{
  const location=USER_LOCATIONS.find(item=>item.id===event.target.value);
  if(!location)return;
  localStorage.setItem("feather-letter-location",location.id);
  drawUserLocation(location);
});
