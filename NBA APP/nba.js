/*Kevin Yao
File: nba.js
Purpose: Pure Javascript file used to get NBA day schedules using Sportradar US API*/


//Global variables to define API call
const access_level = 'trial';
const version = 'v5';
const language_code = 'en';
var today = new Date();
var day = today.getDate();
var month = today.getMonth() + 1;
var year = today.getFullYear();
const format = 'json';
const api_key = 'hrwvmd8qsnrukz79etk3ndk9'; //CHANGE TO YOUR API KEY
var teamName = ["Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets", "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets",
                "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers", "Los Angeles Clippers", "Los Angeles Lakers", "Memphis Grizzlies",
                "Miami Heat", "Milwaulee Bucks", ]

var scheduleURL = 'https://api.sportradar.us/nba/' + access_level + '/'+ version + '/' + language_code + '/games/'+ year+'/' + month + '/' + day+ '/schedule.' + format + '?api_key=' + api_key;

var boxScoreURL = 'https://api.sportradar.us/nba/{access_level}/{version}/{language_code}/games/{game_id}/boxscore.{format}?api_key={hrwvmd8qsnrukz79etk3ndk9}';

const config = {
    headers: {'Access-Control-Allow-Origin': '*'}
};

function getDate() {
    document.getElementById("inputMonth").value = month;
    document.getElementById("inputDay").value = day;
    document.getElementById("inputYear").value = year;
}
getDate();

//First HTTP request for the schedule
var http = new XMLHttpRequest();
var txt = ''; //txt to overwrite the index.html html

//When the HTTP request is ready the following function will begin
http.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){
       console.log("Received schedule data");
        parseScheduleJSON(this.responseText);
       }
}

//Parses JSON Date to a string
function parseJsonDate(jsonDateString){
//    return new Date(parseInt(jsonDateString.replace('/Date(', '')));
    return new Date(jsonDateString);
}

function popUpBoxScore(){
    console.log("asdf");
}

//Parses the JSON schedule and creates a table
function parseScheduleJSON(json){
  var obj = JSON.parse(json);
    console.log(obj);
    var g = obj["games"];
    txt += "<table border='1'>"
    txt += "<th>Game iD|Boxscore</th><th>Start Time</th><th>Location</th><th>Broadcasts</th><th>Away</th><th>Away Score</th><th>Home Score</th><th>Home</th><th>Status</th>";
    for (x in g) {
        txt += "<tr><td onclick = \"popUpBoxScore();\">" + g[x].home.alias + " vs " + g[x].away.alias
            + "</td><td>" + parseJsonDate(g[x].scheduled) 
            + "</td><td>" + g[x].venue.name + "</td><td>";
            for(y in g[x].broadcasts) {
                if (g[x].broadcasts.length - 1 == y)
                    txt += g[x].broadcasts[y].network;
                else
                    txt += g[x].broadcasts[y].network + ', ';
            }
            txt += "</td><td>" + g[x].away.name 
            + "</td><td>" + g[x].away_points
            + "</td><td>" + g[x].home_points 
            + "</td><td>" + g[x].home.name 
            + "</td><td>" + g[x].status + "</td></tr>";
    }   
    console.log(txt);
    document.getElementById("schedule").innerHTML = txt; //Assigns the new HTML
}

//Sends a HTTP Request to get the box score of completed games. Should only work for completed games
function getBoxScore(){
var httpTwo = new XMLHttpRequest();

httpTwo.onreadystatechange = function (){
    if(this.readyState == 4 && this.status == 200){
        console.log("Received boxscore data");
        parseBoxScoreJSON(this.responseText);
    }
};

httpTwo.open("GET", boxScoreURL, true);
httpTwo.send();
}

//When form is submitted, the day's schedule is retrieved with an HTTP request
function clicked() {    
txt = '';
    
month = document.getElementById("inputMonth").value;
day = document.getElementById("inputDay").value;
year = document.getElementById("inputYear").value;
scheduleURL = 'https://api.sportradar.us/nba/' + access_level + '/'+ version + '/' + language_code + '/games/'+ year+'/' + month + '/' + day+ '/schedule.' + format + '?api_key=' + api_key;
    
//Change the HTML for the requested date
var newHeader = "<h1 id = \"header\">Schedule for " + month + "/" + day + "/" + year + "</h1>";
document.getElementById("header").innerHTML = newHeader;

//Make the first HTTP call
http.open("GET", scheduleURL, true);
http.send();
}
