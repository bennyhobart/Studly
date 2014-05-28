/*

To Ash: RECODE THIS -- It's written really badly!

*/

// Include dependencies:
var express = require('express');
var fs = require('fs');
var querystring = require('querystring');
var curl = require('curlrequest');
var cheerio = require('cheerio');

var data = String(fs.readFileSync('subjectList.txt', 'ascii'));
var subjects = data.split('\n');

var year = 2014;

var loc = 'static/handbook/'+year+'/'

// Create directories:
if(!fs.existsSync('static')) {
	fs.mkdirSync('static');
}
if(!fs.existsSync('static/handbook')) {
	fs.mkdirSync('static/handbook');
}
if(!fs.existsSync('static/handbook/'+year)) {
	fs.mkdirSync('static/handbook/'+year);
}

// Requests the handbook page of a subjects and passes it to a processor
function BuildSubject(code) {
	var code = code.toLowerCase();

	console.log('Building '+code+' '+subjects.length+' left!');

	curl.request('https://handbook.unimelb.edu.au/view/'+year+'/'+code, function (err, data) {
		if(err) {
			console.log(err);
		} else {
			processHandbook(code, data);
		}

		// Move on
		BuildSubject(subjects.shift());
	});
}

// Processes a handbook page
function processHandbook(code, body) {
	try {
		code = code.replace('\r', '');

	// Jquery stuff:
	var $ = cheerio.load(body);

	// Ensure the subject exists:
	var title = $('title').html().toLowerCase();
	if(title == 'no document') {
		console.log(code+' does not exist.')
		return;
	}

	var infoHeaders = new Array();
	var info = {};

	// Load her in:
	//if(fs.existsSync(loc+code+'.json')) {
	//	info = JSON.parse(fs.readFileSync(loc+code+'.json'));
	//} else {
		//info = {};
	//}

	var content = $("#content");

	// Find the headers:
	$(".CSCTableDocViewSummaryLabel", content).each(function() {
		var inner = $(this);

		// Find the inner most child:
		$(this).children().each( function() {
			inner = $(this);
		});

		var str = inner.html();

		// Remove :
		str = str.replace(":", "");
		str = str.replace(" ", "");
		str = str.replace("&amp;", "");

		// Push inner most child:
		infoHeaders.push(str.toLowerCase());
	});

	var num = 0;

	// Find the values:
	$(".CSCPreviewValue", content).each(function() {
		var inner = $(this);

		// Remove top level elements:
		while(inner.children().length == 1) {
			inner = inner.children();
		}

		// Store into matching header:
		info[infoHeaders[num]] = inner.html();

		// Move onto next slot:
		num += 1;
	});

	info.pre = new Array();

	// Build prerequisites:
	$(".SubjectTable", info['prerequisites']).each(function() {
		$('.SubjectTitle a', $(this)).each(function() {
			// Grab subject code:
			var str = $(this).html();
			var pos = str.indexOf(" ");
			str = str.substr(0, pos);

			// Store code:
			info.pre.push(str);
		});
	});

	// Add leads to all these subjects:
	/*for(var i=0; i<info.pre.length; i++) {
		var c = info.pre[i].toLowerCase();

		var lead;

		// Load or create the lead:
		if(fs.existsSync(loc+c+'.json')) {
			lead = JSON.parse(fs.readFileSync(loc+c+'.json'));
		} else {
			lead = {};
		}

		if(lead.lead) {
			var alreadyHas = false;

			// It already has leads, check if this subject is already a lead:
			for(var j=0;j<lead.lead.length;j++) {
				if(lead.lead[j] == code) {
					alreadyHas = true;
					break;
				}
			}

			// Store the lead if we don't already have it:
			if(!alreadyHas) {
				lead.lead.push(code);
			}
		} else {
			// First lead for this subject:
			lead.lead = new Array();
			lead.lead.push(code);
		}

		// Store lead:
		fs.writeFile(loc+c+'.json', JSON.stringify(lead), function(err) {
			if(err) {
				console.log(err);
			}
		});
	}*/

	// Store it:
	console.log('Writing '+loc+code+'.json');
	fs.writeFile(loc+code+'.json', JSON.stringify(info), function(err) {
		if(err) {
			console.log(err);
		}
	});
	} catch(e) {
		console.log('Well, that failed!');
		console.log(e);
	}
}

BuildSubject(subjects.shift());

return;

// Create the web server:
var app = express();

app.configure(function() {
	app.use(express.static(__dirname + '/static'));
});

// Index page:
app.get('/', function (req, res) {
	res.send('Nothing to see here!');
});

// Queries:
app.get('/handbook/:year/:code.json', function (req, res) {
	res.send('Not ready!');
});

// Start listening:
app.listen(process.env.PORT || 1337);
