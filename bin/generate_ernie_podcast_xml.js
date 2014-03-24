#!/usr/bin/env node

var podcast = require('podcast');
var glob = require('glob');
var id3 = require('id3js');
var path = require('path');

var incoming_dir = process.env.HOME + '/Dropbox/Misc/mp3me/queue/incoming';

var now = new Date();

var config = { 
  imageurl: 'http://dropbox.ernie.org/podcast/index.jpg',
  description: "Ernie's Running Podcast is a podcast containing content curated by Ernie for him to listen to while running and commuting. It consists mainly of the audio portion of interesting youtube videos from tech conferences and other interesting long form presentations.",
  author : 'Ernie Hershey',
  subtitle : 'Audio feed for Ernie to listen to while running',
  categories: [ 'Technology', 'Health', 'Entertainment' ],
};

var feedOptions = { 
    title: "Ernie's Running Podcast",
    description: config.description,
    feed_url: 'http://dropbox.ernie.org/podcast/index.xml',
    site_url: 'http://dropbox.ernie.org/podcast/index.html',
    image_url: config.imageurl,
    docs: 'http://dropbox.ernie.org/podcast/docs.html',
    author: config.author,
    managingEditor: config.author,
    webMaster: config.author,
    copyright: now.getFullYear() + ' ' + config.author,
    language: 'en',
    //categories: config.categories,
    pubDate: now,
    ttl: '60',
    itunesAuthor: config.author,
    itunesSubtitle: config.subtitle,
    itunesSummary: config.description,
    itunesOwner: { name: config.author, email:'podcast@ernie.org' },
    itunesExplicit: false,
    //itunesCategory: {
        //"name": "Technology"
        // "subcats": config.categories
    //},
    itunesImage: config.imageurl

}
var feed = new podcast(feedOptions);

glob(incoming_dir + '/*.mp3', {},function(err, files) { 
  if(err) throw err;

  for(var i = 0 ; i < files.length ; i++) {
    var f = function(file) {
      var title = '';
      var description = '';
      id3({ file: file,  type: id3.OPEN_LOCAL }, function(err, tags) {

      if(tags.title === null) {
        title = path.basename(file);
      }

        console.log(file + ": \n")
        console.log('title: ' + title);
        console.log('description: ');
        console.log(description);
      });
      };
      f(files[i]);
  }
});

var basename = 'filename.mp3';

/* loop over data and add to feed */
feed.item({
    title:  'item title',
    description: 'use this for the content. It can include html.',
    url: 'http://tempdir.ernie.org/podcast/content/' + basename,
    guid: '1123', // optional - defaults to url
    // categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories
    author: 'Guest Author', // optional - defaults to feed author property
    date: 'May 27, 2012', // any format that js Date can parse.
    // lat: 33.417974, //optional latitude field for GeoRSS
    // long: -111.933231, //optional longitude field for GeoRSS
    // enclosure : {url:'...', file:'path-to-file'}, // optional enclosure
    itunesAuthor: 'Max Nowack',
    itunesExplicit: false,
    itunesSubtitle: 'I am a sub title',
    itunesSummary: 'I am a summary',
    itunesDuration: 12345,
    itunesKeywords: ['javascript','podcast']
});

console.log(feed.xml())
  // process.stdout.write(feed.xml);
