/*Kevin Yao
File: nba.js
Purpose: Pure Javascript file used to get NBA day schedules using Sportradar US API*/


//Global variables to define API call
const access_level = 'trial';
const version = 'v5';
const language_code = 'en';
var year = '2019';
var month = '01';
var day = '13';
const format = 'json';
const api_key = 'uq4fu6ffzubuxbqvpba59rv3'; //CHANGE TO YOUR API KEY

var scheduleURL = 'https://api.sportradar.us/nba/' + access_level + '/'+ version + '/' + language_code + '/games/'+ year+'/' + month + '/' + day+ '/schedule.' + format + '?api_key=' + api_key;

//var boxScoreURL = 'https://api.sportradar.us/nba/{access_level}/{version}/{language_code}/games/{game_id}/boxscore.{format}?api_key={your_api_key}';

//First HTTP request for the schedule
var http = new XMLHttpRequest();
var txt = ''; //txt to overwrite the index.html html

//Variables to hold JSON objects from daily schedule
var obj;
var g;
    
//When the HTTP request is ready the following function will begin
http.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){
       console.log("Received schedule data");
        parseScheduleJSON(this.responseText);
       }
}
//hoes
//Parses JSON Date to a string
function parseJsonDate(jsonDateString){
//    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
    return new Date(jsonDateString);
}

//Parses the JSON schedule and creates a table
function parseScheduleJSON(json){
  obj = JSON.parse(json);
    console.log(obj);
  g = obj["games"];
    txt += "<table border='1'>"
    txt += "<th>Click to go to boxscore</th><th>Start Time</th><th>Location</th><th>Home</th><th>Home Score</th><th>Away Score</th><th>Away</th><th>Status</th>";
    for (x in g) {
		console.log('game_'+x);
        txt += "<tr><td> <a href = \"C:\\Users\\Kevin\\Downloads\\NBA-master\\boxscore.html\">" + x + "</a>"
			+ "</td><td>" + parseJsonDate(g[x].scheduled) 
            + "</td><td>" + g[x].venue.name 
            + "</td><td>" + g[x].home.name 
            + "</td><td>" + g[x].home_points 
            + "</td><td>" + g[x].away_points 
            + "</td><td>" + g[x].away.name 
            + "</td><td>" + g[x].status + "</td></tr>";
    }   
    document.getElementById("schedule").innerHTML = txt; //Assigns the new HTML
}

//Sends a HTTP Request to get the box score of completed games. Should only work for completed games
function getBoxScore(){
	/*
var httpTwo = new XMLHttpRequest();

httpTwo.onreadystatechange = function (){
    if(this.readyState == 4 && this.status == 200){
        console.log("Received boxscore data");
        parseBoxScoreJSON(this.responseText);
    }
};

httpTwo.open("GET", boxScoreURL, true);
httpTwo.send();
*/
console.log("Boxscore clicked");
}
    
function indexOnload(){
	console.log("indexonload");
	scheduleLoad();
}
	
//When form is submitted, the day's schedule is retrieved with an HTTP request
function scheduleLoad(){    
console.log("scheduleload");
txt = '';
    
month = document.getElementById("inputMonth").value;
day = document.getElementById("inputDay").value;
year = document.getElementById("inputYear").value;
if(month == '' || day === '' || year === ''){
	return;
}
scheduleURL = 'https://api.sportradar.us/nba/' + access_level + '/'+ version + '/' + language_code + '/games/'+ year+'/' + month + '/' + day+ '/schedule.' + format + '?api_key=' + api_key;
    
//Change the HTML for the requested date
var newHeader = "<h1 id = \"header\">Schedule for " + month + "/" + day + "/" + year + "</h1>";
document.getElementById("header").innerHTML = newHeader;

////Make the first HTTP call
//http.open("GET", scheduleURL, true);
//http.send();
http = createCORSRequest("GET", scheduleURL);
    
}

function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}