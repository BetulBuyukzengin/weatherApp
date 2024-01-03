'use strict';

const API_KEY = "8f66252b881bec05dc29e9a4464bb00f";

const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const { latitude: lat, longitude: lon } = position.coords; // Destructuring kullanarak koordinatları al
        resolve({ lat, lon });
        console.log(lat, lon);
      },
      function () {
        reject("Your location could not be retrieved");
      }
    );
  });
};

const getJSONLocation = async function () {
  try {
    const { lat, lon } = await getPosition();
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Lokasyon alınamadı");
  }
};

async function getFiveDaysWeatherForecast() {
  const days = 5; // 5 gün için veri alacağız
  const forecastData = [];

  for (let i = 0; i < days; i++) {
    const weatherData = await getJSONLocation(); // Hava durumu verilerini al
    forecastData.push(weatherData); // Verileri diziye ekle
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 3 saat bekleme
  }

  return forecastData; // Toplanan 5 günlük hava durumu verilerini döndür
}

// getFiveDaysWeatherForecast fonksiyonunu çağırıp sonucu almak için
getFiveDaysWeatherForecast()
  .then(data => {
    console.log('Gelecek 5 günün hava durumu verileri:', data);
  })
  .catch(error => {
    console.error('Hava durumu verileri alınırken hata oluştu:', error);
  });


  //1111111111!!!!!!!!!!!!!!!!//
  "use-strict";

const cityName = document.querySelector(".primary-title");
const cityTemp = document.querySelector(".forecasts-info__tempatures");
const cityHum = document.querySelector(".forecasts-info__humidity");
const today_hum = document.querySelector("#hum");
const today_wind = document.querySelector("#wind");
const today_state = document.querySelector("#state");
const info = document.querySelector(".weather-content__info");
const nowTemp = document.querySelector(".state__value");
// const state = {
//   city_temp: [],
// };

const city_temp = [];
const wind = [];
const api_time = [];
const state = [];

let todayData;
let start;
let end;

let forStart;
let forecast8_data;
let forEnd;

const forecasts = document.querySelector(".forecasts");
const API_KEY = "8f66252b881bec05dc29e9a4464bb00f";
let first8_data;
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        resolve({ lat, lon });
        console.log(lat, lon);
      },
      function () {
        reject("Your location could not be retrieved");
      }
    );
  });
};

const getJSONLocation = async function () {
  try {
    const { lat, lon } = await getPosition();
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    // console.log(data);
    const { city } = data;
    // console.log(city.name);
    cityName.textContent = city.name;
    const { list } = data;
    // const today_value=list.slice(0,1);
    // console.log(today_value);
    const forecast_value = list;
    // console.log(forecast_value);
    const getNowDate=function(){
      const date_time=new Date();
      const today_day = date_time.getDate();
      const today_month = date_time.getMonth();
      const today_year = date_time.getFullYear();
      const todayFullDate = `${today_day}:${today_month}:${today_year}`;
     return todayFullDate;
    }
    // getNowDate();
    //? 8lik verisi
    const get_dayData = function (value,date) { 
      console.log(forecast_value);
      
      console.log(date);
      const everyValue = 8;
      start = (value - 1) * everyValue;
      end = value * everyValue;
      first8_data = forecast_value.slice(start, end);
      console.log(first8_data);
      const arrFixedTarih=[]
      first8_data.map((el) => {
        console.log(el);
        const tarih= el.dt_txt;
        const fixTarih=tarih.slice(0,10);
       
         const fixedTarih=fixTarih.replaceAll('-',':');
          arrFixedTarih.push(fixedTarih);
         console.log(typeof date);
         console.log(arrFixedTarih);
        if(arrFixedTarih.includes(date)){
           console.log("eşit");
         }
         else{
          console.log("no");
         }
      });
    };
    get_dayData(1,getNowDate());

    const controlInfo = function (eight) {
      console.log(eight);
      [des_eig] = eight;
      const [des] = des_eig.weather;
      const wind = des_eig.wind;
      const temp = des_eig.main;
      fixedTemp = Math.trunc(temp.temp);
      nowTemp.textContent = fixedTemp;
      const hum = des_eig.main;
      // console.log(hum);

      let weat_info = `
      <div class="info__state weather_info">
      <label for="state">Description: </label>
      <span id="state">${des.description}</span>
      </div>
      <div class="info__state weather_info">
      <label for="hum">Humidity: </label>
      <span id="hum">${hum.humidity} %</span>
      </div>
      <div class="info__state weather_info">
      <label for="wind">Wind: </label>
      <span id="wind">${wind.speed} m/s</span>
      </div>
      `;
      info.insertAdjacentHTML("beforeend", weat_info);
    };
    controlInfo(get_dayData());
    console.log(forecast_value);

    const get_forecastData = function (values = 2) {
      const forValue = 8;
      forStart = (values - 1) * forValue; //8
      forEnd = values * forValue; //16
      forecast8_data = forecast_value.slice(start, end);
      return forecast8_data;
    };
    console.log(get_forecastData());
    const controlForecasts = function (forecasts) {
      console.log(forecasts);
      let html = `      
      <div class="forecasts_days">
      <div class="forecasts__date">12.01.1845</div>
      <i class="fa-solid fa-snowflake forecasts-icon"></i>
      <div class="forecasts-info">
        <div class="forecasts-info__tempatures">${forecasts.temp}°</div>
        <div class="forecasts-info__humidity">%</div>
      </div>
    </div>
      `;
      forecasts.insertAdjacentHTML("beforeend", html);
    };
    controlForecasts(get_forecastData());
  } catch (err) {
    console.error("Lokasyon alınamadı");
  }
};
getJSONLocation();
