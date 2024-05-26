const cityName = document.querySelector("#location");
const searchbtn = document.querySelector("#searchbtn");
let cityList = JSON.parse(localStorage.getItem('cityList')) || [];

// this is dropbox which store the city names and it would give suggestions
function updatecitynames(){
    const datalist = document.querySelector("#cityList");
    datalist.innerHTML="";
    cityList.forEach(city => {
        const option = document.createElement("option");    
        option.value = city;
        datalist.appendChild(option);
    })

}
updatecitynames();

// this is searchbutton and it has major contribution in this project
// most of the tasks are performed in this eventlistener
searchbtn.addEventListener("click",() =>{
    
    const cityInput = cityName.value.trim();
    if(!cityInput){
        alert("please enter city name");
        return;
    }
    fetchweather(`q=${cityInput}`, cityInput);
   
})

document.querySelector(".currentloc").addEventListener("click", ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            position => {
            const {latitude , longitude} = position.coords;
            fetchweather(`lat=${latitude}&lon=${longitude}`);

        },
         error =>{
            alert('Unable to fetch location');
         });
    }
    else {
        alert("Geolocation is not supported by this browser");
    }
})


// fetching weather with the help of city name  
function fetchweather(query, cityInput){
    document.getElementById('next5days').style.display= "grid";
    document.getElementById('wicon').style.display ='block';

    if(!cityList.includes(cityInput)){
        cityList.push(cityInput);
        localStorage.setItem('cityList', JSON.stringify(cityList));
        updatecitynames();
     }
     
     const weatherapi = `http://api.openweathermap.org/data/2.5/forecast?${query}&appid=fcf8430545db0051ae2ef3878a36553a&units=metric`; 
 
     fetch(weatherapi)
     .then( response =>
         {
             if(!response.ok){
                 throw new Error("City not found");
             }
             return response.json();
         })
     .then( data => {
         const differentdaysforecast = new Set();
         const fivedays = data.list.filter( x => {
             const date = new Date (x.dt_txt).getDate();
             if(!differentdaysforecast.has(date)){
                 differentdaysforecast.add(date);
                 return true;
             }
             return false;
         })
          
         updateWeatherToday(data.city.name, data.list[0]);
         updateWeatherforNext5days(fivedays);
         // console.log(fivedays);
     }).catch((error) => {
         alert(error.message);
         document.getElementById('next5days').style.display ="none";
     })

}


// this is for aligning todays weather, day 
function updateWeatherToday(city, weather){
    document.querySelector("#cityName").textContent = city;
    document.querySelector("#date").textContent = `Date : ${new Date(weather.dt_txt).toDateString()}`;
    document.querySelector(".todayweather").children[2].textContent = `Temperature: ${weather.main.temp}°C`;
    document.querySelector(".todayweather").children[3].textContent = `Wind: ${weather.wind.speed}m/s`;
    document.querySelector(".todayweather").children[4].textContent = `Humidity: ${weather.main.humidity}%`;
    // updateWeatherIcon(document.querySelector("#wicon"), weather.weather[0].icon,"Cloudy");

    const weatherIcon = document.querySelector("#wicon");
    const iconText = document.querySelector("#wicontext");
    weatherIcon.src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
    iconText.textContent = weather.weather[0].description;
}


// this is about next five days data and its alignment
function updateWeatherforNext5days(fivedays){
    const next5days = document.querySelectorAll('#next5days > .day');
    fivedays.forEach((forecast, index) => {
        const weatherDate = new Date(forecast.dt_txt);
        if(next5days[index]){
            next5days[index].children[1].textContent = `Date : ${weatherDate.toDateString()}`;
            next5days[index].children[2].textContent = `Temperature : ${forecast.main.temp}C`;
            next5days[index].children[3].textContent = `Wind : ${forecast.wind.speed} m/s`;
            next5days[index].children[4].textContent = `Humidity : ${forecast.main.humidity}%`;
            
            const weatherIcon = next5days[index].querySelector("#icon");
            const iconText = next5days[index].querySelector(".icon-text");
            // updateWeatherIcon(next5days[index].children[0], forecast.weather[0].icon,"Cloudy");
            weatherIcon.src = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
            iconText.textContent = forecast.weather[0].description;
        }
    });
}


// this is for icons, which is taken from openweathermap website directly
// function updateWeatherIcon(element, iconCode, iconText){
//     const iconURL = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
//     element.src= iconURL;

//     const iconTextelement = document.createElement("span");
//     iconTextelement.textContent = iconText;
//     element.parentNode.appendChild(iconTextelement);
// }

// this is my personal thing i want to add in this project
// its a simple dark and day mode 

document.querySelector("#button").addEventListener("click", () =>{
    const icons = document.querySelector(".toggle i");

    // backgrounds
    document.body.classList.toggle('bg-gray-900');
    
    // text color
    document.body.classList.toggle('text-white');

    // icons
    icons.classList.toggle('fa-moon');

    icons.classList.toggle('text-blue-500');
})