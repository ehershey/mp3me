#!/usr/bin/env node

// var fs = require('promised-io/fs');
var async = require('async');
var fs = require('fs');
var glob = require('glob');
var id3 = require('id3js');
var jinja = require('jinja-js');
var mongodb = require('mongodb');
var path = require('path');
var podcast = require('podcast');
var uuid = require('node-uuid');

// Allow $MP3ME_INCOMING_DIR environment variable to override default
//
var incoming_dir = process.env.MP3ME_INCOMING_DIR || process.env.HOME + '/Dropbox/Misc/mp3me/queue/incoming';
var baseurl = 'http://tempdir.ernie.org/podcast/content/';
var feed_template_file = "./template/feed.xml"

var now = new Date();

var config = { 
  title: "Ernie's Running Podcast",
  imageurl: 'http://dropbox.ernie.org/podcast/index.jpg',
  description: "Ernie's Running Podcast is a podcast containing content curated by Ernie for him to listen to while running and commuting. It consists mainly of the audio portion of interesting youtube videos from tech conferences and other interesting long form presentations.",
  author : 'Ernie Hershey',
  subtitle : 'Audio feed for Ernie to listen to while running',
  categories: [ 'Technology', 'Health', 'Entertainment' ],
};

var template_data = { 
  title: config.title,
  ttl: 1,
  pubDate: now,
  lastBuildDate: now,
  feed_image: "http://www.gravatar.com/avatar/19a77e55bafa14d8c1943adaa8c030d4.png",
  explicit: "yes",
  items: []
}

var feedOptions = { 
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

glob(incoming_dir + '/*.{mp3,m4a}', {},function(err, files) {
  if(err) throw err;

  async.map(files, fs.stat, function(err, statses) {

  for(var i = 0 ; i < files.length ; i++) {
    var f = function(i) {
      var file = files[i];
      var stats = statses[i];
      console.log('file: ' + file);
      console.log('stats: ' + stats);
        if(err) throw err;
        var title = '';
        var description = '';
        var basename = path.basename(file);
        id3({ file: file,  type: id3.OPEN_LOCAL }, function(err, tags) {

          title = tags.title;
          if(title === null || title === '') {
            title = basename;
          }
            // console.log('...');
            // console.log('tags: ');
            // console.log(tags);
            // console.log('file: ');
            // console.log(file)
            // console.log('title: ');
            // console.log(title);
            // console.log('tags.title: ');
            // console.log(tags.title);
            // console.log('description: ');
            // console.log(description);
            // console.log('...');
            feed_item =  { 
              title:  title,
              description: 'use this for the content. It can include html.',
              url: baseurl + basename,
              author: 'Guest Author', // optional - defaults to feed author property
              date: 'May 27, 2012', // any format that js Date can parse.
              // title: title,
              // description: description,
              // url: baseurl + basename,
              guid: uuid.v4(), // optional - defaults to url
              //date: stats.mtime,
              itunesAuthor: config.author,
              itunesExplicit: false,
              itunesSubtitle: 'I am a sub title',
              itunesSummary: 'I am a summary',
              itunesDuration: 12345,
              itunesKeywords: ['javascript','podcast']
            };
            template_data.items.push(feed_item);
          }); // id3
        }; // f()
        f(i);
      }; // for i in statses
    console.log(template_data);

    fs.readFile(feed_template_file, 'utf8', function (err,data) {
      if (err) { return console.log(err); }
      process.stdout.write(jinja.render(data, template_data));
    }); // readfile
  }); // async.map


}); // glob

