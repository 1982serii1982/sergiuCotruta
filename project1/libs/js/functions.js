

/////////////////---------------  HELPER FUNCTIONS  ---------------///////////////////////

let preloader = function () {
    function preloaderClose() {

    }


    function updatePreloaderMessage(message) {

        let loadingStatusMessage = $('.preloader_message');

        loadingStatusMessage.html(message);

    }

    return {
        preloaderClose: preloaderClose,
        updatePreloaderMessage: updatePreloaderMessage
    }

}();

function stringify(name, data){
    localStorage.setItem(name, JSON.stringify(data));
}

function parse(data){
    try{
        return JSON.parse(localStorage.getItem(data));
    }catch(e){
        return false;
    }
}

function isset(data){
    if (typeof data !== 'undefined') {
        return true;
    }
    return false
}

function ConvertDMSToDD(dms) {
    const re = /([0-9]+)&deg;([0-9]+)&#39;([0-9]+\s*\.*[0-9]*)&#92;&#34;([A-Z]{1})/;
    let found = dms.match(re);
    
    let res = parseInt(found[1], 10) + found[2]/60 + parseInt(found[3], 10)/(60*60);

    
    let dd = (Math.floor(res*100000))/100000;

    if (found[4] == "S" || found[4] == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

/////////////////----------------------------------------------------///////////////////////









function swapLngLat(arr){
    let result = [];

    if(Array.isArray(arr) && arr.length > 0){
        result = arr.map(function(elem){

            if(Array.isArray(elem) && Array.isArray(elem[0])){
                return swapLngLat(elem)
            }

            let tempElem = [];
            tempElem[1] = elem[0];
            tempElem[0] = elem[1];
            return tempElem;
        });
    }
    return result;
        
};

function phpRequest(request = "null", data = {}){


    //data['request'] = request;

    let sendData = {rawData: data};

    return new Promise(function(resolve, reject){

        $.ajax({
            url: `./libs/php/${request}.php`,
            type: 'POST',
            dataType: 'json',
            data: sendData
        })
        .done(function(result) {
            resolve(result);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {

            let rejectObject = {
                errorCode: jqXHR['status'],
                errorMessage: jqXHR['statusText'],
                er: textStatus,
                er2: errorThrown
            }

            reject(rejectObject);
            
        });
    })
}

function populateSelect(){
    
    let countryArray = [];

    for(let key of serObj.geoJson){
        countryArray[key.properties.name] = {
            "iso_a2" : key.properties.iso_a2,
            "iso_a3" : key.properties.iso_a3,
            "iso_n3" : key.properties.iso_n3
        }
    }

    for(let key of (Object.keys(countryArray)).sort()){
        let iso_a2 = countryArray[key]['iso_a2'];
        let iso_a3 = countryArray[key]['iso_a3'];
        let iso_n3 = countryArray[key]['iso_n3'];
        $('.header_select').append("<option value='" + key + "' data-iso-a2='" + iso_a2 + "' data-iso-a3='" + iso_a3 + "' data-iso-n3='" + iso_n3 + "'>" + key + "</option>");
    }
    
};

function addPolygon(geoJson, map, type = 'polyline') {
    let latLngSwapped = swapLngLat(geoJson.geometry.coordinates);

    if(type === 'polyline'){
        let multiPolylineOptions = {color:'red'};

        let multiPolyline = L.polyline(latLngSwapped, multiPolylineOptions);
        multiPolyline.addTo(map);
        //map.fitBounds(multiPolyline.getBounds());
        map.flyToBounds(multiPolyline.getBounds());
        
        return multiPolyline;
    }else{
        let multiPolygonOptions = {color:'red'};

        let multiPolygon = L.polygon(latLngSwapped , multiPolygonOptions);
        multiPolygon.addTo(map);
        //map.fitBounds(multiPolygon.getBounds());
        map.flyToBounds(multiPolygon.getBounds());

        return multiPolygon;
    }


    
    
    
}

function removePolygon(instance){
    instance.remove();
}

function isInsidePolygon(latitude, longitude, polygon){
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        throw new TypeError('Invalid latitude or longitude. Numbers are expected')
    } else if (!polygon || !Array.isArray(polygon)) {
        throw new TypeError('Invalid polygon. Array with locations expected')
    } else if (polygon.length === 0) {
        throw new TypeError('Invalid polygon. Non-empty Array expected')
    }


    
    const x = latitude; const y = longitude

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0]; const yi = polygon[i][1];
        const xj = polygon[j][0]; const yj = polygon[j][1];
    
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                
        if (intersect){
            inside = !inside;
        } 
    }
    
    return inside;   
}

function isInsideCountryPolygon(latitude, longitude, multiPolylineArray, depth) {

    let inside = false;

    if(depth){
        for (let i = 0; i < multiPolylineArray.length; i++) {

            if (isInsidePolygon(latitude, longitude, multiPolylineArray[i][0])) {
    
                return true;
    
            }

        }
    }else{
        for (let i = 0; i < multiPolylineArray.length; i++) {

            if (isInsidePolygon(latitude, longitude, multiPolylineArray[i])) {
    
                return true;
    
            }

        } 
    }

    

    return false;

}

function returnLatLon() {

    return new Promise(function (resolve, reject) {

        function success(position) {

            let latLng = [];

            latLng[0] = position.coords.latitude;
            latLng[1] = position.coords.longitude;

            resolve(latLng);

        }

        function failure(err) {

            reject(err);
        
        }

        navigator.geolocation.getCurrentPosition(success, failure);

    }); 

}

function latLngToCountryData(lat, lng, objToSearch){

    for(let key of objToSearch){
        let depth;

        if(key.geometry.type === "MultiPolygon"){
            depth = true;
        }else if(key.geometry.type === "Polygon"){
            depth = false;
        }

        
        if(isInsideCountryPolygon(lat, lng, swapLngLat(key.geometry.coordinates), depth)){
            return {
                countryProperties: key.properties,
                countryGeometry: key.geometry,
                errorCode: 0
            }
        }

        
    }

    return {
        errorMessage: `Latitude: ${lat} and Longitude: ${lng} of location is outside of defined country boredrs`,
        errorCode: 1
    }
}



function markerCGCreator(setObj){
    return L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
            let n = cluster.getChildCount();
            let html = `<div>${n}</div>`;
            if(n<setObj.lowLimit){
                return L.divIcon({ html: html, className: setObj.small, iconSize: L.point(40, 40)});
            }else if(n>=setObj.lowLimit && n<setObj.highLimit){
                return L.divIcon({ html: html, className: setObj.medium, iconSize: L.point(40, 40)});
            }else{
                return L.divIcon({ html: html, className: setObj.normal, iconSize: L.point(40, 40)});
            } 
        },
        spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: false
    });
}

function populateCountryInfo(obj){
    $('.info_result_content_detail').remove();
    for(let key in obj){
        $('.countryInfo').append(`<div class="info_result_content_detail">${obj[key]}</div>`)
    }
}

function getWeatherStationData(weatherResult, countryData){
    let weatherObservationObj = {};
    weatherObservationObj['timestamp'] = moment().unix();
    weatherObservationObj['stations'] = [];
    for(let item of weatherResult.data.content.weatherObservations){
        if(isInsideCountryPolygon(item.lat, item.lng, swapLngLat(countryData.countryGeometry.coordinates), (countryData.countryGeometry.type === "MultiPolygon") ? true : false)){
            let obj = {};
            for(let key in item){
                if(key === 'lat' || key === 'lng'){
                    if(item[key] < 0){
                        let res = Math.ceil(item[key]*10000);
                        obj[key] = res/10000;
                        continue;
                    }
                    let res = Math.floor(item[key]*10000);
                    obj[key] = res/10000;
                    continue;
                }
                obj[key] = item[key];
            }
            weatherObservationObj['stations'].push(obj);
        }
    }

    return weatherObservationObj;
}

function weatherTabCreator(classToAppend, dataObj){
    let currentTime = dataObj['list'][0]['dt'];
    let intD = parseInt(moment.unix(currentTime).format('D'));
    let intM = parseInt(moment.unix(currentTime).format('M'));
    let intYY = parseInt(moment.unix(currentTime).format('YY'));
    
    const dataResult = {};
    dataObj['list'].forEach(function(item, index){
        let dt = moment.unix(item['dt']);

        if(intD >= 1 && intD <= 31 && intM !== 2 && intM !== 4 && intM !== 6 && intM !== 9 && intM !== 11){

            if((parseInt(dt.format('D')) === (((intD + 1) % 32) === 0 ? 1 : ((intD + 1) % 32))) && parseInt(dt.format('H')) === 12){
                dataResult['tomorrowDate'] = dt.format('ddd DD/MMM/YY');
                dataResult['tomorrowIcon'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['tomorrowTemp'] = Math.round(item['main']['temp']);
            }

            if((parseInt(dt.format('D')) === (((intD + 2) % 32) === 0 ? 1 : (((intD + 2) % 32) === 1 ? 2 : ((intD + 2) % 32)))) && parseInt(dt.format('H')) === 12){
                dataResult['afterTomorrowDate'] = dt.format('ddd DD/MMM/YY');
                dataResult['afterTomorrowIcon'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['afterTomorrowTemp'] = Math.round(item['main']['temp']);
            }

        }else if(intD >= 1 &&
            intD <= 30 &&
            intM !== 2 &&
            intM !== 1 &&
            intM !== 3 &&
            intM !== 5 &&
            intM !== 7 &&
            intM !== 8 &&
            intM !== 10 &&
            intM !== 12){
            
                if((parseInt(dt.format('D')) === (((intD + 1) % 31) === 0 ? 1 : ((intD + 1) % 31))) && parseInt(dt.format('H')) === 12){
                    dataResult['tomorrowDate'] = dt.format('ddd DD/MMM/YY');
                    dataResult['tomorrowIcon'] = (item['weather'][0]['main']).toLowerCase();
                    dataResult['tomorrowTemp'] = Math.round(item['main']['temp']);
                }
    
                if((parseInt(dt.format('D')) === (((intD + 2) % 31) === 0 ? 1 : (((intD + 2) % 31) === 1 ? 2 : ((intD + 2) % 31)))) && parseInt(dt.format('H')) === 12){
                    dataResult['afterTomorrowDate'] = dt.format('ddd DD/MMM/YY');
                    dataResult['afterTomorrowIcon'] = (item['weather'][0]['main']).toLowerCase();
                    dataResult['afterTomorrowTemp'] = Math.round(item['main']['temp']);
                }
            
        }else if(intD >= 1 && intD <= 28 && intM === 2 && (intYY) % 4 !== 0){

            if((parseInt(dt.format('D')) === (((intD + 1) % 29) === 0 ? 1 : ((intD + 1) % 29))) && parseInt(dt.format('H')) === 12){
                dataResult['tomorrowDate'] = dt.format('ddd DD/MMM/YY');
                dataResult['tomorrowIcon'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['tomorrowTemp'] = Math.round(item['main']['temp']);
            }

            if((parseInt(dt.format('D')) === (((intD + 2) % 29) === 0 ? 1 : (((intD + 2) % 29) === 1 ? 2 : ((intD + 2) % 29)))) && parseInt(dt.format('H')) === 12){
                dataResult['afterTomorrowDate'] = dt.format('ddd DD/MMM/YY');
                dataResult['afterTomorrowIcon'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['afterTomorrowTemp'] = Math.round(item['main']['temp']);
            }

        }else if(intD >= 1 && intD <= 29 && intM === 2 && (intYY) % 4 === 0){

            if((parseInt(dt.format('D')) === (((intD + 1) % 30) === 0 ? 1 : ((intD + 1) % 30))) && parseInt(dt.format('H')) === 12){
                dataResult['tomorrowDate'] = moment.unix(item['dt']).format('ddd DD/MMM/YY');
                dataResult['tomorrowIcon'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['tomorrowTemp'] = Math.round(item['main']['temp']);
            }

            if((parseInt(dt.format('D')) === (((intD + 2) % 30) === 0 ? 1 : (((intD + 2) % 30) === 1 ? 2 : ((intD + 2) % 30)))) && parseInt(dt.format('H')) === 12){
                dataResult['afterTomorrowDate'] = dt.format('ddd DD/MMM/YY');
                dataResult['afterTomorrowIcon'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['afterTomorrowTemp'] = Math.round(item['main']['temp']);
            }

        }

        switch(index){
            case 0:
                dataResult['currentClouds'] = item['weather'][0]['description'];
                dataResult['currentTemp'] = Math.round(item['main']['temp']);
                dataResult['currentPressure'] = item['main']['pressure'];
                dataResult['currentHumidity'] = item['main']['humidity'];
                dataResult['currentIcon'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['currentDate'] = moment.unix(item['dt']).format('ddd DD/MMM/YY');
                break;

            case 1:
                dataResult['currentTime1'] = moment.unix(item['dt']).format('HH:mm');
                dataResult['currentIcon1'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['currentTemp1'] = Math.round(item['main']['temp']);
                break;
            
            case 2:
                dataResult['currentTime2'] = moment.unix(item['dt']).format('HH:mm');
                dataResult['currentIcon2'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['currentTemp2'] = Math.round(item['main']['temp']);
                break;
            
            case 3:
                dataResult['currentTime3'] = moment.unix(item['dt']).format('HH:mm');
                dataResult['currentIcon3'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['currentTemp3'] = Math.round(item['main']['temp']);
                break;

            case 4:
                dataResult['currentTime4'] = moment.unix(item['dt']).format('HH:mm');
                dataResult['currentIcon4'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['currentTemp4'] = Math.round(item['main']['temp']);
                break;

            case 5:
                dataResult['currentTime5'] = moment.unix(item['dt']).format('HH:mm');
                dataResult['currentIcon5'] = (item['weather'][0]['main']).toLowerCase();
                dataResult['currentTemp5'] = Math.round(item['main']['temp']);
                break;

            default:
                //throw new Error('There is a error');
            
        }
    });

    let template = `
    <div class="weather_tab">
    <div class="weather_top">
        <p class="weather_top_city">${dataObj['city']['name']}</p>
        <p class="weather_top_clouds">${dataResult['currentClouds']}</p>
        <p class="weather_top_temp">${dataResult['currentTemp']}&#8451;</p>
        <p class="weather_top_data"><span>Pressure: ${dataResult['currentPressure']}</span>&nbsp;  |&nbsp;  <span>Humidity: ${dataResult['currentHumidity']}%</span></p>
    </div>
    <div class="weather_middle">
        <div class="weather_middle_card">
            <p class="weather_middle_day">Now</p>
            <img class="weather_middle_img" src="./libs/img/weather/${dataResult['currentIcon']}.png" alt="${dataResult['currentIcon']}">
            <p class="weather_middle_temp">${dataResult['currentTemp']}&#8451;</p>
        </div>
        <div class="weather_middle_card">
            <p class="weather_middle_day">${dataResult['currentTime1']}</p>
            <img class="weather_middle_img" src="./libs/img/weather/${dataResult['currentIcon1']}.png" alt="${dataResult['currentIcon1']}">
            <p class="weather_middle_temp">${dataResult['currentTemp1']}&#8451;</p>
        </div>
        <div class="weather_middle_card">
            <p class="weather_middle_day">${dataResult['currentTime2']}</p>
            <img class="weather_middle_img" src="./libs/img/weather/${dataResult['currentIcon2']}.png" alt="${dataResult['currentIcon2']}">
            <p class="weather_middle_temp">${dataResult['currentTemp2']}&#8451;</p>
        </div>
        <div class="weather_middle_card">
            <p class="weather_middle_day">${dataResult['currentTime3']}</p>
            <img class="weather_middle_img" src="./libs/img/weather/${dataResult['currentIcon3']}.png" alt="${dataResult['currentIcon3']}">
            <p class="weather_middle_temp">${dataResult['currentTemp3']}&#8451;</p>
        </div>
        <div class="weather_middle_card">
            <p class="weather_middle_day">${dataResult['currentTime4']}</p>
            <img class="weather_middle_img" src="./libs/img/weather/${dataResult['currentIcon4']}.png" alt="${dataResult['currentIcon4']}">
            <p class="weather_middle_temp">${dataResult['currentTemp4']}&#8451;</p>
        </div>
        <div class="weather_middle_card">
            <p class="weather_middle_day">${dataResult['currentTime5']}</p>
            <img class="weather_middle_img" src="./libs/img/weather/${dataResult['currentIcon5']}.png" alt="${dataResult['currentIcon5']}">
            <p class="weather_middle_temp">${dataResult['currentTemp5']}&#8451;</p>
        </div>
    </div>
    <div class="weather_bottom">
        <div class="weather_bottom_line">
            <p class="weather_bottom_day">${dataResult['currentDate']}</p>
            <img class="weather_bottom_img" src="./libs/img/weather/${dataResult['currentIcon']}.png" alt="${dataResult['currentIcon']}">
            <p class="weather_bottom_temp">${dataResult['currentTemp']}&#8451;</p>
        </div>
        <div class="weather_bottom_line">
            <p class="weather_bottom_day">${dataResult['tomorrowDate']}</p>
            <img class="weather_bottom_img" src="./libs/img/weather/${dataResult['tomorrowIcon']}.png" alt="${dataResult['tomorrowIcon']}">
            <p class="weather_bottom_temp">${dataResult['tomorrowTemp']}&#8451;</p>
        </div>
        <div class="weather_bottom_line">
            <p class="weather_bottom_day">${dataResult['afterTomorrowDate']}</p>
            <img class="weather_bottom_img" src="./libs/img/weather/${dataResult['afterTomorrowIcon']}.png" alt="${dataResult['afterTomorrowIcon']}">
            <p class="weather_bottom_temp">${dataResult['afterTomorrowTemp']}&#8451;</p>
        </div>
    </div>
</div>
    `;
    $('.weather_tab').remove();
    $(`.${classToAppend}`).append(template);
}

async function populateWeather(pointLat, pointLng){
    $('.weather_loader_wrapper').css('display', 'flex');
    $('.lds-default').css('display', 'block');
    $('.weather_loader_error').css('display', 'none');
    let res = await phpRequest('openWeather', {lat: pointLat, lng: pointLng});
    if(isset(res.data.content['list'])){
        weatherTabCreator('weather', res.data.content);
        $('.weather_loader_wrapper').addClass('active');
        setTimeout(function(){
            $('.weather_loader_wrapper').css('display', 'none');
        }, 1000);
    }else{
        $('.lds-default').css('display', 'none');
        $('.weather_loader_error').css('display', 'block');
    }
}

function weatherMarkerSetting(weatherResult, countryData, weatherCGHandler, icon){
    let weatherMarkerArray = [];
    for(let key of getWeatherStationData(weatherResult, countryData)['stations']){
        let homeCountryWeatherMarker = L.marker([key.lat, key.lng], {icon: icon.blueIcon});
        weatherMarkerArray.push(homeCountryWeatherMarker);

        homeCountryWeatherMarker.on('click', async function(){
            weatherMarkerArray.forEach(function(v, i){
                v.setIcon(icon.blueIcon);
            });
            this.setIcon(icon.currentIcon);
            $('.weather_tab').remove();
            $('.weather_loader_wrapper').css('display', 'flex');
            $('.lds-default').css('display', 'block');
            $('.weather_loader_error').css('display', 'none');
            let res = await phpRequest('openWeather', {lat: key.lat, lng:key.lng});
            
            
            if(isset(res.data.content['list'])){
                weatherTabCreator('weather', res.data.content);
                $('.weather_loader_wrapper').addClass('active');
                setTimeout(function(){
                    $('.weather_loader_wrapper').css('display', 'none');
                }, 1000);
            }else{
                $('.lds-default').css('display', 'none');
                $('.weather_loader_error').css('display', 'block');
            }
        });
        homeCountryWeatherMarker.bindPopup('Selected marker');//.closePopup()
        weatherCGHandler.addLayer(homeCountryWeatherMarker);
    }

    return weatherMarkerArray;
}

function earthquakeTabCreator(classToAppend, dataObj){
    let template = `
    <div class="earthquake_item" data-check="${dataObj['lat']}${dataObj['lng']}" tabindex=0>
        <div class="earthquake_item_date">Was on: <span>${dataObj['datetime']}</span></div>
        <div class="earthquake_item_depth">Depth: <span>${dataObj['depth']}</span> km</div>
        <div class="earthquake_item_magn">Magnitude: <span>${dataObj['magnitude']}</span></div>
        <div class="earthquake_item_lng">Longitude: <span>${dataObj['lng']}</span></div>
        <div class="earthquake_item_lat">Latitude: <span>${dataObj['lat']}</span></div>
    </div>
    `;

    $(`.${classToAppend}`).append(template);
}

function earthquakeMarkerSetting(earthquakeResult, countryData, earthquakeCGHandler, icon){
    let itemToDelete = document.querySelectorAll('.earthquake_item');
    for(let item of itemToDelete){
        $(item).remove();
    }

    let earthquakeMarkerArray = [];
    for(let key of earthquakeResult.data.content.earthquakes){
        if(isInsideCountryPolygon(key.lat, key.lng, swapLngLat(countryData.countryGeometry.coordinates), (countryData.countryGeometry.type === "MultiPolygon") ? true : false)){
            earthquakeTabCreator('earthquake', key);
            
            let homeCountryEarthquakesMarker = L.marker([key.lat, key.lng], {icon: icon.greenIcon});
            earthquakeMarkerArray.push(homeCountryEarthquakesMarker);
            homeCountryEarthquakesMarker.on('click', function(e){
                let latLng = this.getLatLng();
                let result = document.querySelectorAll('.earthquake_item');

                   
                earthquakeMarkerArray.forEach(function(v, i){
                    v.setIcon(icon.greenIcon);
                });
                this.setIcon(icon.currentIcon);
                

                for(let item of result){
                    
                    if(item.dataset.check === `${latLng.lat}${latLng.lng}`){
                        $(item).addClass('focus');
                        //$(item).trigger('focus');
                        continue;
                    }
                    $(item).removeClass('focus');
                }
                
            });
            earthquakeCGHandler.addLayer(homeCountryEarthquakesMarker);
        }  
    }
    return earthquakeMarkerArray;
}

function newsTabCreator(classToAppend, newsData){
    let itemToDelete = document.querySelectorAll('.news_item');
    for(let item of itemToDelete){
        $(item).remove();
    }

    

    for(let item of newsData){
        let template = `
        <div class="news_item">
            <p class="news_title">${item['title']}</p>
            <div class="news_body">
                <img class="news_img" onerror="this.src='./libs/img/news.png'" src="${item['image']['thumbnail']}" alt="News thumbnail image">
                <div class="news_desc">${item['description']}<a href="${item['url']}" target="_blank">Read full on web page...</a></div>
            </div>
            <div class="news_footer">
                <div class="news_date">${item['datePublished']}</div>
                <a class="news_source" href="${item['url']}" target="_blank">${item['provider']['name']}</a>
            </div>
        </div>
        `;

        $(`.${classToAppend}`).append(template);
    }
}

function wikiTabCreator(classToAppend, wikiData){
    
    let template = `
    <div class="wiki_item" data-check="${wikiData['lat']}${wikiData['lng']}" tabindex=0>
        <p class="wiki_title">${wikiData['title']}</p>
        <div class="wiki_body">
            <img class="wiki_img" onerror="this.src='./libs/img/news.png'" src="${wikiData['thumbnailImg']}" alt="Wiki thumbnail image">
            <div class="wiki_desc">${wikiData['summary']}<a href="https://${wikiData['wikipediaUrl']}" target="_blank">Read full on web page...</a></div>
        </div>
    </div>
    `;

    $(`.${classToAppend}`).append(template);
    
}

function wikiMarkerSetting(wikiResult, countryData, wikiCGHandler, icon){
    let itemToDelete = document.querySelectorAll('.wiki_item');
    for(let item of itemToDelete){
        $(item).remove();
    }

    let wikiMarkerArray = [];
    for(let key of wikiResult.data.content.geonames){
        if(isInsideCountryPolygon(key.lat, key.lng, swapLngLat(countryData.countryGeometry.coordinates), (countryData.countryGeometry.type === "MultiPolygon") ? true : false)){
           wikiTabCreator('wiki', key);
            let homeCountryWikiMarker = L.marker([key.lat, key.lng], {icon: icon.yellowIcon});
            wikiMarkerArray.push(homeCountryWikiMarker);

            homeCountryWikiMarker.on('click', function(e){
                let latLng = this.getLatLng();
                let result = document.querySelectorAll('.wiki_item');

                
                wikiMarkerArray.forEach(function(v, i){
                    v.setIcon(icon.yellowIcon);
                });
                this.setIcon(icon.currentIcon);
                

                for(let item of result){
                    
                    if(item.dataset.check === `${latLng.lat}${latLng.lng}`){
                        $(item).addClass('focus');
                        $(item).trigger('focus');
                        continue;
                    }
                    $(item).removeClass('focus');
                }
                
            });


            wikiCGHandler.addLayer(homeCountryWikiMarker); 
        }
        
    }

    return wikiMarkerArray;
}

function capitalAirportsTabCreator(classToAppend, dataObj){
    let lat = ConvertDMSToDD(dataObj['lat_format']);
    let lng = ConvertDMSToDD(dataObj['lon_format']);

    let template = `
    <div class="airports_item" data-check="${lat}${lng}" tabindex=0>
        <div class="airports_item_name">Airport name: <span>${dataObj['name']}</span></div>
        <div class="airports_item_dist">Distance: <span>${dataObj['distance']}</span> miles</div>
        <div class="airports_item_lat">Latitude: <span>${lat}</span></div>
        <div class="airports_item_lng">Longitude: <span>${lng}</span></div>
    </div>
    `;

    $(`.${classToAppend}`).append(template);
}



function capitalAirportsMarkerSetting(capitalAirportsResult, countryData, capitalAirportsCGHandler, icon){
    let capitalAirportsMarkerArray = [];
    for(let key of capitalAirportsResult.data.content['airport_list']){
        let lat = ConvertDMSToDD(key['lat_format']);
        let lng = ConvertDMSToDD(key['lon_format']);
        if(isInsideCountryPolygon(lat, lng, swapLngLat(countryData.countryGeometry.coordinates), (countryData.countryGeometry.type === "MultiPolygon") ? true : false)){
            capitalAirportsTabCreator('airports', key);
            
            let homeCountryCapitalAirportsMarker = L.marker([lat, lng], {icon: icon.purpleIcon});
            capitalAirportsMarkerArray.push(homeCountryCapitalAirportsMarker);
            homeCountryCapitalAirportsMarker.on('click', function(e){
                let latLng = this.getLatLng();
                let result = document.querySelectorAll('.airports_item');

                   
                capitalAirportsMarkerArray.forEach(function(v, i){
                    v.setIcon(icon.purpleIcon);
                });
                this.setIcon(icon.currentIcon);
                

                for(let item of result){
                    
                    if(item.dataset.check === `${latLng.lat}${latLng.lng}`){
                        $(item).addClass('focus');
                        $(item).trigger('focus');
                        continue;
                    }
                    $(item).removeClass('focus');
                }
                
            });
            capitalAirportsCGHandler.addLayer(homeCountryCapitalAirportsMarker);
        }  
    }
    return capitalAirportsMarkerArray;
}

async function getCountryBorders(){
    let countryBordersResponse = await phpRequest('countryBorders');
    return countryBordersResponse.data.content.features;
}

async function updateWorldinfoCountries(location, locationLat, locationLng, country){
    if(!isset(serObj.worldInfo['countries'])){
        serObj.worldInfo['countries'] = {};
        let res2 = await phpRequest('openCageData', {placename: location, first: 0});

        
        let res1 = await phpRequest('openCageData', {lat: locationLat, lng: locationLng, first: 1});
        
        
        let currentObj = {
            [country]: {
                currency: res1['data']['content']['results'][0]['annotations']['currency'],
                capital: {
                    geometry: res2.data.content.results[0].geometry,
                    bounds: res2.data.content.results[0].bounds
                }
            }
        };

        serObj.worldInfo['countries'] = {...currentObj};
    }else if(!isset(serObj.worldInfo['countries'][country])){
        let res2 = await phpRequest('openCageData', {placename: location, first: 0});

        let res1 = await phpRequest('openCageData', {lat: locationLat, lng: locationLng, first: 1});

        let currentObj = {
            [country]: {
                currency: res1['data']['content']['results'][0]['annotations']['currency'],
                capital: {
                    geometry: res2.data.content.results[0].geometry,
                    bounds: res2.data.content.results[0].bounds
                }
            }
        };

        serObj.worldInfo['countries'] = {...serObj.worldInfo['countries'], ...currentObj};
    }

    stringify('worldInfo', serObj.worldInfo);
}

function iconGenerator(){
    return {
        purpleIcon: L.icon({
            iconUrl: './libs/img/purple.png',
            iconSize:     [40, 40],
            iconAnchor:   [20, 34],
            popupAnchor:  [3, -37] 
        }),
        yellowIcon: L.icon({
            iconUrl: './libs/img/yellow.png',
            iconSize:     [40, 40],
            iconAnchor:   [20, 34],
            popupAnchor:  [3, -37] 
        }),
        greenIcon: L.icon({
            iconUrl: './libs/img/green.png',
            iconSize:     [40, 40],
            iconAnchor:   [20, 34],
            popupAnchor:  [3, -37] 
        }),
        blueIcon: L.icon({
            iconUrl: './libs/img/blue.png',
            iconSize:     [40, 40],
            iconAnchor:   [20, 34],
            popupAnchor:  [3, -37] 
        }),
        customerIcon: L.icon({
            iconUrl: './libs/img/customer.png',
            iconSize:     [40, 40],
            iconAnchor:   [20, 34],
            popupAnchor:  [3, -37] 
        }),
        capitalIcon: L.icon({
            iconUrl: './libs/img/capital.png',
            iconSize:     [40, 40],
            iconAnchor:   [20, 34],
            popupAnchor:  [3, -37] 
        }),
        currentIcon: L.icon({
            iconUrl: './libs/img/current_marker.png',
            iconSize:     [40, 40],
            iconAnchor:   [20, 34],
            popupAnchor:  [3, -37] 
        })
    }
}

function unboundEvents(){
    $('.earthquake_item').off('focus');
    $('.earthquake_item').off('mousedown');
    $('.earthquake_item').off('mouseenter');
    $('.earthquake_item').off('mouseleave');

    $('.wiki_item').off('focus');
    $('.wiki_item').off('mousedown');
    $('.wiki_item').off('mouseenter');
    $('.wiki_item').off('mouseleave');

    $('.airports_item').off('focus');
    $('.airports_item').off('mousedown');
    $('.airports_item').off('mouseenter');
    $('.airports_item').off('mouseleave');

    $("#countryInfoBox").off("click");
    $("#countryInfoBox1").off("click");

    $("#earthquakeBox").off("click");
    $("#earthquakeBox1").off("click");

    $("#weatherBox").off("click");
    $("#weatherBox1").off("click");

    $("#wikipediaBox").off("click");
    $("#wikipediaBox1").off("click");
    
    $("#airportsBox").off("click");
    $("#airportsBox1").off("click");
}

function homeCountryBoundEvents(){

    // $('.earthquake_item').on('blur', function(){
    //     $(this).removeClass('focus');
    // });

    $('.earthquake_item').on('focus', function(e){
        let result = document.querySelectorAll('.earthquake_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.earthquakeMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                //serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 10);
                continue;
            }
            item.setIcon(serObj.icon.greenIcon);
        }
        
    });

    $('.earthquake_item').on('mousedown', function(e){
        let result = document.querySelectorAll('.earthquake_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.earthquakeMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
                continue;
            }
            item.setIcon(serObj.icon.greenIcon);
        }

        

        e.preventDefault();
    });

    $('.earthquake_item').on('mouseenter', function(){
        $(this).addClass('active');
    });

    $('.earthquake_item').on('mouseleave', function(){
        $(this).removeClass('active');
    });



    $('.wiki_item').on('focus', function(e){
        let result = document.querySelectorAll('.wiki_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.wikiMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                //serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 10);
                continue;
            }
            item.setIcon(serObj.icon.yellowIcon);
        }
        
    });

    $('.wiki_item').on('mousedown', function(e){
        let result = document.querySelectorAll('.wiki_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.wikiMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
                continue;
            }
            item.setIcon(serObj.icon.yellowIcon);
        }

        e.preventDefault();
    });

    $('.wiki_item').on('mouseenter', function(){
        $(this).addClass('active');
    });

    $('.wiki_item').on('mouseleave', function(){
        $(this).removeClass('active');
    });



    $('.airports_item').on('focus', function(e){
        let result = document.querySelectorAll('.airports_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.capitalAirportsMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                //serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 10);
                continue;
            }
            item.setIcon(serObj.icon.purpleIcon);
        }
        
    });

    $('.airports_item').on('mousedown', function(e){
        let result = document.querySelectorAll('.airports_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.capitalAirportsMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
                continue;
            }
            item.setIcon(serObj.icon.purpleIcon);
        }

        e.preventDefault();
    });

    $('.airports_item').on('mouseenter', function(){
        $(this).addClass('active');
    });

    $('.airports_item').on('mouseleave', function(){
        $(this).removeClass('active');
    });


    /******************************* CHECKBOX CONTROL*****************************/
    
    $("#countryInfoBox").on("click", function() {
        if($("#countryInfoBox").is(":checked")){
            serObj.homeCountryInfoFG.addTo(serObj.map);
        }else{
            serObj.homeCountryInfoFG.removeFrom(serObj.map);
        }
    });

    $("#countryInfoBox1").on("click", function() {
        if($("#countryInfoBox1").is(":checked")){
            serObj.homeCountryInfoFG.addTo(serObj.map);
        }else{
            serObj.homeCountryInfoFG.removeFrom(serObj.map);
        }
    });


    $("#earthquakeBox").on("click", function() {
        if($("#earthquakeBox").is(":checked")){
            serObj.homeCountryEarthquakesMarkerCG.addTo(serObj.map);
        }else{
            serObj.homeCountryEarthquakesMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#earthquakeBox1").on("click", function() {
        if($("#earthquakeBox1").is(":checked")){
            serObj.homeCountryEarthquakesMarkerCG.addTo(serObj.map);
        }else{
            serObj.homeCountryEarthquakesMarkerCG.removeFrom(serObj.map);
        }
    });


    $("#weatherBox").on("click", function() {
        if($("#weatherBox").is(":checked")){
            serObj.homeCountryWeatherMarkerCG.addTo(serObj.map);
        }else{
            serObj.homeCountryWeatherMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#weatherBox1").on("click", function() {
        if($("#weatherBox1").is(":checked")){
            serObj.homeCountryWeatherMarkerCG.addTo(serObj.map);
        }else{
            serObj.homeCountryWeatherMarkerCG.removeFrom(serObj.map);
        }
    });


    $("#wikipediaBox").on("click", function() {
        if($("#wikipediaBox").is(":checked")){
            serObj.homeCountryWikiMarkerCG.addTo(serObj.map);
        }else{
            serObj.homeCountryWikiMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#wikipediaBox1").on("click", function() {
        if($("#wikipediaBox1").is(":checked")){
            serObj.homeCountryWikiMarkerCG.addTo(serObj.map);
        }else{
            serObj.homeCountryWikiMarkerCG.removeFrom(serObj.map);
        }
    });
    

    $("#airportsBox").on("click", function() {
        if($("#airportsBox").is(":checked")){
            serObj.homeCountryCapitalAirportsMarkerCG.addTo(serObj.map);
        }else{
            serObj.homeCountryCapitalAirportsMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#airportsBox1").on("click", function() {
        if($("#airportsBox1").is(":checked")){
            serObj.homeCountryCapitalAirportsMarkerCG.addTo(serObj.map);
        }else{
            serObj.homeCountryCapitalAirportsMarkerCG.removeFrom(serObj.map);
        }
    });
}

function countryBoundEvents(){

    // $('.earthquake_item').on('blur', function(){
    //     $(this).removeClass('focus');
    // });

    $('.earthquake_item').on('focus', function(e){
        let result = document.querySelectorAll('.earthquake_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.countryEarthquakeMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                //serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 10);
                continue;
            }
            item.setIcon(serObj.icon.greenIcon);
        }
        
    });

    $('.earthquake_item').on('mousedown', function(e){
        let result = document.querySelectorAll('.earthquake_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.countryEarthquakeMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
                continue;
            }
            item.setIcon(serObj.icon.greenIcon);
        }

        

        e.preventDefault();
    });

    $('.earthquake_item').on('mouseenter', function(){
        $(this).addClass('active');
    });

    $('.earthquake_item').on('mouseleave', function(){
        $(this).removeClass('active');
    });



    $('.wiki_item').on('focus', function(e){
        let result = document.querySelectorAll('.wiki_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.countryWikiMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                //serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 10);
                continue;
            }
            item.setIcon(serObj.icon.yellowIcon);
        }
        
    });

    $('.wiki_item').on('mousedown', function(e){
        let result = document.querySelectorAll('.wiki_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.countryWikiMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
                continue;
            }
            item.setIcon(serObj.icon.yellowIcon);
        }

        e.preventDefault();
    });

    $('.wiki_item').on('mouseenter', function(){
        $(this).addClass('active');
    });

    $('.wiki_item').on('mouseleave', function(){
        $(this).removeClass('active');
    });



    $('.airports_item').on('focus', function(e){
        let result = document.querySelectorAll('.airports_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.countryCapitalAirportsMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                //serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 10);
                continue;
            }
            item.setIcon(serObj.icon.purpleIcon);
        }
        
    });

    $('.airports_item').on('mousedown', function(e){
        let result = document.querySelectorAll('.airports_item');
        for(let item of result){
            $(item).removeClass('focus');
        }

        $(this).addClass('focus');

        let latLng = $(this).data('check');

        for(let item of serObj.countryCapitalAirportsMarkerArray){
            if(`${item.getLatLng()['lat']}${item.getLatLng()['lng']}` === latLng){
                item.setIcon(serObj.icon.currentIcon);
                serObj.map.flyTo([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
                continue;
            }
            item.setIcon(serObj.icon.purpleIcon);
        }

        e.preventDefault();
    });

    $('.airports_item').on('mouseenter', function(){
        $(this).addClass('active');
    });

    $('.airports_item').on('mouseleave', function(){
        $(this).removeClass('active');
    });


    /******************************* CHECKBOX CONTROL*****************************/
    
    $("#countryInfoBox").on("click", function() {
        if($("#countryInfoBox").is(":checked")){
            serObj.countryInfoFG.addTo(serObj.map);
        }else{
            serObj.countryInfoFG.removeFrom(serObj.map);
        }
    });

    $("#countryInfoBox1").on("click", function() {
        if($("#countryInfoBox1").is(":checked")){
            serObj.countryInfoFG.addTo(serObj.map);
        }else{
            serObj.countryInfoFG.removeFrom(serObj.map);
        }
    });

    $("#earthquakeBox").on("click", function() {
        if($("#earthquakeBox").is(":checked")){
            serObj.countryEarthquakesMarkerCG.addTo(serObj.map);
        }else{
            serObj.countryEarthquakesMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#earthquakeBox1").on("click", function() {
        if($("#earthquakeBox1").is(":checked")){
            serObj.countryEarthquakesMarkerCG.addTo(serObj.map);
        }else{
            serObj.countryEarthquakesMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#weatherBox").on("click", function() {
        if($("#weatherBox").is(":checked")){
            serObj.countryWeatherMarkerCG.addTo(serObj.map);
        }else{
            serObj.countryWeatherMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#weatherBox1").on("click", function() {
        if($("#weatherBox1").is(":checked")){
            serObj.countryWeatherMarkerCG.addTo(serObj.map);
        }else{
            serObj.countryWeatherMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#wikipediaBox").on("click", function() {
        if($("#wikipediaBox").is(":checked")){
            serObj.countryWikiMarkerCG.addTo(serObj.map);
        }else{
            serObj.countryWikiMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#wikipediaBox1").on("click", function() {
        if($("#wikipediaBox1").is(":checked")){
            serObj.countryWikiMarkerCG.addTo(serObj.map);
        }else{
            serObj.countryWikiMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#airportsBox").on("click", function() {
        if($("#airportsBox").is(":checked")){
            serObj.countryCapitalAirportsMarkerCG.addTo(serObj.map);
        }else{
            serObj.countryCapitalAirportsMarkerCG.removeFrom(serObj.map);
        }
    });

    $("#airportsBox1").on("click", function() {
        if($("#airportsBox1").is(":checked")){
            serObj.countryCapitalAirportsMarkerCG.addTo(serObj.map);
        }else{
            serObj.countryCapitalAirportsMarkerCG.removeFrom(serObj.map);
        }
    });
}

function disableCheckbox(){
    $('#countryInfoBox').prop('disabled', true);
    $('#countryInfoBox1').prop('disabled', true);

    $('#earthquakeBox').prop('disabled', true);
    $('#earthquakeBox1').prop('disabled', true);

    $('#weatherBox').prop('disabled', true);
    $('#weatherBox1').prop('disabled', true);

    $('#wikipediaBox').prop('disabled', true);
    $('#wikipediaBox1').prop('disabled', true);

    $('#airportsBox').prop('disabled', true);
    $('#airportsBox1').prop('disabled', true);
}

////////////////////////////-------SELECT FUNCTION---------///////////////////////////////

function selectChanger(){
    //Select
    let selects = document.getElementsByTagName('select');
    if (selects.length > 0) {
        selects_init();
    }


    function selects_init() {
        for (let index = 0; index < selects.length; index++) {
            const select = selects[index];
            select_init(select);
        }
        //select_callback();
        document.addEventListener('click', function (e) {
            selects_close(e);
        });
        document.addEventListener('keydown', function (e) {
            if (e.which == 27) {
                selects_close(e);
            }
        });
    }


    function selects_close(e) {
        const selects = document.querySelectorAll('.select');
        if (!e.target.closest('.select')) {
            for (let index = 0; index < selects.length; index++) {
                const select = selects[index];
                const select_body_options = select.querySelector('.select__options');
                select.classList.remove('_active');
                _slideUp(select_body_options, 100);
            }
        }
    }


    function select_init(select) {
        const select_parent = select.parentElement;
        const select_modifikator = select.getAttribute('class');
        const select_selected_option = select.options[select.options.selectedIndex];//Alternative --> const select_selected_option = select.querySelector('option:checked');
        select.setAttribute('data-default', select_selected_option.value);
        select.style.display = 'none';

        select_parent.insertAdjacentHTML('beforeend', '<div class="select select_' + select_modifikator + '"></div>');

        let new_select = select.parentElement.querySelector('.select');
        new_select.appendChild(select);
        select_item(select);
    }

    function select_item(select) {
        const select_parent = select.parentElement;
        const select_options = select.querySelectorAll('option');
        const select_selected_option = select.querySelector('option:checked');
        const select_selected_text = select_selected_option.text;

        let select_type_content = `<div class="select__value"><span>${select_selected_text}</span></div>`;

        select_parent.insertAdjacentHTML('beforeend',
            '<div class="select__item">' +
            '<div class="select__title">' + select_type_content + '</div>' +
            '<div class="select__options" tabindex=0>' + select_get_options(select_options) + '</div>' +
            '</div>');

        select_actions(select, select_parent);
    }

    function select_get_options(select_options) {
        if (select_options) {
            let select_options_content = '';
            for (let index = 0; index < select_options.length; index++) {
                const select_option = select_options[index];
                const select_option_value = select_option.value;
                if (select_option_value != '') {
                    const select_option_text = select_option.text;
                    const select_option_data_iso_a2 = select_option.dataset.isoA2;
                    const select_option_data_iso_a3 = select_option.dataset.isoA3;
                    const select_option_data_iso_n3 = select_option.dataset.isoN3;
                    if(select_option_value === 'default'){
                        select_options_content += `<div data-index=${index} data-value=${select_option_value} selected class="select__option">${select_option_text}</div>`; 
                    }else{
                       select_options_content += `<div data-index=${index} data-iso-n3=${select_option_data_iso_n3} data-iso-a3=${select_option_data_iso_a3} data-iso-a2=${select_option_data_iso_a2} data-value=${select_option_value} class="select__option">${select_option_text}</div>`; 
                    }
                    
                }
            }
            return select_options_content;
        }
    }

    function select_actions(original, select) {
        const select_item = select.querySelector('.select__item');
        const select_body_options = select.querySelector('.select__options');
        const select_options = select.querySelectorAll('.select__option');

        

        select_item.addEventListener('click', function () {
            let selects = document.querySelectorAll('.select');
            for (let index = 0; index < selects.length; index++) {
                const select = selects[index];
                const select_body_options = select.querySelector('.select__options');
                if (select != select_item.closest('.select')) {
                    select.classList.remove('_active');
                    _slideUp(select_body_options, 100);
                }
            }
            _slideToggle(select_body_options, 100);
            select.classList.toggle('_active');
        });

        for (let index = 0; index < select_options.length; index++) {
            const select_option = select_options[index];
            
            select_option.addEventListener('click', function(e) {
                e.stopPropagation();
                let selectOptions = select.querySelectorAll('.select__option');

                for (let id = 0; id < selectOptions.length; id++) {
                    const el = selectOptions[id];
                    if(el.dataset.value === 'default'){
                        el.remove();
                        continue;
                    }
                    el.style.display = 'block';
                }

                select.querySelector('.select__value').innerHTML = '<span>' + this.innerHTML + '</span>';
                this.style.display = 'none';

                _slideToggle(select_body_options, 100);
                select.classList.toggle('_active');

                document.querySelector('.header_select').options[this.dataset.index].selected = true;
                $('.header_select').trigger('change');
            });
        }
    }

    let _slideUp = (target, duration = 500) => {
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.style.display = 'none';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }


    let _slideDown = (target, duration = 500) => {
        target.style.removeProperty('display');
        let display = window.getComputedStyle(target).display;
        if (display === 'none')
            display = 'block';

        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }


    let _slideToggle = (target, duration = 500) => {
        if (!target.classList.contains('_slide')) {
            target.classList.add('_slide');
            if (window.getComputedStyle(target).display === 'none') {
                return _slideDown(target, duration);
            } else {
                return _slideUp(target, duration);
            }
        }
    }
}

