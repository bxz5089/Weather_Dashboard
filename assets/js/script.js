var city="";
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWindSpeed=$("#wind-speed");
var currentUvindex= $("#uv-index");
var cities=[];

//API key
var APIKey="2cc9d1d9d6d98f07ea39618ec0347aab";
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
}

function find(findCity){
    for (var i=0; i<cities.length; i++){
        if(findCity.toUpperCase()===cities[i]){
            return -1;
        }
    }
    return 1;
}

function addToList(findCity){
    var listEl= $("<li>"+findCity.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",findCity.toUpperCase());
    $(".list-group").append(listEl);
}

function currentWeather(city){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        var weathericon= response.weather[0].icon;
        var iconurl="https://openweathermap.org/img/wn/"+weathericon +"@2x.png";
        var date=new Date(response.dt*1000).toLocaleDateString();
        $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");

        // Convert the temp to fahrenheit
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        $(currentTemperature).html((tempF).toFixed(2)+"&#8457");
        $(currentHumidty).html(response.main.humidity+"%");
        var ws=response.wind.speed;
        var windsmph=(ws*2.237).toFixed(1);
        $(currentWindSpeed).html(windsmph+"MPH");

        UVIndex(response.coord.lon,response.coord.lat);
        forecast(response.id);
        if(response.cod==200){
            cities=JSON.parse(localStorage.getItem("cityname"));
            console.log(cities);
            if (cities==null){
                cities=[];
                cities.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(cities));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    cities.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(cities));
                    addToList(city);
                }
            }
        }

    });
}

function UVIndex(ln,lt){
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                $(currentUvindex).html(response.value);
            });
}

function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#Date"+i).html(date);
            $("#Img"+i).html("<img src="+iconurl+">");
            $("#Temp"+i).html(tempF+"&#8457");
            $("#Humidity"+i).html(humidity+"%");
        }
        
    });
}

function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}

function loadlastCity(){
    $("ul").empty();
    var cities = JSON.parse(localStorage.getItem("cityname"));
    if(cities!==null){
        cities=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<cities.length;i++){
            addToList(cities[i]);
        }
        city=cities[i-1];
        currentWeather(city);
    }

}

$("#search-button").on("click",displayWeather);
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);




















