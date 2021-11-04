const moment = require('moment');

// GET TANGAL HARI SENIN DI MINGGU INI
function getLastSunday() {
    const date = new Date();
    const today = date.getDate();
    const dayOfTheWeek = date.getDay();
    const newDate = date.setDate((today - dayOfTheWeek)+1);
    return new Date(newDate);
  }
const ini = getLastSunday()

// GET TANGGAL HARI MINGGU DI MINGGU INI
function getUpcomingSunday() {
    const date = new Date();
    const today = date.getDate();
    const dayOfTheWeek = date.getDay();
    const newDate = date.setDate(today - dayOfTheWeek + 7);
    return new Date(newDate);
  }

  const ini2 = getUpcomingSunday()
  
  
  console.log(moment(ini).format("YYYY-MM-DD"));
