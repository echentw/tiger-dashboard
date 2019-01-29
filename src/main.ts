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
}

async function updateETAs() {
  const data: NLineData = await Model.getNLineETAs();

  const container = $('.n-judah-etas-container');

  container.empty();

  const predictions = data.NJudah.predictions;

  for (let i = 0; i < Math.min(5, predictions.length); ++i) {
    const eta = predictions[i];

    const absoluteTimeString: string = new Date(eta.absoluteTimeSeconds).toLocaleTimeString('en-US');

    const minutes = Math.floor(eta.relativeTimeSeconds / 60.0);
    const seconds = Math.floor(eta.relativeTimeSeconds % 60);

    const displayString = `${absoluteTimeString} (${minutes} min ${seconds} sec)`;
    if (i === 0) {
      container.append(`<div class="n-judah-eta text heavy">${displayString}</div>`);
    } else {
      container.append(`<div class="n-judah-eta text">${displayString}</div>`);
    }
  }
}

function updateCurrentTime() {
  var date = new Date();
  $('.time-container').empty();
  $('.time-container').append(`${Model.getCurrentTime()}`);
}

function updateWeather() {
  $.ajax({
    url: 'http://api.openweathermap.org/data/2.5/weather?id=5391959&APPID=2aff0e5cbbfc2c468be071ac2aa778f4',
    success: function(data: any) {
      const dateContainer = $('.date-container');
      const forecastContainer = $('.forecast-container');
      const temperatureContainer = $('.temperature-container');

      dateContainer.empty();
      forecastContainer.empty();
      temperatureContainer.empty();

      const description = data['weather'][0]['description'];
      const tempKelvin = Number(data['main']['temp']);
      const tempFahrenheit = Math.round(tempKelvin * 9.0 / 5.0 - 459.67);
      const tempCelsius = Math.round(tempKelvin - 273.15);

      const date = new Date();
      const dayOfWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
      ][ date.getDay() ];

      dateContainer.append(`${dayOfWeek}, ${date.toLocaleDateString()}`);
      forecastContainer.append(description);
      temperatureContainer.append(`${tempFahrenheit} &deg;F / ${tempCelsius} &deg;C`);
    },
  });
}

main();
