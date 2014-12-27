var origTimezone = jstz.determine().name();

var initialTimes = ["Europe/Madrid", "Asia/Tokyo", "Asia/Calcutta", "Africa/Cairo", "America/Argentina/Buenos_Aires"];
var destTimezone = initialTimes[Math.floor(Math.random()*5)];
var selectedTime = moment();
var now = true;

function reinterpretMoment (m, tz) {
  var arr = [m.year(), m.month(), m.date(), m.hour(), m.minute()];
  return moment.tz(arr, tz);
}

function setTime (m) {
  selectedTime = reinterpretMoment(m, origTimezone);
  updateTime();
}

function updateTime () {
  var momentWithTZ = selectedTime.clone();
  momentWithTZ.tz(destTimezone);
  $('#output').text(momentWithTZ.format('LT'));
}

function pickerChange (event, from) {
  setTime(event.date);
  $('#nowcheck').prop('checked', false);
}

function nowChange (event) {
  if (event.target.checked) {
    selectedTime = moment();
    updateTime();
    $('#timepicker').data("DateTimePicker").setDate(selectedTime);
    $('#nowcheck').prop('checked', true);
    now = true;
  }
}

function tzChange (event) {
  destTimezone = this.value;
  updateTime();
}

$(function() {
  var picker = $('#timepicker');
  picker.datetimepicker({
    minuteStepping: 15,
    defaultDate: moment(),
    pickDate: false
  });

  picker.on("dp.change", pickerChange);

  var destSelect = $('#destTimezone');

  destSelect.change(tzChange)

  $('#nowcheck').change(nowChange);

  $.getJSON('/data/tz.json', function(data) {
    var zones = data.zones;
    for (var property in zones) {
      if (!zones.hasOwnProperty(property)) continue;

      var option = $('<option/>');
      if (zones[property] == destTimezone) {
        option.attr({ 'value': zones[property], 'selected': '' }).text(property);
      } else {
        option.attr({ 'value': zones[property] }).text(property);
      }

      destSelect.append(option);
    }
    destSelect.chosen({
      search_contains: true
    });

    updateTime(selectedTime);
  });
});
