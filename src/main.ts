import * as $ from 'jquery';
import { Model, ETA, NLineData } from './model';

import './style.scss';

function main() {
  updateCurrentTime();
  updateETAs();
  updateWeather();

  setInterval(updateCurrentTime, 1 * 1000); // every second
  setInterval(updateETAs, 10 * 1000); // every 10 seconds
  setInterval(updateWeather, 2 * 60 * 60 * 1000); // every 2 hours

  blinkArrow();
}

async function updateETAs() {
  const data: NLineData = await Model.getNLineETAs();

  const predictions = data.NOwl.predictions;

  for (let i = 0; i < Math.min(3, predictions.length); ++i) {
    const eta = predictions[i];

    const absoluteTimeString: string = new Date(eta.absoluteTimeSeconds).toLocaleTimeString('en-US');

    const minutes = Math.floor(eta.relativeTimeSeconds / 60.0);
    const seconds = Math.floor(eta.relativeTimeSeconds % 60);

    const displayString = `${absoluteTimeString} (${minutes} min ${seconds} sec)`;
    if (i === 0) {
      $('#predictions').append(`<div id="prediction"><b>${displayString}</b></div>`);
    } else {
      $('#predictions').append(`<div id="prediction">${displayString}</div>`);
    }
  }
  if (predictions.length < 3) {
    for (var i = 0; i < 3 - predictions.length; ++i) {
      $('#predictions').append('<div id="prediction" style="color: white">you cant see me</div>');
    }
  }
}

function updateCurrentTime() {
  var date = new Date();
  $('#current-time').empty();
  $('#current-time').append(`<div>${Model.getCurrentTime()}</div>`);
}

function updateWeather() {
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?id=5391959&APPID=2aff0e5cbbfc2c468be071ac2aa778f4',
    success: function(data: any) {
      $('#today-weather').empty();

      var description = data['weather'][0]['description'];
      var tempKelvin = Number(data['main']['temp']);
      var tempFahrenheit = Math.round(tempKelvin * 9.0 / 5.0 - 459.67);
      var tempCelsius = Math.round(tempKelvin - 273.15);

      var date = new Date();
      var dayOfWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
      ][ date.getDay() ];

      $('#today-weather').append('<div>' + dayOfWeek + ', ' + date.toLocaleDateString() + '</div>');
      $('#today-weather').append('<div>' + description + '</div>');
      $('#today-weather').append(
        '<div>' + String(tempFahrenheit) + '&deg;F / ' + String(tempCelsius) + '&deg;C</div>'
      );
    },
  });
}

function blinkArrow() {
  setInterval(function() {
    $('i').hide();
    setTimeout(function() {
      $('i').show();
    }, 800);
  }, 2000);
}

main();
