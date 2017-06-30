var client_id = '5RUHSDHDQZKQZ3OCCAD4Y0IHFTVQDRCCXUWB4PXWKZRJIV0D';
var client_secret = 'NTKYK3KVQDMGPI1E3LHYSAZ3AL1JGENV513SLMKB0LDC3WTD';
var position = {lat: 41.6669036,lng: -0.8846575};
var styles = [
		{
			"elementType": "labels",
			"stylers": [
				{
					"visibility": "off"
				},
				{
					"color": "#f49f53"
				}
			]
		},
		{
			"featureType": "landscape",
			"stylers": [
				{
					"color": "#f9ddc5"
				},
				{
					"lightness": -7
				}
			]
		},
		{
			"featureType": "road",
			"stylers": [
				{
					"color": "#813033"
				},
				{
					"lightness": 43
				}
			]
		},
		{
			"featureType": "poi.business",
			"stylers": [
				{
					"color": "#645c20"
				},
				{
					"lightness": 38
				}
			]
		},
		{
			"featureType": "water",
			"stylers": [
				{
					"color": "#1994bf"
				},
				{
					"saturation": -69
				},
				{
					"gamma": 0.99
				},
				{
					"lightness": 43
				}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#f19f53"
				},
				{
					"weight": 1.3
				},
				{
					"visibility": "on"
				},
				{
					"lightness": 16
				}
			]
		},
		{
			"featureType": "poi.business"
		},
		{
			"featureType": "poi.park",
			"stylers": [
				{
					"color": "#645c20"
				},
				{
					"lightness": 39
				}
			]
		},
		{
			"featureType": "poi.school",
			"stylers": [
				{
					"color": "#a95521"
				},
				{
					"lightness": 35
				}
			]
		},
		{},
		{
			"featureType": "poi.medical",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#813033"
				},
				{
					"lightness": 38
				},
				{
					"visibility": "off"
				}
			]
		},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{
			"elementType": "labels"
		},
		{
			"featureType": "poi.sports_complex",
			"stylers": [
				{
					"color": "#9e5916"
				},
				{
					"lightness": 32
				}
			]
		},
		{},
		{
			"featureType": "poi.government",
			"stylers": [
				{
					"color": "#9e5916"
				},
				{
					"lightness": 46
				}
			]
		},
		{
			"featureType": "transit.station",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		},
		{
			"featureType": "transit.line",
			"stylers": [
				{
					"color": "#813033"
				},
				{
					"lightness": 22
				}
			]
		},
		{
			"featureType": "transit",
			"stylers": [
				{
					"lightness": 38
				}
			]
		},
		{
			"featureType": "road.local",
			"elementType": "geometry.stroke",
			"stylers": [
				{
					"color": "#f19f53"
				},
				{
					"lightness": -10
				}
			]
		},
		{},
		{},
		{}
	];
var Place = function(data, map){
	var self = this;
	this.name = ko.observable(data.name);
	this.location = ko.observable({lat: data.location.lat,lng: data.location.lng});
	var icon = data.categories[0]?data.categories[0].icon.prefix + 'bg_32' + data.categories[0].icon.suffix:'https://ss3.4sqi.net/img/categories_v2/building/default_bg_32.png';
	console.log(icon);
	this.marker = new google.maps.Marker({
		position: self.location(),
		map: map,
		icon: icon,
		title: self.name()
	});
	this.infowindow = new google.maps.InfoWindow({
		content: '<div class="info-window"><strong>'+data.name+'</strong><br/>'+data.location.address+'</div>'
	});
	this.marker.addListener('click',function(){
		self.infowindow.open(map, self.marker);
	});
	this.openInfo = function(){
		self.infowindow.open(map, self.marker);
	}
}
var ViewModel = function() {
	var self = this;
	this.showSidebar = ko.observable(0);
	this.query = ko.observable("");
	this.placeList = ko.observableArray([]);

	this.toogleSidebar = function(){		
		console.log("click");
		self.showSidebar(self.showSidebar()?0:1);
	}
	this.findPlaces = function(){
		var url = 'https://api.foursquare.com/v2/venues/search?v=20161016&ll='+position.lat+'%2C%20'+position.lng+'&query='+self.query()+'&intent=checkin&client_id='+client_id+'&client_secret='+client_secret;
		console.log(url);
		$.getJSON(url, function(data) { 
			if(data.meta.code==200){
				self.clearMarkers();
				data.response.venues.forEach(function(locationItem){
					self.placeList.push(new Place(locationItem, map));
				});
			} 
		});
	}
	this.clearMarkers = function(){
		self.placeList().forEach(function(item){
			item.marker.setMap(null);
		});
		self.placeList.removeAll();
	}
	this.findPlaces();
}
ko.applyBindings(new ViewModel());

var map;
function initMap() { 
	map = new google.maps.Map(document.getElementById('map'),{
		center: position,
		styles: styles,
		zoom: 15
	});
}