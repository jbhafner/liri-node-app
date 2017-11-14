// ============ REQUIRE/LOAD NPM MODULES ============= //
var Keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var Request = require('request-promise');
var fs = require('mz/fs');
var Colors = require('colors');

// ============ LOAD KEYS ============= //
// Load Twitter Keys
var twitterClient = new Twitter(Keys.twitterKeys);

//Load Spotify Keys
var spotifyClient = new Spotify({
	id: Keys.spotifyKeys.clientId,
	secret: Keys.spotifyKeys.clientSecret
});	

//Load OMDB Keys
var omdb1 = "http://www.omdbapi.com/?t="
var omdb2 = "&apikey="+(Keys.omdbKeys.apikey);
// console.log('omdb: ', omdb1 + "____" + omdb2);

// ============ TAKE IN CLI ARGUMENTS ============= //
// get the third element in the command line (e.g. my-tweets)
// and any additional arguments
var vliriCommand = process.argv[2];
var vliriArgument1 = process.argv[3];
var vliriArgument2 = process.argv[4];
fs.appendFile('log.txt',"COMMAND: " + vliriCommand + " " + vliriArgument1 + " " + vliriArgument2 + "\n",
	encoding='UTF-8', function(err) {
		if(err) throw err;
});

// ============ FUNCTION TO READ COMMAND AND CALL PROPER FUNCTION ============= //

function liriCommand(vliriCommand) {
	if(vliriCommand==='fav-tweets') {
		console.log('fav-tweets'.inverse);
		getFavTweets();
	} else if (vliriCommand==="my-tweets") {
		console.log('my-tweets'.inverse);
		getMyTweets();
	} else if (vliriCommand==='spotify-this-song') {
		console.log('spotify-this-song'.inverse);
		getSpotify(vliriArgument1, vliriArgument2);
	} else if (vliriCommand==='movie-this') {
		console.log('movie-this'.inverse);
		getOMDB(vliriArgument1);
	} else if (vliriCommand==='do-what-it-says') {
		console.log('do-what-it-says'.inverse);
		doWhatItSays();
	} else {
		console.log("You made an incorrect choice. Please use: my-tweets, fav-tweets,".inverse + "\n" + "spotify-this-song, movie-this or do-what-it-says".inverse);
	}
};	

// ============ FUNCTIONS TO GET DATA FROM APIs ============= //

// ------------ Function to get top 20 Twitter Favorites --------------- //
function getFavTweets() {
	var params = {screen_name: 'HafnerTest', count:20};
	// console.log("before client get");
	twitterClient.get('favorites/list', params,function(error, tweets, response) {
	 	if (!error) {
		    // console.log('tweets: ', tweets);
		    // console.log("tweets typeof: ", typeof(tweets));
		    	console.log("\n\n" + "MY MOST FAVORITE TWEETS".black.bgMagenta);
		    	console.log("+++++++++++++++++++++++".gray);
			    for (var i=0; i<tweets.length; i++) {
			    	console.log(`Tweet ${i+1}. posted by ${tweets[i].user.name.underline} at ${tweets[i].created_at} `);
					console.log(`Tweet Text: ${tweets[i].text}`.white);
					console.log(`=============================`.magenta);
				}
		} else {
			console.log("error");
			}
	});
};

// ------------ Function to get my most recent 20 tweets --------------- //
function getMyTweets() {
	var params = {screen_name: 'HafnerTest', count:20};
	twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
	  if (!error) {
		    	console.log("\n\n" + "MY MOST RECENT TWEETS".black.bgMagenta);
		    	console.log("+++++++++++++++++++++++".gray);
			    for (var i=0; i<tweets.length; i++) {
			    	console.log(`Tweet ${i+1}. posted by ${tweets[i].user.name.underline} at ${tweets[i].created_at} `);
					console.log(`Tweet Text: ${tweets[i].text}`.white);
					console.log(`=============================`.magenta);
		    	}
		} else {
			console.log("error");
		}
	});
};


// ------------ Function to get Spotify Data --------------- //
function getSpotify(song='The Sign', artist='Ace of Base') {
	// console.log("Spotify function ran");
	// console.log("spotifyClient: ", spotifyClient);

	spotifyClient.search({type: 'track', query: song, artist: artist, limit: 1})
		.then(function(data) {
			var firstItem=data.tracks.items[0];
		    console.log("\n\n" + "SPOTIFY SONG RESULTS".black.bgMagenta);			
			// console.log (JSON.stringify(firstItem, null, 2));
			console.log(`Artist ${firstItem.album.artists[0].name.underline} | Song name ${firstItem.name} | Album name is ${firstItem.album.name}`);
			console.log(`Preview url ${firstItem.preview_url}`.white);

		}, function(err) {
			console.log('Sorry, I had a problem. ', err);
		});
};

// ------------ Function to get OMDB Movie data --------------- //

function getOMDB(movie='Mr. Nobody') {
	var vImdbRating="";
	// console.log('move is ', movie);
	// console.log("OMDB function ran");
	// console.log('request string ', (omdb1+movie+omdb2));
	Request(omdb1+encodeURI(movie)+omdb2)
		.then(function(data){
			var parseData=JSON.parse(data);
			// console.log('parseData ', parseData);
			for (i in parseData.Ratings) {
				// console.log('i is ', i);
				if (parseData.Ratings[i].Source==="Rotten Tomatoes") {
					vImdbRating = (parseData.Ratings[i].Value);
					// console.log("Rotten tomatoe true", " ", parseData.Ratings[i].Source, " ", parseData.Ratings[i].Value );
				}	
			}
			// console.log('vImdbRating', vImdbRating);
			// console.log('data ', data);
		    console.log("\n\n" + "OMDB MOVIE RESULTS".black.bgMagenta + "\n");			

			console.log(`Title ${JSON.parse(data).Title} | Released ${JSON.parse(data).Year}`.black.bgWhite);			
			console.log(`IMDB Rating ${JSON.parse(data).imdbRating} |  Rotten Tomatoes Rating ${vImdbRating}`);
			console.log(`Production Country(w) ${parseData.Country} | Language ${parseData.Language}`);
			console.log(`Plot: ${parseData.Plot}`.white);
			console.log(`Actors: ${parseData.Actors}`.inverse);
		}, function(err) {
			console.log('response ', response);
			console.log('Sorry, I had a problem. ', err);			
		});
};

// ------------ Function do-what-it-says --------------- //
function doWhatItSays() {
	fs.readFile('./random.txt', 'UTF-8')
		.then(function(data){
			// console.log('data ', data);
			var doItArray = data.toString().split(',')
			console.log('running function '.inverse, doItArray[0].inverse);
			getSpotify(doItArray[1]);
		}, function(err) {
			console.log(`Sorry, I had a problem. `, err);			
		});
};

// ============ Start program by calling liriCommand function ============= //
liriCommand(vliriCommand);
