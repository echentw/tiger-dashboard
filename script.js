updateCurrentTime();
updateETAs();

setInterval(updateETAs, 10 * 1000);
setInterval(updateCurrentTime, 1 * 1000);

function updateETAs() {
  $.ajax({
    url: 'http://webservices.nextbus.com/service/publicXMLFeed?command=predictions&a=sf-muni&stopId=13911',
    success: function(data){
      $('#predictions').empty();

      var predictions = data
        .getElementsByTagName('predictions')[0]
        .getElementsByTagName('direction')[0]
        .getElementsByTagName('prediction');

      for (var i = 0; i < predictions.length; ++i) {
        var elem = predictions[i];
        var timestamp = Number(elem.getAttribute('epochTime'));
        var total_seconds = Number(elem.getAttribute('seconds'));

        var date = new Date(timestamp);
        var eta = date.toLocaleTimeString('en-US')

        var minutes = Math.floor(total_seconds / 60);
        var seconds = total_seconds % 60;

        var display_string = eta + ' (' + minutes + ' min ' + seconds + ' sec)';

        if (i === 0) {
          $('#predictions').append('<div><b>' + display_string + '</b></div>');
        } else {
          $('#predictions').append('<div>' + display_string + '</div>');
        }
      }
    }
  })
}

function updateCurrentTime() {
  var date = new Date();
  $('#current-time').empty();
  $('#current-time').append('<div>' + date.toLocaleTimeString('en-Us') + '</div>');
}
