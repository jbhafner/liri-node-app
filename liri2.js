var Twitter = require('twitter');
var keys = require("./keys.js");
var twitterClient = new Twitter(keys.twitterKeys);

// get the third element in the command line (e.g. my-tweets)
var vliriCommand = process.argv[2];
liriCommand(vliriCommand);

function liriCommand(vliriCommand) {
	console.log("vliriCommand: ", vliriCommand);
	if (vliriCommand==="my-tweets") {
		console.log('my-tweets selection entered');
		getTweets();
	} else if (vliriCommand==='spotify-this-song') {
		console.log('spotify-this-song');
	} else if (vliriCommand==='movie-this') {
		console.log('movie-this');
	} else if (vliriCommand==='do-what-it-says') {

	} else {
		console.log("function liriCommand did not work");
	}
}	

// console.log(twitterClient);
// Retrieve Tweets -- retrieve last 20 tweets and display

function getTweets(){
	console.log("getTweets called");
   twitterClient.get('statuses/user_timeline', 
   {screen_name:'HafnerTest', count:20}, 
   function(error, tweets, response) {
      if(tweets) {
         console.log("Tweets: ", tweets);
         return;
      } else if (error) {
         console.log("This is an error: ", error);
      } else if (response) {
      	console.log("Response: ", response);
      } else {
      	console.log("Nothing worked");
      }
   for(var i = 0; i< tweets.length; i++){
      console.log("####### Tweet: " + (i + 1) + " #######");
      console.log("Posted at: " + tweets[i].created_at);
      console.log("Tweet text: " + tweets[i].text);
      console.log("");
   }
   }

   )};
   // console.log('Twitter client after function: ', twitterClient);
   // console.log('Tweets after function: ', tweets);	

// getTweets(process.argv[2]);
console.log("command: ",vliriCommand);
console.log(process.argv[2]);
