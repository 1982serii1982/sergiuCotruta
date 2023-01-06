
(async function(){

    ////////////////-------------------------------------//////////////////////

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

    serObj.edge = 0;
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

    serObj.geoJson = await getCountryBorders();

    //--------------------------------------------------------------------//

    let homeCountryData = latLngToCountryData(serObj.homeLat, serObj.homeLon, serObj.geoJson);
    if(homeCountryData.errorCode){
        alert(homeCountryData.errorMessage);
        throw new Error('There is a error with country borders defined in countryBorders json file');
    }
    

    if(!isset(serObj.worldInfo['countryInfo'])){
        let response = await phpRequest('restCountries');
        serObj.worldInfo['countryInfo'] = response;
     }

    
    //-----------------------------------------------------------------------//


    const geonamesCountryInfoResult = await phpRequest('geonamesCountryInfo', {country: homeCountryData.countryProperties['iso_a2']});
    if(geonamesCountryInfoResult.status.code === '200'){
        $('.search_loader_wrapper').css('display', 'none');
    }


    const homeCountryName = homeCountryData.countryProperties.name;
    const homeCountryCapital = geonamesCountryInfoResult.data.content.geonames[0]['capital'];


    //--------------------- Currency 1 hour cache ----------- START ------------//
    if(!isset(serObj.worldInfo['currency'])){
        let response = await phpRequest('currency');
        serObj.worldInfo['currency'] = response;
    }else if((serObj.worldInfo['currency'].data.content['timestamp'] + 3600) < moment().unix()){
        let response = await phpRequest('currency');
        serObj.worldInfo['currency'] = response;
    }
    //----------------------------- END ------------------------------------//

    

    await updateWorldinfoCountries(homeCountryCapital, serObj.homeLat, serObj.homeLon, homeCountryName);
    

    

    
    
    let currencyCode = serObj.worldInfo.countries[homeCountryName].currency.iso_code;
    let currencyRate = serObj.worldInfo.currency.data.content.rates[currencyCode];
    let currencyBase = serObj.worldInfo.currency.data.content.base;
    let homeCountryCapitalLat = serObj.worldInfo.countries[homeCountryName].capital.geometry.lat;
    let homeCountryCapitalLng = serObj.worldInfo.countries[homeCountryName].capital.geometry.lng;
    let countryFlag = homeCountryData.countryProperties['iso_a2'].toLowerCase();

    let callStr, domStr;
    for(let key of serObj.worldInfo.countryInfo.data.content){
        if(key['alpha3Code'] === homeCountryData.countryProperties['iso_a3']){
            callStr = `<span>Country calling code:</span>&nbsp;<span>+${key['callingCodes'][0]}</span>`;
            domStr = `<span>Country top domain level:</span>&nbsp;<span>${key['topLevelDomain'][0]}</span>`;
            break;
        }
    }

    const countryInfoObj = {
        countryFlag: `<img src="./libs/img/flags/${countryFlag}.svg" alt="Country Flag">`,
        countryString: `<span>Country:</span>&nbsp;<span>${homeCountryName}</span>`, 
        capitalString: `<span>Capital:</span>&nbsp;<span>${homeCountryCapital}</span>`,
        populationString: `<span>Population:</span>&nbsp;<span>${geonamesCountryInfoResult.data.content.geonames[0]['population']}</span>`,
        areaString: `<span>Area (sq. km.):</span>&nbsp;<span>${geonamesCountryInfoResult.data.content.geonames[0]['areaInSqKm']}</span>`,
        currencyString: `<span>1 ${currencyBase}=</span>&nbsp;<span>${currencyRate} ${currencyCode}</span>`,
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

   
    /************************** EASY BUTTON ************************************************************/

    L.easyButton('fa-solid fa-location-crosshairs fa-beat', function(){
        let customerLocationMarker = L.marker([serObj.homeLat, serObj.homeLon], {icon: serObj.icon.customerIcon});
        customerLocationMarker.bindPopup(`<b>lat${serObj.homeLat}</b><br>long${serObj.homeLon}<br>You are in ${homeCountryData.countryProperties.name}`).closePopup();
        customerLocationMarker.addTo(serObj.map);
        serObj.map.flyTo([serObj.homeLat, serObj.homeLon], 10);
    }).addTo(serObj.map);

    /************************** COUNTRY INFO ************************************************************/

    let homeCountryMultiPolyline = L.polyline(swapLngLat(homeCountryData.countryGeometry.coordinates), {color:'red'});

    let customerLocationMarker = L.marker([serObj.homeLat, serObj.homeLon], {icon: serObj.icon.customerIcon});
    customerLocationMarker.bindPopup(`<b>lat${serObj.homeLat}</b><br>long${serObj.homeLon}<br>You are in ${homeCountryData.countryProperties.name}`).closePopup();
    
    let homeCountryCapitalMarker = L.marker([homeCountryCapitalLat, homeCountryCapitalLng], {icon: serObj.icon.capitalIcon});
    homeCountryCapitalMarker.bindPopup(`This is ${homeCountryCapital} your country capital `).closePopup();


    serObj.homeCountryInfoFG = L.featureGroup();
    serObj.homeCountryInfoFG.addLayer(homeCountryMultiPolyline);
    serObj.homeCountryInfoFG.addLayer(customerLocationMarker);
    serObj.homeCountryInfoFG.addLayer(homeCountryCapitalMarker);
    serObj.homeCountryInfoFG.addTo(serObj.map);
    serObj.map.flyToBounds(serObj.homeCountryInfoFG.getBounds());

    
    $('#countryInfoBox').prop('disabled', false);
    $('#countryInfoBox1').prop('disabled', false);

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
        $('#earthquakeBox').prop('disabled', false);
        $('#earthquakeBox1').prop('disabled', false);
        serObj.homeCountryEarthquakesMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_green-small', medium: 'mycluster_green-medium', normal: 'mycluster_green'});
        serObj.earthquakeMarkerArray = earthquakeMarkerSetting(homeCountryEarthquakesResult, homeCountryData, serObj.homeCountryEarthquakesMarkerCG, {currentIcon: serObj.icon.currentIcon, greenIcon: serObj.icon.greenIcon});
        serObj.map.addLayer(serObj.homeCountryEarthquakesMarkerCG);

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
        $('#weatherBox').prop('disabled', false);
        $('#weatherBox1').prop('disabled', false);
        serObj.homeCountryWeatherMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_blue-small', medium: 'mycluster_blue-medium', normal: 'mycluster_blue'});
        serObj.weatherMarkerArray = weatherMarkerSetting(homeCountryWeatherResult, homeCountryData, serObj.homeCountryWeatherMarkerCG, {currentIcon: serObj.icon.currentIcon, blueIcon: serObj.icon.blueIcon});
        serObj.map.addLayer(serObj.homeCountryWeatherMarkerCG);

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
        $('#wikipediaBox').prop('disabled', false);
        $('#wikipediaBox1').prop('disabled', false);

        serObj.homeCountryWikiMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_yellow-small', medium: 'mycluster_yellow-medium', normal: 'mycluster_yellow'});
        serObj.wikiMarkerArray = wikiMarkerSetting(homeCountryWikiResult, homeCountryData, serObj.homeCountryWikiMarkerCG, {currentIcon: serObj.icon.currentIcon, yellowIcon: serObj.icon.yellowIcon});
        serObj.map.addLayer(serObj.homeCountryWikiMarkerCG);

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
    

    let homeCountryCapitalAirportsResult = await phpRequest('rapidAirportGuide', {lat: homeCountryCapitalLat, lng: homeCountryCapitalLng, second: 1});
    
    let airportsToDelete = document.querySelectorAll('.airports_item');
    for(let item of airportsToDelete){
        $(item).remove();
    }

    $('.airports_loader_wrapper').css('display', 'flex');
    $('.lds-default').css('display', 'block');
    $('.airports_loader_error').css('display', 'none');
    if(homeCountryCapitalAirportsResult.data.content != null){
        $('#airportsBox').prop('disabled', false);
        $('#airportsBox1').prop('disabled', false);

        serObj.homeCountryCapitalAirportsMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_purple-small', medium: 'mycluster_purple-medium', normal: 'mycluster_purple'});
        serObj.capitalAirportsMarkerArray = capitalAirportsMarkerSetting(homeCountryCapitalAirportsResult, homeCountryData, serObj.homeCountryCapitalAirportsMarkerCG, {currentIcon: serObj.icon.currentIcon, purpleIcon: serObj.icon.purpleIcon});
        serObj.map.addLayer(serObj.homeCountryCapitalAirportsMarkerCG);

        serObj.homeCountryCapitalAirportsResultError = 0;

        $('.airports_loader_wrapper').addClass('active');
        setTimeout(function(){
            $('.airports_loader_wrapper').css('display', 'none');
        }, 1000);
    }else{
        $('.lds-default').css('display', 'none');
        $('.airports_loader_error').css('display', 'block');
    }

    setTimeout(function(){
        $('.preloader').css('display', 'none');
    },3000);
    
    /********************************** BOUND EVENTS ************************************************** */ 
    
    homeCountryBoundEvents();





    $(document).ready(function () {
        

        stringify('worldInfo', serObj.worldInfo);

    });

})();



$(document).ready(function () {

    

    $('.header_select').on('change', async function(e){

        disableCheckbox();

        if(!serObj.edge){
            if(!serObj.homeCountryEarthquakesResultError){
                serObj.map.removeLayer(serObj.homeCountryEarthquakesMarkerCG);
            }

            if(!serObj.homeCountryWeatherResultError){
                serObj.map.removeLayer(serObj.homeCountryWeatherMarkerCG);
            }
            
            if(!serObj.homeCountryWikiResultError){
                serObj.map.removeLayer(serObj.homeCountryWikiMarkerCG);
            }
            
            if(!serObj.homeCountryCapitalAirportsResultError){
                serObj.map.removeLayer(serObj.homeCountryCapitalAirportsMarkerCG);
            }
            
            serObj.map.removeLayer(serObj.homeCountryInfoFG);
        }

        

        if(serObj.edge){
            serObj.map.removeLayer(serObj.countryInfoFG);

            if(!serObj.countryEarthquakesResultError){
                serObj.map.removeLayer(serObj.countryEarthquakesMarkerCG);
            }

            if(!serObj.countryWeatherResultError){
                serObj.map.removeLayer(serObj.countryWeatherMarkerCG);
            }
            
            if(!serObj.countryWikiResultError){
                serObj.map.removeLayer(serObj.countryWikiMarkerCG);
            }

            if(!serObj.countryCapitalAirportsResultError){
                serObj.map.removeLayer(serObj.countryCapitalAirportsMarkerCG);
            }
             
        }
        
        
        

        let isoA2 = e.target.options[e.target.selectedIndex].dataset.isoA2;
        const geonamesCountryInfoResult = await phpRequest('geonamesCountryInfo', {country: isoA2});
        const countryCapital = geonamesCountryInfoResult.data.content.geonames[0]['capital'];

        let openCageDataPlacenameResult = await phpRequest('openCageData', {placename: countryCapital, first: 0});

        let countryCapitalLat = openCageDataPlacenameResult.data.content.results[0].geometry.lat;
        let countryCapitalLng = openCageDataPlacenameResult.data.content.results[0].geometry.lng;

        let countryData = latLngToCountryData(countryCapitalLat, countryCapitalLng, serObj.geoJson);
        if(countryData.errorCode){
            alert(countryData.errorMessage);
            throw new Error('There is a error with country borders defined in countryBorders json file');
        }
        
        let countryName = countryData.countryProperties.name;

        //--------------------- Currency 1 hour cache ----------- START ------------//

        if(!isset(serObj.worldInfo['currency'])){
            let response = await phpRequest('currency');
            serObj.worldInfo['currency'] = response;
        }else if((serObj.worldInfo['currency'].data.content['timestamp'] + 3600) < moment().unix()){
            let response = await phpRequest('currency');
            serObj.worldInfo['currency'] = response;
        }

        //-------------------------------------------------------- END ------------//

        await updateWorldinfoCountries(countryCapital, countryCapitalLat, countryCapitalLng, countryName);

        let openCageDataLatLngResult = await phpRequest('openCageData', {lat: countryCapitalLat, lng: countryCapitalLng, first: 1});
        let currencyCode = openCageDataLatLngResult['data']['content']['results'][0]['annotations']['currency'].iso_code;
        let currencyRate = serObj.worldInfo.currency.data.content.rates[currencyCode];
        let currencyBase = serObj.worldInfo.currency.data.content.base;
        let countryFlag = countryData.countryProperties['iso_a2'].toLowerCase();

        let callStr, domStr;
        for(let key of serObj.worldInfo.countryInfo.data.content){
            if(key['alpha3Code'] === countryData.countryProperties['iso_a3']){
                callStr = `<span>Country calling code:</span>&nbsp;<span>+${key['callingCodes'][0]}</span>`;
                domStr = `<span>Country top domain level:</span>&nbsp;<span>${key['topLevelDomain'][0]}</span>`;
                break;
            }
        }

        const countryInfoObj = {
            countryFlag: `<img src="./libs/img/flags/${countryFlag}.svg" alt="Country Flag">`,
            countryString: `<span>Country:</span>&nbsp;<span>${countryName}</span>`, 
            capitalString: `<span>Capital:</span>&nbsp;<span>${countryCapital}</span>`,
            populationString: `<span>Population:</span>&nbsp;<span>${geonamesCountryInfoResult.data.content.geonames[0]['population']}</span>`,
            areaString: `<span>Area (sq. km.):</span>&nbsp;<span>${geonamesCountryInfoResult.data.content.geonames[0]['areaInSqKm']}</span>`,
            currencyString: `<span>1 ${currencyBase}=</span>&nbsp;<span>${currencyRate} ${currencyCode}</span>`,
            dateString: `<span>Today is:</span>&nbsp;<span>${serObj.currentDate}</span>`,
            callingCodeString: callStr,
            domainString: domStr
        }

        populateCountryInfo(countryInfoObj);
        populateWeather(countryCapitalLat, countryCapitalLng);

        /**************************************** COUNTRY INFO  ***************************************/

        serObj.countryMultiPolyline = L.polyline(swapLngLat(countryData.countryGeometry.coordinates), {color:'red'});
        serObj.countryCapitalMarker = L.marker([countryCapitalLat, countryCapitalLng], {icon: serObj.icon.capitalIcon});
        serObj.countryCapitalMarker.bindPopup(`This is ${countryCapital} your country capital `).closePopup();
        
        serObj.countryInfoFG = L.featureGroup();
        serObj.countryInfoFG.addLayer(serObj.countryMultiPolyline);
        serObj.countryInfoFG.addLayer(serObj.countryCapitalMarker);
        serObj.countryInfoFG.addTo(serObj.map);

        let countryBoundingBox = {
            north: serObj.countryMultiPolyline.getBounds()['_northEast'].lat,
            south: serObj.countryMultiPolyline.getBounds()['_southWest'].lat,
            east: serObj.countryMultiPolyline.getBounds()['_northEast'].lng,
            west: serObj.countryMultiPolyline.getBounds()['_southWest'].lng
        };

        $('#countryInfoBox').prop('disabled', false);
        $('#countryInfoBox1').prop('disabled', false);

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
            $('#earthquakeBox').prop('disabled', false);
            $('#earthquakeBox1').prop('disabled', false);
            serObj.countryEarthquakesMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_green-small', medium: 'mycluster_green-medium', normal: 'mycluster_green'});
            serObj.countryEarthquakeMarkerArray = earthquakeMarkerSetting(countryEarthquakesResult, countryData, serObj.countryEarthquakesMarkerCG, {currentIcon: serObj.icon.currentIcon, greenIcon: serObj.icon.greenIcon});
            serObj.map.addLayer(serObj.countryEarthquakesMarkerCG);
    
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
            $('#weatherBox').prop('disabled', false);
            $('#weatherBox1').prop('disabled', false);
            serObj.countryWeatherMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_blue-small', medium: 'mycluster_blue-medium', normal: 'mycluster_blue'});
            serObj.weatherMarkerArray = weatherMarkerSetting(countryWeatherResult, countryData, serObj.countryWeatherMarkerCG, {currentIcon: serObj.icon.currentIcon, blueIcon: serObj.icon.blueIcon});
            serObj.map.addLayer(serObj.countryWeatherMarkerCG);
    
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
            $('#wikipediaBox').prop('disabled', false);
            $('#wikipediaBox1').prop('disabled', false);

            serObj.countryWikiMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_yellow-small', medium: 'mycluster_yellow-medium', normal: 'mycluster_yellow'});
            serObj.countryWikiMarkerArray = wikiMarkerSetting(countryWikiResult, countryData, serObj.countryWikiMarkerCG, {currentIcon: serObj.icon.currentIcon, yellowIcon: serObj.icon.yellowIcon});
            serObj.map.addLayer(serObj.countryWikiMarkerCG);

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
        
        
        let countryCapitalAirportsResult = await phpRequest('rapidAirportGuide', {lat: countryCapitalLat, lng: countryCapitalLng, second: 1});
        
        let airportsToDelete = document.querySelectorAll('.airports_item');
        for(let item of airportsToDelete){
            $(item).remove();
        }
        
        $('.airports_loader_wrapper').css('display', 'flex');
        $('.lds-default').css('display', 'block');
        $('.airports_loader_error').css('display', 'none');
        if(countryCapitalAirportsResult.data.content != null){
            $('#airportsBox').prop('disabled', false);
            $('#airportsBox1').prop('disabled', false);

            serObj.countryCapitalAirportsMarkerCG = markerCGCreator({lowLimit: 10, highLimit: 100, small: 'mycluster_purple-small', medium: 'mycluster_purple-medium', normal: 'mycluster_purple'});
            serObj.countryCapitalAirportsMarkerArray = capitalAirportsMarkerSetting(countryCapitalAirportsResult, countryData, serObj.countryCapitalAirportsMarkerCG, {currentIcon: serObj.icon.currentIcon, purpleIcon: serObj.icon.purpleIcon});
            serObj.map.addLayer(serObj.countryCapitalAirportsMarkerCG);

            serObj.countryCapitalAirportsResultError = 0;

            $('.airports_loader_wrapper').addClass('active');
            setTimeout(function(){
                $('.airports_loader_wrapper').css('display', 'none');
            }, 1000);
        }else{
            $('.lds-default').css('display', 'none');
            $('.airports_loader_error').css('display', 'block');
            serObj.countryCapitalAirportsResultError = 1;
        }
        
        
        
        serObj.map.flyToBounds(serObj.countryInfoFG.getBounds());

        unboundEvents();

        countryBoundEvents();

        

        serObj.edge = 1;

        
    });

    
    
});