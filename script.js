"use-strict";

const cityName = document.querySelector(".primary-title");
const cityTemp = document.querySelector(".forecasts-info__tempatures");
const cityHum = document.querySelector(".forecasts-info__humidity");
const forecasts = document.querySelector(".forecasts");
const API_KEY = "8f66252b881bec05dc29e9a4464bb00f";

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
        reject("KONUMUNUZ ALINAMADI");
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
    console.log(data);
    const { city } = data;
    console.log(city.name);
    cityName.textContent = city.name;
    const { list } = data;
    const forecast_value=list.slice(0,5);
    forecast_value.map((day) => {
      console.log(day);
      //bulutlu,yagmurlu
      const [state] = day.weather;
      console.log(state.main);

      const temp = day.main;
      const city_temp=Math.round(temp.temp);
      // cityTemp.textContent = Math.round(temp.temp);
      // cityTemp.textContent=cityTemp;
      // console.log(temp.humidity);
      //  cityHum.textContent = temp.humidity;
      // cityHum.textContent = temp.humidity;

      console.log(day.wind); //ruzgar

       let html = `      
      <div class="forecasts_days">
      <div class="forecasts__date">12.01.1845</div>
      <i class="fa-solid fa-snowflake forecasts-icon"></i>
      <div class="forecasts-info">
        <div class="forecasts-info__tempatures">${ city_temp}°</div>
        <div class="forecasts-info__humidity">${temp.humidity}%</div>
      </div>
    </div>
      `;forecasts.insertAdjacentHTML("beforeend",html); 
    });
    
  } catch (err) {
    console.error("Lokasyon alınamadı");
  }
};
getJSONLocation();
