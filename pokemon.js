//getting the user's location
window.onload = function() {
  var startPos;
  var geoSuccess = function(position) {
    startPos = position;
    var lat = startPos.coords.latitude;
    var long = startPos.coords.longitude;
    getWeather(lat, long);
  };

  var geoError = function(error) {
    alert("Please refresh and enable geolocation! Thanks! 💗");
  };

  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};



//getting weather data from location
var getWeather = function(lat, long) {
  var api = "fe7d570cabe36ab27a2b1292671a6a02";
  var locationUrl = "https://api.darksky.net/forecast/" + api + "/" + lat + "," + long;
  $.ajax({
    url: locationUrl,
    dataType: "jsonp",
    success: function (data) {
          console.log(data);
        var current =  data.minutely.summary;
        updateTemp(data.currently.temperature);
        var icon = data.minutely.icon;
        var text = "Currently, it's " + current.toLowerCase();
        $("#text").html(text);
        var pokemon = whichType(icon);
        setBackground(pokemon);
        pickOne(pokemon.index);
    }
  });
}

//which Pokémon type is suitable
var whichType = function(weather) {
  var options = {
    "cloud" : {index: 3,   type: "flying", self: "cloud"},
    "clear" : {index: 18,   type: "fairy", self: "clear"},
    "rain"  : {index: 12,   type: "grass", self: "rain"},
    "snow"  : {index: 10,   type: "fire", self: "snow"},
    "wind"  : {index: 6,   type: "rock", self: "wind"}
  }

  for (var index in options) {
    if (weather.includes(index)) {
      return options[index];
    }
  }
  //if none matches
  return {index: 1, type: "normal", self: "clear"};
}

var setBackground = function(type) {
  var int = getRandomInt(0, 2);
  if (type.self == "wind") {
    int = 0;
  }

  var src = type.self + int;
  if (src == "snow0" || src == "snow1" || src == "snow2" || src == "cloud0"){
    $('body').css('color', '#333');
    $('#text').css('color', '#333');
    $('#info').css('color', '#333');
  }

  $('body').css('background-image', 'url(assets/' + src + '.jpeg)');
  $('body').css('background-size', '1280px auto');
  $('body').css('background-attachment', 'fixed');
}

//picking a ranodm Pokémon of a particular type
var pickOne = function(type) {
  var url = "https://crossorigin.me/https://pokeapi.co/api/v2/type/" + type;
  $.getJSON(url, function(data) {
    var length = Math.min(data.pokemon.length, 600);
    var index = Math.floor(Math.random() * length);
    var selected = data.pokemon[index].pokemon.url;

    $.getJSON(selected, function(data) {
      var id = data.id;
      var name = data.forms[0].name;
      var text = "You'll do great today with <b>" + name + "</b> by your side 💗"
      $('#info').html(text);
      var sprite = data.sprites.front_default;

      if (sprite == null) {
        for (var i in data.sprites) {
          if (data.sprites[i] != null) {
            sprite = data.sprites[i];
            break;
          }
        }
      }

      if (sprite == null) {
        alert("Sorry, couldn't find an image!")
      }

      //redo this if both no!
      $('html').css('cursor', 'url(' + sprite + '), pointer');
    })
  });
}

var updateTemp = function(temp) {
  // $('#temp').html(temp + " °F");
  var celsius = Math.round((temp -31) * 5 / 9);
  $('#temp').html(celsius + " °C");
}


var getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
