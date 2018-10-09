updateCurrentTime();
updateETAs();
// updateWeather();

actuallyUpdateWeather(SF_WEATHER);
// updateWeather();

setInterval(updateCurrentTime, 1 * 1000); // every second
setInterval(updateETAs, 10 * 1000); // every 10 seconds
setInterval(updateWeather, 2 * 60 * 60 * 1000); // every 2 hours

blinkArrow();

function updateETAs() {
  $.ajax({
    url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=13911',
    success: function(data){
      $('#predictions').empty();

      var predictions = data
        .getElementsByTagName('predictions')[0]
        .getElementsByTagName('direction')[0]
        .getElementsByTagName('prediction');

      for (var i = 0; i < Math.min(3, predictions.length); ++i) {
        var elem = predictions[i];
        var timestamp = Number(elem.getAttribute('epochTime'));
        var total_seconds = Number(elem.getAttribute('seconds'));

        var date = new Date(timestamp);
        var eta = date.toLocaleTimeString('en-US')

        var minutes = Math.floor(total_seconds / 60);
        var seconds = total_seconds % 60;

        var display_string = eta + ' (' + minutes + ' min ' + seconds + ' sec)';

        if (i === 0) {
          $('#predictions').append('<div id="prediction"><b>' + display_string + '</b></div>');
        } else {
          $('#predictions').append('<div id="prediction">' + display_string + '</div>');
        }
      }

      if (predictions.length < 3) {
        for (var i = 0; i < 3 - predictions.length; ++i) {
          $('#predictions').append('<div id="prediction" style="color: white">you cant see me</div>');
        }
      }
    }
  });
}

function updateCurrentTime() {
  var date = new Date();
  $('#current-time').empty();
  $('#current-time').append('<div>' + date.toLocaleTimeString('en-Us') + '</div>');
}

function updateWeather() {
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?id=5391959&APPID=2aff0e5cbbfc2c468be071ac2aa778f4',
    success: function(data) {
      actuallyUpdateWeather(data);
    },
  });
}

function actuallyUpdateWeather(data) {
  $('#today-weather').empty();

  var description = data['weather'][0]['description'];
  var tempKelvin = Number(data['main']['temp']);
  var tempFahrenheit = Math.round(tempKelvin * 9.0 / 5.0 - 459.67);

  var date = new Date();
  var dayOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ][ date.getUTCDay() ];

  $('#today-weather').append('<div>' + dayOfWeek + ', ' + date.toLocaleDateString() + '</div>');
  $('#today-weather').append('<div>' + description + '</div>');
  $('#today-weather').append('<div>' + String(tempFahrenheit) + '&deg;F</div>');
}

function blinkArrow() {
  setInterval(function() {
    $('i').hide();
    setTimeout(function() {
      $('i').show();
    }, 800);
  }, 2000);
}
