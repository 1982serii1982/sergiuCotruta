
(function(){
    window['serObj'] = {};

    //localStorage.clear();

    if(!parse('worldInfo')){
        serObj.worldInfo = {};
    }else{
        serObj.worldInfo = parse('worldInfo');
        console.log(serObj.worldInfo);
    }


    

    const OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'opentopomap'
    });

    const WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const openstreetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    });

    const baseMaps = {
        "OpenStreetMap": openstreetmap,
        "Topo Map": OpenTopoMap,
        "Terrain Map": WorldImagery
    };

    let southWest = L.latLng(-90, -180),
        northEast = L.latLng(90, 180),
        bounds = L.latLngBounds(southWest, northEast);


    let map = L.map('map', {
        layers: [openstreetmap],
        attributionControl: false,
        maxZoom: 19,
        minZoom: 2,
        center: bounds.getCenter(),
        zoom: 2,
        zoomControl: false,
        //maxBounds: bounds,
        maxBoundsViscosity: 1.0
    });

    serObj.map = map;

    const layerControl = L.control.layers(baseMaps).addTo(map);

    L.control.attribution({
        position: 'bottomright'
    }).addTo(map);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    L.control.scale({
        position: 'bottomright'
    }).addTo(map);

    //L.DomEvent.disableScrollPropagation($('.info_search')[0]);
    L.DomEvent.disableScrollPropagation($('.info_result')[0]);
    L.DomEvent.disableScrollPropagation($('.info_result')[1]);
   // L.DomEvent.disableClickPropagation($('.info_search')[0]);
    L.DomEvent.disableClickPropagation($('.info_result')[0]);
    L.DomEvent.disableClickPropagation($('.info_result')[1]);

    L.DomEvent.disableScrollPropagation($('.preloader')[0]);
    L.DomEvent.disableClickPropagation($('.preloader')[0]);
    

    

    // L.tileLayer('https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key={apikey}', {
    //     attribution: '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //     apikey: 'beff1c35d6mshf85497309639726p1c67a8jsn75d71af83ba2',
    //     maxZoom: 19
    // }).addTo(map);


    $(document).ready(function () {
    
    });
})();




