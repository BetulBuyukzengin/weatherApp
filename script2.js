"use-strict";

const cityName = document.querySelector(".primary-title");
const cityTemp = document.querySelector(".forecasts-info__tempatures");
const cityHum = document.querySelector(".forecasts-info__humidity");
const today_hum = document.querySelector("#hum");
const today_wind = document.querySelector("#wind");
const today_state = document.querySelector("#state");
const info = document.querySelector(".weather_info");

// const state = {
//   city_temp: [],
// };

const city_temp = [];
const wind = [];
const api_time = [];

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

    //? 0-8 arası her gunun verisi
    const get_dayData = function (value = 1) {
      const everyValue = 8;
      const start = (value - 1) * everyValue;
      const end = value * everyValue;
      first8_data = forecast_value.slice(start, end);
      return first8_data;

     
    };
    console.log(get_dayData());

    const control_data = function () {
      get_dayData();
      first8_data.map((el) => {
        console.log(el);
        const [state] = el.weather;
        console.log(state.description);
        const temp = el.main;
        // const city_temp = Math.round(temp.temp);
        // city_temp = Math.round(temp.temp);
        city_temp.push(Number(Math.round(temp.temp)));
        console.log(city_temp);

        // console.log(city_temp);
        // wind = el.wind.speed; //* Rüzgar hızı
        wind.push(el.wind.speed);
        // console.log(wind);

        const date = el.dt_txt; //* apiden gelen tarih ve saat
        // console.log( date);
        // console.log(date.split(' ').at(1));
        // api_time = date.split(" ").at(1); //* api den gelen saatler
        const time = date.split(" ")[1];
        // api_time.push(time.slice(0,2)); //* api den gelen saatler
        console.log(time);
        console.log(api_time);
        console.log(typeof api_time);



      });
    };
    control_data();

    //! her 3 saatte 1 veri kontrolu ve guncelleme

    /*             // Sıcaklık değerlerinin ve zaman dilimlerinin listesi
                // const temperatureValues = [5, 8, 10, 15, 20, 25, 22, 18]; // Örnek sıcaklık değerleri
                // const timeFrames = [0, 3, 6, 9, 12, 15, 18, 21]; // Zaman dilimleri (saatler)

                // Şu anki sıcaklık değerini alacak fonksiyon
                function getCurrentTemperature() {
                  control_data();
                  const currentTime = new Date();
                  const currentHour = currentTime.getHours();
                  const currentMinute = currentTime.getMinutes();
                  const newHour = `${currentHour}:${currentMinute}`;
                  console.log(typeof parseInt(newHour));

                  console.log(currentHour);
                  for (let i = 0; i < api_time.length; i++) {
                    // console.log(api_time[i]);
                    if (
                      currentHour >= api_time[i] &&
                      currentHour < api_time[(i + 1) % api_time.length]
                    ) {
                      return city_temp[i];
                    }
                  }
                  return null; // Eğer zaman dilimi bulunamazsa bir varsayılan değer döndürülebilir veya hata mesajı gösterilebilir
                }

                // Şu anki sıcaklık değerini kontrol etmek ve güncellemek için fonksiyon
                function checkAndUpdateTemperature() {
                  const currentTemperature = getCurrentTemperature();

                  if (currentTemperature !== null) {
                    console.log(`Şu anki sıcaklık değeri: ${currentTemperature} derece.`);
                    // Burada şu anki sıcaklık değerine göre yapılacak işlemler veya güncelleme kodu yer alabilir
                  } else {
                    console.log("Şu anki zaman diliminde sıcaklık değeri bulunamadı.");
                  }
                }

                // İlk kontrolü yap
                checkAndUpdateTemperature(); // İlk çalıştırma anında kontrolü yap

                // Her üç saatte bir kontrolü gerçekleştirecek ve gerekirse güncelleyecek olan setInterval
                setInterval(checkAndUpdateTemperature, 3 * 60 * 60 * 1000); // 3 saat aralıklarla tekrar et */

   control_data();
       //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11
    forecast_value.map((data, i) => {
      //  console.log(data,i);

      // description
      /*       const [state] = data.weather;
       */ // console.log(state.description);
      // today_state.textContent = state.description;

      /*   const date = data.dt_txt; //* apiden gelen tarih

      // console.log(date.split(' ').at(1));
      const api_time = date.split(" ").at(1); //* api den gelen saatler
      // console.log(api_time);
 */
     /*    //?        TODAY TIME
        const date_time = new Date(data.dt);
        // console.log(date_time);
        // console.log(date_time);
        const today_time = date_time.getHours();
        const today_minute = date_time.getMinutes();
        const today_second = date_time.getSeconds();
        const todayFullTime = `${today_time}:${today_minute}:${today_second}`;
        // console.log(todayFullTime);
        //?         TODAY DATE
        const today_day = date_time.getDate();
        const today_month = date_time.getMonth();
        const today_year = date_time.getFullYear();
        const todayFullDate = `${today_day}:${today_month}:${today_year}`;
        // console.log(todayFullDate); */


      let weat_info = `
      <span id="state">${state.main}</span>
      <span id="hum">${temp.humidity} %</span>
      <span id="wind">${wind} m/s</span>
`;
      info.insertAdjacentHTML("beforeend", weat_info);


      let html = `      
      <div class="forecasts_days">
      <div class="forecasts__date">12.01.1845</div>
      <i class="fa-solid fa-snowflake forecasts-icon"></i>
      <div class="forecasts-info">
        <div class="forecasts-info__tempatures">${city_temp}°</div>
        <div class="forecasts-info__humidity">${temp.humidity}%</div>
      </div>
    </div>
      `;
      forecasts.insertAdjacentHTML("beforeend", html);
    });
  } catch (err) {
    console.error("Lokasyon alınamadı");
  }
};
getJSONLocation();
