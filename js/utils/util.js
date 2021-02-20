
function parseTimeUTC(time, cFormat) {
	const format = cFormat || '{y}-{m}-{d} '
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (('' + time).length === 10) time = parseInt(time) * 1000
		date = new Date(time)
	}
	let newt = ''+date.toUTCString();	//"Tue, 09 Feb 2021 22:05:53 GMT"
	//Feb-09-2021 01:14:14 PM +UTC
	newt = newt.split(",")[1].trim();
	let darr = newt.split(" ");

	let hms = darr[3];
	let hours = parseInt(hms.split(":")[0]) ;
	let minutes = parseInt(hms.split(":")[1]) ;

	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	hours = hours < 10 ? '0'+hours : hours;


	let result = darr[1]+"-"+darr[0]+"-"+darr[2]+" "+hours+":"+minutes+" "+ampm+" +UTC";
	return ''+result;
}

function parseStrTimeUTC(time, cFormat) {
	debugger
	const format = cFormat || '{y}-{m}-{d} '
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		date = time.replace("-","/").replace("-","/").replace("-","/");
		date = new Date(time)
	}
	let newt = ''+date.toUTCString();	//"Tue, 09 Feb 2021 22:05:53 GMT"
	//Feb-09-2021 01:14:14 PM +UTC
	newt = newt.split(",")[1].trim();
	let darr = newt.split(" ");

	let hms = darr[3];
	let hours = parseInt(hms.split(":")[0]) ;
	let minutes = parseInt(hms.split(":")[1]) ;

	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	hours = hours < 10 ? '0'+hours : hours;


	let result = darr[1]+"-"+darr[0]+"-"+darr[2]+" "+hours+":"+minutes+" "+ampm+" +UTC";
	return ''+result;
}

function parseTime(time, cFormat) {
	// if (arguments.length === 0) {
	//    return null
	// }

	const format = cFormat || '{y}-{m}-{d} '
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (('' + time).length === 10) time = parseInt(time) * 1000
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		if (key === 'a') return ['1', '2', '3', '4', '5', '6', '7'][value - 1]
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}
let barcode = null
function scanCode(self){
	let promise = new Promise(function (resolve, reject) {
			uni.scanCode({
				success: function (res) {
					resolve(res)
				},
				fail(e){
					reject(e)
				}
			});

		}
	)
	return promise
}
export default {
	parseTime,
	parseTimeUTC,
	parseStrTimeUTC,
	scanCode
}
