$(function() {

	const addressObject = {
		"Austria": {
			"jenbach": ["zistererbichl", "kirchgasse", "feldgasse", "burgeck"],
			"saalfelden": ["sonnrain", "firnweg", "breithornweg", "bachwinkl"],
			"amstetten": ["oiden", "silberweisring", "neugasse", "sonnleiten"],
			"graz": ["burgring", "murgasse", "griesgasse", "orpheumgasse"]
		},
		"France": {
			"tours": ["Rue Dupuytren", "Rue Pierre de Ronsard", "Rue du Petit Bois", "Rue de Trotbriant"],
			"pau": ["Rue Lasdeveze", "Rue Berlioz", "Rue de la Butte", "Rue Romain Tresarieu"],
			"cannes": ["Rue Joseph Flory", "Rue Sicard", "Rue Jean Gras", "Rue Ricord Laty"],
			"quimper": ["Rue Tredern de Lezerec", "Rue de la République", "Rue de Kerivoal", "Rue de la Terre Noire"]
		},
		"Norway": {
			"kristiansand": ["Valhallagata", "Kuholmsveien", "Kongens gate", "Sleipners vei"],
			"stavanger": ["Marcus Thranes gate", "Hafrsfjordgata", "Lars Vaages gate", "Klinkenberggata"],
			"bergen": ["Pavels vei", "Astrups vei", "Svaneviksveien", "Kanalveien"],
			"tana": ["Skaidiveien", "Lismaveien", "Meieriveien", "Grenvegen"]
		},
		"Poland": {
			"koszalin": ["Harcerska", "Marynarzy", "Franciszkańska", "Bosmańska"],
			"lublin": ["Wyścigowa", "Wyszyńskiego", "Aleja Kraśnicka", "Kazimierza Pułaskiego"],
			"przemyśl": ["Rakoczego", "Bohaterów Getta", "Hugo Kołłątaja", "Gościnna"],
			"katowice": ["Powstańców", "Mikołaja Kopernika", "Wierzbowa", "Bożogrobców"]
		}
	};

	/////////////////// HELPER FUNCTION ///////////////////////////

	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	function populate(elem){
		for(let key in addressObject){
			elem.append("<option value=" + key + ">" + key + "</option>");
		}
	}

	////////////////////////////////////////////////////////////////



	populate($('#agw_country'));

	$('#agw_country').change(function(e){
		$('#agw_country option[selected]').remove();
		$('#agw_city').empty();
		$('#agw_city').append('<option value="" selected>Select a City</option>');
		for(let key in addressObject[$(this).val()]){
			$('#agw_city').append("<option value='" + key.toLowerCase() + "'>" + capitalize(key) + "</option>");
		}
	})

	$('#agw_city').change(function(){
		$('#agw_city option[selected]').remove();
		$('#agw_street').empty();
		$('#agw_street').append('<option value="" selected>Select a Street</option>');
		for(let key of addressObject[$('#agw_country').val()][$(this).val()]){
			$('#agw_street').append("<option value='" + key.toLowerCase() + "'>" + capitalize(key) + "</option>");
		}
	});

	$('#agw_street').change(function(){
		$('#agw_street option[selected]').remove();
	});

	$('#agw_number').change(function(){
		$('#agw_number option[selected]').remove();
	});

    $('.api_box button').click(function(event) {
		let obj = {};
		const target = event.target;
		const test1 = $(target.closest('.api_box')).find("select#agw_country");
		const test2 = $(target.closest('.api_box')).find(".lng_input").children('input#lng_weather');
		const test3 = $(target.closest('.api_box')).find(".lng_input").children('input#lng_time');


		if(test1.length){
			obj['country'] = $('#agw_country').val();
			obj['city'] = $('#agw_city').val();
			obj['street'] = $('#agw_street').val();
			obj['house'] = $('#agw_number').val();
		}else if(test2.length){
			obj['lng_weather'] = $('#lng_weather').val();
			obj['lat_weather'] = $('#lat_weather').val();
		}else if(test3.length){
			obj['lng_time'] = $('#lng_time').val();
			obj['lat_time'] = $('#lat_time').val();
		}

		$.ajax({
			url: "./libs/php/getCountryInfo.php",
			type: 'POST',
			dataType: 'json',
			data: obj,
			success: function(result) {

				if (result.status.name == "ok") {

					switch(result.status.description){
						case "address":
							$('.ag_result_timeElapsed').html(result.status['returnedIn']);
							$('.ag_result_reg').html(result.data.adminName1);
							$('.ag_result_dep').html(result.data.adminName2);
							$('.ag_result_lng').html(result.data.lng);
							$('.ag_result_lat').html(result.data.lat);
							$('.ag_result_cc').html(result.data.countryCode);
							$('.ag_result_pc').html(result.data.postalcode);
							break;
						case "weather":
							$('.ws_result_timeElapsed').html(result.status['returnedIn']);
							$('.ws_result_cloud').html(result.data.clouds);
							$('.ws_result_hum').html(result.data.humidity);
							$('.ws_result_station').html(result.data.stationName);
							$('.ws_result_wind').html(result.data.windDirection);
							break;
						case "time":
							$('.tz_result_timeElapsed').html(result.status['returnedIn']);
							$('.tz_result_sunrise').html(result.data.sunrise);
							$('.tz_result_sunset').html(result.data.sunset);
							$('.tz_result_country').html(result.data.countryName);
							$('.tz_result_local').html(result.data.time);
							break;
					}

					$('.ag_result_reg').html(result.data.continent);
					$('#txtCapital').html(result.data.capital);
					$('#txtLanguages').html(result.data.languages);
					$('#txtPopulation').html(result.data.population);
					$('#txtArea').html(result.data.areaInSqKm);

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
			}
		}); 
	
	});
});	
	
	
	