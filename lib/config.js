var mongodb = require('mongodb');


// Allow $MP3ME_INCOMING_DIR environment variable to override default
//
module.exports.incoming_dir = process.env.MP3ME_INCOMING_DIR || process.env.HOME + '/Dropbox/Misc/mp3me/queue/incoming';
module.exports.baseurl = 'http://tempdir.ernie.org/podcast/content/';
module.exports.feed_template_file = "./template/feed.xml"

var config = {
  title: "Ernie's Running Podcast",
  imageurl: 'http://dropbox.ernie.org/podcast/index.jpg',
  description: "Ernie's Running Podcast is a podcast containing content curated by Ernie for him to listen to while running and commuting. It consists mainly of the audio portion of interesting youtube videos from tech conferences and other interesting long form presentations.",
  author : 'Ernie Hershey',
  subtitle : 'Audio feed for Ernie to listen to while running',
  categories: [ 'Technology', 'Health', 'Entertainment' ],
};

// set database options
//
var dbname = "moves";
var dbserver = "localhost";
var dbport = 27017;

var dbuser = '';
var dbpass = '';

var dboptions = '';

// process database options
//

var dbuserpass = '';

if(dbuser && dbpass)
{
  dbuserpass = dbuser + ':' + dbpass + '@';
}

if(dboptions) {
  dboptions = '?' + dboptions;
}

module.exports.dburl = 'mongodb://' + dbuserpass + dbserver + ':' + dbport + '/' + dbname + dboptions;

var now = new Date();

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

module.exports.feedinfo_collection_name = "feed_info";
