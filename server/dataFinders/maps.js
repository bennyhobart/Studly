// Include dependencies
var fs = require('fs');
var http = require('http');

// Jquery stuff
var cheerio = require('cheerio');

// Load any old buildings
var buildings = {};
if(fs.existsSync('./buildings.json')) {
    buildings = require('./buildings.json');
}

// Map Location
var mapLoc = 'http://maps.unimelb.edu.au/parkville/building/';

/*
Class to cache buildings
*/
function buildingCacher(name, href) {
    this.name = name;
    this.href = href;
    this.cache();
}

// Caches a building
buildingCacher.prototype.cache() {
    var content = '';

    // Request the page (this will have a link to rooms)
    http.get(this.href, function(res) {
        res.on('data', function(chunk) {
            content += chunk;
        }).on('end', function() {
            // Load the page into cheerio
            var $ = cheerio.load(content);

            $('.within ul li a').each(function() {
                // Grab useful stuff
                var link = $(this);
                var name = link.html();
                var href = link.attr('href');

                // Tell the user
                console.log(name+' - '+href);
            });
        });
    });
}

// This function update the map list
function buildMaps() {
    // Tell the user
    console.log('Updating maps...');

    // List of buildings left to check
    var toBuild = [];

    // Request the page
    var content = '';
    http.get(mapLoc, function(res) {
        // Grab the data:
        res.on('data', function (chunk) {
            content += chunk;
        }).on('end', function() {
            // Load the page into cheerio
            var $ = cheerio.load(content);

            $('.within ul a').each(function() {
                var link = $(this);
                var name = link.html();
                var href = link.attr('href');
                console.log(name+' - '+href);
            });
        });
    }).on('error', function(err) {
        throw err;
    });
}

// Build the maps
buildMaps();