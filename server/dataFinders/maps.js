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
}

// Caches a building
buildingCacher.prototype.cache = function(callback) {
    console.log('Caching: '+this.name);

    var content = '';

    // Request the page (this will have a link to rooms)
    http.get(this.href, function(res) {
        res.on('data', function(chunk) {
            content += chunk;
        }).on('end', function() {
            // Load the page into cheerio
            var $ = cheerio.load(content);

            console.log('Got a link back:');

            $('.within ul li a').each(function() {
                // Grab useful stuff
                var link = $(this);
                var name = link.html();
                var href = link.attr('href');

                // Tell the user
                console.log('DATA: '+name+' - '+href);
            });

            // Check if there is a callback
            if(callback) {
                // Run the callback
                callback();
            }
        });
    });
}

// This function update the map list
function buildMaps() {
    // Tell the user
    console.log('Updating maps...');

    // List of buildings left to check
    this.toBuild = [];
}

// Start caching
buildMaps.prototype.startCaching = function() {
    console.log('\n\nHERE\n\n');
    console.log(this.toBuild);

    // Alias of this
    var thisMap = this;

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
                //console.log(name+' - '+href);

                // Store that this building needs caching
                thisMap.toBuild.push(new buildingCacher(name, href));
            });

            // Continue Caching
            thisMap.cacheNext();
        });
    }).on('error', function(err) {
        throw err;
    });
}

// Cache the next building
buildMaps.prototype.cacheNext = function() {
    var thisMap = this;

    if(this.toBuild.length > 0) {
        // Grab the first thing that needs caching
        var toCache = this.toBuild.pop();

        // Cache it
        toCache.cache(function() {
            thisMap.cacheNext();
        });
    }
}

// Build the maps
var cacher = new buildMaps();
cacher.startCaching();
