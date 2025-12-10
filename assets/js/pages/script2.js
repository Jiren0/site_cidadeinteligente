(function(){

  // Estado principal da aplicação
  const state = {
    map: null,           // Mapa Leaflet
    userMarker: null,    // Marcador da localização do usuário
    stations: [],        // Delegacias encontradas
    robots: [],          // Robôs simulados
    stationLayer: null,  // Camada dos marcadores das delegacias
    robotLayer: null,    // Camada dos marcadores dos robôs
    userLocation: null   // Coordenadas do usuário
  };

  // -----------------------------
  // 🔵 Inicializa o mapa
  // -----------------------------
  function initMap(){

    // Verifica se o Leaflet carregou
    if(typeof L === 'undefined'){
      document.getElementById('stations').innerHTML = '<div class="meta">Erro: Leaflet não carregou.</div>';
      return;
    }

    // Cria o mapa e define uma posição inicial (Brasília)
    state.map = L.map('map').setView([-15.7801,-47.9292], 13);

    // Carrega o mapa base do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      maxZoom: 19, 
      attribution: '© OpenStreetMap' 
    }).addTo(state.map);

    // Cria camadas separadas para delegacias e robôs
    state.stationLayer = L.layerGroup().addTo(state.map);
    state.robotLayer   = L.layerGroup().addTo(state.map);

    // Tenta obter a localização real do usuário
    if(navigator.geolocation){

      navigator.geolocation.getCurrentPosition(pos => {

        // Salva a posição do usuário
        state.userLocation = [pos.coords.latitude, pos.coords.longitude];

        // Move o mapa até ele
        state.map.setView(state.userLocation, 14);

        // Cria marcador no local do usuário
        state.userMarker = L.circleMarker(state.userLocation, {
          radius:8, fill:true, color:'#0b5ed7', fillOpacity:0.9
        }).addTo(state.map).bindPopup('Você está aqui');

        // Busca delegacias
        searchStations();

        // Carrega robôs de exemplo
        loadSampleRobots();

      }, err => {

        // Caso o usuário negue localização
        state.userLocation = [-15.7801,-47.9292];
        state.map.setView(state.userLocation, 12);
        searchStations();
        loadSampleRobots();
      });
    }
  }

  // -----------------------------
  // 🔵 Busca delegacias usando Overpass / OpenStreetMap
  // -----------------------------
  async function searchStations(){

    const radius = Number(radiusInput.value) || 3000;
    const el = document.getElementById('stations');

    el.innerHTML = '<div class="meta">Buscando...</div>';

    if(!state.userLocation){
      el.innerHTML = '<div class="meta">Localização desconhecida.</div>';
      return;
    }

    const [lat, lon] = state.userLocation;

    // Query Overpass em formato OSMQL
    const query = `
      [out:json][timeout:25];
      (
        node(around:${radius},${lat},${lon})[amenity=police];
        way(around:${radius},${lat},${lon})[amenity=police];
        relation(around:${radius},${lat},${lon})[amenity=police];
      );
      out center 50;
    `;

    try{

      // Envia a busca ao Overpass
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      const data = await response.json();

      // Formata as delegacias
      state.stations = data.elements.map((el, idx) => {
        const c = el.type === "node" 
          ? { lat: el.lat, lon: el.lon }
          : (el.center || {});
        return { 
          name:`Delegacia ${idx+1}`, 
          lat:c.lat, 
          lon:c.lon 
        };
      });

      renderStations();

    }catch(e){

      // Mostra erro se falhar
      el.innerHTML = '<div class="meta">Erro ao buscar delegacias.</div>';
    }
  }

  // -----------------------------
  // 🔵 Renderiza as delegacias no painel e no mapa
  // -----------------------------
  function renderStations(){
    const el = document.getElementById('stations');
    el.innerHTML = '';

    state.stationLayer.clearLayers();

    if(state.stations.length === 0){
      el.innerHTML = '<div class="meta">Nenhuma delegacia encontrada.</div>';
      return;
    }

    // Para cada delegacia encontrada
    state.stations.forEach(s => {

      // Cria item no painel
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <strong>${s.name}</strong>
        <div class="meta">${s.lat.toFixed(5)}, ${s.lon.toFixed(5)}</div>
      `;

      // Clicar no item centraliza no mapa
      div.addEventListener('click',()=> state.map.setView([s.lat,s.lon],17));

      el.appendChild(div);

      // Adiciona marcador no mapa
      L.marker([s.lat,s.lon])
       .addTo(state.stationLayer)
       .bindPopup(`<strong>${s.name}</strong>`);
    });
  }

  // -----------------------------
  // 🔵 Cria robôs falsos para demonstração
  // -----------------------------
  function loadSampleRobots(){

    // Se já houver robôs, apenas renderiza
    if(state.robots.length > 0){ 
      renderRobots(); 
      return; 
    }

    const base = state.userLocation || [-15.7801,-47.9292];

    // 3 robôs gerados aleatoriamente
    for(let i=0;i<3;i++){
      const lat = base[0] + (Math.random()-0.5)*0.02;
      const lon = base[1] + (Math.random()-0.5)*0.02;

      state.robots.push({
        id:'robot-'+Date.now()+'-'+i,
        name:'Robo '+(i+1),
        lat, lon,
        battery: Math.floor(40 + Math.random()*50),
        status:'patrolling'
      });
    }

    renderRobots();
  }

  // -----------------------------
  // 🔵 Renderiza lista de robôs + ícones no mapa
  // -----------------------------
  function renderRobots(){

    const el = document.getElementById('robots');
    el.innerHTML = '';

    state.robotLayer.clearLayers();

    state.robots.forEach(r => {

      // Cria item visual
      const div = document.createElement('div');
      div.className = 'item';

      const battClass =
        r.battery > 50 ? 'good' :
        r.battery > 20 ? 'warn' : 'low';

      div.innerHTML = `
        <div style="display:flex;justify-content:space-between">
          <div>
            <strong>${r.name}</strong>
            <div class="meta">${r.status}</div>
          </div>
          <div class="battery ${battClass}">${r.battery}%</div>
        </div>

        <div class="controls">
          <button class="btn small" data-action="center" data-id="${r.id}">Ir</button>
          <button class="btn small" data-action="charge" data-id="${r.id}" style="background:#ffc107">Carregar</button>
          <button class="btn small" data-action="remove" data-id="${r.id}" style="background:#dc3545">Remover</button>
        </div>
      `;

      el.appendChild(div);

      // Ícone do robô no mapa
      const icon = L.divIcon({
        html:`<div class="marker-robot">🤖</div>`,
        iconSize:[30,30],
        iconAnchor:[15,30]
      });

      L.marker([r.lat,r.lon],{icon})
        .addTo(state.robotLayer)
        .bindPopup(`<strong>${r.name}</strong><br>Bateria: ${r.battery}%`);
    });

    // Eventos dos botões
    document.querySelectorAll("button[data-action]").forEach(btn =>{
      btn.onclick = ()=>{
        const id = btn.dataset.id;
        const ac = btn.dataset.action;

        if(ac === "center") centerOnRobot(id);
        if(ac === "charge") chargeRobot(id);
        if(ac === "remove") removeRobot(id);
      };
    });
  }

  // -----------------------------
  // 🔵 Centraliza no robô selecionado
  // -----------------------------
  function centerOnRobot(id){
    const r = state.robots.find(x => x.id === id);
    if(r) state.map.setView([r.lat,r.lon],17);
  }

  // -----------------------------
  // 🔵 Simula envio do robô para carregar
  // -----------------------------
  function chargeRobot(id){

    const r = state.robots.find(x => x.id === id);
    if(!r) return;

    r.status = "carregando";
    r.battery = Math.min(100, r.battery + 20);
    renderRobots();

    // Após 3 segundos volta a patrulhar
    setTimeout(()=>{
      r.status = "patrulhando";
      renderRobots();
    }, 3000);
  }

  // -----------------------------
  // 🔵 Remove robô da lista
  // -----------------------------
  function removeRobot(id){
    state.robots = state.robots.filter(x => x.id !== id);
    renderRobots();
  }

  // -----------------------------
// 🔵 Adiciona um único robô novo
// -----------------------------
function addSingleRobot(){
  const base = state.userLocation || [-15.7801,-47.9292];

  const lat = base[0] + (Math.random()-0.5)*0.02;
  const lon = base[1] + (Math.random()-0.5)*0.02;

  const n = state.robots.length + 1;

  state.robots.push({
    id:'robot-'+Date.now(),
    name:'Robo '+n,
    lat, lon,
    battery: Math.floor(60 + Math.random()*40),
    status:'patrulhando'
  });

  renderRobots();
}

// -----------------------------
// 🔵 Botões da interface
// -----------------------------
document.getElementById('refreshBtn').onclick = searchStations;
document.getElementById('addRobotBtn').onclick = addSingleRobot;

document.getElementById('simulateBtn').onclick = ()=>{
  state.robots.forEach(r=>{
    r.battery = Math.max(0, r.battery - (10 + Math.random()*20));
  });
  renderRobots();
};

  // Inicializa tudo
  initMap();

})();
