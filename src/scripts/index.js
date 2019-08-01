import '../styles/index.scss';

class Forecast {
    constructor() {
        this.key = 'OEl5iVG56QLegnJt3YTqNgmfVrl1LBLI';
        this.weatherURI = 'http://dataservice.accuweather.com/currentconditions/v1/';
        this.cityURI = 'http://dataservice.accuweather.com/locations/v1/cities/search';
    }

   async updateCity(city) {
        const cityDetails = await this.getCity(city);
        const weather = await this.getWeather(cityDetails.Key);

        return {cityDetails, weather};
    }

    async getCity(city) {
        const query = `?apikey=${this.key}&q=${city}`;

        const response = await fetch(this.cityURI + query);
        const data = await response.json();

        return data[0]; // first city from the list

    }

    async getWeather(id) {
        const query = `${id}?apikey=${this.key}`;

        const response = await fetch(this.weatherURI + query);
        const data = await response.json();

        return data[0];
    }
}

const forecast = new Forecast();


const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('.time');
const icon = document.querySelector('.icon img');


const updateUi = (data) => {

    console.log(data);

  const {cityDetails, weather} = data;

  // update Details
  details.innerHTML = `
    <h5 class="my-3">${cityDetails.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
       <div class="display-4 my-4">
         <span>${weather.Temperature.Metric.Value}</span>
         <span>&deg;C</span>
       </div>`;

  // update icons
    let iconSrc = `src/img/icons/${weather.WeatherIcon}.svg`;

    icon.setAttribute('src', iconSrc);

  // update images
    let timeSrc = weather.IsDayTime ? 'src/img/day.svg' : 'src/img/night.svg';

    time.setAttribute('src', timeSrc);


    if(card.classList.contains('d-none')) {
        card.classList.remove('d-none');
    }

};

cityForm.addEventListener('submit', e => {
    e.preventDefault();

    const city = cityForm.city.value.trim();
    cityForm.reset();

    forecast.updateCity(city)
        .then(data => updateUi(data))
        .catch(err => console.log(err));

    // set localStorage

    localStorage.setItem('city', city);
});

if(localStorage.getItem('city')) {

    forecast.updateCity(localStorage.getItem('city'))
        .then(data => updateUi(data))
        .catch(err => console.log(err));

}
