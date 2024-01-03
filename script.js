"use-strict";
const cityName = document.querySelector(".primary-title");
const cityTemp = document.querySelector(".forecasts-info__tempatures");
const cityHum = document.querySelector(".forecasts-info__humidity");
const today_hum = document.querySelector("#hum");
const today_wind = document.querySelector("#wind");
const today_state = document.querySelector("#state");
const info = document.querySelector(".weather-content__info");
// const nowTemp = document.querySelector(".state__value");
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

const weatherObj = [
  {
    id: 1, // Örnek hava durumu kodu
    main: "", // Örnek hava durumu adı
    description: "", // Örnek hava durumu açıklaması
  },
];

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

  // "13d": "icons/freezingRain.png",
  "11d": "icons/thunderstorm.png",
  "11n": "icons/thunderstorm.png",
  "13d": "icons/snow.png",
  "13n": "icons/snow.png",
  "50d": "icons/mist.png",
  "50n": "icons/mist.png",
};

const forecasts = document.querySelector(".forecasts");
const API_KEY = "8f66252b881bec05dc29e9a4464bb00f";
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`

// Bunu asla kullanma! 🤘
const generateDay = function () {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1; // Months 0 Based.
  const year = now.getFullYear();
  const fullDate = `${day}.${month}.${year}`;
};

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
  console.log(weatherInfos.description);
  return {
    icon: weatherInfos.icon,
    main: weatherInfos.main, // Örnek hava durumu adı
    description: weatherInfos.description, // Örnek hava durumu açıklaması
  };
};

const getWeatherIconSrc = function (condition) {
  // İkonu gösterecek olan element
  // const weatherIconElement = document.getElementById("weather-icon");

  //  const iconPath = weatherIcons.includes(fixedWeatherCondition);

  // İkon elementine uygun hava durumu ikonunu ekleyin
  // weatherIconElement.src = iconPath;
  // console.log(condition);
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

    // const createWeatherObject = function (dataWeather) {
    //   const { weather } = dataWeather;
    //   const [weatherInfos] = weather;
    //   console.log(weatherInfos.description);
    //   return {
    //     icon: weatherInfos.icon,
    //     main: weatherInfos.main, // Örnek hava durumu adı
    //     description: weatherInfos.description, // Örnek hava durumu açıklaması
    //   };
    // };

    // const weatherIcons = {
    //   "01d": "icons/clearSky.png",
    //   "01n": "icons/clearSky.png",

    //   "02d": "icons/fewClouds.png",
    //   "02n": "icons/fewClouds.png",

    //   "03d": "icons/scatteredClouds.png",
    //   "03n": "icons/scatteredClouds.png",

    //   "04d": "icons/cloud.png",
    //   "04n": "icons/cloud.png",

    //  "09d": "icons/showerRain.png",
    //  "09n": "icons/showerRain.png",

    //   "10d": "icons/rain.png",
    //   "10n": "icons/rain.png",

    //   // "13d": "icons/freezingRain.png",
    //   "11d": "icons/thunderstorm.png",
    //   "11n": "icons/thunderstorm.png",
    //   "13d": "icons/snow.png",
    //   "13n": "icons/snow.png",
    //   "50d": "icons/mist.png",
    //   "50n": "icons/mist.png",
    // };

    // const getWeatherIconSrc = function (condition) {
    //   // İkonu gösterecek olan element
    //   // const weatherIconElement = document.getElementById("weather-icon");

    //   //  const iconPath = weatherIcons.includes(fixedWeatherCondition);

    //   // İkon elementine uygun hava durumu ikonunu ekleyin
    //   // weatherIconElement.src = iconPath;
    //   // console.log(condition);
    //   if (weatherIcons[condition]) {
    //     return weatherIcons[condition];
    //   }
    // };

    // Alt kısım render [ Günlük 8 Sonuç ]
    const controlForecasts = function (forrecasts) {
      forrecasts.map((data) => {
        console.log(data);

        // createWeatherObject(data);
        // console.log(createWeatherObject(data));
        // API'den gelen hava durumu verisine göre ikonu belirleme
        // const weatherCondition = createWeatherObject(data).description;
        // console.log(weatherCondition);
        // const fixedWeatherCondition = weatherCondition.replaceAll(" ", "_");
        // console.log(fixedWeatherCondition);
        // getWeatherIconSrc(fixedWeatherCondition);
        const weatherCondition = createWeatherObject(data).icon;
        console.log(weatherCondition);

        getWeatherIconSrc(weatherCondition);

        const date = data.dt_txt.slice(0, 10);

        //* Türkiye tarih formatına dönüştürme
        const transformDate = new Date(date);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const newDate = transformDate.toLocaleDateString("tr-TR", options);

        const time = data.dt_txt.slice(11, 16);
        const main = data.main;

        // 8 Günlük veri markup
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

        // 8 Results every time.
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
  console.log(day);

  const todayInfo = {
    description: day.weather[0].description,
    wind: day.wind.speed,
    temp: Math.round(day.main.temp),
    humidity: day.main.humidity,
  };
  wetContentState.innerHTML = "";

  // nowTemp.textContent = todayInfo.temp;

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
  <div class="info__state weather_info">
    <label for="state">Description: </label>
    <span id="state">${
      todayInfo.description.slice(0, 1).toUpperCase() +
      todayInfo.description.slice(1)
    }</span>
  </div>
  <div class="info__state weather_info">
    <label for="hum">Humidity: </label>
    <span id="hum">${todayInfo.humidity} %</span>
  </div>
  <div class="info__state weather_info">
    <label for="wind">Wind: </label>
    <span id="wind">${todayInfo.wind} m/s</span>
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

/** */
// Display popup
const displayPopup = function (location) {
  if (location) popup.innerHTML = `Can't take your location. Please allow us!`;

  popup.classList.add("popup-show");
  setTimeout(function () {
    popup.classList.remove("popup-show");
  }, 3000);
};

// Aramaya bağlı api call
const getJSONBySearch = async function (searchCity) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&units=metric`
    );
    const data = await res.json();
    console.log(data);
    // const { city } = data; olmadı ekle
    const { city, list } = data;

    // 3 saniye sonra popup'u gizle
    if (!city) displayPopup();

    cityName.innerHTML = city.name;
    // forecasts call
    //  displaySearchForecasts(data);

    //************ */
    //  const displaySearchForecasts = function (data) {
    const displaySearchForecasts = function (searchForecast) {
      // const { list } = data;
      // for(let i=0;searchForecast.lenght<i;i++){

      //   // Önce mevcut tahminleri temizle
      //   forecasts[i].innerHTML = '';
      // }
      forecasts.innerHTML = "";

      searchForecast.map((data) => {
        const date = data.dt_txt.slice(0, 10);

        //* Türkiye tarih formatına dönüştürme
        const transformDate = new Date(date);
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const newDate = transformDate.toLocaleDateString("tr-TR", options);

        const time = data.dt_txt.slice(11, 16);
        const main = data.main;

        const weatherCondition = createWeatherObject(data).icon;

        // 8 Günlük veri markup
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

      /*   // Verileri 8'li gruplara bölmek için bir fonksiyon
  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const chunkedData = chunkArray(list, 8); // Verileri 8'li gruplara ayır

  // Her bir 8'li grup için tahmin verilerini işle
  chunkedData.forEach((group) => {
    let html = ''; // Her bir 8'li grup için boş bir HTML stringi oluştur

    group.forEach((data) => {
      const date = data.dt_txt.slice(0, 10);
      const transformDate = new Date(date);
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      const newDate = transformDate.toLocaleDateString("tr-TR", options);
      const time = data.dt_txt.slice(11, 16);
      const main = data.main;

      // Tahmin verilerini HTML stringine ekleyerek biriktir
      html += `
        <div class="forecasts_days">
          <div class="forecasts__date">
            <span class="forecasts-date">${newDate}</span>${time}
          </div>
          <i class="fa-solid fa-snowflake forecasts-icon"></i>
          <div class="forecasts-info">
            <div class="forecasts-info__tempatures">${Math.round(main.temp)}°</div>
            <div class="forecasts-info__humidity">${main.humidity}%</div>
          </div>
        </div>
      `;
    });

    // Oluşturulan HTML'i forecasts elementine ekle
    forecasts.insertAdjacentHTML('beforeend', html);
  }); */
    };
    //? 1 Günlük 8 Veri
    const get_forecastSearchData = function (value) {
      value.map((val) => {
        start = (val - 1) * 8;
        end = val * 8;

        // 8 Results every time.
        const eachEightForcData = list.slice(start, end);
        val === 1 && controlInfo(eachEightForcData);
        val === 1 && displaySearchForecasts(eachEightForcData);
      });
    };
    get_forecastSearchData(dayValues);

    //********* */
  } catch (err) {
    console.log(err);
  }
};

// EVENT HANDLERS
searchIcon.addEventListener("click", getCity);

// Functions executed at the beginning
const init = function () {
  getJSONLocation();
};
init();
