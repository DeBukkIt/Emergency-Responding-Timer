var alarmTimeMillis;
var dateAlarm;
var dateTarget1;
var dateTarget2;

const TIME_ALARM_TO_TARGET_1 = 8; // minutes
const TIME_ALARM_TO_TARGET_2 = 13; // minutes

const TIME_STOP_CLOCK_AFTER_ALARM = 30; //minutes

const UNIT_MINUTES = "Min."; // e.g. 'min'
const UNIT_HOURS = "Std."; // e.g. 'h'

const TEXT_TIMEOUT = "überschritten"; // e.g. 'timeout'
const BG_COLOR_DEFAULT = "white";
const BG_COLOR_ACTIVE = "#f4ff61";

const CLOCK_UPDATE_INTERVAL = 250; // milliseconds

function start(alarmTimeMillis) {	
	window.alarmTimeMillis = alarmTimeMillis;

	window.dateAlarm = new Date(window.alarmTimeMillis * 1000);
	window.dateTarget1 = datePlusMinutes(dateAlarm, TIME_ALARM_TO_TARGET_1);
	window.dateTarget2 = datePlusMinutes(dateAlarm, TIME_ALARM_TO_TARGET_2);
	
	// display timestamps
	document.getElementById("alarmzeit").innerHTML = "um " + formatDate(dateAlarm) + " Uhr";
	document.getElementById("sz1zeit").innerHTML = "<u>Ankunft</u> um " + formatDate(dateTarget1) + " Uhr";
	document.getElementById("sz2zeit").innerHTML = "<u>Ankunft</u> um " + formatDate(dateTarget2) + " Uhr";

	// start clocks
	updateClocks();
	setInterval(updateClocks, CLOCK_UPDATE_INTERVAL);
}

function updateClocks() {	
	var now = new Date();
	now.setHours(now.getHours() - 1);
	
	// update clock 1: time since alarm
	var diffAlarmtime = new Date(now.getTime() - dateAlarm.getTime());
	if(now.getTime() + 3600*1000 > dateAlarm.getTime() + TIME_STOP_CLOCK_AFTER_ALARM*60*1000) {
		diffAlarmtime.setHours(0);
		diffAlarmtime.setMinutes(0);
		diffAlarmtime.setSeconds(0);
		document.getElementById("alarmzeit_clock").innerHTML = "> " + TIME_STOP_CLOCK_AFTER_ALARM + " Min.";
	} else {
		document.getElementById("alarmzeit_clock").innerHTML = formatDate(diffAlarmtime, true);
	}
	
	// update clock 2: countdown to target 1
	var diffMins1 = getDiffMinutes(now, dateTarget1);
	var diffSecs1 = getDiffSeconds(now, dateTarget1);
	var resultCountdown1 = new Date();
	resultCountdown1.setHours(-1);
	resultCountdown1.setMinutes(diffMins1);
	resultCountdown1.setSeconds(diffSecs1 % 60 + 1);
	if(now.getTime() + 3600*1000 > dateTarget1.getTime()) {
		resultCountdown1.setHours(0);
		resultCountdown1.setMinutes(0);
		resultCountdown1.setSeconds(0);
		document.getElementById("sz1_clock").innerHTML = "./.";
		document.getElementById("sz1_subtitle").innerHTML = TEXT_TIMEOUT;
		document.getElementById("sz1_cell").style.backgroundColor = BG_COLOR_DEFAULT;
	} else {
		document.getElementById("sz1_clock").innerHTML = formatDate(resultCountdown1, true);
		document.getElementById("sz1_cell").style.backgroundColor = BG_COLOR_ACTIVE;
	}
	
	// update clock 3: countdown to target 2
	var diffMins2 = getDiffMinutes(now, dateTarget2);
	var diffSecs2 = getDiffSeconds(now, dateTarget2);
	var resultCountdown2 = new Date();
	resultCountdown2.setHours(-1);
	resultCountdown2.setMinutes(diffMins2);
	resultCountdown2.setSeconds(diffSecs2 % 60 + 1);
	if(now.getTime() + 3600*1000 > dateTarget2.getTime()) {
		resultCountdown2.setHours(0);
		resultCountdown2.setMinutes(0);
		resultCountdown2.setSeconds(0);
		document.getElementById("sz2_clock").innerHTML = "./.";
		document.getElementById("sz2_subtitle").innerHTML = TEXT_TIMEOUT;
		document.getElementById("sz2_cell").style.backgroundColor = BG_COLOR_DEFAULT;
	} else {
		document.getElementById("sz2_clock").innerHTML = formatDate(resultCountdown2, true);
		if(now.getTime() + 3600*1000 > dateTarget1.getTime()) { //clock 2 timed out already
			document.getElementById("sz2_cell").style.backgroundColor = BG_COLOR_ACTIVE;
		}
	}
}

function formatDate(date, addUnits = false) {
	var unitSuffixMin = "";
	var unitSuffixHrs = "";
	if(addUnits) {
		unitSuffixMin = " " + UNIT_MINUTES;
		unitSuffixHrs = " " + UNIT_HOURS;
	}
	
	var hh_str = date.getHours().toString();
	var MM_str = date.getMinutes().toString();
	var ss_str = date.getSeconds().toString();
	
	if(hh_str.length < 2) {
		hh_str = "0" + hh_str;
	}
	if(MM_str.length < 2) {
		MM_str = "0" + MM_str;
	}
	if(ss_str.length < 2) {
		ss_str = "0" + ss_str;
	}
	
	if(parseInt(hh_str) > 0) {
		return hh_str + ":" + MM_str + ":" + ss_str + unitSuffixHrs;
	} else {
		return MM_str + ":" + ss_str + unitSuffixMin;
	}
}

function getDiffSeconds(d1, d2) {
   var millisecondDiff = d2 - d1;
   var secDiff = Math.floor(( d2 - d1) / 1000);
   return secDiff;
}

function getDiffMinutes(d1, d2) {
   var seconds = getDiffSeconds(d1, d2);
   var minutesDiff = Math.floor(seconds / 60);
   return minutesDiff;
}

function datePlusMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
