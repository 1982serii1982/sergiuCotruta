////////////////----------    HELP FUNCTIONS    ----------//////////////////////

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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function resetMarkersIcon(iconObj){
    if(serObj.edge){
        serObj.earthquakeMarkerArray.forEach(function(v, i){
            v.setIcon(iconObj.greenIcon);
        });

        serObj.weatherMarkerArray.forEach(function(v, i){
            v.setIcon(iconObj.blueIcon);
        });

        serObj.wikiMarkerArray.forEach(function(v, i){
            v.setIcon(iconObj.yellowIcon);
        });

        // serObj.capitalAirportsMarkerArray.forEach(function(v, i){
        //     v.setIcon(iconObj.purpleIcon);
        // });
    }
    
    if(!serObj.edge){
        serObj.countryEarthquakeMarkerArray.forEach(function(v, i){
            v.setIcon(iconObj.greenIcon);
        });

        serObj.countryWeatherMarkerArray.forEach(function(v, i){
            v.setIcon(iconObj.blueIcon);
        });

        serObj.countryWikiMarkerArray.forEach(function(v, i){
            v.setIcon(iconObj.yellowIcon);
        });

        // serObj.countryCapitalAirportsMarkerArray.forEach(function(v, i){
        //     v.setIcon(iconObj.purpleIcon);
        // });
    }
    
}

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

    for(let key of serObj.geoJsonProperties.data.content){
        countryArray[key.name] = {
            "iso_a2" : key.iso_a2,
            "iso_a3" : key.iso_a3,
            "iso_n3" : key.iso_n3
        }
    }

    for(let key of (Object.keys(countryArray)).sort()){
        let iso_a2 = countryArray[key]['iso_a2'];
        let iso_a3 = countryArray[key]['iso_a3'];
        let iso_n3 = countryArray[key]['iso_n3'];
        $('.header_select').append("<option value='" + key + "' data-iso-a2='" + iso_a2 + "' data-iso-a3='" + iso_a3 + "' data-iso-n3='" + iso_n3 + "'>" + key + "</option>");
    }
    
};

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

    for(let [index, value] of objToSearch.data.content.entries()){
        let depth;

        if(value.type === "MultiPolygon"){
            depth = true;
        }else if(value.type === "Polygon"){
            depth = false;
        }

        
        if(isInsideCountryPolygon(lat, lng, swapLngLat(value.coordinates), depth)){
            return {
                countryIndex: index,
                coordinates: value,
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
        spiderfyOnMaxZoom: false, showCoverageOnHover: false, zoomToBoundsOnClick: true
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
        if(isInsideCountryPolygon(item.lat, item.lng, swapLngLat(countryData.coordinates), (countryData.type === "MultiPolygon") ? true : false)){
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

function weatherMarkerSetting(weatherResult, countryData, weatherCGHandler, iconObject){
    let weatherMarkerArray = [];
    for(let key of getWeatherStationData(weatherResult, countryData)['stations']){
        let homeCountryWeatherMarker = L.marker([key.lat, key.lng], {icon: iconObject.blueIcon});
        weatherMarkerArray.push(homeCountryWeatherMarker);
        homeCountryWeatherMarker.bindPopup(`This is weather marker.<br>Now you can press <span class="fa-solid fa-sun-cloud fa-beat"></span> button<br>on left hand side of the map,<br>to see more details.`).closePopup();
        homeCountryWeatherMarker.on('click', async function(){
            // weatherMarkerArray.forEach(function(v, i){
            //     v.setIcon(icon.blueIcon);
            // });
            resetMarkersIcon(iconObject);
            this.setIcon(iconObject.currentIcon);
            //$('#weather').modal('show');
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
        weatherCGHandler.addLayer(homeCountryWeatherMarker);
    }

    return weatherMarkerArray;
}

function earthquakeTabCreator(classToAppend, dataObj){
    let template1 = `
    <div class="earthquake_item" data-check="${dataObj['lat']}${dataObj['lng']}" tabindex=0>
        <div class="earthquake_item_date"><span>Date</span><span>${dataObj['datetime']}</span></div>
        <div class="earthquake_item_depth"><span>Depth</span><span>${dataObj['depth']}&nbsp;km</span></div>
        <div class="earthquake_item_magn"><span>Magnitude</span><span>${dataObj['magnitude']}</span></div>
        <div class="earthquake_item_lng"><span>Longitude</span><span>${dataObj['lng']}</span></div>
        <div class="earthquake_item_lat"><span>Latitude</span><span>${dataObj['lat']}</span></div>
    </div>
    `;

    

    $(`.${classToAppend}`).append(template1);
    return template1;
}

function earthquakeMarkerSetting(earthquakeResult, countryData, earthquakeCGHandler, iconObject){
    let itemToDelete = document.querySelectorAll('.earthquake_item');
    for(let item of itemToDelete){
        $(item).remove();
    }

    let earthquakeMarkerArray = [];
    for(let key of earthquakeResult.data.content.earthquakes){
        if(isInsideCountryPolygon(key.lat, key.lng, swapLngLat(countryData.coordinates), (countryData.type === "MultiPolygon") ? true : false)){
            let template = earthquakeTabCreator('earthquake', key);
            
            let homeCountryEarthquakesMarker = L.marker([key.lat, key.lng], {icon: iconObject.greenIcon});
            homeCountryEarthquakesMarker.bindPopup(`This is earthquake marker.<br><div class="earthquake_marker">${template}</div>`).closePopup();
            
            earthquakeMarkerArray.push(homeCountryEarthquakesMarker);
            homeCountryEarthquakesMarker.on('click', function(e){
                let latLng = this.getLatLng();
                let result = document.querySelectorAll('.earthquake_item');

                   
                // earthquakeMarkerArray.forEach(function(v, i){
                //     v.setIcon(icon.greenIcon);
                // });
                resetMarkersIcon(iconObject);
                this.setIcon(iconObject.currentIcon);
                //$('#earthquake').modal('show');
                

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

function wikiMarkerSetting(wikiResult, countryData, wikiCGHandler, iconObject){
    let itemToDelete = document.querySelectorAll('.wiki_item');
    for(let item of itemToDelete){
        $(item).remove();
    }

    let wikiMarkerArray = [];
    for(let key of wikiResult.data.content.geonames){
        if(isInsideCountryPolygon(key.lat, key.lng, swapLngLat(countryData.coordinates), (countryData.type === "MultiPolygon") ? true : false)){
           wikiTabCreator('wiki', key);
            let homeCountryWikiMarker = L.marker([key.lat, key.lng], {icon: iconObject.yellowIcon});
            homeCountryWikiMarker.bindPopup(`This is wikipedia marker.<br>Now you can press <span class="fa-solid fa-w fa-beat"></span> button<br>on left hand side of the map.<br>To see more details find window<br>with <span style="color: #f77676;">LIGHTRED</span> background color`).closePopup();
            wikiMarkerArray.push(homeCountryWikiMarker);
            
            homeCountryWikiMarker.on('click', function(e){
                let latLng = this.getLatLng();
                let result = document.querySelectorAll('.wiki_item');

                
                // wikiMarkerArray.forEach(function(v, i){
                //     v.setIcon(icon.yellowIcon);
                // });
                resetMarkersIcon(iconObject);
                this.setIcon(iconObject.currentIcon);
                

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

function capitalAirportsMarkerSetting(capitalAirportsResult, countryData, capitalAirportsCGHandler, iconObject){
    let capitalAirportsMarkerArray = [];
    for(let key of capitalAirportsResult.data.content['airport_list']){
        let lat = ConvertDMSToDD(key['lat_format']);
        let lng = ConvertDMSToDD(key['lon_format']);
        if(isInsideCountryPolygon(lat, lng, swapLngLat(countryData.coordinates), (countryData.type === "MultiPolygon") ? true : false)){
            capitalAirportsTabCreator('airports', key);
            
            let homeCountryCapitalAirportsMarker = L.marker([lat, lng], {icon: iconObject.purpleIcon});
            homeCountryCapitalAirportsMarker.bindPopup(`This is airports marker.<br>Now you can press <span class="fa-solid fa-plane fa-beat"></span> button<br>on left hand side of the map.<br>To see more details find window<br>with <span style="color: #f77676;">LIGHTRED</span> background color`).closePopup();
            capitalAirportsMarkerArray.push(homeCountryCapitalAirportsMarker);
            homeCountryCapitalAirportsMarker.on('click', function(e){
                let latLng = this.getLatLng();
                let result = document.querySelectorAll('.airports_item');

                   
                // capitalAirportsMarkerArray.forEach(function(v, i){
                //     v.setIcon(icon.purpleIcon);
                // });
                resetMarkersIcon(iconObject);
                this.setIcon(iconObject.currentIcon);
                

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
}

function homeCountryBoundEvents(){
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
                serObj.map.setView([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
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
                serObj.map.setView([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
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
                serObj.map.setView([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
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
}

function countryBoundEvents(){
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
                serObj.map.setView([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
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
                serObj.map.setView([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
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
                serObj.map.setView([item.getLatLng()['lat'], item.getLatLng()['lng']], 13);
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
}

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

window['serObj'] = {};


if(!parse('worldInfo')){
    serObj.worldInfo = {};
}else{
    serObj.worldInfo = parse('worldInfo');
    console.log(serObj.worldInfo);
}

L.DomEvent.disableScrollPropagation($('.preloader')[0]);
L.DomEvent.disableClickPropagation($('.preloader')[0]);








(async function(){

    


    ////////////////----------    MAIN START    ----------//////////////////////

    preloader.updatePreloaderMessage('Retrieve User Location...');

    try {
        let latLng = await returnLatLon();

        serObj.homeLat = latLng[0];
        serObj.homeLon = latLng[1];

    } catch (err) {

        serObj.homeLat = 51.5007144;
        serObj.homeLon = -0.1422878;

    }

    ////////////////-------------------------------------//////////////////////


    preloader.updatePreloaderMessage('Retrieve Current Date...');

    const currentDate = moment().format('DD/MM/YYYY');
    serObj.currentDate = currentDate;

    serObj.edge = 1;
    serObj.homeCountryWikiResultError = 1;
    serObj.homeCountryEarthquakesResultError = 1;
    serObj.homeCountryWeatherResultError = 1;
    serObj.homeCountryCapitalAirportsResultError = 1;

    serObj.countryEarthquakesResultError = 1;
    serObj.countryWeatherResultError = 1;
    serObj.countryWikiResultError = 1;
    serObj.countryCapitalAirportsResultError = 1;
    



    ////////////////-------------------------------------//////////////////////


    preloader.updatePreloaderMessage('Retrieve Geo Data...');

    serObj.geoJsonProperties = await phpRequest('countryBorders', {index: 1});
    serObj.geoJsonGeometries = await phpRequest('countryBorders', {index: 2});

    //--------------------------------------------------------------------//

    let homeCountryData = latLngToCountryData(serObj.homeLat, serObj.homeLon, serObj.geoJsonGeometries);
    if(homeCountryData.errorCode){
        alert(homeCountryData.errorMessage);
        throw new Error('There is a error with country borders defined in countryBorders json file');
    }
    

    if(!isset(serObj.worldInfo['countryInfo'])){
        let response = await phpRequest('restCountries');
        serObj.worldInfo['countryInfo'] = response;
     }

    
    //-----------------------------------------------------------------------//

    
    


    //--------------------- Currency 1 hour cache ----------- START ------------//
    if(!isset(serObj.worldInfo['currency'])){
        let response = await phpRequest('currency');
        serObj.worldInfo['currency'] = response;
    }else if((serObj.worldInfo['currency'].data.content['timestamp'] + 3600) < moment().unix()){
        let response = await phpRequest('currency');
        serObj.worldInfo['currency'] = response;
    }
    //----------------------------- END ------------------------------------//

    let callStr, domStr, homeCpt;
    for(let key of serObj.worldInfo.countryInfo.data.content){
        if(key['alpha3Code'] === serObj.geoJsonProperties.data.content[homeCountryData.countryIndex]['iso_a3']){
            callStr = `<span>Country calling code:</span>&nbsp;<span>+${key['callingCodes'][0]}</span>`;
            domStr = `<span>Country top domain level:</span>&nbsp;<span>${key['topLevelDomain'][0]}</span>`;
            homeCpt = key['capital'];
            break;
        }
    }

    const geonamesCountryInfoResult = await phpRequest('geonamesCountryInfo', {country: serObj.geoJsonProperties.data.content[homeCountryData.countryIndex]['iso_a2']});
    if(geonamesCountryInfoResult.status.code === '200'){
        $('.search_loader_wrapper').css('display', 'none');
    }


    const homeCountryName = serObj.geoJsonProperties.data.content[homeCountryData.countryIndex].name;
    let homeCountryCapital = homeCpt;

    

    await updateWorldinfoCountries(homeCountryCapital, serObj.homeLat, serObj.homeLon, homeCountryName);
    

    
    let currencyCode = serObj.worldInfo.countries[homeCountryName].currency.iso_code;
    let currencyRate = serObj.worldInfo.currency.data.content.rates[currencyCode];
    let currencyBase = serObj.worldInfo.currency.data.content.base;
    let homeCountryCapitalLat = serObj.worldInfo.countries[homeCountryName].capital.geometry.lat;
    let homeCountryCapitalLng = serObj.worldInfo.countries[homeCountryName].capital.geometry.lng;
    let countryFlag = serObj.geoJsonProperties.data.content[homeCountryData.countryIndex]['iso_a2'].toLowerCase();

    

    const countryInfoObj = {
        countryFlag: `<img src="./libs/img/flags/${countryFlag}.svg" alt="Country Flag">`,
        countryString: `<span>Country:</span>&nbsp;<span>${homeCountryName}</span>`, 
        capitalString: `<span>Capital:</span>&nbsp;<span>${homeCountryCapital}</span>`,
        populationString: `<span>Population:</span>&nbsp;<span>${numberWithCommas(geonamesCountryInfoResult.data.content.geonames[0]['population'])}</span>`,
        areaString: `<span>Area (sq. km.):</span>&nbsp;<span>${numberWithCommas(geonamesCountryInfoResult.data.content.geonames[0]['areaInSqKm'])}</span>`,
        currencyString: `<span>1 ${currencyBase}=</span>&nbsp;<span>${numberWithCommas(currencyRate)} ${currencyCode}</span>`,
        dateString: `<span>Today is:</span>&nbsp;<span>${currentDate}</span>`,
        callingCodeString: callStr,
        domainString: domStr
    }
    
    ////////////////-------------------------------------//////////////////////

    preloader.updatePreloaderMessage('Populate Items...');

    populateSelect();
    selectChanger();
    populateCountryInfo(countryInfoObj);
    populateWeather(serObj.homeLat, serObj.homeLon);

    

    //-------------------------------------------------------------------//
    
    preloader.updatePreloaderMessage('Outline Home Country...');
    serObj.icon = iconGenerator();

   
    /************************** MAP CONTROL ************************************************************/

    const OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: 'opentopomap'
    });

    const WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    const openstreetmap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    });

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

    const baseMaps = {
        "OpenStreetMap": openstreetmap,
        "Topo Map": OpenTopoMap,
        "Terrain Map": WorldImagery
    };



    L.control.attribution({
        position: 'bottomright'
    }).addTo(map);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    L.control.scale({
        position: 'bottomleft'
    }).addTo(map);


    L.easyButton('fa-solid fa-circle-info', function(){
    }, 'Toggle info window', 'countryInfoButton', {set: 1, data_bs_toggle: 'modal', data_bs_target: '#countryInfo'}).addTo(serObj.map);

    L.easyButton('fa-solid fa-sun-cloud', function(){
    }, 'Toggle weather window', 'weatherButton', {set: 1, data_bs_toggle: 'modal', data_bs_target: '#weather'}).addTo(serObj.map);

    L.easyButton('fa-solid fa-house-crack', function(){
    }, 'Toggle earthquake Window', 'earthquakeButton', {set: 1, data_bs_toggle: 'modal', data_bs_target: '#earthquake'}).addTo(serObj.map);

    L.easyButton('fa-solid fa-w', function(){
    }, 'Toggle wikipedia Window', 'wikipediaButton', {set: 1, data_bs_toggle: 'modal', data_bs_target: '#wikipedia'}).addTo(serObj.map);

    L.easyButton('fa-solid fa-plane', function(){
    }, 'Toggle airports Window', 'airportsButton', {set: 1, data_bs_toggle: 'modal', data_bs_target: '#airports'}).addTo(serObj.map);

    L.easyButton('fa-solid fa-newspaper', function(){
    }, 'Toggle news Window', 'newsButton', {set: 1, data_bs_toggle: 'modal', data_bs_target: '#news'}).addTo(serObj.map);

    serObj.layerControl = L.control.layers(baseMaps).addTo(map);


    

    /************************** COUNTRY INFO ************************************************************/

    let homeCountryMultiPolyline = L.polyline(swapLngLat(homeCountryData.coordinates.coordinates), {color:'red'});

    let homeCountryCapitalMarker = L.marker([homeCountryCapitalLat, homeCountryCapitalLng], {icon: serObj.icon.capitalIcon});
    homeCountryCapitalMarker.bindPopup(`This is ${homeCountryCapital} your country capital `).closePopup();


    serObj.homeCountryInfoFG = L.featureGroup();
    serObj.homeCountryInfoFG.addLayer(homeCountryMultiPolyline);
    serObj.homeCountryInfoFG.addLayer(homeCountryCapitalMarker);
    serObj.homeCountryInfoFG.addTo(serObj.map);

    serObj.layerControl.addOverlay(serObj.homeCountryInfoFG, "<b>Country Info</b>");

    serObj.map.fitBounds(serObj.homeCountryInfoFG.getBounds());

    let homeCountryBoundingBox = {
        north: homeCountryMultiPolyline.getBounds()['_northEast'].lat,
        south: homeCountryMultiPolyline.getBounds()['_southWest'].lat,
        east: homeCountryMultiPolyline.getBounds()['_northEast'].lng,
        west: homeCountryMultiPolyline.getBounds()['_southWest'].lng
    };


    /************************** EARTHQUAKES ************************************************************/



    let homeCountryEarthquakesResult = await phpRequest('geonamesEarthquakes', {country: homeCountryBoundingBox, time: moment().format('YYYY-MM-DD')});

    let earthquakeToDelete = document.querySelectorAll('.earthquake_item');
    for(let item of earthquakeToDelete){
        $(item).remove();
    }

    $('.earthquake_loader_wrapper').css('display', 'flex');
    $('.lds-default').css('display', 'block');
    $('.earthquake_loader_error').css('display', 'none');
    if(isset(homeCountryEarthquakesResult.data.content['earthquakes'])){
        serObj.homeCountryEarthquakesMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_green-small', medium: 'mycluster_green-medium', normal: 'mycluster_green'});
        serObj.earthquakeMarkerArray = earthquakeMarkerSetting(homeCountryEarthquakesResult, homeCountryData.coordinates, serObj.homeCountryEarthquakesMarkerCG, serObj.icon);
        serObj.map.addLayer(serObj.homeCountryEarthquakesMarkerCG);
        serObj.layerControl.addOverlay(serObj.homeCountryEarthquakesMarkerCG, "<b>Earthquake</b>");

        serObj.homeCountryEarthquakesResultError = 0;

        $('.earthquake_loader_wrapper').addClass('active');
        setTimeout(function(){
            $('.earthquake_loader_wrapper').css('display', 'none');
        }, 1000);
    }else{
        $('.lds-default').css('display', 'none');
        $('.earthquake_loader_error').css('display', 'block');
    }

    /************************** WEATHER ************************************************************/

    let homeCountryWeatherResult = await phpRequest('geonamesWeather', {country: homeCountryBoundingBox});
    if(isset(homeCountryWeatherResult.data.content['weatherObservations'])){
        serObj.homeCountryWeatherMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_blue-small', medium: 'mycluster_blue-medium', normal: 'mycluster_blue'});
        serObj.weatherMarkerArray = weatherMarkerSetting(homeCountryWeatherResult, homeCountryData.coordinates, serObj.homeCountryWeatherMarkerCG, serObj.icon);
        serObj.map.addLayer(serObj.homeCountryWeatherMarkerCG);
        serObj.layerControl.addOverlay(serObj.homeCountryWeatherMarkerCG, "<b>Weather</b>");

        serObj.homeCountryWeatherResultError = 0;
    }else{
        alert('Error to load weather markers');
    }

    /************************** NEWS ************************************************************/
    
    let homeCountryNewsResult = await phpRequest('rapidWebSearchNews', {country: homeCountryName});

    let newsToDelete = document.querySelectorAll('.news_item');
    for(let item of newsToDelete){
        $(item).remove();
    }

    $('.news_loader_wrapper').css('display', 'flex');
    $('.lds-default').css('display', 'block');
    $('.news_loader_error').css('display', 'none');

    if(isset(homeCountryNewsResult.data.content['value'])){
        newsTabCreator('news', homeCountryNewsResult.data.content.value);
        $('.news_loader_wrapper').addClass('active');
        setTimeout(function(){
            $('.news_loader_wrapper').css('display', 'none');
        }, 1000);
    }else{
        $('.lds-default').css('display', 'none');
        $('.news_loader_error').css('display', 'block');
    }

   /************************** WIKIPEDIA ************************************************************/ 

    
    let homeCountryWikiResult = await phpRequest('geonamesWikipediaBoundingBox', {country: homeCountryBoundingBox});

    let wikiToDelete = document.querySelectorAll('.wiki_item');
    for(let item of wikiToDelete){
        $(item).remove();
    }

    $('.wiki_loader_wrapper').css('display', 'flex');
    $('.lds-default').css('display', 'block');
    $('.wiki_loader_error').css('display', 'none');
    if(isset(homeCountryWikiResult.data.content['geonames'])){
        serObj.homeCountryWikiMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_yellow-small', medium: 'mycluster_yellow-medium', normal: 'mycluster_yellow'});
        serObj.wikiMarkerArray = wikiMarkerSetting(homeCountryWikiResult, homeCountryData.coordinates, serObj.homeCountryWikiMarkerCG, serObj.icon);
        serObj.map.addLayer(serObj.homeCountryWikiMarkerCG);
        serObj.layerControl.addOverlay(serObj.homeCountryWikiMarkerCG, "<b>Wikipedia</b>");

        serObj.homeCountryWikiResultError = 0;

        $('.wiki_loader_wrapper').addClass('active');
        setTimeout(function(){
            $('.wiki_loader_wrapper').css('display', 'none');
        }, 1000);
    }else{
        $('.lds-default').css('display', 'none');
        $('.wiki_loader_error').css('display', 'block');
    }

    /************************** AIRPORTS ************************************************************/
    

    // let homeCountryCapitalAirportsResult = await phpRequest('rapidAirportGuide', {lat: homeCountryCapitalLat, lng: homeCountryCapitalLng, second: 1});
    
    // let airportsToDelete = document.querySelectorAll('.airports_item');
    // for(let item of airportsToDelete){
    //     $(item).remove();
    // }

    // $('.airports_loader_wrapper').css('display', 'flex');
    // $('.lds-default').css('display', 'block');
    // $('.airports_loader_error').css('display', 'none');
    // if(homeCountryCapitalAirportsResult.data.content != null){
    //     serObj.homeCountryCapitalAirportsMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_purple-small', medium: 'mycluster_purple-medium', normal: 'mycluster_purple'});
    //     serObj.capitalAirportsMarkerArray = capitalAirportsMarkerSetting(homeCountryCapitalAirportsResult, homeCountryData.coordinates, serObj.homeCountryCapitalAirportsMarkerCG, serObj.icon);
    //     serObj.map.addLayer(serObj.homeCountryCapitalAirportsMarkerCG);
    //     serObj.layerControl.addOverlay(serObj.homeCountryCapitalAirportsMarkerCG, "<b>Airports</b>");

    //     serObj.homeCountryCapitalAirportsResultError = 0;

    //     $('.airports_loader_wrapper').addClass('active');
    //     setTimeout(function(){
    //         $('.airports_loader_wrapper').css('display', 'none');
    //     }, 1000);
    // }else{
    //     $('.lds-default').css('display', 'none');
    //     $('.airports_loader_error').css('display', 'block');
    // }

    // setTimeout(function(){
    //     $('.preloader').css('display', 'none');
    // },3000);
    
    /********************************** BOUND EVENTS ************************************************** */ 
    
    homeCountryBoundEvents();



    $(document).ready(function () {
        

        stringify('worldInfo', serObj.worldInfo);

    });

})();



$(document).ready(function () {

    

    $('.header_select').on('change', async function(e){

        if(serObj.edge){
            if(!serObj.homeCountryEarthquakesResultError){
                serObj.map.removeLayer(serObj.homeCountryEarthquakesMarkerCG);
                serObj.layerControl.removeLayer(serObj.homeCountryEarthquakesMarkerCG);
            }

            if(!serObj.homeCountryWeatherResultError){
                serObj.map.removeLayer(serObj.homeCountryWeatherMarkerCG);
                serObj.layerControl.removeLayer(serObj.homeCountryWeatherMarkerCG);
            }
            
            if(!serObj.homeCountryWikiResultError){
                serObj.map.removeLayer(serObj.homeCountryWikiMarkerCG);
                serObj.layerControl.removeLayer(serObj.homeCountryWikiMarkerCG);
            }
            
            if(!serObj.homeCountryCapitalAirportsResultError){
                serObj.map.removeLayer(serObj.homeCountryCapitalAirportsMarkerCG);
                serObj.layerControl.removeLayer(serObj.homeCountryCapitalAirportsMarkerCG);
            }
            
            serObj.map.removeLayer(serObj.homeCountryInfoFG);
            serObj.layerControl.removeLayer(serObj.homeCountryInfoFG);
        }

        

        if(!serObj.edge){
            serObj.map.removeLayer(serObj.countryInfoFG);
            serObj.layerControl.removeLayer(serObj.countryInfoFG);

            if(!serObj.countryEarthquakesResultError){
                serObj.map.removeLayer(serObj.countryEarthquakesMarkerCG);
                serObj.layerControl.removeLayer(serObj.countryEarthquakesMarkerCG);
            }

            if(!serObj.countryWeatherResultError){
                serObj.map.removeLayer(serObj.countryWeatherMarkerCG);
                serObj.layerControl.removeLayer(serObj.countryWeatherMarkerCG);
            }
            
            if(!serObj.countryWikiResultError){
                serObj.map.removeLayer(serObj.countryWikiMarkerCG);
                serObj.layerControl.removeLayer(serObj.countryWikiMarkerCG);
            }

            if(!serObj.countryCapitalAirportsResultError){
                serObj.map.removeLayer(serObj.countryCapitalAirportsMarkerCG);
                serObj.layerControl.removeLayer(serObj.countryCapitalAirportsMarkerCG);
            }
             
        }
        
        
        

        let isoA2 = e.target.options[e.target.selectedIndex].dataset.isoA2;
        let isoA3 = e.target.options[e.target.selectedIndex].dataset.isoA3;

        let callStr, domStr, homeCpt;
        for(let key of serObj.worldInfo.countryInfo.data.content){
            if(key['alpha3Code'] === isoA3){
                callStr = `<span>Country calling code:</span>&nbsp;<span>+${key['callingCodes'][0]}</span>`;
                domStr = `<span>Country top domain level:</span>&nbsp;<span>${key['topLevelDomain'][0]}</span>`;
                homeCpt = key['capital'];
                break;
            }
        }

        const geonamesCountryInfoResult = await phpRequest('geonamesCountryInfo', {country: isoA2});
        let countryCapital = homeCpt;

        let openCageDataPlacenameResult = await phpRequest('openCageData', {placename: countryCapital, first: 0});

        let countryCapitalLat = openCageDataPlacenameResult.data.content.results[0].geometry.lat;
        let countryCapitalLng = openCageDataPlacenameResult.data.content.results[0].geometry.lng;

        countryData = await phpRequest('countryBorders', {index: 3, isoA2: isoA2});

        
        
        let countryName = countryData.data.content[0].properties.name;

        //--------------------- Currency 1 hour cache ----------- START ------------//

        if(!isset(serObj.worldInfo['currency'])){
            let response = await phpRequest('currency');
            serObj.worldInfo['currency'] = response;
        }else if((serObj.worldInfo['currency'].data.content['timestamp'] + 3600) < moment().unix()){
            let response = await phpRequest('currency');
            serObj.worldInfo['currency'] = response;
        }

        //------------------------ Currency 1 hour cache ---------- END ------------//

        await updateWorldinfoCountries(countryCapital, countryCapitalLat, countryCapitalLng, countryName);

        let openCageDataLatLngResult = await phpRequest('openCageData', {lat: countryCapitalLat, lng: countryCapitalLng, first: 1});
        let currencyCode = openCageDataLatLngResult['data']['content']['results'][0]['annotations']['currency'].iso_code;
        let currencyRate = serObj.worldInfo.currency.data.content.rates[currencyCode];
        let currencyBase = serObj.worldInfo.currency.data.content.base;
        let countryFlag = isoA2.toLowerCase();

        

        const countryInfoObj = {
            countryFlag: `<img src="./libs/img/flags/${countryFlag}.svg" alt="Country Flag">`,
            countryString: `<span>Country:</span>&nbsp;<span>${countryName}</span>`, 
            capitalString: `<span>Capital:</span>&nbsp;<span>${countryCapital}</span>`,
            populationString: `<span>Population:</span>&nbsp;<span>${numberWithCommas(geonamesCountryInfoResult.data.content.geonames[0]['population'])}</span>`,
            areaString: `<span>Area (sq. km.):</span>&nbsp;<span>${numberWithCommas(geonamesCountryInfoResult.data.content.geonames[0]['areaInSqKm'])}</span>`,
            currencyString: `<span>1 ${currencyBase}=</span>&nbsp;<span>${numberWithCommas(currencyRate)} ${currencyCode}</span>`,
            dateString: `<span>Today is:</span>&nbsp;<span>${serObj.currentDate}</span>`,
            callingCodeString: callStr,
            domainString: domStr
        }

        populateCountryInfo(countryInfoObj);
        populateWeather(countryCapitalLat, countryCapitalLng);

        /**************************************** COUNTRY INFO  ***************************************/

        serObj.countryMultiPolyline = L.polyline(swapLngLat(countryData.data.content[0].geometry.coordinates), {color:'red'});
        serObj.countryCapitalMarker = L.marker([countryCapitalLat, countryCapitalLng], {icon: serObj.icon.capitalIcon});
        serObj.countryCapitalMarker.bindPopup(`This is ${countryCapital} your country capital `).closePopup();
        
        serObj.countryInfoFG = L.featureGroup();
        serObj.countryInfoFG.addLayer(serObj.countryMultiPolyline);
        serObj.countryInfoFG.addLayer(serObj.countryCapitalMarker);

        serObj.layerControl.addOverlay(serObj.countryInfoFG, "<b>Country Info</b>");

        serObj.countryInfoFG.addTo(serObj.map);

        let countryBoundingBox = {
            north: serObj.countryMultiPolyline.getBounds()['_northEast'].lat,
            south: serObj.countryMultiPolyline.getBounds()['_southWest'].lat,
            east: serObj.countryMultiPolyline.getBounds()['_northEast'].lng,
            west: serObj.countryMultiPolyline.getBounds()['_southWest'].lng
        };

        /************************************* EARTHQUAKES ***************************************************/

        let countryEarthquakesResult = await phpRequest('geonamesEarthquakes', {country: countryBoundingBox, time: moment().format('YYYY-MM-DD')});
        
        let earthquakeToDelete = document.querySelectorAll('.earthquake_item');
        for(let item of earthquakeToDelete){
            $(item).remove();
        }

        $('.earthquake_loader_wrapper').css('display', 'flex');
        $('.lds-default').css('display', 'block');
        $('.earthquake_loader_error').css('display', 'none');
        if(isset(countryEarthquakesResult.data.content['earthquakes'])){
            serObj.countryEarthquakesMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_green-small', medium: 'mycluster_green-medium', normal: 'mycluster_green'});
            serObj.countryEarthquakeMarkerArray = earthquakeMarkerSetting(countryEarthquakesResult, countryData.data.content[0].geometry, serObj.countryEarthquakesMarkerCG, serObj.icon);
            serObj.map.addLayer(serObj.countryEarthquakesMarkerCG);
            serObj.layerControl.addOverlay(serObj.countryEarthquakesMarkerCG, "<b>Earthquake</b>");
    
            serObj.countryEarthquakesResultError = 0;
    
            $('.earthquake_loader_wrapper').addClass('active');
            setTimeout(function(){
                $('.earthquake_loader_wrapper').css('display', 'none');
            }, 1000);
        }else{
            $('.lds-default').css('display', 'none');
            $('.earthquake_loader_error').css('display', 'block');
            serObj.countryEarthquakesResultError = 1;
        }

        /************************************* WEATHER ***************************************************/

        let countryWeatherResult = await phpRequest('geonamesWeather', {country: countryBoundingBox});

        if(isset(countryWeatherResult.data.content['weatherObservations'])){
            serObj.countryWeatherMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_blue-small', medium: 'mycluster_blue-medium', normal: 'mycluster_blue'});
            serObj.countryWeatherMarkerArray = weatherMarkerSetting(countryWeatherResult, countryData.data.content[0].geometry, serObj.countryWeatherMarkerCG, serObj.icon);
            serObj.map.addLayer(serObj.countryWeatherMarkerCG);
            serObj.layerControl.addOverlay(serObj.countryWeatherMarkerCG, "<b>Weather</b>");
    
            serObj.countryWeatherResultError = 0;
        }else{
            serObj.countryWeatherResultError = 1;
            alert('Error to load weather markers');
        }


        /************************************* NEWS ***************************************************/
    
        let countryNewsResult = await phpRequest('rapidWebSearchNews', {country: countryName});

        let newsToDelete = document.querySelectorAll('.news_item');
        for(let item of newsToDelete){
            $(item).remove();
        }

        $('.news_loader_wrapper').css('display', 'flex');
        $('.lds-default').css('display', 'block');
        $('.news_loader_error').css('display', 'none');

        if(isset(countryNewsResult.data.content['value'])){
            newsTabCreator('news', countryNewsResult.data.content.value);
            $('.news_loader_wrapper').addClass('active');
            setTimeout(function(){
                $('.news_loader_wrapper').css('display', 'none');
            }, 1000);
        }else{
            $('.lds-default').css('display', 'none');
            $('.news_loader_error').css('display', 'block');
        }

        /************************************* WIKIPEDIA ***************************************************/

        let countryWikiResult = await phpRequest('geonamesWikipediaBoundingBox', {country: countryBoundingBox});
        
        let wikiToDelete = document.querySelectorAll('.wiki_item');
        for(let item of wikiToDelete){
            $(item).remove();
        }

        $('.wiki_loader_wrapper').css('display', 'flex');
        $('.lds-default').css('display', 'block');
        $('.wiki_loader_error').css('display', 'none');
        if(isset(countryWikiResult.data.content['geonames'])){
            serObj.countryWikiMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_yellow-small', medium: 'mycluster_yellow-medium', normal: 'mycluster_yellow'});
            serObj.countryWikiMarkerArray = wikiMarkerSetting(countryWikiResult, countryData.data.content[0].geometry, serObj.countryWikiMarkerCG, serObj.icon);
            serObj.map.addLayer(serObj.countryWikiMarkerCG);
            serObj.layerControl.addOverlay(serObj.countryWikiMarkerCG, "<b>Wikipedia</b>");

            serObj.countryWikiResultError = 0;

            $('.wiki_loader_wrapper').addClass('active');
            setTimeout(function(){
                $('.wiki_loader_wrapper').css('display', 'none');
            }, 1000);
        }else{
            $('.lds-default').css('display', 'none');
            $('.wiki_loader_error').css('display', 'block');
            serObj.countryWikiResultError = 1;
        }

        /************************************* AIRPORTS ***************************************************/
        
        
        // let countryCapitalAirportsResult = await phpRequest('rapidAirportGuide', {lat: countryCapitalLat, lng: countryCapitalLng, second: 1});
        
        // let airportsToDelete = document.querySelectorAll('.airports_item');
        // for(let item of airportsToDelete){
        //     $(item).remove();
        // }
        
        // $('.airports_loader_wrapper').css('display', 'flex');
        // $('.lds-default').css('display', 'block');
        // $('.airports_loader_error').css('display', 'none');
        // if(countryCapitalAirportsResult.data.content != null){
        //     serObj.countryCapitalAirportsMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_purple-small', medium: 'mycluster_purple-medium', normal: 'mycluster_purple'});
        //     serObj.countryCapitalAirportsMarkerArray = capitalAirportsMarkerSetting(countryCapitalAirportsResult, countryData.data.content[0].geometry, serObj.countryCapitalAirportsMarkerCG, serObj.icon);
        //     serObj.map.addLayer(serObj.countryCapitalAirportsMarkerCG);
        //     serObj.layerControl.addOverlay(serObj.countryCapitalAirportsMarkerCG, "<b>Airports</b>");

        //     serObj.countryCapitalAirportsResultError = 0;

        //     $('.airports_loader_wrapper').addClass('active');
        //     setTimeout(function(){
        //         $('.airports_loader_wrapper').css('display', 'none');
        //     }, 1000);
        // }else{
        //     $('.lds-default').css('display', 'none');
        //     $('.airports_loader_error').css('display', 'block');
        //     serObj.countryCapitalAirportsResultError = 1;
        // }
        
        
        
        serObj.map.fitBounds(serObj.countryInfoFG.getBounds());

        unboundEvents();

        countryBoundEvents();

        

        serObj.edge = 0;

        
    });
});