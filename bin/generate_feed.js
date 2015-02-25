#!/usr/bin/env node

var async = require('async');
var fs = require('fs');
var glob = require('glob');
var id3 = require('id3js');
var jinja = require('jinja-js');
var mongodb = require('mongodb');
var path = require('path');
var podcast = require('podcast');
var uuid = require('node-uuid');
var xmlescape = require('xml-escape');

var config = require('lib/config');

var now = new Date();

var incoming_dir = config.incoming_dir;
var feed_template_file = config.feed_template_file;
var baseurl = config.baseurl;
var dburl = config.dburl;
var feedinfo_collection_name = config.feedinfo_collection_name;
var MongoClient = mongodb.MongoClient;

var template_data = {
  title: config.title,
  ttl: 1,
  pubDate: now,
  lastBuildDate: now,
  feed_image: "http://www.gravatar.com/avatar/19a77e55bafa14d8c1943adaa8c030d4.png",
  explicit: "yes",
  items: []
}

function pull_db_info(db, callback) {
  var collection = db.collection(feedinfo_collection_name);

  collection.find().toArray(function(err, results) {
    if (err) throw err;
    walk_filesystem(results);
  });


}

MongoClient.connect(dburl, function(err, db)
{
  if (err) throw err;
  console.log('got db');
  pull_db_info(db, function() { 
    db.close();
  });
}) // db connect

  glob(incoming_dir + '/*.{mp3,m4a}', {},function(err, files) {
   if(err) throw err;

   async.map(files, fs.stat, function(err, statses) {

   for(var i = 0 ; i < files.length ; i++) {
     var f = function(i) {
       var file = files[i];
       var stats = statses[i];
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

             // escape printable chars
             //
             title = xmlescape(title);

             // Remove non-printable chars
             //
             title = title.replace(/[^\040-\176\200-\377]/gi, "");

             feed_item =  {
               title:  title,
               description: 'use this for the content. It can include html.',
               url: baseurl + basename,
               author: 'Guest Author', // optional - defaults to feed author property
               date: 'May 27, 2012', // any format that js Date can parse.
               // title: title,
               // description: description,
               // url: baseurl + basename,
               guid: 'uuid.v4()', // optional - defaults to url
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
     // console.log(template_data);

     fs.readFile(feed_template_file, 'utf8', function (err,data) {
       if (err) { return console.log(err); }
       process.stdout.write(jinja.render(data, template_data));
     }); // readfile
   }); // async.map


  }); // glob
