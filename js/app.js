var client_id = '5RUHSDHDQZKQZ3OCCAD4Y0IHFTVQDRCCXUWB4PXWKZRJIV0D';
var client_secret = 'NTKYK3KVQDMGPI1E3LHYSAZ3AL1JGENV513SLMKB0LDC3WTD';
var position = {lat: 41.6669036,lng: -0.8846575};

var Place = function(data, map){
	var self = this;
	this.name = ko.observable(data.name);
	this.location = ko.observable({lat: data.location.lat,lng: data.location.lng});
	this.visible = ko.observable(1);
	this.address = ko.observable(data.location.formattedAddress);

	var icon = data.categories[0]?data.categories[0].icon.prefix + 'bg_32' + data.categories[0].icon.suffix:'https://ss3.4sqi.net/img/categories_v2/building/default_bg_32.png';
	this.marker = new google.maps.Marker({
		position: self.location(),
		map: map,
		icon: icon,
		animation: google.maps.Animation.DROP,
		title: self.name()
	});
	this.marker.addListener('click',function(){
		viewModel.openInfo(self);
	});
	this.openInfo = function(){
		viewModel.openInfo(self);
	};

};
var ViewModel = function() {
	var self = this;
	this.showSidebar = ko.observable(0);
	this.query = ko.observable("");
	this.notifierText = ko.observable("");
	this.notifier = ko.observable(0);
	this.placeList = ko.observableArray([]);
	this.currentPlace = null;

	this.toogleSidebar = function(){
		self.showSidebar(self.showSidebar()?0:1);
		setTimeout(function(){
			google.maps.event.trigger(map, 'resize');
		}, 1000);
		
	};

	this.showNotification = function(message){
		self.notifier(1);
		self.notifierText(message);
		setTimeout(function(){
			self.notifier(0);
		}, 5000);
		
	};

	this.findPlaces = function(){
		var url = 'https://api.foursquare.com/v2/venues/search?v=20161016&ll='+position.lat+
			'%2C%20'+position.lng+'&q=&intent=checkin&client_id='+client_id+'&client_secret='+
			client_secret;
		$.getJSON(url, function(data) { 
			if(data.meta.code==200){
				console.log(JSON.stringify(data));
				data.response.venues.forEach(function(locationItem){
					self.placeList.push(new Place(locationItem, map));
				});
			} 
			else{
				alert("Cannot access API to download place info.");
			}
		}).fail(function(error){
			self.showNotification("Error calling Foursquare API");
		});
	};

	this.filterPlaces = function(){
		self.placeList().forEach(function(item){
			if(item.name().indexOf(self.query()) !== -1){
				item.visible(1);
				item.marker.setMap(map);
			}
			else{
				item.visible(0);
				item.marker.setMap(null);
				self.infowindow.close();
			}
		});
	};

	this.openInfo = function(place){
		if (self.currentPlace) {
			self.currentPlace.marker.setAnimation(null);
		}
		self.infowindow.setContent('<div class="info-window"><strong>'+place.name()+'</strong><br/>'+place.address()+'</div>');
		self.infowindow.open(map, place.marker);
		place.marker.setAnimation(google.maps.Animation.BOUNCE);
		self.currentPlace = place;
	};
};

var viewModel = new ViewModel();
ko.applyBindings(viewModel);

var map;
function initMap() {
	var style = loadStyle(function(styles){
			map = new google.maps.Map(document.getElementById('map'),{
			center: position,
			styles: styles,
			zoom: 15
		});
		viewModel.infowindow = new google.maps.InfoWindow({
			content: ''
		});
		viewModel.infowindow.addListener('closeclick',function(){
			viewModel.currentPlace.marker.setAnimation(null);
			viewModel.currentPlace = null;
		});
		viewModel.findPlaces();
	});
	
}

function handleAPIError() {
	viewModel.showNotification("Error loading Google Maps Javascript API");
}
function loadStyle(callback){
	var url = 'css/mapStyle.json';
	$.getJSON(url, function(data) {
		callback(data.styles);
	}).fail(function(error){
		viewModel.showNotification("Error loading map style");
	});
}