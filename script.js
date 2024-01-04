"use-strict";
const cityName = document.querySelector(".primary-title");
const cityTemp = document.querySelector(".forecasts-info__tempatures");
const cityHum = document.querySelector(".forecasts-info__humidity");
const today_hum = document.querySelector("#hum");
const today_wind = document.querySelector("#wind");
const today_state = document.querySelector("#state");
const info = document.querySelector(".weather-content__info");
const input = document.querySelector(".weather-input");
const inputForm = document.querySelector(".weather-input__section");
const searchIcon = document.querySelector(".search");
const popup = document.getElementById("myPopup");
const wetContentState = document.querySelector(".weather-content__state");

// Data split
const dayValues = [1, 2, 3, 4, 5];
let start;
let end;
let forStart;
let forecast8_data;
let forEnd;

const weatherIcons = {
  "01d": "icons/clearSky.png",
  "01n": "icons/clearSky.png",
  "02d": "icons/fewClouds.png",
  "02n": "icons/fewClouds.png",
  "03d": "icons/scatteredClouds.png",
  "03n": "icons/scatteredClouds.png",
  "04d": "icons/cloud.png",
  "04n": "icons/cloud.png",
  "09d": "icons/showerRain.png",
  "09n": "icons/showerRain.png",
  "10d": "icons/rain.png",
  "10n": "icons/rain.png",
  "11d": "icons/thunderstorm.png",
  "11n": "icons/thunderstorm.png",
  "13d": "icons/snow.png",
  "13n": "icons/snow.png",
  "50d": "icons/mist.png",
  "50n": "icons/mist.png",
};

const forecasts = document.querySelector(".forecasts");
const API_KEY = "8f66252b881bec05dc29e9a4464bb00f";

// Get location
const getPosition = function () {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        resolve({ lat, lon });
      },
      function () {
        reject(() => displayPopup());
      }
    );
  });
};

const createWeatherObject = function (dataWeather) {
  const { weather } = dataWeather;
  const [weatherInfos] = weather;
  return {
    icon: weatherInfos.icon,
    main: weatherInfos.main,
    description: weatherInfos.description,
  };
};

const getWeatherIconSrc = function (condition) {
  if (weatherIcons[condition]) {
    return weatherIcons[condition];
  }
};

// Get Data by location
const getJSONLocation = async function () {
  try {
    const { lat, lon } = await getPosition();
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    const { city, list } = data;
    cityName.textContent = city.name;

   
    const controlForecasts = function (forrecasts) {
      forrecasts.map((data) => {
        const weatherCondition = createWeatherObject(data).icon;

        getWeatherIconSrc(weatherCondition);

        const date = data.dt_txt.slice(0, 10);

        //* Türkiye tarih formatına dönüştürme
        const transformDate = new Date(date);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const newDate = transformDate.toLocaleDateString("tr-TR", options);

        const time = data.dt_txt.slice(11, 16);
        const main = data.main;

        // 8 day data
        const html = `
            <div class="forecasts_days">
              <div class="forecasts__date">
                <span class="forecasts-date">${newDate}</span>${time}
              </div>
              <img src="${getWeatherIconSrc(
                weatherCondition
              )}" alt="Weather Icon" id="weather-icon" class= "forecasts-icon">
              <div class="forecasts-info">
                <div class="forecasts-info__tempatures">${Math.round(
                  main.temp
                )}°
                </div>
                <div class="forecasts-info__humidity">${main.humidity}%</div>
              </div>
            </div>
              `;
        forecasts.insertAdjacentHTML("beforeend", html);
      });
    };

    //? 1 Günlük 8 Veri
    const get_dayData = function (values) {
      values.map((value) => {
        start = (value - 1) * 8;
        end = value * 8;

        // 8 Results every time
        const eachEightData = list.slice(start, end);
        value === 1 && controlInfo(eachEightData);
        value === 1 && controlForecasts(eachEightData);
      });
    };
    get_dayData(dayValues);
  } catch (err) {
    displayPopup("location");
    console.error("Lokasyon alinamadi");
  }
};

const controlInfo = function (oneDay) {
  info.innerHTML = "";

  day = oneDay[0];
  const todayInfo = {
    description: day.weather[0].description,
    wind: day.wind.speed,
    temp: Math.round(day.main.temp),
    humidity: day.main.humidity,
  };
  wetContentState.innerHTML = "";

  const weatherInfoCondition = createWeatherObject(day).icon;

  const weat_infoIcon = ` 
  <p class="state__value-deg"><span class="state__value"></span>${
    todayInfo.temp
  }°C</p>
  <img src="${getWeatherIconSrc(
    weatherInfoCondition
  )}" alt="Weather Icon" id="weather-icon" class= "state-icon">
`;
  wetContentState.insertAdjacentHTML("beforeend", weat_infoIcon);

  const weat_info = `
  <div class="weather_container-elStart">
    <div class="info__state weather_info">
      <label class="weather_info--text" for="state">Description: </label>
      <span id="state">${
        todayInfo.description.slice(0, 1).toUpperCase() +
        todayInfo.description.slice(1)
      }</span>
    </div>
    <div class="info__state weather_info">
      <label class="weather_info--text" for="hum">Humidity: </label>
      <span id="hum">${todayInfo.humidity} %</span>
    </div>
    <div class="info__state weather_info">
      <label class="weather_info--text" for="wind">Wind: </label>
      <span id="wind">${todayInfo.wind} m/s</span>
    </div>
  </div>
  `;
  info.insertAdjacentHTML("beforeend", weat_info);
};

// Take input value
const getCity = function () {
  const searchCity = input.value;
  getJSONBySearch(searchCity);
  input.value = "";
};

// Control submit
const getFormCity = inputForm.addEventListener("submit", function (event) {
  event.preventDefault();
  getCity();
});


// Display popup
const displayPopup = function (location) {
  if (location) popup.innerHTML = `Can't take your location. Please allow us!`;

  popup.classList.add("popup-show");
  setTimeout(function () {
    popup.classList.remove("popup-show");
  }, 3000);
};

//  api call
const getJSONBySearch = async function (searchCity) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    const { city, list } = data;

  
    if (!city) displayPopup();

    cityName.innerHTML = city.name;
   
    const displaySearchForecasts = function (searchForecast) {
     
      forecasts.innerHTML = "";
      searchForecast.map((data) => {
        const date = data.dt_txt.slice(0, 10);

        //* translate format 
        const transformDate = new Date(date);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const newDate = transformDate.toLocaleDateString("tr-TR", options);

        const time = data.dt_txt.slice(11, 16);
        const main = data.main;

        const weatherCondition = createWeatherObject(data).icon;

        // 8 day
        const htmlSearch = `
        <div class="forecasts_days">
          <div class="forecasts__date">
            <span class="forecasts-date">${newDate}</span>${time}
          </div>
          <img src="${getWeatherIconSrc(
            weatherCondition
          )}" alt="Weather Icon" id="weather-icon" class= "forecasts-icon">
          <div class="forecasts-info">
            <div class="forecasts-info__tempatures">${Math.round(main.temp)}°
            </div>
            <div class="forecasts-info__humidity">${main.humidity}%</div>
          </div>
        </div>
          `;
        forecasts.insertAdjacentHTML("beforeend", htmlSearch);
      });
    };
    //? 1 day - 8 data
    const get_forecastSearchData = function (value) {
      value.map((val) => {
        start = (val - 1) * 8;
        end = val * 8;

        // 8 Results every time
        const eachEightForcData = list.slice(start, end);
        val === 1 && controlInfo(eachEightForcData);
        val === 1 && displaySearchForecasts(eachEightForcData);
      });
    };
    get_forecastSearchData(dayValues);

    //********* */
  } catch (err) {
    console.error(err);
  }
};
searchIcon.addEventListener("click", getCity);
const init = function () {
  getJSONLocation();
};
init();
